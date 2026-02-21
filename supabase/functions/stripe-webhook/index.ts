// @ts-nocheck
import Stripe from 'npm:stripe@16.12.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

type PurchaseEmailPayload = {
  customerName: string;
  customerEmail: string;
  itemCodes: string[];
  productName: string;
  amount: string;
  currency: string;
  invoiceUrl: string | null;
  sourceId: string;
  idempotencyKey: string;
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'Riviqo <no-reply@riviqo.com>';
const APP_URL = (Deno.env.get('APP_URL') || 'https://riviqo.com').replace(/\/$/, '');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
};

const formatAmount = (amount: number | null | undefined) => {
  if (amount == null) return '0.00';
  const value = amount / 100;
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const buildPurchaseEmail = (language: 'fr' | 'en', payload: PurchaseEmailPayload) => {
  const isFr = language === 'fr';
  const subject = isFr
    ? 'Confirmation de commande Riviqo'
    : 'Riviqo order confirmation';

  const html = `
    <!doctype html>
    <html lang="${isFr ? 'fr' : 'en'}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin:0;padding:0;background:#f7f7f7;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f7f7;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background:#ffffff;border-radius:12px;border:1px solid #e6e6e6;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px;background:#111111;color:#ffffff;font-family:Arial,sans-serif;">
                    <h1 style="margin:0;font-size:20px;">Riviqo</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;font-family:Arial,sans-serif;color:#111111;">
                    <h2 style="margin:0 0 12px;font-size:20px;">${
                      isFr ? 'Merci pour votre confiance' : 'Thank you for your trust'
                    }</h2>
                    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#2b2b2b;">${
                      isFr
                        ? `Bonjour ${payload.customerName}, nous vous confirmons que votre paiement a bien ete recu et que vos services sont en cours d activation.`
                        : `Hello ${payload.customerName}, we confirm that your payment has been received and your services are being activated.`
                    }</p>
                    <div style="margin:12px 0 18px;padding:12px;background:#f3f4f6;border-radius:8px;font-size:13px;color:#3a3a3a;">
                      <div><strong>${isFr ? 'Produit' : 'Product'}:</strong> ${payload.productName}</div>
                      <div style="margin-top:8px;"><strong>${isFr ? 'Montant' : 'Amount'}:</strong> ${payload.amount} ${payload.currency.toUpperCase()}</div>
                    </div>
                    <a href="${payload.invoiceUrl || `${APP_URL}/Settings?tab=billing`}" style="display:inline-block;padding:12px 18px;background:#111111;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;">
                      ${isFr ? 'Voir mes services' : 'View my services'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { subject, html };
};

const sendViaResend = async (to: string, subject: string, html: string) => {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
      text: subject
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${response.status} ${text}`);
  }
};

const getLanguageFromEvent = (event: Stripe.Event): 'fr' | 'en' => {
  const object = event?.data?.object as any;
  const metadata = object?.metadata || {};
  return metadata?.language === 'en' ? 'en' : 'fr';
};

const getPurchaseSourceId = (event: Stripe.Event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    return session.id;
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    return invoice.id;
  }

  return event.id;
};

const parseItemQuantities = (raw: string | null | undefined) => {
  const quantities = new Map<string, number>();
  const value = String(raw || '').trim();
  if (!value) return quantities;

  for (const token of value.split(',')) {
    const [codeRaw, qtyRaw] = token.split(':');
    const code = String(codeRaw || '').trim();
    if (!code) continue;

    const parsedQty = Number(qtyRaw || 1);
    const quantity = Number.isFinite(parsedQty) ? Math.max(1, Math.floor(parsedQty)) : 1;
    quantities.set(code, quantity);
  }

  return quantities;
};

const mapCreditsFromProductCode = (productCode: string, quantity = 1) => {
  const normalized = (productCode || '').toLowerCase();
  const qty = Math.max(1, Math.floor(Number(quantity || 1)));

  if (normalized === 'photos_pack5') return { photos: 5 * qty, contacts: 0, feature: false, entitlementType: 'credits', quantityTotal: 5 * qty };
  if (normalized === 'photos_pack15') return { photos: 15 * qty, contacts: 0, feature: false, entitlementType: 'credits', quantityTotal: 15 * qty };
  if (normalized === 'contact_unit') return { photos: 0, contacts: 1 * qty, feature: false, entitlementType: 'credits', quantityTotal: 1 * qty };
  if (normalized === 'contact_pack5') return { photos: 0, contacts: 5 * qty, feature: false, entitlementType: 'credits', quantityTotal: 5 * qty };
  if (normalized === 'contact_pack8') return { photos: 0, contacts: 8 * qty, feature: false, entitlementType: 'credits', quantityTotal: 8 * qty };
  if (normalized === 'contact_pack10') return { photos: 0, contacts: 10 * qty, feature: false, entitlementType: 'credits', quantityTotal: 10 * qty };
  if (normalized === 'sponsored_listing') return { photos: 0, contacts: 0, feature: false, entitlementType: 'credits', quantityTotal: qty };
  if (normalized === 'smart_matching') return { photos: 0, contacts: 0, feature: true, entitlementType: 'feature', quantityTotal: null };
  if (normalized === 'data_room') return { photos: 0, contacts: 0, feature: true, entitlementType: 'feature', quantityTotal: null };
  return { photos: 0, contacts: 0, feature: false, entitlementType: 'credits', quantityTotal: 0 };
};

