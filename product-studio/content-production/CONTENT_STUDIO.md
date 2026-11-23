# Almanac Content Studio — production architecture v0.1

**Decision:** Make content production a first-class, independently evaluated product capability, not a prompt that produces unverified lessons. This is the foundational *production system* for the existing, refined Netlify Almanac application. It does not replace approved content, grant learners access or re-enable checkout.

## Why this exists

The learner should experience a clear progression:

**Learning objective → short explanation → retrieval → application → actionable feedback → scheduled review.**

The production system works backward from that experience and creates only assets that help accomplish a specified learning outcome.

### Content factory, not unbounded agent

| Stage | Input | Machine-assisted output | Approval gate |
|---|---|---|---|
| 0. Request & fit | Course, institution, syllabus/competencies, audience, intended outcome | Scope and prerequisite map | Confirm actual course fit, academic integrity and learner agency |
| 1. Source acquisition | Licensed textbook, faculty material, official syllabus or permissibly licensed references | Source metadata, authenticity, version, rights and citation records | Reject inaccessible, unlicensed, stale or unverifiable evidence |
| 2. Curriculum design | Approved sources + level + competencies | Measurable objectives and concept/dependency graph | Expert confirms coverage, sequencing, relevance and no unsupported claims |
| 3. Asset design | Approved objective, citation anchors, media policy | Structured spec for lesson, question, flashcard, case, diagram, video or audio | Determine learner purpose and delivery medium; budget and accessibility |
| 4. AI-assisted drafting | Retrieval of **only approved source excerpts**, versioned prompt, constrained JSON output | **Draft** asset with per-claim source references and explicit unknowns | Fail if any key claim is ungrounded or generated citations invented |
| 5. Automated evaluation | Draft plus acceptance spec | Schema checks, uniqueness, item-to-objective alignment, citation/rights and readability flags | Tests must run; passing tests never implies clinical correctness |
| 6. Subject expert review | Exact immutable candidate and source | Corrections, content hash, approval/rejection record | Human educator or licensed nurse for clinical content; distinct author and reviewer where possible |
| 7. Media production | Approved script & source marks | Video/audio/diagram with transcript, captions, alt text, resource manifest | License, factual consistency, accessibility, human playback review |
| 8. Controlled publication | Approved media and content hashes | Review-locked release package | Publish to entitled learners only; all dependent assets match approved versions |
| 9. Learning feedback | Private mastery measures + privacy-gated aggregate UX analytics | Coverage gaps, stuck points, revision candidates | Human review of changes and a new content version; do not mutate approved answers in place |

Do not turn "draft" into "approved" based on an LLM confidence score, visual polish or website traffic. Do not mix versions of case simulations or promote verbatim claims without original evidence.

## First implementable unit

One **source-locked, measurable learning objective** in Advanced Pathophysiology. Ship one fully reviewed micro-lesson and associated:
- concept explanation with source references, prerequisites and examples,
- three retrieval prompts (basic, understanding, application) with rationales,
- five source-aligned spaced-repetition flashcards,
- accessible static diagram only if it genuinely aids comprehension,
- one study-session recommendation and useful next step,
- reviewer acceptance evidence, content provenance, lesson and asset hashes.

This is a target slice, **not** a claim that these educational assets exist or are approved. No video merely for the sake of having a video. Expand the medium only when it improves learning and rights permit.

## LLM architecture principles

1. **Deterministic first.** Use typed rules for rights, entitlement, lifecycle state, approved answers, scheduling and price. LLMs draft or explain within bounded contexts; they cannot decide final access, payment, source truth or release.
2. **Versioned retrieval grounded in evidence.** Approved corpus only, chunk/source IDs, edition and syllabus tags, permission metadata, and provenance for each substantive learning claim. If evidence is absent, decline or escalate.
3. **Structured outputs.** Model responses conform to a typed schema with stable IDs, citations, unknowns and asset kind. Invalid output is rejected rather than silently corrected or published.
4. **Prompt and model provenance.** Record model, prompt version, workflow version, source snapshot, generation timestamp and cost/latency. Pin and evaluate changes on fixed examples.
5. **Task-oriented model routing.** Use small/fast models for metadata classification and simple transformations only where evals prove adequate; higher-reliability models for complex reasoning and cross-source synthesis, followed by human expert review.
6. **Narrow workflows before autonomous agents.** Build acquisition → objective map → drafting → verification as observable components. Only add an agent when a fixed workflow measurably fails. Constrain tool permissions, outputs, retries and spend.
7. **Adversarial evaluation.** Test prompt injection from uploaded syllabi and PDFs, unsupported citations, fabricated medication doses, answer-key leakage, academic misconduct requests, data contamination and unauthorized publication.
8. **Human control.** Subject-matter reviewer approves exact candidate versions. Learner chooses study method; AI may recommend but must explain why and permit override.
9. **Data minimization.** Student notes, clinical case information, sensitive uploads, identifiers and exam answers stay in protected learner systems—not analytics events or model-evaluation logs by default. Redact production traces.
10. **Measure learning and reliability, not output volume.** Track source coverage, reviewer rejection, hallucination rate on eval samples, item discrimination after sufficient validated data, learner completion of useful actions, accessibility and cost per approved asset. Never equate usage duration with learning.

References for architecture and safety:
- OpenAI agent evaluation: https://developers.openai.com/api/docs/guides/agent-evals
- OpenAI guardrails/human review: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
- Anthropic Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- NIST GenAI profile: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- UNESCO Generative AI in Education: https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research

## Content lifecycle

```text
proposed → sourced → curriculum_mapped → ai_draft → automated_qa
  → expert_review → approved → published → superseded
                 ↘ rejected / needs_sources / needs_license
```

Any source/answer/media change invalidates prior approval for the impacted asset. Distinguish **reviewed content integrity** (a real human saw this exact item) from **scientific/clinical correctness** (requires expert evidence and potentially updated guidelines). Existing `src/lib/hash.ts` uses a non-cryptographic FNV-derived check for edit detection; for an evidence-grade publication/provenance pipeline add cryptographic SHA-256, signatures/append-only audit and server-side verification before content release. Do not silently replace the current hash without a migration and integrity tests.

## Where it connects in the existing app

- `src/content/patho/author.ts`: current authored course sections, extracted page/question/flashcard relationships and IDs.
- `src/content/types.ts`: existing lessons, assessment items and reviewable media.
- `src/content/course.ts`: current curriculum/course registry and reviewable items.
- `src/lib/use-course.ts`: entitlement- and review-filtered content seen by learners.
- `src/lib/learning-guide.ts`: guided learning recommendations based on available authorized material.
- `product-studio/PRODUCT_SYSTEM.md`: the product discovery, experiment and controlled-release loop.

**Import bridge:** Convert approved, versioned assets into the existing `ASection` authoring format or a backwards-compatible future content registry. Do not replace the current course data or learner activity history as part of this first foundation.

## Definition of done for the first content vertical slice

A **single** approved module exists with true source/license references, objectives, one interactive learning loop, expert-signed exact-version approval, tests, keyboard/captions/alt-text QA, entitlement-limited preview and traceable revision history. Only then pursue mass generation, asset automation or a broader AI tutor.
