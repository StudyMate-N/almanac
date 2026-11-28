# Self-service media entitlement and release inventory — source-level audit
**Date:** 2026-11-23 · **Scope:** draft PR #7 only · **Status:** REVIEW / NOT A LIVE CONTENT CATALOG

## Evidence examined
- `src/lib/learning-offers.ts` (blob `e88884d7`): existing custom-production offers, included formats, bounded extras and speed validation. Offer descriptions are promises of package *scope*, **not proof any particular media file exists or is released**.
- `src/components/site/request-builder.tsx` (blob `2f95978b`): quote preview and request flow; not evidence of payment approval or a paid prebuilt SKU.
- `src/lib/deck.ts` (blob `262364bc`): FSRS card queue, review dates and daily new-card limits; not evidence of content correctness.
- `src/lib/store.tsx` (blob `95c1603e`): `authorizedCourses`, `approvals`, `isApproved(id,item)` compares an exact content hash, `isVisible` additionally allows reviewer preview. **Reviewer preview is not a student entitlement**; public access must not reuse that bypass.
- `src/lib/hash.ts` (blob `c937110c`): deterministic `contentHash` implementation; content approval does not automatically approve separately generated MP4/audio/PPTX derivatives.
- `learning-experience/prototypes/self-study-configurator.html` (blob `97489a38`): offline request/study-path mockup, no live catalog authorization or payment.
- Doctrine, pricing, roadmap, recipes, decision engine, operating system, rollout and integration backlog reviewed against `ops/ALMANAC_PARALLEL_OPERATIONS.md` on PR #13.

## Real evidence versus unresolved inventory
| Object | Confirmed in inspected source | Still unverified for release |
| --- | --- | --- |
| Custom-production package descriptions | Three bounded offers and included formats defined in code | Actual deliverable files, human capacity, completed buyer fulfillment |
| Learner course authorization | `authorizedCourses` loaded into student context | Valid live account/session, specific learner-to-course authorization from functioning backend |
| Exact-version lesson approval | `approvals[id] === contentHash(item)` | Approved IDs/hashes for an identified reusable pilot lesson; clinical reviewer and source provenance |
| Spaced-review mechanism | FSRS scheduler and persisted card state | Approved card text/answer and entitlements for a particular student |
| Video, slides and audio | Architecture and package descriptions | Actual asset URLs, successful retrieval, media hash, poster/VTT/transcript, reuse rights, approved scope |
| Stories, games, music | Design/prototypes only | SKU, entitlement, reviewed teaching benefit, accessibility, rights, deployment |
| Prebuilt self-study catalog | Journey described in doctrine | Approved SKU, actual released files, exact catalog price; **none inferred** |
| Payment/email | Existing request/invoice source | Merchant authorization and sender verification; **not approved** |

**Result:** no individual third-party source, media file, public distribution license, current learner entitlement, or exact approved media hash was verified by this source-level audit. Do not label any item `released` on that basis.

## Minimal gate for an entitlement-aware media selector
Require a server-authoritative record for each requested asset with `courseId`, `objectiveId`, `assetId`, `sourceId`, `sourceVersion`, `rightsStatus`, `rightsScope` (private/public/export), `contentHash`, `mediaHash`, `approvalStatus`, `releasedAt`, `accessibleAlternativeAssetId`, and `entitlementId` or owner-scoped authorization. A client-provided ID/hash is a lookup key, **never** proof of authorization. Resolve signed URLs only after user-scoped authorization and exact-version checks; never persist signed URLs in local preference data. Reviewer preview must not grant learner access.

For an optional variant to be shown as **available**, require: approved source/claim version; actual file verified retrievable; confirmed commercial/private reuse rights; accessibility fallback; release approval for the exact media derivative; active learner entitlement. If any gate is absent, show `Not available yet` and a genuinely accessible reviewed text route **only if that route independently passes all gates**. Do not silently substitute unreviewed content.

## Acceptance test matrix for next implementation
| Case | Expected outcome | Evidence to collect |
| --- | --- | --- |
| Entitled learner + exact approved video hash + licensed transcript | Video offered, text alternative remains selectable | Authorized server response, playback, caption/keyboard test |
| Same course, different learner without entitlement | No media metadata, no signed URL | Negative authenticated API test |
| Coach preview flag on ordinary student | No entitlement bypass | Negative authenticated API test |
| Edited narration, old approval hash | Reject old approval, hide new variant pending re-review | Hash mismatch test |
| Low-bandwidth preference + video-first | Explain text-first fallback, retain available video as optional | Mobile/keyboard and offline test |
| Optional game/music selected | No price change, no false availability/mastery | Quote invariance and state test |
| Change start mode or session length | Card IDs, attempts, FSRS due dates, course access and quote unchanged | Before/after persisted state |
| Watch video without answering a question | No mastery event | Event audit |
| Answer original retrieval + explain why + new transfer item | Record actual attempt and rationale, not just click count | Reviewed rubric + anonymized learner test |
| Inactive backend | Fail closed; do not imply active paid enrollment | Live integration result |

## Learner autonomy measurement (pilot only)
With a *genuinely approved and accessible* objective, record (a) whether learner can independently select and revise goal/start mode/session pace, (b) whether they can articulate why the next action fits the goal, (c) whether they can answer an unseen transfer question with a defensible explanation, and (d) whether progress survives preference changes. Report denominator, consent and missing responses; do not infer learning gains from clicks or videos watched.

## Dependencies / ownership
- **Platform QA:** backend activation and server-side entitlement / signed URL tests, tracked separately in issue #11; do not bypass.
- **Content owner:** supply one real, rights-cleared, version-locked pilot objective and each media derivative's approval record.
- **Campaign PR #5:** public excerpts need a *separate public-use license* and approval. No posts generated here.
- **Commercial/compliance:** provider, catalog pricing and email approval remain outside this branch.

**Next:** turn this manifest contract into a schema-only validator with synthetic fixtures and negative tests, then test one genuinely released lesson. Do not wire new production routes or merge without owner approval.
