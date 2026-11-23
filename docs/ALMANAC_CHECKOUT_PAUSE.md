# Checkout pause — temporary operational policy

Decision: all **new** Almanac learning orders are paused while the existing product and educational experience are rebuilt.

- The authoritative Supabase Edge Function `learning-order-checkout` was upgraded from version **7** to **8**. Version 8 returns HTTP **503** with `error: "checkout_paused"` for all new order payloads. It does not invoke the `learning_request_create_cad` RPC or request exchange rates for a new checkout.
- The original Edge Function source is preserved, verbatim, in `ops/legacy-checkout/learning-order-checkout.v7.ts` on the `product/almanac-learning-system-v1` branch, for a **reviewed rollback only**. Do not restore it just because a CI test fails.
- Existing **staff re-quote** action (`action: "requote"`) remains on its previous code path. Existing invoices, receipt reporting, learner access, file services and staff operations have **not** been deleted or globally disabled.
- This hotfix replaces the public `/request` purchasing form with a clear maintenance notice and useful navigation. The Next.js `POST /api/learning-requests` returns HTTP 503 `checkout_paused` unconditionally while the old checkout is decommissioned. The old server implementation remains under version control but is not reachable after hotfix deployment.
- The public page explains that users should not make new transfers based on stale quotes without checking existing invoice status.
- Existing historical invoice and support responsibilities remain; **this is not cancellation, deletion, or a refund**.
- The live backend pause was requested explicitly by the project owner. Its deployment must be tested separately from the Netlify frontend hotfix. Netlify automatically builds the canonical branch `feat/custom-learning-orders-v1`; only a tested merge into that branch updates the production UI.
- Verify with `node scripts/check-checkout-health.mjs` from CI and with the public /request page after deploy. Expected result: 503 checkout_paused on new orders, zero new order records, while existing read and recovery remain accessible.
- The redesign should not re-enable the legacy checkout. New purchase journeys require a separately reviewed product offer, entitlement system, merchant route, privacy/terms, QA, and explicit production go/no-go.

**Rollback:** Only after an explicit decision to resume purchases, restore a reviewed backend version with preserved authentication/re-quote behavior, and deploy a reviewed new purchase UI. Never enable old checkout by flipping an undocumented environment variable.
