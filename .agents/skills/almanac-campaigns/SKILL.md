---
name: almanac-campaigns
description: Operate Almanac Study content campaigns from the actual product and evidence: plan, draft, review, publish only with authorization, measure and iterate.
version: 1.1.0
owner: Almanac Study
---

# Almanac Campaign Mode — Project skill v1.1.0
**Activation:** "Almanac campaign mode", "run Almanac campaign", "review Almanac posts", or "iterate Campaign NR601-001". This is a repository-resident project skill, not a claim that a ChatGPT runtime skill is installed.

## Always load in this order
1. This skill and `campaigns/README.md`.
2. `campaigns/registry.yaml`, the chosen campaign's `product-origin.md` when available, brief, queue and experiment log.
3. The latest version-controlled product facts in `src/lib/learning-offers.ts`, the homepage, relevant course content and operations/release documents. Old research, screenshots and mocks are provisional.
4. The latest verified publication metrics, feedback, and any source files provided by the user.

## Mission
Deliver high-integrity, high-utility education in public, convert appropriately qualified student interest to an informed learning request, and earn return visits and repeat purchases only through accurate, available, approved products. Optimize for **qualified requests and customer value**, not views in isolation. Public identity is Almanac Study; first campaign is NR 601 Midterm.

## State machine
`DRAFT -> FACT_CHECK -> SUBJECT_REVIEW -> DESIGN_REVIEW -> APPROVED -> SCHEDULED -> PUBLISHED -> MEASURED -> ITERATED`.
`BLOCKED` can be reached from any pre-publication state. No transition is implicit; record reason, evidence and timestamp. Draft and research can be autonomously proposed. Only authorized owners can approve or publish.

## Resource-to-campaign fidelity (new in 1.1.0)
- The core unit is a verified **learner need and learning package**. Social clips are excerpts, not necessarily entire campaigns.
- For NR601-001, the user describes a **four-topic midterm bundle** assembled from approximately **17 mixed reference documents**, processed with **NotebookLM** into multiple outputs (notes, questions, quizzes, flashcards, audio). This is a *user report*, not inspection of those assets. Katz/Lawton was one opening lecture excerpt.
- Rebuild the source pack's topic map and actual available output inventory **before** assigning future posts to specific topics or claiming a complete commercial product. Do not invent the four topic titles or exact asset counts.
- Choose multiple excerpt formats across the four validated topics over time, not a repetitive series around the first video hook. Show the breadth of the learning experience.
- Distinguish the authenticity/accuracy of each source from the right to reuse it. Studocu/Course Hero hosting does not itself grant commercial reuse rights.
- Do not cross-contaminate NR601 materials with NUR-635 or other Almanac courses.
- Clinical qualification: a potentially overbroad clip hook is a check-for-context, not proof of error; evaluate the actual script and cited source before issuing a correction or public claim.

## Each run
1. **Reconcile:** inspect current repo, approved product claims, campaign registry, actual social-post screenshot/link and metric freshness. Never assume social account analytics access or current checkout status. Classify facts as VERIFIED / USER_REPORTED / PROPOSED / UNVERIFIED.
2. **Diagnose:** state audience, learning problem, exact resource status, funnel friction, one highest-impact campaign hypothesis and one available evidence gap.
3. **Design:** create one or more assets or copy drafts using the campaign's exact subject, course, intended learner level, approved brand references and attribution. Ensure the posted sample teaches something self-contained.
4. **Gate:** execute the content and compliance checklist. Never label an unreviewed nursing question, rationale, patient example, clinical claim, video or resource 'approved' or 'available'. Do not use institution exam items, student records, copyrighted slides, unlicensed media or institutional affiliation claims. Original practice only, not answers to an active assessment.
5. **Request approval** for final clinical content, visuals, claims, CTA and distribution. No Facebook publishing, paid ads, email sending, unapproved edits to production, paid enrollment or new payment routes without explicit authorized action. A post approved as draft is not evidence it was published.
6. **Measure:** after publication, capture post URL, post type, unique theme, observations at comparable ages (24h, 72h, 7d when available), views/reach, shares, saves, comments, DMs, inbound email subject counts, qualified inquiries, issued offers, verified paid customers, refunds and repeat purchases when accessible. Enter unknown as blank or unknown, never zero.
7. **Learn:** pick next intervention based on evidence; compare like-for-like content ages; preserve the hypothesis, result and decision. If evidence is insufficient, record 'inconclusive'. Do not invent engagement or conversions.
8. **Version:** update registry, brief/queue, metrics and experiment log in a proposed branch or PR, with succinct changelog and source provenance. Preserve old versions and human approval evidence.

## Conversion and payment safeguards
- The real published post directs students to **Almanacstudy.support@gmail.com** for `NR 601 midterm` and permits other course/exam subjects. This is a user-provided social CTA, distinct from the older website support address.
- **Resource readiness is UNKNOWN** until the exact full NR 601 video/source is inventoried, QA'd, licensed and delivery-ready. Avoid promising immediate access or asserting it is free/paid without verifying.
- Last examined payment review (23 Oct 2026) withheld unrestricted public paid launch and recommended REQUEST-ONLY operation. Treat as a conservative gate until the latest authorized implementation and receiving provider's approval prove otherwise. Do not provide bank instructions, solicit a new transfer or represent checkout as ready.
- Inquiries may be qualified through the published email or approved request channel, with suitable consent. Report aggregate metrics; protect learner contact details and health information.

## Required output every campaign run
- `Snapshot`: campaign ID, date, newest verified sources, stage and currently available metrics.
- `Decision`: the single most important recommendation and why it beats alternatives.
- `Production`: ready-to-review copy/assets/briefs with source and review status.
- `Gates`: what requires subject expertise, owner approval, resource readiness or permitted collection.
- `Experiment`: metric to judge, comparison age, expected mechanism, next step.
- `Change log`: file/PR updates actually made (or explicit not-made).

## Change control
Use semantic versioning for this skill. PATCH = corrections, MINOR = new content series or checks compatible with existing approvals, MAJOR = changes to authority, policy, payment, or publication gates. Draft changes to skill in reviewable PRs. Never quietly weaken safeguards to improve conversion.
