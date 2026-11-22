# Almanac — Responsive Multimodal Learning System
**Version:** 0.1 implementation proposal · 22 November 2026  
**State:** DESIGN / REVIEW, not production release or an approved change to public brand copy.  
**Companion:** Campaign Mode draft PR #5, `ops/almanac-campaign-mode-v1`; this branch is intentionally separate so the public campaign and private learning architecture can be reviewed independently.

## Company objective
**One learning foundation, many useful ways to learn, and one continuing evidence-based path forward.**

Almanac must not be a media factory. Every delivery format needs a defined learner problem, trusted objective/claim, clear role in instruction, and a way to check or support understanding. The learner should be able to move between modalities without contradictory facts or losing progress.

### The responsive learning loop
`Need / goal -> diagnose what is known -> select trustworthy concepts -> teach -> practise -> receive feedback -> revisit weakness -> transfer/apply -> choose next action`.

**Responsiveness** means actions reflect actual needs, choices and observed progress *where supported and consented to*; it does not mean learning-style pigeonholing, guaranteed individualized AI tutoring, or unlimited instant approved materials.

## Existing product facts observed (feat/custom-learning-orders-v1)
- `README.md`: Next.js 16 and Supabase course player; organized pages, questions with rationales, FSRS-based flashcards and learner-state persistence; offline caching; coach review queue; content approval by exact-version hash; video blocks via `NEXT_PUBLIC_MEDIA_BASE` and MP4/poster/VTT where configured.
- `src/content/patho/author.ts`: section -> lesson/page -> learning blocks; embedded questions become shared bank items and cards feed review.
- `src/lib/deck.ts`: FSRS review scheduler, history and daily new-card limits.
- `src/lib/learning-offers.ts`: current offer specifications include narrated videos, visual summaries (slides/infographic/mind map), explained practice and flashcards, and a consolidated slide deck in Exam Pack; does **not** establish that every asset is delivered or every optional modality exists.
- Current repository evidence does NOT establish deployed interactive narrative, game engine, music generator, adaptive tutor, live webinars, broad media tracking, a slide player, downloadable rights-cleared NR 601 pack or a working paid checkout. Treat these as proposals, not claims.

## Two surfaces, one knowledge base

### A. Public learning: encounter, benefit, invitation
- Discovery: Facebook Reels/Posts/Stories, other short-video channels when owner authorizes, website sample lessons, email updates to opted-in learners.
- A genuinely instructive piece teaches one concept or invites an original retrieval attempt, with an explanation accessible without purchase.
- Example media: 20–60-second original microvideo, 1–5-panel visual explanation, 60–180-second audio excerpt with transcript, original challenge with rationale, short case/story, mini-interactive quiz, occasional tested mnemonic.
- Each public artifact links to a verified source/objective in the internal content library and uses the correct permission/license.
- CTA is proportionate: save/try/revisit, tell us your goal, or request details of **actually available** learning resources. No fake urgency or unapproved payment route.
- Never expose learner names, submitted school materials, non-public question banks, clinical patient records, paid pack contents or licensed third-party sources in public derivatives without authorization.

### B. Almanac workspace: understand, practise, feedback, return
- **Study path** grounded in goals and a finite topic/objective map.
- **Read**: structured explanation, figures, transcript, citations.
- **Watch**: segmented video with captions, visual checkpoints; return to evidence and assessment.
- **Listen**: narrated overview or worked audio explanation with transcript and optional chaptering.
- **See**: deck/slides, worked diagrams, accessible summaries.
- **Practise**: original questions, written explanation, worked examples, flashcards and spaced repetition.
- **Experience**: story-based decision path and optional purposeful learning game, each followed by explanation and reflection.
- **Recall**: optional mnemonic/educational song for finite material only, backed by exact text and an understanding check.
- **Adapt**: recommend another example/review only based on observable learner input/progress and allowed product features; retain user control and record version.
- **Download**: supported portable files only after release and with accessible alternatives.

## Golden rule: objective first, format second
Don't produce every format for every topic. Use `FORMAT_DECISION_ENGINE.md` to pick formats based on the difficulty:
- Deep process or mechanism -> diagram + segmented video + causal explanation/practice
- Vocabulary / short factual sequence -> flashcards + retrieval; optionally melody/rhythm after testing
- Clinical reasoning / tradeoffs / policy scenarios -> branched case + explanation of consequences + original practice
- Procedural skill -> demonstration + step list + realistic simulation, with explicit real-world limits
- Dense overview -> slide deck + study map + audio optional
- Persistent misconception -> contrast + worked example + challenge with feedback

## Production and release standards
Follow `OPERATING_SYSTEM.md`, `media-manifest.schema.json`, and the reviewer gates. Every artifact is a versioned *derivative of approved learning claims*, not the reverse. Use source rights and educational quality checks before public or commercial publication.

**Clinical rule:** no unreviewed simulated clinical management advice, high-stakes 'official' question claims, unsourced medication instructions, copyright or patient data exposure.

## Editorial doctrine (proposed)
- **Public:** teach openly, invite purposeful progress, listen to learners.
- **Inside product:** explain clearly, practise deliberately, respond to demonstrated gaps.
- **Across media:** coherent knowledge, accessible choice, verified rights, measured outcomes.
- **Business:** qualified learning needs and long-term trusted outcomes matter more than output volume or raw views.

## Files
- `FORMAT_DECISION_ENGINE.md` — role and priority of each media type.
- `OPERATING_SYSTEM.md` — content model, provenance, pipeline, approvals and channel rules.
- `ROLLOUT_6_WEEKS.md` — phased shipping, gates and acceptance criteria.
- `PLATFORM_INTEGRATION_BACKLOG.md` — concrete repo-aligned engineering tasks.
- `media-manifest.schema.json` — machine-readable learning object + media variant contract.
- `PROTOTYPE_HANDOFF.md` — two actually produced lightweight prototype files (an interactive linked PowerPoint story and a standalone offline HTML game), packaged for download in the conversation; GitHub contains related source specifications.
- `pilots/EXPLAIN_TEST_MULTIMODAL_PILOT.md` — public/internal multi-format worked example without borrowed NR 601 material.
- `EVIDENCE_AND_RISKS.md` — relevant research and claims not justified by it.
- `.agents/skills/almanac-responsive-media/SKILL.md` — agent/reviewer workflow; no direct public autonomy.

## Non-claims
This repo contribution supplies strategy, schema, design specifications and pilot scripts. It does **not** deploy media players, create podcasts, compose original audio, record lessons, attach files to the learner workspace, upload a presentation to Facebook, or modify checkout. Those actions are separate implementation/approval work.
