import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';

type PurchaseEmailPayload = {
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: string;
  currency: string;
  invoiceUrl: string | null;
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'Riviqo <no-reply@riviqo.com>';
const APP_URL = Deno.env.get('APP_URL') || 'https://riviqo.com';

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

const formatAmount = (amount: number | null | undefined, currency: string) => {
  if (amount == null) return '0.00';
  const value = amount / 100;
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const buildPurchaseEmail = (
  language: 'fr' | 'en',
  payload: PurchaseEmailPayload
) => {
  const isFr = language === 'fr';
  const subject = isFr
    ? 'Confirmation de votre achat Riviqo'
    : 'Your Riviqo purchase confirmation';

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
                      isFr ? 'Merci pour votre achat' : 'Thanks for your purchase'
                    }</h2>
                    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#2b2b2b;">${
                      isFr
                        ? `Bonjour ${payload.customerName}, votre paiement a ete confirme.`
                        : `Hello ${payload.customerName}, your payment has been confirmed.`
                    }</p>
                    <div style="margin:12px 0 18px;padding:12px;background:#f3f4f6;border-radius:8px;font-size:13px;color:#3a3a3a;">
                      <div><strong>${isFr ? 'Produit' : 'Product'}:</strong> ${payload.productName}</div>
                      <div style="margin-top:8px;"><strong>${isFr ? 'Montant' : 'Amount'}:</strong> ${payload.amount} ${payload.currency.toUpperCase()}</div>
                    </div>
                    <a href="${payload.invoiceUrl || `${APP_URL}/Abonnement`}" style="display:inline-block;padding:12px 18px;background:#111111;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;">
                      ${isFr ? 'Voir la facture' : 'View invoice'}
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
      productName,
      amount: formatAmount(session.amount_total, session.currency || 'eur'),
      currency: (session.currency || 'eur').toUpperCase(),
      invoiceUrl: null
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
      productName: lineItem?.description || 'Riviqo subscription',
      amount: formatAmount(invoice.amount_paid, invoice.currency || 'eur'),
      currency: (invoice.currency || 'eur').toUpperCase(),
      invoiceUrl: invoice.hosted_invoice_url || null
    };
  }

  return null;
};

serve(async (req) => {
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

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return jsonResponse(400, {
      error: `Webhook signature verification failed: ${(error as Error).message}`
    });
  }

  // Only process supported payment events for purchase emails.
  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'invoice.payment_succeeded'
  ) {
    return jsonResponse(200, { received: true, ignored: event.type });
  }

  try {
    const payload = await resolvePurchasePayload(stripe, event);
    if (!payload) {
      return jsonResponse(200, { received: true, skipped: 'no_customer_email' });
    }

    const language: 'fr' | 'en' = 'fr';
    const { subject, html } = buildPurchaseEmail(language, payload);
    await sendViaResend(payload.customerEmail, subject, html);

    return jsonResponse(200, {
      received: true,
      sent: true,
      eventType: event.type,
      recipient: payload.customerEmail
    });
  } catch (error) {
    return jsonResponse(500, {
      error: (error as Error).message,
      eventType: event.type
    });
  }
});
