# Self-service study product rollout — proposed sequence

## 0. Distinguish existing vs new (verified repo, 22 Nov 2026)
**Existing foundation**: request-builder with package types, quote preview, included media, preferences (balanced/video/reading/practice), delivery (workspace/files/both), enhancements and speed; FSRS deck and learner progress state; separate app review approvals. This is partial **pre-sale guided configuration**, not evidence that learner-driven package editing, flexible study recipes and entitlement-aware media recommendation already ship.
**New proposal**: customer control during the learning experience, transparent optional formats, context-sensitive scheduling and evidence-based suggestions while preserving current included core educational methods and pricing.

## 1. Two-stage configurator
**Stage A — pre-purchase / public**
- Goal/course selector (plus course ID where known); target date/weekly time and learner objective.
- Starting preference and optional modality interests (audio, visual, interactive story/game, rhythm/song, written, practice), presented as preferences rather than 'learning-style diagnosis'.
- Package selection **only from verified existing offers** and constraints. Show minimum included set and what qualifies as new content beyond the standard scope.
- Itemized quote for authorized custom-production extras; no independent price for games, stories or music until policy/price exists.
- If current payment route not approved, the outcome is an interest/request record, not payable checkout.
- Upload rights and privacy notice for course source documents. Set false availability claims to blocked.

**Stage B — post-entitlement / private workspace**
- Today screen asks `What do you want to accomplish?` with 3 default paths: Continue recommended, Choose a topic, Review what I missed.
- Provide an optional `Change how I study` sheet: start mode, session length, optional formats, quiet/low-bandwidth option, weak-topic priority.
- Show fixed content coverage and essential concept checks distinct from optional media. Learner can change modality order and session length at any time.
- Recommendations use already recorded practice/FSRS evidence; no unverified adaptive AI inference.
- After work: `What did you learn?`, `Where did you get stuck?`, `Choose or accept the next step`, with transparent reason.
- Persist settings via authorized Supabase RPC; version studies and protect learner privacy.

## 2. Onboarding 'study formula'
A compact three-click default:
1. **Your goal:** topic / course / exam / skill and timeline.
2. **Your start:** Reading, Watching, Listening or Practising if available; default balanced when no preference.
3. **Your next step:** a realistic recommended cycle with no forced extras: explain -> retrieve -> apply -> feedback -> revisit. User can choose another valid pathway.

For new learners, explain `Start here` and a simple reason; don't force them to configure 12 variables. An advanced settings panel may include priorities, pace, format interest, bandwidth and notifications.

## 3. Delivery patterns at scale
| Component | First feasible version | Scaled version |
|---|---|---|
| Course selection | existing catalog + reviewed availability | multi-course verified course entitlement service |
| Study path | finite plan from approved topics and user goal | recommender from objective evidence and validated feedback |
| Choice interface | native radio/select + optional mode preferences | persistent personalization that users can override |
| Media | current core text/video/slides/practice plus low-fi story/game prototypes | reviewed playable manifest-backed audio/story/game units |
| Pricing | existing OFFERS and server-side quote; unknown options request only | approved transparent production labor and media add-on catalog |
| Assessment | reviewed questions, FSRS, explanations | calibrated objective-level competency and delayed-transfer checks |
| Human support | request review and existing coach tools | capacity-aware escalation and coaching plans if funded |
| Analytics | minimal study state; no marketing pixels in private responses | privacy-aware evaluations tied to objectives and choice patterns |

## 4. Release slices (conditional)
**Slice A, immediate pilot** — new self-service doctrine and pricing policy; nontransactional interactive UI prototype using the true existing price rules; optional media interest with no fee or fulfillment claim; run review of four customer paths and price invariants.
**Slice B, private-mode prototype** — prototype `Change how I study` inside one controlled course using existing objective IDs and approved media only. Prefs can be changed after accessing lesson, while future FSRS queue and attempts remain consistent.
**Slice C, limited study cohort** — compare a guided three-choice home with a flat resource list; monitor attempt completion, independent explanation accuracy, accessibility and choice complexity (not view duration alone).
**Slice D, commercialization** — paid self-study catalog only after actual ready asset inventory, rights, approved pricing, checkout receiving permission and support. Experimental custom media only if production and QA costs justify an explicit SKU.
**Slice E, scale** — reusable entitlements, objective graph, content recommender, stable media manifests, cohort analytics and authoring tooling; pilot rather than assume advantage.

## 5. Owners / decision gates
- Brand/product owner: choose where customization is promoted and which requests remain staff reviewed.
- Learning lead/clinical reviewer: subject competence standards, original assessment review, rights.
- Pricing/operations: approved self-study catalog SKU, costs, limits, refund/turnaround, payment collection.
- Engineering: persistence, server validation, access and offline consistency; no unapproved production deploy.
- Research/analytics: outcomes, learner agency and consent.
- Student: chooses path and can override any recommendation, but cannot change the truth of a source or assessment key.

## 6. First user research questions
- Do students want a **ready package they can reorganize**, or custom generation they can specify?
- Are they willing to trade novelty formats for better feedback and more time practising?
- Which four choices matter most without causing choice overload? (start mode, goal, available time, priority topic)
- Is ability to reconfigure one's study path *after* buying more valuable than extensive pre-purchase controls?
- Which extras require new production time versus repurposing already-approved media?
- Would a highly self-directed student still choose guided defaults when stuck?
- Are stories/games/music useful for this learning objective *and* optional without losing learning opportunity?

## 7. Decision to unlock
Approve a **self-directed learning tier inside existing entitlements**, with full pedagogical guardrails, before adding a separately priced 'unlimited AI custom learning' product. Avoid launching an independent self-study price until actual reusable catalog and entitlement costs are known.
