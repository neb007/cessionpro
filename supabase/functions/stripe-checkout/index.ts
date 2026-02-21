// @ts-nocheck
import Stripe from 'npm:stripe@16.12.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

type CheckoutItem = {
  code: string;
  quantity?: number;
};

type CheckoutBody = {
  items?: CheckoutItem[];
  language?: 'fr' | 'en';
  checkoutType?: 'hosted' | 'elements';
  returnOrigin?: string;
};

const FORCED_ONE_SHOT_CODES = new Set(['smart_matching', 'sponsored_listing', 'data_room']);

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const APP_URL = (Deno.env.get('APP_URL') || 'https://riviqo.com').replace(/\/$/, '');
const APP_ORIGIN = (() => {
  try {
    return new URL(APP_URL).origin;
  } catch {
    return 'https://riviqo.com';
  }
})();
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

const checkoutError = (params: {
  code: string;
  message: string;
  retryable?: boolean;
  action?: string;
  details?: Record<string, unknown>;
}) => ({
  error: {
    code: params.code,
    message: params.message,
    retryable: Boolean(params.retryable),
    action: params.action || null,
    details: params.details || {}
  }
});

const sanitizeReturnOrigin = (rawOrigin: string | null | undefined) => {
  if (!rawOrigin) return null;

  try {
    const originUrl = new URL(rawOrigin);
    if (!['http:', 'https:'].includes(originUrl.protocol)) return null;

    const normalized = originUrl.origin.replace(/\/$/, '');
    const hostname = originUrl.hostname.toLowerCase();
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isAppOrigin = normalized === APP_ORIGIN;

    if (!isLocalhost && !isAppOrigin) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
};

const serializeItemQuantities = (normalized: Map<string, number>) =>
  [...normalized.entries()]
    .map(([code, quantity]) => `${code}:${quantity}`)
    .join(',');

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

const isStripeCustomerMissingError = (error: unknown) => {
  const stripeError = error as { code?: string; type?: string; message?: string };
  const message = (stripeError?.message || '').toLowerCase();
  return (
    stripeError?.code === 'resource_missing' ||
    message.includes('no such customer')
  );
};

const getStripeKeyMode = () => {
  if (!STRIPE_SECRET_KEY) return 'missing';
  if (STRIPE_SECRET_KEY.startsWith('sk_test_')) return 'test';
  if (STRIPE_SECRET_KEY.startsWith('sk_live_')) return 'live';
  return 'unknown';
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(
      405,
      checkoutError({
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed',
        retryable: false,
        action: 'CONTACT_SUPPORT'
      })
    );
  }

  if (!STRIPE_SECRET_KEY) {
    return jsonResponse(
      500,
      checkoutError({
        code: 'STRIPE_CONFIG_MISSING',
        message: 'Missing STRIPE_SECRET_KEY',
        retryable: false,
        action: 'CONTACT_SUPPORT'
      })
    );
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(
      401,
      checkoutError({
        code: 'AUTH_TOKEN_MISSING',
        message: 'Missing authorization token',
        retryable: false,
        action: 'REAUTH'
      })
    );
  }

  let payload: CheckoutBody;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(
      400,
      checkoutError({
        code: 'INVALID_JSON_BODY',
        message: 'Invalid JSON body',
        retryable: true,
        action: 'RETRY'
      })
    );
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) {
    return jsonResponse(
      400,
      checkoutError({
        code: 'CHECKOUT_ITEMS_MISSING',
        message: 'Missing items',
        retryable: false,
        action: 'REFRESH_CART'
      })
    );
  }

  const normalized = new Map<string, number>();
  for (const item of items) {
    const code = (item?.code || '').trim();
    const maxQuantity = code === 'sponsored_listing' ? 365 : 20;
    const quantity = Math.max(1, Math.min(Number(item?.quantity || 1), maxQuantity));
    if (!code) continue;
    const next = Math.min((normalized.get(code) || 0) + quantity, maxQuantity);
    normalized.set(code, next);
  }

  if (normalized.size === 0) {
    return jsonResponse(
      400,
      checkoutError({
        code: 'CHECKOUT_ITEMS_INVALID',
        message: 'No valid items provided',
        retryable: false,
        action: 'REFRESH_CART'
      })
    );
  }

  const language: 'fr' | 'en' = payload.language === 'en' ? 'en' : 'fr';
  const checkoutType: 'hosted' | 'elements' = payload.checkoutType === 'elements' ? 'elements' : 'hosted';
  const clientReturnOrigin = sanitizeReturnOrigin(payload.returnOrigin);
  const checkoutReturnBase = clientReturnOrigin || APP_URL;
  const supabase = getSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return jsonResponse(
      401,
      checkoutError({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Invalid auth token',
        retryable: false,
        action: 'REAUTH'
      })
    );
  }

  const user = authData.user;
  let diagStripeKeyMode = getStripeKeyMode();
  let diagStoredCustomerId: string | null = null;

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
      return jsonResponse(
        429,
        checkoutError({
          code: 'CHECKOUT_RATE_LIMITED',
          message: 'Too many checkout attempts',
          retryable: true,
          action: 'RETRY'
        })
      );
    }

    await logSecurityEvent({
      supabase,
      userId: user.id,
      eventType: 'checkout_attempt',
      req,
      details: { itemCount: normalized.size }
    });

    const codes = [...normalized.keys()];
    const itemQuantitiesMetadata = serializeItemQuantities(normalized);
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

    diagStoredCustomerId = customerRow?.stripe_customer_id || null;

    await logSecurityEvent({
      supabase,
      userId: user.id,
      eventType: 'checkout_customer_context',
      req,
        details: {
          stripe_key_mode: diagStripeKeyMode,
          has_stored_customer: Boolean(diagStoredCustomerId),
          stored_customer_id: diagStoredCustomerId,
          checkout_type: checkoutType,
          checkout_mode: mode,
          checkout_return_base: checkoutReturnBase
        }
      });

    const createAndPersistCustomer = async () => {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.full_name || undefined,
        metadata: {
          user_id: user.id
        }
      });

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

      return customer.id;
    };

    if (customerRow?.stripe_customer_id) {
      try {
        await stripe.customers.retrieve(customerRow.stripe_customer_id);
        stripeCustomerId = customerRow.stripe_customer_id;

        await logSecurityEvent({
          supabase,
          userId: user.id,
          eventType: 'checkout_customer_reused',
          req,
          details: {
            stripe_key_mode: diagStripeKeyMode,
            stripe_customer_id: stripeCustomerId
          }
        });
      } catch (error) {
        if (!isStripeCustomerMissingError(error)) {
          throw error;
        }

        await logSecurityEvent({
          supabase,
          userId: user.id,
          eventType: 'checkout_customer_missing_or_mode_mismatch',
          req,
          details: {
            stripe_key_mode: diagStripeKeyMode,
            stored_customer_id: customerRow.stripe_customer_id,
            stripe_error_code: (error as { code?: string })?.code || null,
            stripe_error_type: (error as { type?: string })?.type || null,
            stripe_error_message: (error as Error)?.message || 'unknown'
          }
        });

        // Stored customer belongs to another Stripe mode/account (test/live mismatch)
        // or has been deleted. Recreate a fresh customer in current Stripe context.
        stripeCustomerId = await createAndPersistCustomer();

        await logSecurityEvent({
          supabase,
          userId: user.id,
          eventType: 'checkout_customer_recreated',
          req,
          details: {
            stripe_key_mode: diagStripeKeyMode,
            previous_customer_id: customerRow.stripe_customer_id,
            new_customer_id: stripeCustomerId
          }
        });
      }
    } else {
      stripeCustomerId = await createAndPersistCustomer();

      await logSecurityEvent({
        supabase,
        userId: user.id,
        eventType: 'checkout_customer_created',
        req,
        details: {
          stripe_key_mode: diagStripeKeyMode,
          stripe_customer_id: stripeCustomerId
        }
      });
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
            item_quantities: itemQuantitiesMetadata,
            checkout_type: 'elements',
            checkout_mode: 'payment'
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
          item_quantities: itemQuantitiesMetadata,
          checkout_type: 'elements',
          checkout_mode: 'subscription'
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
      success_url: `${checkoutReturnBase}/Settings?tab=billing&checkout=success`,
      cancel_url: `${checkoutReturnBase}/Settings?tab=pricing&checkout=canceled`,
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
        item_codes: codes.join(','),
        item_quantities: itemQuantitiesMetadata,
        checkout_mode: mode
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
      details: {
        message: (error as Error).message,
        stripe_key_mode: diagStripeKeyMode,
        stored_customer_id: diagStoredCustomerId,
        stripe_error_code: (error as { code?: string })?.code || null,
        stripe_error_type: (error as { type?: string })?.type || null
      }
    });

    return jsonResponse(
      400,
      checkoutError({
        code: 'CHECKOUT_FAILED',
        message: (error as Error).message,
        retryable: true,
        action: checkoutType === 'elements' ? 'HOSTED_FALLBACK' : 'RETRY',
        details: {
          stripe_key_mode: diagStripeKeyMode,
          stored_customer_id: diagStoredCustomerId,
          checkout_type: checkoutType
        }
      })
    );
  }
});
