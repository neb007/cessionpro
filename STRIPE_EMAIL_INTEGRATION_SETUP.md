# Stripe Full Integration (UI + Secure Backend + Webhooks + Billing)

## Added in codebase

### Backend / Supabase
- SQL migration:
  - `migrations/20260218_stripe_billing_secure.sql`
- New Edge Functions:
  - `supabase/functions/stripe-checkout/index.ts`
  - `supabase/functions/stripe-portal/index.ts`
- Reinforced webhook:
  - `supabase/functions/stripe-webhook/index.ts`

### Frontend
- Service:
  - `src/services/billingService.js`
- Connected UI pages (without visual redesign):
  - `src/pages/Abonnement.jsx`
  - `src/pages/Billing.jsx`

## Required secrets (Supabase Edge Functions)
Set these secrets in Supabase:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM` (recommended: `Riviqo <no-reply@riviqo.com>`)
- `APP_URL` (recommended: `https://riviqo.com`)

## Deploy commands
```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-portal
supabase functions deploy stripe-webhook
```

## Stripe dashboard setup

### Webhook endpoint
Use:
- `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`

Subscribe to at least:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.payment_failed`

## Security model implemented
- Server-side catalog validation (`billing_products`) to prevent client-side price tampering.
- Auth required for checkout and portal functions (Supabase JWT).
- Webhook signature verification via `stripe-signature`.
- Webhook idempotence via `billing_webhook_events(event_id UNIQUE)`.
- Billing audit trail tables (`billing_transactions`, `billing_subscriptions`, `billing_checkout_sessions`).
- RLS on billing tables to restrict user access to own records.
- Security logging (`billing_security_events`) for checkout/portal attempts.

## Database objects (high-level)
- `billing_customers`
- `billing_products`
- `billing_checkout_sessions`
- `billing_transactions`
- `billing_subscriptions`
- `billing_webhook_events`
- `billing_security_events`

## Operational notes
- Fill `billing_products.stripe_price_id` with real Stripe Price IDs when available.
- One checkout session currently enforces a single mode (`payment` OR `subscription`) per cart.
- Portal button opens Stripe customer portal if a Stripe customer mapping exists.

## Quick validation checklist
1. Run SQL migration.
2. Deploy 3 Edge Functions.
3. Configure Stripe webhook endpoint + events.
4. In app, add products in **Abonnement** and launch checkout.
5. Complete payment in Stripe test mode.
6. Confirm:
   - row inserted/updated in billing tables,
   - email sent,
   - transaction visible in **Billing** page,
   - portal button opens Stripe portal.
