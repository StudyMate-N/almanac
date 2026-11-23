# Almanac × Creem — payment system contract v0.1

**Decision (2026-11-24):** Creem is the designated future checkout and merchant-of-record provider for Almanac. This is an implementation direction, **not a claim that the merchant, every offer or a live API key is approved**.

**Current operational state:** Legacy **new-order checkout remains disabled** in both Netlify frontend and the live Supabase Edge Function (see `docs/ALMANAC_CHECKOUT_PAUSE.md`). Existing private invoices, historical payment records, approved student access and support obligations remain in place. This branch does **not** enable Creem transactions, create a product or grant entitlements.

## Confirmed provider capabilities

Primary docs:
- [Create checkout API](https://docs.creem.io/api-reference/endpoint/create-checkout) and [API reference](https://docs.creem.io/skills/creem-api/REFERENCE): server-key-authenticated `POST /v1/checkouts` with a merchant-owned `product_id`, `request_id`, optional `success_url`; distinct `https://test-api.creem.io` vs `https://api.creem.io`.
- [Webhooks](https://docs.creem.io/skills/creem-api/WEBHOOKS): raw-body HMAC-SHA256 in `creem-signature` header; test credentials and signing secret separate from production. Duplicate and out-of-order deliveries must be anticipated.
- [Country list](https://docs.creem.io/merchant-of-record/supported-countries): Kenya currently included in eligible merchant payout countries. **Individual merchant approval and payout account verification are separate.**
- [Merchant terms](https://www.creem.io/terms): disclose true merchant identity, beneficial ownership, related sites, business activity and product type. Never open duplicate accounts or obscure common ownership.

## Product, not checkout-first design

The learner sees an outcome and a rights-cleared education product before any price or payment. Creem purchases should only be offered for explicitly approved, deliverable products, e.g. prebuilt, rights-cleared course access, practice libraries or self-study resources. **Do not invent available products or prices.** Custom-produced learner-specific packages, research-writing offers, direct exam/assessment completion or unreviewed materials are NOT included in the initial Creem catalogue without distinct eligibility/legal review. Request review and prospective interest can exist without a purchase CTA.

## Future purchase journey

```text
User goal → verified eligible, rights-cleared digital offer
      ↓
Authenticated learner + versioned price and product mapping on server
      ↓
Server-owned Creem product_id → create test checkout with stable request_id
      ↓
Creem-hosted checkout → redirect is ONLY a display state
      ↓
Raw signed webhook → reject invalid signature, payload or event type
      ↓
Verify mode, merchant account, known product, expected amount/currency,
order and request_id against pending internal order (server-to-server check if needed)
      ↓
Persist unique event id + checkout id + order id inside DB transaction
      ↓
Exactly-once entitlement grant or refund/revocation transition
      ↓
Learner sees access and support/recovery outcome
```

**Never grant course access based on browser redirects, query strings, submitted emails, or a webhook body alone.**

## Implemented in this PR

- `src/lib/payments/creem-verification.ts`: server-only HMAC verification of unchanged raw request body; extracts only non-PII event/order/product identifiers from signed `checkout.completed`, requires paid order and completed checkout, intentionally returns `fulfillmentAllowed:false`. Signed but unsupported refund/dispute/subscription events are not processed by this first contract.
- `src/lib/payments/creem-checkout-policy.ts`: evaluates explicit merchant approval, authenticated learner, release authorization, server-owned fixed-price offers and rights approval. The actual `ALMANAC_CREEM_APPROVED_OFFERS` registry is **empty** by design.
- `scripts/check-creem-payment-contract.mjs`: synthetic webhook signature, tamper, invalid/unsupported payment events, zero sensitive data in evidence, dormant checkout registry, and old-checkout-pause checks.

No public Creem webhook endpoint is registered. No live/test API credentials or product IDs exist in code. No real payments, DB writes or account operations occur in these tests.

## Next engineering gates (not implemented yet)

1. Merchant reviews Creem account **under truthful Almanac and related-business disclosures**, confirms actual business category, product scope, account review and allowed payout.
2. Approve real product catalogue with rights, reviewer sign-off, delivered content, refund/terms and a stable server-side price/version register. Create **test** products in Creem dashboard and record test IDs in secret server configuration, not client source.
3. Add **test-only** server-side checkout session endpoint with authenticated learner, ownership and commercial eligibility checks. Use `request_id` to prevent duplicate payment attempts. Never accept arbitrary client product IDs/prices.
4. Add signed webhook intake: verify raw body, account/mode, product and order reconciliation. Store event processing in a unique-constraint transactional ledger; replay, duplicate and out-of-order events must be safe. Check all relevant payment and subscription/refund/chargeback events before automatic entitlement.
5. Run sandbox test suite: paid, failed, canceled, duplicate, delayed, tampered, incorrect product/amount, wrong environment, refunded/disputed, network retry and backend recovery. Reconcile ledger with Creem API for disputes/ambiguity.
6. Review domain/checkout experience, authenticated mobile accessibility, clear subscription/one-time disclosure, post-payment onboarding, cancellation/refund workflows and support communications.
7. Only after **merchant approval + sandbox reconciliation + privacy/security review + sign-off** may a separate PR enable live purchase flows. The legacy CAD bank invoice workflow remains historical; do not silently convert its invoices to Creem or double-charge.

## PostHog role

PostHog can track *consented product-use milestones* such as viewing an offer and beginning an approved checkout, but not customer emails, order IDs, card data, personal financial attributes, access tokens, browser payment URLs or sensitive learning records. Creem's **financial ledger**, not PostHog, is authoritative for monetary state.

## Failure policy

Fail closed with a precise non-payment option. During development, user-facing site still says new orders are paused. Never enable Creem merely because an API test passes or a session redirect succeeds. Existing legacy invoice/access obligations must remain independently supported.