const createEmailDispatchToken = async (params: {
  supabase: ReturnType<typeof createClient>;
  actorId: string;
  recipientEmail: string;
  sourceId: string;
  idempotencyKey: string;
}) => {
  const { data: existing } = await params.supabase
    .from('email_dispatch_logs')
    .select('id, status')
    .eq('idempotency_key', params.idempotencyKey)
    .eq('status', 'sent')
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return { shouldSend: false };
  }

  await params.supabase.from('email_dispatch_logs').insert({
    actor_id: params.actorId,
    event_type: 'purchase_confirmation',
    recipient_email: params.recipientEmail,
    source_id: params.sourceId,
    idempotency_key: params.idempotencyKey,
    status: 'skipped',
    error: 'processing'
  });

  return { shouldSend: true };
};

const finalizeEmailDispatchLog = async (params: {
  supabase: ReturnType<typeof createClient>;
  idempotencyKey: string;
  status: 'sent' | 'failed' | 'skipped';
  error?: string | null;
}) => {
  await params.supabase
    .from('email_dispatch_logs')
    .update({
      status: params.status,
      error: params.error || null
    })
    .eq('idempotency_key', params.idempotencyKey)
    .eq('event_type', 'purchase_confirmation')
    .eq('status', 'skipped')
    .eq('error', 'processing');
};

const applyPurchasedEntitlements = async (params: {
  supabase: ReturnType<typeof createClient>;
  event: Stripe.Event;
}) => {
  const { supabase, event } = params;

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'invoice.payment_succeeded' &&
    event.type !== 'payment_intent.succeeded'
  ) {
    return;
  }

  let userId: string | null = null;
  let itemCodes: string[] = [];
  let itemQuantities = new Map<string, number>();
  let sourceTransactionId: string | null = null;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    userId = session.metadata?.user_id || session.client_reference_id || null;
    itemCodes = (session.metadata?.item_codes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    itemQuantities = parseItemQuantities(session.metadata?.item_quantities || '');

    const { data: txn } = await supabase
      .from('billing_transactions')
      .select('id')
      .eq('stripe_checkout_session_id', session.id)
      .maybeSingle();
    sourceTransactionId = txn?.id || null;
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    userId = invoice.metadata?.user_id || null;
    itemCodes = (invoice.metadata?.item_codes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    itemQuantities = parseItemQuantities(invoice.metadata?.item_quantities || '');

    const { data: txn } = await supabase
      .from('billing_transactions')
      .select('id')
      .eq('stripe_invoice_id', invoice.id)
      .maybeSingle();
    sourceTransactionId = txn?.id || null;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const checkoutType = String(paymentIntent.metadata?.checkout_type || '').toLowerCase();

    if (checkoutType !== 'elements') {
      return;
    }

    userId = paymentIntent.metadata?.user_id || null;

    if (!userId && typeof paymentIntent.customer === 'string') {
      const { data: customerRow } = await supabase
        .from('billing_customers')
        .select('user_id')
        .eq('stripe_customer_id', paymentIntent.customer)
        .maybeSingle();
      userId = customerRow?.user_id || null;
    }

    itemCodes = (paymentIntent.metadata?.item_codes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    itemQuantities = parseItemQuantities(paymentIntent.metadata?.item_quantities || '');

    const { data: txn } = await supabase
      .from('billing_transactions')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .maybeSingle();
    sourceTransactionId = txn?.id || null;
  }

  if (!userId || itemCodes.length === 0) {
    return;
  }

  let photosDelta = 0;
  let contactsDelta = 0;

  const isMissingTableError = (error: unknown) => {
    const err = error as { code?: string; message?: string; details?: string };
    const code = String(err?.code || '');
    const message = String(err?.message || '').toLowerCase();
    const details = String(err?.details || '').toLowerCase();

    return (
      code === '42P01' ||
      message.includes('does not exist') ||
      message.includes('schema cache') ||
      details.includes('schema cache')
    );
  };

  for (const code of itemCodes) {
    const quantity = itemQuantities.get(code) || 1;
    const mapped = mapCreditsFromProductCode(code, quantity);
    photosDelta += mapped.photos;
    contactsDelta += mapped.contacts;

    try {
      await supabase.from('billing_entitlements').upsert(
        {
          user_id: userId,
          product_code: code,
          entitlement_type: mapped.entitlementType,
          quantity_total: mapped.feature ? null : mapped.quantityTotal,
          quantity_remaining: mapped.feature ? null : mapped.quantityTotal,
          status: 'active',
          source_transaction_id: sourceTransactionId,
          source_stripe_event_id: event.id,
          activated_at: new Date().toISOString(),
          metadata: {
            grant_origin: event.type,
            purchase_quantity: quantity
          },
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,product_code,source_stripe_event_id' }
      );
    } catch (error) {
      if (!isMissingTableError(error)) {
        throw error;
      }
    }
  }

  if (photosDelta > 0 || contactsDelta > 0) {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('photos_remaining_balance, contact_credits_balance')
      .eq('id', userId)
      .maybeSingle();

    await supabase
      .from('profiles')
      .update({
        photos_remaining_balance: Number(profileRow?.photos_remaining_balance || 0) + photosDelta,
        contact_credits_balance: Number(profileRow?.contact_credits_balance || 0) + contactsDelta
      })
      .eq('id', userId);
  }
};

const resolvePurchasePayload = async (
  stripe: Stripe,
  event: Stripe.Event
): Promise<PurchaseEmailPayload | null> => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.customer_email;
    if (!customerEmail) return null;

    let productName = 'Riviqo purchase';
    if (session.id) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1
      });
      const first = lineItems.data[0];
      if (first?.description) productName = first.description;
    }

    return {
      customerName: session.customer_details?.name || 'Client',
      customerEmail,
      itemCodes: (session.metadata?.item_codes || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      productName,
      amount: formatAmount(session.amount_total),
      currency: (session.currency || 'eur').toUpperCase(),
      invoiceUrl: null,
      sourceId: session.id,
      idempotencyKey: `purchase_confirmation:${session.id}`
    };
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerEmail = invoice.customer_email;
    if (!customerEmail) return null;

    const lineItem = invoice.lines?.data?.[0];
    return {
      customerName: invoice.customer_name || 'Client',
      customerEmail,
      itemCodes: (invoice.metadata?.item_codes || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      productName: lineItem?.description || 'Riviqo subscription',
      amount: formatAmount(invoice.amount_paid),
      currency: (invoice.currency || 'eur').toUpperCase(),
      invoiceUrl: invoice.hosted_invoice_url || null,
      sourceId: invoice.id,
      idempotencyKey: `purchase_confirmation:${invoice.id}`
    };
  }

  return null;
};

