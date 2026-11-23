# Almanac — merchant review and cross-brand support remediation
**Date:** 22 Nov 2026 | **Status:** urgent code hotfix in review; provider approval NOT restored.

## The user-provided rejection
An email screenshot dated **10 Nov 2026**, from **compliance@agentaos.ai** to **almanacstudy.support@gmail.com**, says AgentaOS cannot approve Almanac because it uses the same WhatsApp as `unemployedproff.com`. The reviewer characterizes the related site's services as research papers, dissertations and student discussion posts, and says it cannot work with a seller running an essay-writing service. The screenshot says `Fix that and apply again from 8 February`; the year is clipped. Since the email is from Nov 2026, **8 Feb 2027 is the likely next occurrence, not a verified date from the screenshot**.

The message is evidence of the provider's decision/reason, not independent proof of the unrelated site's current offerings. Any explanation back to the provider must be factual and provide honest ownership/control disclosures.

## Root causes confirmed in the 22 Nov repo review
- `src/components/site/request-builder.tsx`: lost-invoice notice used `support@unemployedproff.com`.
- `src/components/site/printable-invoice.tsx`: two invoice support destinations used the same unrelated brand.
- `src/components/site/payment-steps.tsx`: updated-invoice and support mailto destinations used that address.
- `src/lib/learning-mail.ts`: outbound transactional support reply-to and default operations routing used that unrelated address.
- `src/app/contact/page.tsx` and `src/app/api/learning-invoices/route.ts`: WhatsApp number fell back to `+1 205 727 9363`, previously used by Unemployed Professor, even if no Almanac-specific WhatsApp env setting existed.
- Other known public pages (`/contact`, footer, privacy and terms) already use `almanacstudy.support@gmail.com`, making the cross-brand fallback internally inconsistent.

## Hotfix changes
1. Single branded `ALMANAC_SUPPORT_EMAIL` constant in `src/lib/almanac-contact.ts`.
2. Replace known cross-brand email destinations in invoice recovery, printable invoice, payment help, and transactional reply-to/operations fallback.
3. Fail-closed WhatsApp: nothing displayed unless `ALMANAC_WHATSAPP_NUMBER` is explicitly configured to a **genuine independently operated Almanac-only support channel**, `ALMANAC_WHATSAPP_APPROVED=true` is separately authorized in server config, and the number passes E.164 checks. The known previously shared number is blocked even if configured. This does not itself establish compliance or separate beneficial ownership.
4. Sender validation rejects the other brand's known email domain; if operators configured an unrelated sender, transactional email needs independent verification and may remain disabled.
5. Add static audit script `node scripts/check-almanac-contact-isolation.mjs` so this doesn't silently regress.

**Not changed:** Paystack/AgentaOS account status, bank-transfer beneficiaries, CAD quote logic, order/payment endpoints, existing invoices, student data, actual company ownership, WhatsApp account registrations or the unrelated business's marketing.

## More serious merchant eligibility issue
Official [AgentaOS merchant terms](https://agentaos.ai/terms) last updated 30 Oct 2026, Section 5 and 21, say its platform is principally for ready-made digital products and online courses, and **custom or per-client-scoped work is excluded** even where packages have standard names and fees. That makes Almanac's current bespoke-study-pack quotation flow a likely poor fit for AgentaOS *independently of the WhatsApp rejection*. Do not interpret this as confirmation that any specific Almanac product is eligible.

**Potentially eligible line (subject to provider approval):** separately released and rights-cleared prebuilt courses, original practice and flashcard libraries, verified self-study access, downloadable ready-made digital study products. **Not to route via AgentaOS on present terms:** commissioned packs created after individual subject/syllabus uploads, bespoke one-off materials, or unapproved coaching/essay-writing work. Ask provider to confirm permitted offer IDs/URLs in writing before sale.

## Substantive resolution before reapplication
- [ ] Owner confirms business/legal ownership and any affiliation to `unemployedproff.com`; disclose links truthfully to the provider. Separate contact channels are good operational practice, **not a way to conceal common ownership**.
- [ ] Independent support address `almanacstudy.support@gmail.com` is actively monitored and mail sending/reply-to has been tested without unrelated-brand env settings.
- [ ] Remove the shared WhatsApp channel from Almanac now; if providing WhatsApp later, provision a real dedicated number and separate account/business operations, then seek provider advice about associated-merchant policy.
- [ ] Audit the other site's actual services and discontinue or correct any contract-cheating/ghostwriting services if present; truthful public policy must match practice.
- [ ] Document real Almanac offers: objectives, deliverables, source rights, samples, reviewer controls, no completion of active assessments on learners' behalf, customer support, refunds and ownership.
- [ ] Split ready-made/self-service digital learning products from bespoke custom production operationally and for payment processing; never misclassify bespoke work as a ready-made digital product.
- [ ] Verify actual permitted payment route before asking new students to pay; issue refunds/support for any prior customers as applicable.
- [ ] Get written provider clarification regarding reapplication eligibility (email says 8 February; year not visible) and whether truthful related-business disclosure and product scope meet policy.
- [ ] Recheck live Netlify env + deploying branch, run actual integration tests for invoice recovery, sender/from, API WhatsApp number, and any printed invoices.
- [ ] Do not create duplicate accounts or conceal beneficial ownership to bypass rejection.

## Provider communication guidance (do not send until facts/owner confirm)
A reply should acknowledge the review and ask exactly which corrections and supporting documents are required, including beneficial-owner/common-operator disclosures and eligibility for **ready-made online courses** separately from **bespoke course production**. Avoid claiming corporate independence or discontinuation of another service unless verifiable. Seek the exact earliest reapplication date and whether a review of changes can happen earlier.

## Release boundaries
The current fix is a **code patch**, not a guarantee of deployment, email-deliverability, provider approval or lawfulness of every product. Payment collection was previously on hold; a code-only contact correction does NOT re-authorize transfers, provider checkout or merchant onboarding.
