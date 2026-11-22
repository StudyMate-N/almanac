# Repository-aligned engineering backlog (proposed, not implemented)

**Goal:** Extend current Next.js/Supabase app without disrupting content review, stable item IDs, FSRS, offline support or paid request safeguards.

| Priority | Task | Repository anchor | Concrete acceptance |
|---|---|---|---|
| P0 | Catalog real assets and video fallbacks | `README.md`, `NEXT_PUBLIC_MEDIA_BASE` | Per-asset MP4 poster VTT URL/source reviewer status confirmed; graceful text fallback works |
| P0 | Canonical item/media manifest loader | `src/content/patho/author.ts`, `src/lib/types` | schema validation for current and proposed media types; source/version hash, broken reference check |
| P0 | Source rights/provenance and release gates | `/coach`, hash approvals | different rights checks for private lesson and public sample; edited script invalidates media approval |
| P0 | Standard accessible PPTX/audio exports | deliverable generation templates, package offers | editable PPTX+accessible PDF and MP3+transcript pairs for one approved objective |
| P0 | Creative import: S01 public media | campaign PR #5 (separate branch) | approved logo, readable carousel files, alt descriptions and owner release captured |
| P1 | Audio player and transcript panel | `/app/learn/[pageId]` | pause, speed, chapter if supplied, captions/transcript, offline fallback, no unsolicited autoplay |
| P1 | Video chapter + check-in | current video blocks and `NEXT_PUBLIC_MEDIA_BASE` | questions at meaningful points, jump back to explanation, mobile and low-bandwidth tests |
| P1 | Slide deck viewer + source notes | module guide/visual summary | keyboard navigation, image descriptions, export when rights permit |
| P1 | Media/objective progress events | `src/lib/api.ts` / Supabase RPC | event schema, consent, stable IDs, no student PII leaking to public pixels |
| P1 | Branching scenario v0 using existing block/rendering conventions | `src/content/patho/author.ts` | approved 2-choice fork with meaningful feedback/debrief and one transfer item |
| P1 | Game v0 (sort concepts) with accessible text mode | practice runner | option selection and rationale, not reward-only score; no time pressure |
| P1 | Private workspace 'Start with' mode selector | `PREFERENCES` in `learning-offers.ts` | choices for video/reading/practice remain preferences, not fixed learning style labels |
| P2 | Content generation workbench with human review queue | `/coach` + media pipeline | batch versioned derivative exports with provenance, approvals and failure visibility |
| P2 | Progress-informed next-step recommendations | FSRS + practice records | deterministic rules, override, logged reason, randomized or matched educational evaluation |
| P2 | Story and game authoring interface | authoring + rendering framework | content-only reusable schema and safe branching constraints |
| P2 | Optional original music cue player | reusable media variants | no autoplay, licensed original composition, text/speech alternative and outcome metric |
| P3 | Translation/language support, advanced serious games, accessibility localization | broader product architecture | evidence and demand threshold first, separate rights and safety review |

## Engineering quality gates
- No regression in `npm run typecheck`, `npm run build`, relevant unit/e2e and existing reviewer hash approvals.
- Preserve stable IDs for graded cards/questions, due dates and learner events; migrate schemas with rollback.
- All interactive paths keyboard/touch usable; preserve offline fallback for readable lessons and review.
- Media manifests never expose private URL tokens to public clients; entitlements and signed URLs if required.
- One feature toggle per pilot. If data collection fails, the baseline lesson/quiz still works.
- No new pricing or commitments until staff capacity and operational approval. The Oct 2026 payment-routing uncertainty remains separate from multimedia work.

## Design questions to answer with actual pilot
- Does a 45-second audio recap improve completion or *delayed recall* compared with a concise written summary?
- Does a 2-choice story improve application of a rule compared with another worked example?
- Does a sort/match microgame improve explaining classification criteria more than ordinary retrieval practice?
- Does showing a playlist of choices improve learner autonomy but add choice overload? Keep defaults minimal.
- Does one original sung mnemonic outperform a spoken/text cue for a bounded low-stakes sequence?

The smallest useful next implementation is **a reviewed learning-object manifest plus one genuinely accessible narrated video/audio/slides/practice object**. Story/game/music are optional pilots, not dependencies for a coherent first release.