const upsertTransaction = async (params: {
  supabase: ReturnType<typeof createClient>;
  event: Stripe.Event;
}) => {
  const { supabase, event } = params;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || session.client_reference_id || null;
    const itemCodes = (session.metadata?.item_codes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await supabase.from('billing_checkout_sessions').upsert(
      {
        user_id: userId,
        stripe_checkout_session_id: session.id,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
        mode: session.mode,
        status: session.status || 'complete',
        currency: session.currency || 'eur',
        amount_total_cents: session.amount_total || null,
        item_codes: itemCodes,
        metadata: session.metadata || {},
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_checkout_session_id' }
    );

    await supabase.from('billing_transactions').upsert(
      {
        user_id: userId,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
        stripe_event_id: event.id,
        status: session.payment_status || 'paid',
        currency: session.currency || 'eur',
        amount_paid_cents: session.amount_total || null,
        item_codes: itemCodes,
        payload: session,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_payment_intent_id' }
    );
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const userId = invoice.metadata?.user_id || null;

    await supabase.from('billing_transactions').upsert(
      {
        user_id: userId,
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id:
          typeof invoice.payment_intent === 'string' ? invoice.payment_intent : null,
        stripe_customer_id: typeof invoice.customer === 'string' ? invoice.customer : null,
        stripe_event_id: event.id,
        status: 'paid',
        currency: invoice.currency || 'eur',
        amount_paid_cents: invoice.amount_paid || null,
        invoice_url: invoice.hosted_invoice_url || null,
        payload: invoice,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_invoice_id' }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await supabase.from('billing_transactions').upsert(
      {
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id:
          typeof paymentIntent.customer === 'string' ? paymentIntent.customer : null,
        stripe_event_id: event.id,
        status: paymentIntent.status || 'failed',
        currency: paymentIntent.currency || 'eur',
        amount_paid_cents: paymentIntent.amount_received || 0,
        payload: paymentIntent,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_payment_intent_id' }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    let userId = paymentIntent.metadata?.user_id || null;
    if (!userId && typeof paymentIntent.customer === 'string') {
      const { data: customerRow } = await supabase
        .from('billing_customers')
        .select('user_id')
        .eq('stripe_customer_id', paymentIntent.customer)
        .maybeSingle();
      userId = customerRow?.user_id || null;
    }

    const itemCodes = (paymentIntent.metadata?.item_codes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await supabase.from('billing_transactions').upsert(
      {
        user_id: userId,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id:
          typeof paymentIntent.customer === 'string' ? paymentIntent.customer : null,
        stripe_event_id: event.id,
        status: paymentIntent.status || 'succeeded',
        currency: paymentIntent.currency || 'eur',
        amount_paid_cents: paymentIntent.amount_received || paymentIntent.amount || null,
        item_codes: itemCodes,
        payload: paymentIntent,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'stripe_payment_intent_id' }
    );
  }
};

const upsertSubscription = async (params: {
  supabase: ReturnType<typeof createClient>;
  event: Stripe.Event;
}) => {
  const { supabase, event } = params;
  if (
    event.type !== 'customer.subscription.updated' &&
    event.type !== 'customer.subscription.deleted'
  ) {
    return;
  }

  const sub = event.data.object as Stripe.Subscription;
  const item = sub.items?.data?.[0];
  const price = item?.price;
  const userId = sub.metadata?.user_id || null;

  await supabase.from('billing_subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : null,
      stripe_price_id: price?.id || null,
      status: sub.status,
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
      ended_at: sub.ended_at ? new Date(sub.ended_at * 1000).toISOString() : null,
      payload: sub,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'stripe_subscription_id' }
  );
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return jsonResponse(500, {
      error: 'Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET'
    });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return jsonResponse(400, { error: 'Missing stripe-signature header' });
  }

  const body = await req.text();
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20'
  });
  const supabase = getSupabaseClient();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return jsonResponse(400, {
      error: `Webhook signature verification failed: ${(error as Error).message}`
    });
  }

  const handledEvents = new Set([
    'checkout.session.completed',
    'invoice.payment_succeeded',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
  ]);

  const { data: alreadyProcessed } = await supabase
    .from('billing_webhook_events')
    .select('id, processing_status')
    .eq('event_id', event.id)
    .maybeSingle();

  if (alreadyProcessed) {
    return jsonResponse(200, { received: true, duplicate: true, eventType: event.type });
  }

  await supabase.from('billing_webhook_events').insert({
    event_id: event.id,
    event_type: event.type,
    processing_status: handledEvents.has(event.type) ? 'processing' : 'ignored',
    payload: {
      id: event.id,
      type: event.type,
      created: event.created
    }
  });

  if (!handledEvents.has(event.type)) {
    await supabase
      .from('billing_webhook_events')
      .update({
        processing_status: 'ignored',
        processed_at: new Date().toISOString()
      })
      .eq('event_id', event.id);

    return jsonResponse(200, { received: true, ignored: event.type });
  }

  try {
    await upsertTransaction({ supabase, event });
    await upsertSubscription({ supabase, event });
    await applyPurchasedEntitlements({ supabase, event });

    if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
      const payload = await resolvePurchasePayload(stripe, event);
      if (payload) {
        const sourceId = payload.sourceId || getPurchaseSourceId(event);
        const emailLock = await createEmailDispatchToken({
          supabase,
          actorId: '00000000-0000-0000-0000-000000000000',
          recipientEmail: payload.customerEmail,
          sourceId,
          idempotencyKey: payload.idempotencyKey || `purchase_confirmation:${sourceId}`
        });

        if (emailLock.shouldSend) {
          try {
            const language = getLanguageFromEvent(event);
            const { subject, html } = buildPurchaseEmail(language, payload);
            await sendViaResend(payload.customerEmail, subject, html);
            await finalizeEmailDispatchLog({
              supabase,
              idempotencyKey: payload.idempotencyKey || `purchase_confirmation:${sourceId}`,
              status: 'sent'
            });
          } catch (error) {
            await finalizeEmailDispatchLog({
              supabase,
              idempotencyKey: payload.idempotencyKey || `purchase_confirmation:${sourceId}`,
              status: 'failed',
              error: (error as Error).message
            });
            throw error;
          }
        }
      }
    }

    await supabase
      .from('billing_webhook_events')
      .update({
        processing_status: 'processed',
        processed_at: new Date().toISOString(),
        error: null
      })
      .eq('event_id', event.id);

    return jsonResponse(200, {
      received: true,
      processed: true,
      eventType: event.type
    });
  } catch (error) {
    await supabase
      .from('billing_webhook_events')
      .update({
        processing_status: 'failed',
        processed_at: new Date().toISOString(),
        error: (error as Error).message
      })
      .eq('event_id', event.id);

    return jsonResponse(500, {
      error: (error as Error).message,
      eventType: event.type
    });
  }
});
