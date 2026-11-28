# Cross-channel production and learning delivery operating system

## 1. Ownership
**Learning owner** chooses goal/objectives and outcomes; **source curator** validates provenance/rights; **subject reviewer** verifies conceptual and, where needed, clinical facts; **learning designer** matches objectives to activities; **media producer** authors approved variants; **accessibility QA** checks alternate paths; **release owner** confirms exact version and audience; **analyst** examines learning and demand signals. One person can hold multiple roles but distinct checks must be evidenced.

## 2. Source of truth: a concept/objective graph, not a NotebookLM export
`course -> modules -> learning objectives -> approved claims / examples -> activities + assessment items -> linked media variants -> review hashes -> releases -> learner events`.
- Each learning claim includes source IDs, scope, caveats and version. Links to third-party articles or Course Hero/Studocu-hosted files do not confer content reuse rights.
- Each assessment has a distinct item ID, correct key, explanation for each option, expert reviewer, and relevant objective ID; never scrape live institution tests.
- Each media artifact has a canonical script/transcript and references only vetted learning claims. Slides/voice/video/games must be checked for internal consistency, not automatically presumed accurate because exported together.
- Maintain clear rights statuses: `owned_original | permission_confirmed | open_licensed | link_only | unverified | prohibited`. Public downloads and commercial export require permission/attribution fit.
- Maintain statuses `idea -> scripted -> fact_checked -> subject_approved -> media_QA -> accessibility_QA -> rights_cleared -> release_approved -> published -> monitored -> superseded`. A text approved at version X does not approve new generated audio or a modified graphic.

## 3. Production loop
1. Intake learner's course/exam/goal, constraints, preferred starting mode (not unsupported fixed learning-style profiles), request handling/consent.
2. Build objective map from eligible syllabus/reference. Record learner scope, difficulty and deadlines; never collect unnecessary student PII.
3. Source-check/rights-check before drafting; preserve provenance and avoid copying institution-graded work.
4. Produce a verified master explanation with examples, misconceptions, terms and source references.
5. Write 3--5 assessment probes aimed at recall, explanation and transfer. Review exact answers and rationales.
6. Select the minimal appropriate set of media variants with `FORMAT_DECISION_ENGINE.md`; generating all media for every topic is an anti-goal.
7. Create script/storyboard, slides and transcript before video/audio; source-aligned subtitles, speaker notes, diagram descriptions and mobile versions.
8. Expert review and asset accessibility, mobile, low-bandwidth and integrity QA.
9. Release to authorized workspace. Export selected, separately reviewed *public* excerpts under a different license/scope. Keep hashes and stable IDs aligned with existing patho authoring and approvals.
10. Observe questions missed, user-controlled revisit behavior, completion, short delayed recall and learner feedback. Do not infer understanding from plays or media duration. Adapt the next step only on confirmed signals; give the learner override.
11. Plan iterative corrections with new review requirements for revised claims or media. Track supersession links and feedback inbox.

## 4. Public communication distribution
| Surface | Native formats | Frequency is hypothesis, not imposed | Objective and CTA | Gate |
|---|---|---|---|---|
| Facebook Feed | portrait study carousel, quote, original question, short vertical clips | several quality posts / week, capacity dependent | benefit first, ask next learning need | brand/clinical/reuse approval |
| Facebook Stories | short poll, 1-question practice, answer reveal | complement preceding feed post | respond and return | account access; consent |
| Instagram | 4:5 carousel, Reels, stories, captioned microclips | repurpose only where audience fit | save/think/visit | format and caption adaptation |
| TikTok | authentic 20–60s micro explanations, rationale hook | pilot after video workflow proven | try/reason/learn next | own footage, music licenses, age/safety |
| YouTube | Shorts and structured 4–12min explainers with chapter links | deeper output when assets verified | watch -> question -> workspace | transcripts and copyright |
| Website | sample lesson, example question, verified preview, course-request page | evergreen update on changed evidence | take a meaningful next step | no unverifiable checkout/AI tutor claims |
| Email (opt-in) | weekly 1 useful idea + link + request/lesson | when consented and reply path staffed | return/review | unsubscribe and privacy |
| WhatsApp (opt-in) | short study digest, sample audio/text, course-specific updates | small-scale targeted pilot only | opt-in and helpful action | consent, no bulk unsolicited messages |
| Podcasts/audio feeds | 3–8min chaptered mini lessons with transcript | only when verified capacity | listen then perform one check | voice rights, audio accessibility |
| PDFs/PPTX | downloadable recap / 5–10 slide module deck | verified requested pack | offline review and printable logic | download rights and accessibility |
| Webinars/live | optional Q&A and live worked explanations | future research | ask and discuss | privacy, moderation, staff capacity |

