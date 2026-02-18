# Supabase Auth Email Templates Setup (Riviqo)

This guide maps the local HTML templates to Supabase Auth email templates.

## Prerequisites
- Resend domain verified
- SMTP configured in Supabase Auth:
  - Host: `smtp.resend.com`
  - Port: `465`
  - Username: `resend`
  - Password: your Resend API key
- Sender: `Riviqo <no-reply@riviqo.com>`

## Templates to configure in Supabase

1. `Confirm signup`
- Subject FR: `Confirmez votre inscription Riviqo`
- Subject EN: `Confirm your Riviqo signup`
- HTML file FR: `supabase/templates/emails/auth/confirm-signup.fr.html`
- HTML file EN: `supabase/templates/emails/auth/confirm-signup.en.html`

2. `Reset password`
- Subject FR: `Reinitialisez votre mot de passe Riviqo`
- Subject EN: `Reset your Riviqo password`
- HTML file FR: `supabase/templates/emails/auth/reset-password.fr.html`
- HTML file EN: `supabase/templates/emails/auth/reset-password.en.html`

3. `Confirm email change`
- Subject FR: `Confirmez votre changement d'email`
- Subject EN: `Confirm your email change`
- HTML file FR: `supabase/templates/emails/auth/confirm-email-change.fr.html`
- HTML file EN: `supabase/templates/emails/auth/confirm-email-change.en.html`

## Supabase variables used in templates
- `{{ .Email }}`
- `{{ .ConfirmationURL }}`

## Notes
- Supabase Auth UI does not provide per-language auto-switch in one template.
- Recommended approach: keep EN as default in Supabase and maintain FR copy for manual switch if needed, or route by project/tenant strategy.
- For app notification emails, language switching is already handled in Edge Functions.
