# Almanac — temporary Netlify deployment and Vercel return

## Current hosting (verified 24 Nov 2026)

The owner's direction: **Vercel is the build and preview path for Almanac.** Netlify was the temporary detour while Vercel's free-tier daily deployment limit was hit.

| Where | Project | What it serves | Status on 24 Nov 2026 |
| --- | --- | --- | --- |
| Vercel | `almanac` (only Vercel project linked to `StudyMate-N/almanac`) | Production = `main` (last production deploy 14 Oct 2026). Preview = every pushed branch. | Previews building normally (all READY on 24 Nov); daily limit not blocking. |
| Netlify | `almanac-study` | `feat/custom-learning-orders-v1` | Live; temporary. Keep until Vercel cutover is approved. |
| Netlify | `almanac-prev` | Older preview copy | Not linked to current work. Candidate for deletion. |

Vercel's free plan allows 100 deployments per day and resets on its own; every branch push uses one. Avoid pushing many branches in quick succession.

This document's original Netlify-launch steps follow for reference.


Goal: Put the **current Next.js application** online on a temporary Netlify URL without changing the GitHub repository, Supabase database, or Vercel project's production configuration.

## Today — Netlify launch

**Prerequisite:** Operator connects their own Netlify account to GitHub and authorizes the `StudyMate-N/almanac` repository. ChatGPT does not currently have a connected Netlify deployment action, so creation/initial linking requires the operator.

1. Visit https://app.netlify.com/start and sign in.
2. Select **Import an existing project** → **GitHub**.
3. Authorize the GitHub app to access `StudyMate-N/almanac`.
4. Select repository `StudyMate-N/almanac`.
5. **Deploy branch**: `feat/custom-learning-orders-v1` (**NOT** the default/main branch). If branch selection is unavailable in the initial wizard, configure the production branch under Project configuration → Build & deploy / Continuous deployment before exposing the Netlify URL.
6. Netlify reads the committed `netlify.toml`:
   - Base directory: repository root
   - Build: `npm run build`
   - Publish: `.next`
   - Node version: `22`
   - Next.js: use automatic OpenNext adapter; do **not** add a legacy Next.js plugin, SPA redirects, or static export.
7. In Netlify **Project configuration → Environment variables**, supply the same required runtime values as the Vercel development deployment. **Never commit secrets, bank account numbers or provider keys to GitHub or paste them into chat.** Runtime variables must be set in Netlify's project configuration (not only in `netlify.toml`).
   - `ALMANAC_WHATSAPP_NUMBER` and `ALMANAC_WHATSAPP_APPROVED=true`: only for a dedicated, Almanac-only number. Leave both unset otherwise; the site then shows no WhatsApp.
   - Bank (sensitive, copy securely from approved bank records): `ALMANAC_BANK_CURRENCY`, `ALMANAC_BANK_NAME`, `ALMANAC_BANK_ADDRESS`, `ALMANAC_BANK_INSTITUTION`, `ALMANAC_BANK_TRANSIT`, `ALMANAC_BANK_ACCOUNT_TYPE`, `ALMANAC_BANK_ACCOUNT_NUMBER`, `ALMANAC_BANK_BENEFICIARY`. Do not enable visible payment instructions until account and cross-border CAD routing are independently verified.
   - Optional public Supabase config (repo has public defaults): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — values are public configuration, not service-role keys.
   - Optional pre-existing media URL: `NEXT_PUBLIC_MEDIA_BASE` (public resource origin when available).
   - Optional transactional notifications (only after verified sending identity): `ALMANAC_RESEND_API_KEY`, `ALMANAC_EMAIL_FROM`, `ALMANAC_OPERATIONS_EMAIL`.
   - Sensitive `BLOB_READ_WRITE_TOKEN` is only needed if a specific Vercel Blob integration is actually used server-side. Do not copy by default.
   - **Never set the Supabase service-role key in `NEXT_PUBLIC_*` variables.** Supabase Edge functions remain deployed separately and use their own service credentials.
8. Deploy. Use the generated `*.netlify.app` address **temporarily**, without moving a custom domain for a one-day test.
9. Run Netlify browser tests before sharing the link:
   - Home, catalog, `/request`, `/help`, `/contact`, Terms and Privacy.
   - Package pricing, module quantities, and unavailable 3-day Complete Course.
   - Invoice creation: only via a controlled test order, explicit terms consent and correct CAD amount/validity. Do not encourage a real bank transfer without financial validation.
   - Private invoice link access, optional syllabus file upload, payment report file upload (test-only).
   - Staff `/coach` and learning-orders staff area, authorization / navigation.
   - Student sign-in, `/app/orders`, interactive course routes for test accounts.
   - Mobile/desktop rendering and server function logs. Redact private URLs and tokens in support screenshots.
10. Keep Netlify **temporary**. If the deployment fails, inspect its build/function logs and adjust only the Netlify-specific setup; don't rewrite Supabase or Vercel.

## Tomorrow — safe return to Vercel

An automated task is scheduled for **16 October 2026, around 08:00 Africa/Nairobi**, to retry Vercel preview deployment after the quota resets and verify its status. It will not blindly reconfigure DNS or activate public bank transfers.

1. Verify the latest GitHub branch CI remains green.
2. Deploy the same branch to Vercel **Preview** under the existing `almanac` project.
3. Test the same core URLs: `/`, `/courses`, `/request`, `/invoice` using an authorized test invoice, `/app/orders`, and `/coach/learning-requests`.
4. Confirm Vercel's environment values match the active Netlify deployment where needed. Both must connect to the same Supabase backend; do not migrate or duplicate customer data.
5. When Vercel is ready and tested, make Vercel the shared destination again. If no custom domain was moved and only `netlify.app` was used, **no DNS change is necessary**.
6. Do not delete Netlify immediately: retain a short fallback until successful cutover and no active clients rely on its URL. Prefer disabling future Netlify auto-deploys if no longer in use.
7. Do not merge draft PR #3 or enable public banking payments until the outstanding release gates in `docs/ALMANAC_QA_RELEASE_REPORT.md` are satisfied.

## Notes and blockers

- Netlify has no currently connected app/action in this ChatGPT session. User action in Netlify is required to connect GitHub and create the site; do not present a fake deployed URL.
- Success on Netlify does not independently verify bank settlement, transactional email, malware scanning, legal texts, academic content quality, or fulfillment capacity.
- The hostname itself is not important: one GitHub source, one set of Supabase data, and separate hosting configurations make the one-day migration reversible.