**One approved master concept can become multiple independent excerpts, not a demand for identical caption syndication.** Each channel retains native formatting, a useful action and attribution to underlying concept ID.

## 5. Media-specific release packs
- **Video:** final MP4, correct audio, 9:16 social and 16:9 lesson variants when justified, transcript, accurate SRT/VTT, poster, source/reviewer IDs, no auto-generated protected school logos.
- **Audio:** MP3/AAC, transcript, title, chapter markers where appropriate, source and voice rights; assess intelligibility of terms/dosages and avoid authoritative unsupported medical prescriptions.
- **Slides/PPTX:** editable slide deck with source notes, export PDF, accessible reading order and text alternatives for diagrams, licensed imagery, original visuals, 4:5 repurposing when required.
- **Interactive/game:** documented objective, prompts, input/correct states, meaningful feedback, keyboard and touch support, no randomized misinformation, visible restart/reset, privacy review, no arbitrary time pressure.
- **Story:** labeled fictional simulation, branching logic, scenario facts, rationale, debrief/transfer activity and no implication of real patient data.
- **Mnemonic song:** original/licensed music + exact lyric verification against intended claim, transcript/plain-text mnemonic, off switch, zero risk of implying simplification substitutes for clinical decision-making.
- **NotebookLM:** import curated source materials with provenance. Treat generated studio assets as drafts, not verified facts or commercial permission. Rework or export only under platform terms and appropriate source rights. Preserve exact asset version/source IDs and human QA.

## 6. Accessibility and delivery defaults
- WCAG 2.2 AA target for web-facing interactive content, appropriate to component; keyboard and mobile support, captions, transcripts, alt text, readable contrast, reduced motion, screen-reader labels, content not dependent on color, audio-off and image-off alternatives.
- Lower-bandwidth pathway: text -> static visual -> audio -> video in ascending data usage; offer offline downloads only if licensed and permitted by package.
- User preference indicates how to **start**, not a scientifically fixed 'learning style'. Explanations and practice remain available to all.
- Captions and transcripts required where they serve access, even when particular multimedia experiments suggest reducing redundant on-screen text for cognitive load; accessibility is not negotiable.

## 7. Analytics and privacy
Track events with hashed/pseudonymous learner identity only if necessary and consented; internal per-objective data separate from public aggregate analytics. Candidate events:
`lesson_started, media_started, media_completed, transcript_opened, quiz_attempted, rationale_opened, card_reviewed, story_decision, game_attempted, optional_mnemonic_played, objective_retaken, learner_feedback`.
Don't log sensitive learner notes, medical case information, video transcripts or raw quiz responses into advertising pixels. Collect only needed analytics with appropriate retention.
Public metrics: views, shares, saves, clicks to legitimate next learning step, qualified subject requests. Private metrics: response correctness, delayed recall, explanation quality with transparent rubric, course persistence, learner-reported utility and technical issues.
Customer metrics: valid inquiries, verified feasible offerings, authorized paid conversion, complaints/refunds, sustainable support workload. Distinguish correlation from experimental causal improvement.

## 8. Release gates and stop rules
Release fails if: claim unverifiable; rights unclear for proposed distribution; clinical reviewer missing; generated question has ambiguous answer; no accessible equivalent; audio mispronounces a safety-critical term; content version changed after approval; pilot cannot measure meaningful learning; provider payment route unverified where sale implied.
An amateur **presentation** may be publicly published if sound and well-sourced; an amateur **clinical answer** is never acceptable.
