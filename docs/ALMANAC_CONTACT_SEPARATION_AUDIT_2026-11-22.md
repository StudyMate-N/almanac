# Almanac — follow-up cross-brand separation audit
**Date:** 22 Nov 2026 | **Status:** v2 patch awaiting CI and merge; brand/customer-channel segregation is not the same as legal/merchant independence.

## Verified defects from full feature-branch source review
Original hotfix PR #9 removed unrelated-domain references from publicly visible request form, invoice fallback, printable invoice, payment-help component, contact page and default mail code, and blocked the old WhatsApp number.
A subsequent comparison-based scan across 137 changed application, server, SQL and script source paths found further references:
- `src/app/app/orders/page.tsx`: paid learner order claim error and support footer
- `src/components/site/staff-recovery-panel.tsx`: manual private invoice-link and access-code recovery copy
- `src/app/coach/external-enrollment/page.tsx`: external invitation email body assembled by staff
- `src/components/gate.tsx`: learner sign-in/access code help
- `src/components/site/patho-page.tsx`: course landing page support mailto
The v2 hotfix replaces these with the central `ALMANAC_SUPPORT_EMAIL`. Two files listed in GitHub comparison no longer exist on the branch, so were not inspectable; no claim of scanning deleted files.

## Deployment environment audit — important
Live Netlify environment (`almanac-study`) still had `ALMANAC_OPERATIONS_EMAIL` and `ALMANAC_EMAIL_FROM` associated with the other brand, despite the first code hotfix. The Resend account available in this conversation exposes the other brand's verified sending domain, but no verified Almanac-branded sending domain.

Corrective operator actions on 22 Nov 2026:
- Reassigned **ALMANAC_OPERATIONS_EMAIL** to `almanacstudy.support@gmail.com` in dev, branch-deploy, deploy-preview and production contexts.
- Deleted `ALMANAC_EMAIL_FROM`, removing the known cross-brand sending identity.
- Deleted `ALMANAC_RESEND_API_KEY` from the Almanac Netlify site: the service will not make automated transactional deliveries until a properly authorized dedicated Almanac sender and key are provided.
- `ALMANAC_WHATSAPP_NUMBER` and `ALMANAC_WHATSAPP_APPROVED` were absent; code fails closed and blocks the previously shared number even if misconfigured.
- Do **not** reintroduce the other company's sender or WhatsApp merely to restore notifications; demonstrate a genuine dedicated channel and proper related-business disclosures first.

## Regression coverage
- `scripts/check-almanac-contact-isolation.mjs`: scans all currently present files under `src/` for the other brand's domain and the old phone number, allowing only the explicit denylist in `src/lib/almanac-contact.ts`.
- `.github/workflows/learning-orders.yml` now executes that audit in the existing PR quality gate before type-check and build.
- The historical reference to the old contact in this audit and the denial-policy source is for blocking/review only, never a permitted destination.

## Limits to what this audit establishes
- Cannot prove separate legal entities, beneficial ownership, staff, finances, bank beneficiary, past customer transfers, domain registrants, or access-control permissions merely by changing code and environment settings.
- The Almanac website still includes a CAD bank-transfer path subject to earlier restricted launch review. Separate payment approval, authorized beneficiary and suitable provider need actual evidence before accepting funds. The provider rejection is not reversed by this technical patch.
- The **email sending functionality is intentionally paused**. New requests must show working on-screen invoice recovery and be monitored through the staff system; end-to-end recovery mail, support inbox monitoring and a dedicated verified sending domain still require verification.
- Existing already-emailed notifications, screenshots, archived invoices, and downloaded PDFs are not retroactively edited.
- No undisclosed business/merchant separation claims should be made to the payment provider. Related ownership or operational connections must be disclosed truthfully.

## Closeout checklist
- [ ] PR v2 passes live CI and is merged into the Netlify production branch; verify deploy and the live /contact and course support URLs.
- [x] Source support destinations centralized; subsequent regression test to run automatically on every source PR.
- [x] Netlify env cross-brand email variables remediated; dedicated sender pending.
- [ ] Human verifies the actual support inbox and staff response capacity.
- [ ] Dedicated operational email sender/domain and credential verified and configured if transactional notifications are desired.
- [ ] Owner verifies any beneficial ownership or financial relationship; compare actual bank beneficiary and payment terms to the commercial operator.
- [ ] AgentaOS confirms product eligibility, reapplication date and required documentation in writing.

