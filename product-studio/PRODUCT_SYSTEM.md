# Almanac Product Studio — v0.1

**Purpose:** A small operating system for building a coherent, responsive educational product. The existing application, content, checkout and workspace are **design inputs**, not approved final interfaces. The current legacy checkout is paused.

## Product thesis

Almanac should **communicate the next useful learning action** rather than make a tired student work out which screen, pack or content type to open.

> Learner goal → relevant approved objective → next useful activity → explanation and practice → feedback → revisit/advance.

Almanac is not a generative-answer vending machine. It must support **genuine learning and independent assessment**, preserve learner authorship, and distinguish access, engagement, practice and demonstrated understanding. A video watched or page opened is not evidence of mastery.

## Two separate, connected systems

### 1. The learner-facing Learning Engine
| Capability | First implementation | Release rule |
|---|---|---|
| Understand context | Goal choice, authorized course, time budget, optional low-data mode | Optional; minimal input, no forced questionnaire |
| Explain next action | One specific available lesson or existing practice set, with plain-language reason | All suggested links must come from entitlement- and approval-filtered content |
| Support action | Existing lesson/player, explained practice, flashcards | No content generated or shown without author/reviewer approval and user access |
| Respond to difficulty | Honest fallback when material or history is unavailable | Never claim a diagnosis, hidden mastery calculation or guaranteed outcome |
| Keep continuity | Existing learner progress, answers and FSRS; later versioned preference sync | Never erase answer history or quietly change paid entitlement |
| Learn from use | Minimal, consented product outcome counters plus purposeful feedback | No medical cases, source text, tokens, email, user identity or grades sent to PostHog |

**V1 pilot:** `/app/learning-compass` uses deterministic `src/lib/learning-guide.ts`; it is intentionally not a chatbot. It is a functioning guided interface against the existing reviewed, entitlement-filtered course lists. Future AI assistance must only operate on approved, versioned materials, with accuracy and citation checks and a way to say "I don't know." It may never change answer keys or access rights.

### 2. The Product Studio
Every product change goes through the same short, versioned loop.

1. **Observe:** Identify a real user problem from consented usage, support feedback, usability testing or evidence. State what is known vs assumed.
2. **Frame:** One learner job-to-be-done and the result that matters (e.g., successfully start an approved learning activity).
3. **Prototype:** Show the interaction and failure states. Test against no access, no media, a busy learner, limited data, and a wrong answer.
4. **Build:** Small isolated PR against the **refined Netlify source**, with working code. Preserve payment controls, secure assets, staff approval, customer support and authorization.
5. **Evaluate:** Run deterministic scenario tests, authenticated browser tests, accessibility review and real subject-matter QA when learning content is involved. Compare with the baseline.
6. **Release:** Gated Netlify preview → informed decision → limited rollout → monitor unintended effects → iterate or revert.

The automation is **evaluation and delivery support**, not autonomous production releases. No PR is approved simply because CI is green, and no product release is approved simply because people clicked it.

## Product rules that prevent drift

- **One meaningful next action.** Every page answers: "Where am I? Why am I here? What should I do now? What happens afterwards?"
- **No dead ends.** If content is not authorized or reviewed, show that clearly and offer an appropriate non-purchasing action.
- **Intent before packages.** A prospective learner's question or outcome matters before pricing and media menus. Legacy `/request` and checkout remain paused until reimagined.
- **Course and objective integrity.** Learner preferences reorder available approaches, not course scope, graded correctness or rights.
- **Progress is evidence, not decoration.** Separate started, reviewed, attempted, feedback read, spaced review due and demonstrably understood.
- **Calm and accessible.** Keyboard navigable, WCAG 2.2 AA as target, clear progress/uncertainty, reduced motion, low-bandwidth route. Avoid mandatory heavy video.
- **System tells the truth.** Preview-only, future capability, restricted content and commercial availability are always labeled correctly.
- **Distinct businesses.** Almanac contacts, receipts, payment methods and student information cannot fall through to Unemployed Professor or Harborpost.
- **One authoritative delivery line.** Refined Netlify branch, not the old Vercel draft. Vercel is a reference until a separate retirement decision.

## First critical journeys (acceptance cases)

