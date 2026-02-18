# Email Templates (FR/EN)

Ces templates sont des references pour la configuration Supabase Auth et les emails applicatifs.
Ils ne sont pas charges automatiquement par le code. Copiez-les dans l'interface Supabase ou utilisez-les
comme base pour les templates Resend/Stripe.

## Auth (Supabase)
- `auth/confirm-signup.fr.html`
- `auth/confirm-signup.en.html`
- `auth/reset-password.fr.html`
- `auth/reset-password.en.html`
- `auth/confirm-email-change.fr.html`
- `auth/confirm-email-change.en.html`

Variables Supabase disponibles (exemples):
- `{{ .Email }}`
- `{{ .ConfirmationURL }}`

## App (Resend Edge Functions)
- `app/message.fr.html`
- `app/message.en.html`
- `app/listing-published.fr.html`
- `app/listing-published.en.html`
- `app/smartmatch.fr.html`
- `app/smartmatch.en.html`
- `app/deal-stage.fr.html`
- `app/deal-stage.en.html`
- `app/document-shared.fr.html`
- `app/document-shared.en.html`
- `app/nda-signed.fr.html`
- `app/nda-signed.en.html`

## Billing (Stripe)
- `billing/purchase.fr.html`
- `billing/purchase.en.html`

Variables proposees pour l'email d'achat (a fournir par Stripe):
- `{{customer_name}}`
- `{{product_name}}`
- `{{amount}}`
- `{{currency}}`
- `{{invoice_url}}`
