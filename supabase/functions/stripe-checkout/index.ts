// @ts-nocheck
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type CheckoutItem = {
  code: string;
  quantity?: number;
};

type CheckoutBody = {
  items?: CheckoutItem[];
  language?: 'fr' | 'en';
  checkoutType?: 'hosted' | 'elements';
};

const FORCED_ONE_SHOT_CODES = new Set(['smart_matching', 'sponsored_listing', 'data_room']);

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const APP_URL = (Deno.env.get('APP_URL') || 'https://riviqo.com').replace(/\/$/, '');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });

const getBearerToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
};

const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
};

const getClientIp = (req: Request) => {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    null
  );
};

const logSecurityEvent = async (params: {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  eventType: string;
  req: Request;
  details?: Record<string, unknown>;
}) => {
  await params.supabase.from('billing_security_events').insert({
    user_id: params.userId,
    event_type: params.eventType,
    ip: getClientIp(params.req),
    user_agent: params.req.headers.get('user-agent'),
    details: params.details || {}
  });
};

const isRateLimited = async (params: {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  eventType: string;
  limitPerMinute: number;
}) => {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await params.supabase
    .from('billing_security_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', params.userId)
    .eq('event_type', params.eventType)
    .gte('created_at', since);

  return (count || 0) >= params.limitPerMinute;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!STRIPE_SECRET_KEY) {
    return jsonResponse(500, { error: 'Missing STRIPE_SECRET_KEY' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: 'Missing authorization token' });
  }

  let payload: CheckoutBody;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) {
    return jsonResponse(400, { error: 'Missing items' });
  }

  const normalized = new Map<string, number>();
  for (const item of items) {
    const code = (item?.code || '').trim();
    const quantity = Math.max(1, Math.min(Number(item?.quantity || 1), 20));
    if (!code) continue;
    normalized.set(code, (normalized.get(code) || 0) + quantity);
  }

  if (normalized.size === 0) {
    return jsonResponse(400, { error: 'No valid items provided' });
  }

  const language: 'fr' | 'en' = payload.language === 'en' ? 'en' : 'fr';
  const checkoutType: 'hosted' | 'elements' = payload.checkoutType === 'elements' ? 'elements' : 'hosted';
  const supabase = getSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return jsonResponse(401, { error: 'Invalid auth token' });
  }

  const user = authData.user;

  try {
    const limited = await isRateLimited({
      supabase,
      userId: user.id,
      eventType: 'checkout_attempt',
      limitPerMinute: 10
    });
    if (limited) {
      await logSecurityEvent({
        supabase,
        userId: user.id,
        eventType: 'checkout_rate_limited',
        req,
        details: { itemCount: normalized.size }
      });
      return jsonResponse(429, { error: 'Too many checkout attempts' });
    }

    await logSecurityEvent({
      supabase,
      userId: user.id,
      eventType: 'checkout_attempt',
      req,
      details: { itemCount: normalized.size }
    });

    const codes = [...normalized.keys()];
    const { data: products, error: productsError } = await supabase
      .from('billing_products')
      .select(
        'product_code, display_name_fr, display_name_en, currency, unit_amount_cents, billing_mode, billing_interval, stripe_price_id, is_active'
      )
      .in('product_code', codes)
      .eq('is_active', true);

    if (productsError) {
      throw new Error('Failed to load product catalog');
    }

    if (!products || products.length !== codes.length) {
      throw new Error('Some products are unavailable');
    }

    const normalizedProducts = products.map((product) =>
      FORCED_ONE_SHOT_CODES.has(product.product_code)
        ? {
            ...product,
            billing_mode: 'payment',
            billing_interval: null,
            stripe_price_id: null
          }
        : product
    );

    const hasSubscriptionItems = normalizedProducts.some((p) => p.billing_mode === 'subscription');
    const mode: 'payment' | 'subscription' = hasSubscriptionItems ? 'subscription' : 'payment';
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    let stripeCustomerId: string | null = null;
    const { data: customerRow } = await supabase
      .from('billing_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerRow?.stripe_customer_id) {
      stripeCustomerId = customerRow.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.full_name || undefined,
        metadata: {
          user_id: user.id
        }
      });
      stripeCustomerId = customer.id;

      await supabase.from('billing_customers').upsert(
        {
          user_id: user.id,
          stripe_customer_id: customer.id,
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = normalizedProducts.map((product) => {
      const quantity = normalized.get(product.product_code) || 1;

      if (product.stripe_price_id) {
        return {
          price: product.stripe_price_id,
          quantity
        };
      }

      const displayName = language === 'en' ? product.display_name_en : product.display_name_fr;
      const name = `Riviqo • ${displayName}`;
      if (product.billing_mode === 'subscription') {
        return {
          quantity,
          price_data: {
            currency: product.currency,
            unit_amount: product.unit_amount_cents,
            product_data: { name },
            recurring: {
              interval: product.billing_interval as 'month' | 'year'
            }
          }
        };
      }

      return {
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.unit_amount_cents,
          product_data: { name }
        }
      };
    });

    if (checkoutType === 'elements') {
      if (mode === 'payment') {
        const totalAmountCents = normalizedProducts.reduce((sum, product) => {
          const qty = normalized.get(product.product_code) || 1;
          return sum + product.unit_amount_cents * qty;
        }, 0);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmountCents,
          currency: products[0].currency,
          customer: stripeCustomerId,
          automatic_payment_methods: { enabled: true },
          receipt_email: user.email || undefined,
          metadata: {
            user_id: user.id,
            language,
            item_codes: codes.join(','),
            checkout_type: 'elements'
          }
        });

        await logSecurityEvent({
          supabase,
          userId: user.id,
          eventType: 'elements_payment_intent_created',
          req,
          details: { paymentIntentId: paymentIntent.id, amount: totalAmountCents }
        });

        return jsonResponse(200, {
          checkoutType: 'elements',
          mode: 'payment',
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amountTotalCents: totalAmountCents,
          currency: products[0].currency,
          itemCodes: codes
        });
      }

      const recurringProducts = normalizedProducts.filter((p) => p.billing_mode === 'subscription');
      const oneTimeProducts = normalizedProducts.filter((p) => p.billing_mode === 'payment');

      const subscriptionItems: Stripe.SubscriptionCreateParams.Item[] = await Promise.all(
        recurringProducts.map(async (product) => {
          const quantity = normalized.get(product.product_code) || 1;

          if (product.stripe_price_id) {
            return {
              price: product.stripe_price_id,
              quantity
            };
          }

          const stripeProduct = await stripe.products.create({
            name: language === 'en' ? product.display_name_en : product.display_name_fr,
            metadata: {
              product_code: product.product_code,
              created_by: 'riviqo_elements_checkout'
            }
          });

          return {
            quantity,
            price_data: {
              currency: product.currency,
              unit_amount: product.unit_amount_cents,
              recurring: {
                interval: product.billing_interval as 'month' | 'year'
              },
              product: stripeProduct.id
            }
          };
        })
      );

      const addInvoiceItems: Stripe.SubscriptionCreateParams.AddInvoiceItem[] = await Promise.all(
        oneTimeProducts.map(async (product) => {
          const quantity = normalized.get(product.product_code) || 1;

          if (product.stripe_price_id) {
            return {
              price: product.stripe_price_id,
              quantity
            };
          }

          const stripeProduct = await stripe.products.create({
            name: language === 'en' ? product.display_name_en : product.display_name_fr,
            metadata: {
              product_code: product.product_code,
              created_by: 'riviqo_elements_checkout_onetime'
            }
          });

          return {
            quantity,
            price_data: {
              currency: product.currency,
              unit_amount: product.unit_amount_cents,
              product: stripeProduct.id
            }
          };
        })
      );

      if (subscriptionItems.length === 0) {
        throw new Error('A subscription checkout requires at least one recurring item');
      }

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: subscriptionItems,
        add_invoice_items: addInvoiceItems.length ? addInvoiceItems : undefined,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        collection_method: 'charge_automatically',
        metadata: {
          user_id: user.id,
          language,
          item_codes: codes.join(','),
          checkout_type: 'elements'
        },
        expand: ['latest_invoice.payment_intent']
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent;
      if (!paymentIntent?.client_secret) {
        throw new Error('Unable to initialize subscription payment');
      }

      await supabase.from('billing_subscriptions').upsert(
        {
          user_id: user.id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: stripeCustomerId,
          stripe_price_id: subscriptionItems[0]?.price || null,
          status: subscription.status,
          cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
          current_period_start: subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000).toISOString()
            : null,
          current_period_end: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          payload: subscription,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'stripe_subscription_id' }
      );

      await logSecurityEvent({
        supabase,
        userId: user.id,
        eventType: 'elements_subscription_created',
        req,
        details: { subscriptionId: subscription.id }
      });

      return jsonResponse(200, {
        checkoutType: 'elements',
        mode: 'subscription',
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
        amountTotalCents: paymentIntent.amount,
        currency: paymentIntent.currency,
        itemCodes: codes
      });
    }

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      customer: stripeCustomerId,
      line_items,
      success_url: `${APP_URL}/Settings?tab=billing&checkout=success`,
      cancel_url: `${APP_URL}/Settings?tab=pricing&checkout=canceled`,
      locale: language === 'fr' ? 'fr' : 'en',
      submit_type: mode === 'subscription' ? 'subscribe' : 'pay',
      payment_method_types: ['card'],
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        language,
        item_codes: codes.join(',')
      },
      custom_text: {
        submit: {
          message:
            language === 'fr'
              ? 'Paiement sécurisé par Stripe · Facture disponible après achat.'
              : 'Secure payment by Stripe · Invoice available after purchase.'
        }
      },
      allow_promotion_codes: false,
      billing_address_collection: 'auto'
    };

    if (mode === 'payment') {
      checkoutParams.invoice_creation = { enabled: true };
    }

    const session = await stripe.checkout.sessions.create(checkoutParams);

    await supabase.from('billing_checkout_sessions').upsert(
      {
        user_id: user.id,
        stripe_checkout_session_id: session.id,
        stripe_customer_id: stripeCustomerId,
        mode,
        status: session.status || 'open',
        currency: session.currency || 'eur',
        amount_total_cents: session.amount_total || null,
        item_codes: codes,
        metadata: session.metadata || {},
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_checkout_session_id' }
    );

    await logSecurityEvent({
      supabase,
      userId: user.id,
      eventType: 'checkout_created',
      req,
      details: { sessionId: session.id, mode }
    });

    return jsonResponse(200, {
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    await logSecurityEvent({
      supabase,
      userId: user.id,
      eventType: 'checkout_failed',
      req,
      details: { message: (error as Error).message }
    });

    return jsonResponse(400, {
      error: (error as Error).message
    });
  }
});