| Situation | Required response |
|---|---|
| First learner, approved course | Explain where to begin, recommend one approved action, display "why" and "after" |
| Learner preparing for an exam | Offer approved practice with a bounded, user-chosen time target; never promise mastery |
| Learner doesn't understand | Start from an available reviewed explanation and suggest meaningful retrieval afterwards |
| Learner missed questions | Offer existing missed-question filter if actual history exists; never invent weak areas |
| No reviewed assets | Say not ready, do not generate a fake link or demand payment |
| No entitlement | Protect learner and source data; direct only to permitted catalogue/order support |
| Limited data/assistive technology | Prefer reading when available, respect keyboard and reduced motion |
| Existing purchaser during checkout pause | Preserve private invoice, historical payment and learner access; do not sell a new package |
| Unverified merchant processing | No payment button, transfer instruction or checkout creation in the new guided product |
| Staff editing materials | Versioned content approval invalidated by changed hash; learner never sees unreviewed changes |

## Measures: product outcomes, not vanity traffic

We will *define* measurements now and collect them only when lawful and properly consented.

- **Time to a useful first action:** time from an authorized learner's expressed goal to opening an appropriate activity.
- **Guided-action success:** proportion of opted-in, pilot-guided sessions that reach an available authorized activity.
- **Blocked-path rate:** intended learner actions that cannot proceed because of missing review, entitlement or asset.
- **Active learning loop:** lesson / practice attempt / explanation reviewed, each counted separately.
- **Recovery from confusion:** learner can choose another path or find support without abandoning the task.
- **Agency:** explicit overrides, change-of-mode, low-data choice and their effect on successful actions.
- **Quality and safety:** accessible navigation, source correctness, data privacy, no cross-order leaks, no unverified assessment claims.

Keep private study responses, item scores, learner names, access codes, medical data and uploads **out of PostHog**. PostHog is useful for anonymized/consented aggregate UX patterns, feature flags, experiments and qualitative surveys after a reviewed event contract. Session replay **remains off** for private learning and sensitive forms. Analyze learning outcomes in the protected learner data system with valid access instead.

## Architecture (minimum coherent version)

```text
Learner browser ──> Guided experience ──> Verified lesson / approved practice
        │                     │                     │
        │                     └── explanation / fallback ───> next action
        │
        ├─ Private user state (existing Supabase access + approval checks)
        │    └─ course access, released materials, attempts, spaced review
        │
        └─ Optional privacy-gated product event stream
             └─ PostHog aggregate evaluation (no private course content)

Product Studio: GitHub issue → scenario contract → preview → CI + human review
     → Netlify controlled release → product observation → next iteration
```

## Project gates and dependencies

- Existing Almanac Supabase restored and **ACTIVE_HEALTHY**. This is not proof of correctness of its 64 flagged anonymous SECURITY DEFINER grant surfaces; see [issue #25](https://github.com/StudyMate-N/almanac/issues/25).
- Stop and preserve legacy payment/checkout: [hotfix PR #26](https://github.com/StudyMate-N/almanac/pull/26) and `docs/ALMANAC_CHECKOUT_PAUSE.md`.
- Security dependency patch: [PR #22](https://github.com/StudyMate-N/almanac/pull/22); keep as release gate.
- Privacy analytics port: [PR #23](https://github.com/StudyMate-N/almanac/pull/23); no production events until consent/privacy testing.
- Existing learner-directed route panel [PR #24](https://github.com/StudyMate-N/almanac/pull/24) is useful prototype evidence; do not assume that UI is the final product. The experience-engine pilot independently tests a broader goal-first interaction.
- User-authored/verified learning content, staff production tooling, copyright rights, live media assets and merchant approval need their own evidence and decisions. Don't mark them green from visual or CI checks.

## Definition of a releasable slice

The student can describe a real learning need in plain language, understand an authorized recommendation, do at least one reviewed learning activity, get accurate feedback, and return without losing progress. The pilot passes first-run and returning-user browser tests with available/unavailable content, phone layout, keyboard, low-data and unauthorized access. Staff can trace content origin and approval. No checkout, inaccurate promises or data leakage. **Only then** evolve the experience into the primary workspace.