## Follow-up verification — 23 Nov 2026 (contact-compliance lane)

**Changed:** This follow-up records current evidence without changing production code or restoring payment/email services. PR #10 is already merged, so the former hotfix branch is retained as a historical audit branch; further runtime changes should be proposed in a new scoped review PR rather than force-pushing the merged branch.

**Verified:**
- GitHub PR #10 reports `closed / merged`. The production Netlify project `almanac-study` reports deploy `6b0259d8c528d3f775bc660f` as `ready`; the previously observed deployed commit is `15c2c1d45ce16dd3ce143cbcb0a2feb9d4f4e23f` (22 Nov 2026).
- A fresh read of Netlify environment-variable **names and redacted context classifications**, without disclosing secret values, confirms `ALMANAC_OPERATIONS_EMAIL` resolves to the Almanac support inbox in **dev, branch-deploy, deploy-preview and production** contexts.
- `ALMANAC_EMAIL_FROM`, `ALMANAC_RESEND_API_KEY`, and `ALMANAC_WHATSAPP_NUMBER` remain **absent**. This prevents assuming automated email or WhatsApp is configured; it is not evidence of an independently verified sender or monitored inbox.
- A fresh connected Supabase project read still returns `INACTIVE` for Almanac project `pebkqsyfliytbowxzyun`. No remote private-resource authorization or checkout probe can be counted as passed.
- Direct public-page verification was attempted for `/`, `/contact`, `/app/orders`, and `/coach/external-enrollment` via an HTTP client; all failed at DNS resolution in the execution environment. An independent web fetch of `/` and `/contact` also failed. These are **unverified**, not evidence of broken or clean rendered pages.

**Blocked:** Live DOM/page contact scan; inbox monitoring and real sender-domain validation; external authorization/payment tests; AgentaOS product eligibility and reapplication-date confirmation; ownership/beneficiary and historical-notice review. No external messages were sent and no payment routing, invoices, refund records or credentials were changed.

**Next:** Obtain a browser-capable authenticated smoke-test environment to inspect rendered public and staff-authorized pages (without exposing student data), restore Supabase through the QA lane with operator approval, then rerun remote privacy and checkout tests. Separately provision a verified Almanac-specific transactional sender and validate inbox deliverability. Keep Issue #8 open and merchant activation blocked until written eligibility and truthful ownership disclosures are confirmed.

## Follow-up verification — 24 Nov 2026

**Changed:** Evidence-only update on historical audit branch; no runtime change or merge. Backend restoration was performed by the QA lane with owner authorization, not this lane.

**Verified:** Supabase project API now reports `ACTIVE_HEALTHY`. Netlify production deploy `6b04b2a5555f3d183d90f22d` is ready, published 23 Nov at 21:40:22 UTC, commit `1f4db5d8f955e959d3df3d4d8dd935c234024a60`. Exact commit CI [45271965649](https://github.com/StudyMate-N/almanac/actions/runs/45271965649) succeeded: contact scan 120 source files, typecheck/build, seven unauthorized file probes denied HTTP 403, checkout health step successful. No orders/files created by privacy probes. Netlify operations address matches Almanac support in four contexts; sender/key and WhatsApp configuration absent. An email diagnostic recipient variable exists; its value is not disclosed or independently approved here. No diagnostic email was sent. Current deployed mail source requires a sender and key before transport.

**Blocked:** Rendered page/invoice inspection, actual monitored inbox and dedicated verified sender, diagnostic recipient authorization, controlled entitlement and payment settlement, privileged RPC review (Issue #11), merchant written approval and ownership/beneficiary disclosure. Backend health and CI do not authorize collections.

**Next:** QA lane to complete controlled end-to-end and RPC authorization checks; contact lane to verify rendered pages and dedicated sender/diagnostic recipient before any email activation. No external correspondence or customer/payment data changes.
