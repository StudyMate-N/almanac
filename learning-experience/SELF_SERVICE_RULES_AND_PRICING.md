# Self-Service Policy Engine: Product, Entitlement, Pricing, Learning
**Implementation contract v0.1 — draft for engineering and commercial owner review**

## Already implemented in source (inspected 22 Nov 2026)
- `src/lib/learning-offers.ts` exports `OFFERS`, `ENHANCEMENTS`, `SPEEDS`, `PREFERENCES`, `isSpeedAvailable`, `parseLearningRequest`, `calculateQuote`.
- `src/components/site/request-builder.tsx` lets prospective learners select resource/exam/course package, goal, course source files, start preference, delivery method, bounded additional scope and speed, with itemized USD total and an invoice submission path.
- `src/lib/deck.ts` already implements FSRS scheduling of card reviews; `src/lib/store.tsx` stores learner plans and progress and supports offline caches and Supabase syncing.
- `README.md` claims approved version-specific learning objects via /coach and existing question/flashcard review routes.
- No currently examined source proves a live self-service study recipe editor, validated on-demand remix engine, game/song entitlements or approved payment collection.

## Scope and prices: read only from verified current code
| Custom production package | Baseline USD | Included scope |
|---|---:|---|
| Focused Study Module | 49 | 1 module; brief narrated video, visual summary, 15 explained questions, 15 flashcards, workspace/download support |
| Exam Preparation Pack | 149 | up to 4 modules; 2 short narrated videos, summaries/deck, 40 explained practice, 50-question simulation, 40 flashcards, plan and workspace |
| Complete Course | 399 | up to 8 modules; 8 videos, 8 slide summaries, 120 questions/cards, 80-question simulation, plan and workspace |
Additions from code: `deep_video` +$35 (package cap 1/2/3); `exam_sim` +$39 (cap 0/2/2); `unit` +$59 (cap 0/0/4). Delivery speed multiplier: standard ×1; priority ×1.4; express ×1.9, rounded to nearest USD by implementation; urgency/capacity guard in `isSpeedAvailable`.

## Price invariants
1. Preferences and format **ordering** do not affect base price.
2. Existing included core formats cannot be removed or resold as extras, and file-only selection doesn't generate an invented discount.
3. Optional games, stories, music, extra audio, AI tutoring and coaching are **not priced** by the current quotation engine. Offer a 'Tell us what you'd like' interest field, then staff feasibility quote only after pricing/rights/capacity approval.
4. Existing special limits: Complete Course express not allowed; express with added units or too many extras forbidden; priority with >2 extra modules forbidden. Always invoke server validation, not just UI.
5. Public sample and prebuilt-catalog self-study pricing is not derivable from bespoke production prices. A listed catalog item needs its own approved entitlement/price, with no price fabricated here.
6. Before payment activation, confirm provider eligibility, legal/currency/tax duties, delivery SLA, refund terms, exact staff fulfillment capacity and provider approval; no frontend value overrides.
7. Internal cost model to develop: reviewer time + subject synthesis + original item QA + media rendering/editing + accessibility + hosting/bandwidth + support + payment fees + margin + expected revisions. Price changes require explicit approval and sync with DB/RPC and product code.
8. Avoid charging twice for a slide/video included in the offer, an existing accessible alternative, or a learner's normal preference change.

## Decision table for selection authorization
| Action | User control | Price | Gate / system response |
|---|---|---|---|
| Change video-first -> reading-first in available materials | Immediate | $0 additional within entitlement | Save preference, do not alter approved content |
| Ask to revisit missed flashcards | Immediate | $0 additional | Reuse FSRS state, do not erase prior attempts |
| Change session length and order | Immediate | $0 additional | Recompute schedule within scope; show impact on target date |
| Select already included video/slides/flashcards | Immediate when released | Included | Honor objective coverage and progress checks |
| Watch optional reviewed story/game already authorized | Immediate when available | Included only if entitlement says so | Optional; accessible alternate task |
| Request new video/extra module/simulation | Constrained builder | Code-defined add-on | Server validates count, turnaround, staff capacity; request/approval before sale |
| Request custom music/game/story | Interest request only | Not yet priced | Rights + instructional/clinical evaluation + cost and fulfillment review |
| Reuse copyrighted uploads as commercial public resource | Not a self-serve override | N/A | Rights/consent review mandatory |
| Claim concept mastery without appropriate check | Not permitted | N/A | Show 'Viewed'/'Practised', not 'Mastered' |
| Request unavailable/incomplete course | Proposal or request only | Needs review | Status truthful, no instant access promise |

## Proposed safe interfaces and server validation
- `study_preferences`: `course_id`, `preferred_start_mode`, `session_minutes`, `priority_objectives[]`, `low_bandwidth`, `optional_story_enabled`, `optional_game_enabled`, `optional_mnemonic_enabled`, `updated_at`. Save via authorized Supabase RPC and verified entitlement.
- `study_plan_recommendations`: suggested `objective_id`, `reason_code` (not-started / missed-retrieval / due-review / goal-priority), `next_action`, `source_evidence`, `override_allowed`; generate only from available, approved content.
- `new_production_request`: selected existing `OFFERS`, enhancements, speed and existing server price validation. Experimental formats are a separate notes/interest array and must not modify the submitted structured quote until backend/schema approval.
- `learning_object`: reference `learning-experience/media-manifest.schema.json` and hash approvals.
- `study_events`: only minimal purpose-bound opt-in event records, partitioned from public pixel marketing.

## Formula candidates for guided next step (transparent proposal)
Ordered priority, **not AI clinical diagnosis**:
1. If a source is unapproved or an objective is unavailable -> STOP / truthful explanation.
2. If learner has not seen an objective or requests foundational explanation -> brief approved guide (prefer selected modality if available).
3. If original item is due via FSRS -> retrieval, then feedback.
4. If missed items indicate weak concepts -> offer a relevant reviewed worked example, then a new item.
5. If learner explains/retrieves correctly and no due item -> move to application/transfer; don't require an arbitrary number of video plays.
6. If learner chooses another valid route -> allow it and preserve a suggestion as optional.
7. Show explanation such as 'We suggested this because you missed two approved items in this topic' without sensitive/public display, and provide 'Not now' / 'Choose another route'.

## Study recipe guardrails
- An outcome has distinct states: `not_started -> introduced -> practised -> evidence_of_understanding`; `mastery` needs separate validated rubric and cannot be inferred from engagement.
- Learner may skip video/audio/game/song, but cannot get a 'tested' or 'mastered' label merely by skipping assessments.
- For clinical content, reviewed conceptual boundaries and exact correct/rationale keys cannot be personalized away.
- Upload permissions and privacy notices apply even to user-supplied copyrighted lecture slides; avoid raw content reuse on public feeds.
- No unsupported skill 'diagnosis', learning-style classification or performance guarantee.

## Minimum acceptance tests
- Every existing bundle/add-on/speed combination still quotes exactly as `calculateQuote` and `isSpeedAvailable`; server quote matches client.
- A preference switch never changes quote, entitlement, past attempts or FSRS due dates.
- No game/music/story toggle adds money or creates a fulfillment obligation in existing checkout.
- Choosing unavailable source shows BLOCKED or staff review, not 'Instantly generated'.
- A learner can use text only, video only as a starting mode, not 'content-only substitute' for necessary reviewed practice.
- Releasing a new media variant without approved content hash/rights is forbidden.
- Offline option settings preserve and sync state with proper conflict behavior.
