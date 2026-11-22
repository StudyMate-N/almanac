# Almanac Self-Service — Acceptance & Price Test Matrix
**Working QA specification v0.1 · source inspected 22 Nov 2026.**

## Verified source code references
- `src/lib/learning-offers.ts`: OFFERS, ENHANCEMENTS, PREFERENCES, SPEEDS, calculator and server-compatible validations.
- `src/components/site/request-builder.tsx`: current user-facing choices and invoice-generation flow.
- `src/lib/deck.ts`: due card scheduling and stable card review IDs.
- `src/lib/store.tsx`: learner plans, cache and progress.
- `learning-experience/prototypes/self-study-configurator.html`: local-only **separate prototype**, not attached to the production route.

## Deterministic custom-production quotation cases
| Case | Expected |
|---|---|
| Focused module, standard, no extras | $49, permitted |
| Exam pack, standard, no extras | $149, permitted |
| Complete course, standard, no extras | $399, permitted |
| Exam pack + 1 deep video + 1 extra exam, priority | Round(($149+$35+$39)×1.4) = **$312**, permitted |
| Focused module + 1 deep video, express | Round(($49+$35)×1.9) = **$160**, permitted |
| Complete course + 4 extra units + 3 deep videos + 2 extra simulations, standard | $399+$236+$105+$78 = **$818**, permitted (capacity still separate) |
| Complete Course + express | BLOCKED (regardless of extras) |
| Complete Course + 3 extra modules, priority | BLOCKED by `isSpeedAvailable` |
| Exam pack + 2 deep videos, express | BLOCKED by `isSpeedAvailable` |
| Focused module + extra simulation | BLOCKED by max=0 |
| Exam pack + extra unit | BLOCKED by max=0 |
| Any package: optional story/music/game interest toggled | Zero extra charge and no promise of fulfillment |
| Any package: preferred start changes video -> reading | Zero extra charge; no deletion of included formats |
| Existing released self-study catalogue (any mode) | No price calculated from bespoke package base; uses only an approved actual catalog SKU when one exists |

**Notes:** This matrix derives from inspected source, not a live backend test. Prototype UI clamps above-cap extra quantity; actual RPC must reject invalid raw submissions. Availability and legal/payment eligibility remain separate constraints.

## Learner study integrity tests
1. Switching starting format leaves question identities, previous attempts, FSRS due dates and course entitlement unchanged.
2. Setting session length from 45 to 15 minutes changes the suggested workload, not the correctness key or approved objectives.
3. Skipping a video or optional musical cue does **not** generate a "mastered" state.
4. 'Evidence of understanding' requires actual task evidence with reviewed rubric; passive viewing is a distinct tracked state.
5. A learner can accept a proposed next objective or override without losing an assessment attempt.
6. Choosing unavailable media shows an honest unavailability option and text alternative; no fake generation progress.
7. Story and game use approved content hash, meaningful feedback, accessible tap/keyboard path and separate transfer question.
8. Low-bandwidth text route remains accessible when MP4/CDN unavailable or licensed file offline.
9. A source/claim edit invalidates its approval and affected derivatives; no stale video/audio export remains approved.
10. All newly stored learner preferences and study events are subject to RLS/RPC owner authorization and offline conflict reconciliation; no private responses in social trackers.

## Self-service usability checks
- Five-minute test: learner can identify included materials, change a start mode, specify a time budget and state next useful study action without help.
- Distinguishes **already released** materials from **new commission** quote.
- User cannot accidentally generate an invoice or pay from local study-prototype.
- Pricing/quality explanation understandable without professional jargon; access and capacity unambiguous.
- Advanced format options don't cause choices to overwhelm default flow.
- Email address and payment-route truth approved before public activation.

## Scope and risk
Source `src/components/site/request-builder.tsx` invoice recovery fallback currently references `support@unemployedproff.com`, an address belonging to a different brand; payment messaging concerns CAD transfer. Owner must confirm correct Almanac transactional support destination and payment approval. Tracked in [Issue #8](https://github.com/StudyMate-N/almanac/issues/8). Do not guess a replacement address or push direct payment changes without approval.

## Checks actually performed
- The new prototype HTML script was parsed as valid JavaScript (syntax-only).
- Static source contains no `fetch()` or XHR network requests; user preferences are only exported to a local JSON file on a click.
- Source-derived reference arithmetic was independently recomputed for sample cases; this is **not** a full browser, API, accessibility or database test.

## Before merge or production
- Real browser testing desktop/mobile, screen reader and keyboard QA, automated unit tests comparing UI quote and database validation.
- Security review for any durable preference persistence and catalog entitlements.
- Product owner confirms scope, rate semantics, release statuses, learner privacy and transactional-support identity.
