# Almanac — Parallel Operations Command v1.0
**Created:** 22 Nov 2026. **Execution model:** four independent ChatGPT automation workstreams with user-invoked immediate iterations, plus ordinary scheduled runs. These are not a claimed 24/7 continuously executing agent swarm. Each iteration acts on a separate version-controlled branch and reports evidence.

## Mission
Keep Almanac making useful, safe progress even if an unrelated system is blocked. Coordinate different operational domains while preventing shared-code conflicts, checkout/data exposure and unsupported claims of 'done'.

## Workstream contract

| Lane / daily task | Task ID | Owned change surface | Current starting artifacts | Main gate |
|---|---|---|---|---|
| Merchant and Contact Compliance | `6b025e478e048191b2c75eceb2435b83` | customer contact, invoices, mail/WhatsApp isolation, merchant provider correspondence **drafts only** | PR #10 merged and production deployed; Issue #8 | Actual merchant approval, dedicated sender, legal disclosure |
| Platform Release QA | `6b025e4b8a50819197bc56e80f8d1047` | app health, CI/local vs remote checks, backend/entitlement incident reports | Issue #11 (inactive Supabase), draft PR #12 | Real backend security and checkout probes passing |
| Learning Media + Self-Service | `6b0249cb2d4081918fddae2a34ae8853` | `learning-experience/`, approved media proof-of-concepts, learner-controlled study rules | draft PR #7; `src/lib/study-path.ts` pilot & tests | Source/rights, user entitlement, peer review, no invented mastery or costs |
| Campaigns + Learner Acquisition | `6b0233f5ae0c8191907009c81ed9a42b` | `campaigns/`, creative production and learning-first social experiments | draft PR #5, Sprints 01/02 | Owner approval, clinical rights when relevant, verified inquiry/funnel |

**Avoid simultaneous edits:** each workstream owns its own feature branch and file set. All changes landing on `feat/custom-learning-orders-v1` require reviewed merges from one lane at a time, resolving conflict and rerunning relevant checks. No agent should silently merge another lane's work.

## Current evidence snapshot (do not freeze as permanent status)
- The original Almanac customer/contact hotfix PR #9 was deployed, then a wider scan found additional legacy contact paths. Follow-up PR #10 was merged; Netlify reported a ready production deployment on the feature branch.
- Netlify `ALMANAC_OPERATIONS_EMAIL` was reassigned to the Almanac support address in all deployment contexts; shared/legacy `ALMANAC_EMAIL_FROM` and `ALMANAC_RESEND_API_KEY` were removed. **Automated transactional mail is paused** until an authorized dedicated sender is configured. No claim of verified inbox access or deliverability.
- The Supabase Almanac backend reported `INACTIVE` from its connected project API. Past remote unauthorized-access and checkout smoke checks failed/unavailable; this blocks claiming functional learner access/payment. A frontend's ready deployment does not override backend status.
- PR #12 separates local build verification from genuinely remote security tests while keeping remote failures visible. This is review-only until merged.
- PR #7 now includes a deterministic recommendation proof-of-concept requiring approved, rights-cleared, accessible and entitled content and an optional learner override; tests and CI pending verification.
- PR #5 includes separate learner-responsive Sprint 02 drafts; **no** new posts or unverified course pack offers were released.
- AgentaOS screenshot rejection concerns shared WhatsApp and alleged essay-writing service; accurate ownership disclosure, commercial product suitability and written provider approval remain unresolved.

## Independence rules: what continues when another lane fails
- **Backend offline?** QA investigates, while learning can safely prototype pure local recommendation rules and accessibility; marketing may teach general original study skills, but cannot advertise a working paid learner workspace.
- **Payment approval rejected?** Do not collect money or claim product can be bought. Continue source review, publish only owner-approved genuinely useful free learning, prepare request-only responses with honest terms.
- **Course source rights unverified?** Don't sample restricted NR601 content; teach original general study methodology and build rights/inventory tooling.
- **Creative owner approval absent?** Prepare reviewable drafts, media briefs, accessible alt-text; no publishing, messaging or ad spend.
- **Unverified inbox sender?** Keep transactional email off; prioritize on-screen help and owner-monitored authenticated support.
- **CI remote check failing?** Distinguish blocked external precondition from local test outcome; never label remote privacy or checkout tests successful without actual evidence.

## Every run's acceptance contract
1. Read the correct branch and current docs, not just yesterday's plans.
2. Pick one substantial demonstrable action: content/test/code/docs as applicable.
3. Confirm no collision with another active branch or critical shared state.
4. Apply approved safe actions on review branch; preserve owner signoff and customer privacy.
5. Report: **Changed**, **Verified**, **Blocked**, **Next** with exact commits/PRs, metrics and genuine test results. `Unknown` is not `zero` or `passed`.
6. Record dependencies on other lanes as GitHub issues or review links—not by halting all work.

## Merge and release authority
- **Content/clinical:** verified original evidence, rights, appropriate reviewer; user authorizes publishing.
- **Product:** unit/integration tests, no FSRS state or entitlement regression, accessibility, safe source handling; an app feature is not launched merely because code is written.
- **Operations:** dedicated verified email sender and user-run support checks; no unauthorized messages; safe rollback.
- **Merchant:** truthful legal/beneficial-ownership disclosures, suitable provider approval for actual ready-made vs bespoke products, no checkout/payment collection before authorized.
- **Quality:** local and real remote tests must both pass for claims of backend release readiness; never bypass controls for a green badge.

## Practical integration rhythm
Independent daily tasks develop asynchronously as scheduled, but their runs may execute inline when started from the conversation. The orchestrating assistant inspects and synthesizes changed PRs and blockers. Escalate only essential decisions to the owner, not every cosmetic variation. Do not promise uninterrupted real-time work unless an actual delegated or scheduled execution is confirmed.

## Workstream evidence links
- [Merchant compliance issue #8](https://github.com/StudyMate-N/almanac/issues/8)
- [Backend release issue #11](https://github.com/StudyMate-N/almanac/issues/11)
- [Merged contact cleanup PR #10](https://github.com/StudyMate-N/almanac/pull/10)
- [Release QA PR #12](https://github.com/StudyMate-N/almanac/pull/12)
- [Learner media + self-service PR #7](https://github.com/StudyMate-N/almanac/pull/7)
- [Campaign mode PR #5](https://github.com/StudyMate-N/almanac/pull/5)
