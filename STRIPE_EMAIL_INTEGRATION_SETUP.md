# Stripe Purchase Email Integration (Supabase Edge Function)

## Added
- Edge Function: `supabase/functions/stripe-webhook/index.ts`
- Billing templates:
  - `supabase/templates/emails/billing/purchase.fr.html`
  - `supabase/templates/emails/billing/purchase.en.html`

## Required secrets (Supabase)
Set these in Supabase Edge Functions secrets:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM` (recommended: `Riviqo <no-reply@riviqo.com>`)
- `APP_URL` (recommended: `https://riviqo.com`)

## Deploy function
```bash
supabase functions deploy stripe-webhook
```

## Stripe webhook endpoint
Use this URL in Stripe Dashboard > Webhooks:
- `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`

Subscribe at least to events:
- `checkout.session.completed`
- `invoice.payment_succeeded`

## Current behavior
- Verifies Stripe signature (`stripe-signature`).
- Extracts customer email/name, amount, currency, product description.
- Sends purchase confirmation email via Resend.
- Ignores unsupported event types.

## Notes
- Language is currently defaulted to FR in webhook (`language = 'fr'`).
- If you want per-user language, pass metadata in Stripe checkout session and map it in webhook.
