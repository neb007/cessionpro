# GitHub Environment Setup (Local / Staging / Production)

This project uses:
- Frontend deploy: Vercel
- Backend functions: Supabase Edge Functions
- Git flow: `develop` (staging/preview) and `main` (production)

## 1) Local environment

Use local-only file (already present):
- `.env.local`

Required keys:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- optional: `VITE_APP_ENV=local`

Never commit local secrets.

## 2) GitHub branch rules

Configure in GitHub repository settings:

### Branch `main`
- Require pull request before merge
- Require status checks to pass before merge
  - `build-and-lint`
- Restrict direct pushes to `main`

### Branch `develop`
- Optional but recommended:
  - Require status checks (`build-and-lint`)

## 3) CI checks

Workflow file:
- `.github/workflows/ci.yml`

Runs on push/PR to `main` and `develop`:
- `npm ci`
- `npm run lint`
- `npm run build`

## 4) Vercel environments

In Vercel project settings, define variables for:
- Preview (branch `develop`)
- Production (branch `main`)

Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_ENV`
  - Preview: `staging`
  - Production: `production`

## 5) Supabase Edge Function secrets

Set in Supabase project settings (Functions secrets):
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_URL`
- `STRIPE_SECRET_KEY` (when Stripe is enabled)
- `STRIPE_WEBHOOK_SECRET` (when Stripe is enabled)

## 6) Deploy commands for Edge Functions

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy send-email
npx supabase functions deploy smartmatch-notify
npx supabase functions deploy stripe-webhook
```

## 7) Guardrails with one Supabase project

Because staging and production currently share one Supabase project:
- Keep Stripe webhook endpoint disabled in production until explicit go-live
- Keep idempotency keys enabled in email flows
- Use different `APP_URL` values by environment (preview vs production)

## 8) Future migration to two Supabase projects

Later, split into:
- non-prod Supabase project for `develop`
- prod Supabase project for `main`

Migration steps:
1. Duplicate schema/functions to non-prod
2. Point Preview env vars to non-prod project
3. Keep Production env vars on prod project
