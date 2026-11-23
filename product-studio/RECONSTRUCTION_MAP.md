# Almanac reconstruction map — keep the foundations, redesign the product

**Status:** working product audit, not an approved wireframe. **One release truth:** refined Netlify site, with new checkout paused. No old Vercel draft import.

## Core diagnosis from current source

Today Almanac's public flow largely asks the user to choose a *commercial package* (`resource / exam / complete course`), quantities, extras, timeline, delivery and an invoice **before** they have used a coherent learning experience. The current /app offers a collection of tools (course outline, Today, lessons, practice, flashcards, progress, coach, orders) but has no single learner-intent-to-next-step contract. The product-specific question "what am I trying to learn, and what should I do now?" must become the central organizing principle.

That is a product-architecture problem, not a page-spacing bug.

## Three product surfaces — distinct responsibilities

### Discover: before entitlement
**User asks:** "Can Almanac help me learn this?"

The site should give a clear explanation and credible sample of one real learning objective, a reviewed teaching interaction, what is genuinely available and what is still planned. It should not force the user to predict whether they want 8 videos vs 120 flashcards. Default state while rebuilding: **no purchase route**.

### Learn: after entitlement
**User asks:** "What should I do right now, and what if I struggle?"

The system should know the authorized course, objectives, available approved materials, actual prior attempts and due review, then suggest one short meaningful action with an explanation and a way to override. A typical cycle is `explain → try → reason through feedback → revisit`. Being active is not the same as understanding.

### Operate: staff/review system
**Staff asks:** "What approved learning experience can this learner safely receive next?"

The content supply system needs source provenance, rights, reviewed objectives, approved version hashes, interactive content parity, media captions, accessibility, customer entitlement, production capacity and secure release. The current coach/order/asset systems are candidate foundations. Keep customer data and historical delivery obligations unchanged.

## Existing code → disposition

| Current part | Decision | What changes |
|---|---|---|
| `/request` + `POST /api/learning-requests` | **SUSPENDED** | Paused page and deterministic API rejection. Rebuild commerce after educational value and permitted merchant route are demonstrated |
| Supabase `learning-order-checkout` | **SUSPENDED for new orders** | Live version 8 rejects `checkout_paused` before order creation; staff re-quote preserved |
| `/invoice` and payment-report endpoints | **PRESERVE LEGACY OBLIGATIONS** | Existing users retain access and support; do not advertise new payments |
| `/courses` + course pages | **REIMAGINE DISCOVERY** | Demonstrate real, reviewed outcomes; separate available, preview, and proposed |
| `/app` Today dashboard | **FOUNDATION** | Eventually becomes one contextual "what matters now" learning entry, not a list of dashboard widgets |
| `/app/learning-compass` (Product Studio pilot) | **NEW TESTABLE KERNEL** | Goal → authorized recommendation → rationale → next step, with fallback |
| `/app/learn`, practice, flashcards | **REUSE + REWORK** | Authentic study actions, feedback, review and cross-session continuity |
| `/app/orders` | **PRESERVE CUSTOMER ACCESS** | Existing paid orders and downloads; no new checkout links |
| `/coach` | **CONTINUE INTERNAL REFACTOR** | Turn into versioned learning-content production, review, accuracy and release system |
| `src/lib/store.tsx` and Supabase data | **PRESERVE AND AUDIT** | Existing real progress/FSRS; no silent rewrite; authorizations/privileged RPCs require security review |
| PostHog draft PR #23 | **MEASUREMENT TOOL** | Consent-gated UX events on approved learner experience, not sensitive answer tracking or blanket replay |
| Legacy Vercel `almanac` | **ARCHIVE REFERENCE** | Do not equate with source or deploy new learner journey through it |

## Learning Engine interaction contract

Every meaningful user screen should expose:
1. **Context:** "You're in [authorized course]" (or no course, stated honestly).
2. **Goal:** "What are you trying to accomplish?"
3. **One recommended action:** start a reviewed lesson or practice activity, not five competing CTAs.
4. **Reason:** "We suggest this because ..." grounded in visible evidence; if there is no evidence, say so.
5. **Action & recovery:** Start, change route, choose lower-data alternative or seek help.
6. **Feedback:** Show the outcome of what the learner attempted; if accuracy/feedback is unreviewed, do not invent mastery.
7. **Continuity:** On return, resume approved materials and prior progress without clearing records.

**Example interaction (not a factual statement about any current learner):** "You're preparing for an assessment and have set aside 15 minutes. Let's start with ten reviewed questions from your available course. After each one, check the reasoning; we can revisit the ideas that were difficult." The pilot currently supports this *structure* but does not yet use a validated per-objective model or cross-device preference sync.

## Replace the current navigation in controlled stages

- **Slice 0 — Stop risky commerce:** Complete. Keep new checkout down, existing invoices supported.
- **Slice 1 — Guided start:** Build and test `/app/learning-compass` with user goal, time, bandwidth, authorized activity and reason.
- **Slice 2 — Real learning loop:** Connect guide to approved objective coverage, practice rationales, meaningful feedback, honest uncertainty and spaced-recall continuity. Require clinical and rights review for source content.
- **Slice 3 — Production cockpit:** Make coach's content review and approvals explicit and testable, then power the guide with real reviewed media inventory.
- **Slice 4 — Product measurement:** Small, privacy-vetted PostHog events, purposeful usability feedback, first-action and recovered-error evaluation; hold sensitive study evidence in protected database.
- **Slice 5 — Commercial model:** Only after learner usefulness and an approved merchant path, design clear ready-made access vs bespoke human work with transparent entitlements and no unsupported timelines.
- **Slice 6 — Release:** one coherent public narrative, mobile/keyboard accessibility, secure staff and learner end-to-end test, rollback plan, Netlify preview plus production verification.

Do not treat steps as a calendar promise. Parallel work is possible, but no test is silently waived by a later UI patch.

## Current hard constraints

- Do not reintroduce the existing custom-order invoice checkout as a shortcut.
- Do not publish unverified nursing/medical content, media or answer keys.
- Do not claim a learning outcome from pageviews or video completions.
- Do not send raw learner answers, exams, case information, payments, access codes or account data to PostHog.
- Do not replace existing paid-order fulfillment with a prototype interface.
- Do not point Netlify at Vercel's older `main` code.
- Do not mark Netlify preview as complete until the actual deploy becomes `ready` and authenticated browser behavior is checked.
