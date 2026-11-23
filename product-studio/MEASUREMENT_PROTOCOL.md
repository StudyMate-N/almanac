# Almanac measurement and experiment contract — design, not live tracking

**Status:** not instrumented. PostHog project `Almanac — Pilot` (760516, US Cloud) has `anonymize_ips=true` and, at the last inspection, `ingested_event=false`. Production tracking remains disabled. Draft privacy analytics implementation is separate PR #23, not merged into the Product Studio branch.

## What we are trying to learn

**Core hypothesis:** an educational system that offers one intelligible, relevant next step will help an authorized learner begin and complete meaningful learning actions more reliably than a flat dashboard of tools.

The primary release assessment must be **observed learner behavior and task understanding** in a controlled pilot, not an anonymous pageview. Measure whether the user can:
1. Explain what to do next.
2. Open an authorized activity without hunting through menus.
3. Complete a genuine retrieval/application attempt and inspect its reasoning, when released.
4. Recover when suggested material is missing or unsuitable.
5. Return without losing their real progress.

Only use privacy-vetted, consented analytics to supplement that evidence.

## Proposed minimal public/product event schema

Events below are **proposals**, not yet added to a live SDK. Each contains only allowlisted categorical properties. No raw route path, URL, query, student ID, email, medical case content, answer, invoice, token, upload or grade.

| Event | Trigger | Allowed event properties |
|---|---|---|
| `almanac_guide_opened` | Learner deliberately opens the guided pilot after consenting to product measurement | `surface: guided_study` |
| `almanac_goal_selected` | Learner changes their coarse intent selection | `intent: understand/prepare/review/unsure` |
| `almanac_step_presented` | A new, actionable recommendation is displayed | `action: lesson/practice/overview`, `reason_code` allowlist |
| `almanac_step_opened` | Learner follows the suggested activity link | `action: lesson/practice/overview` |
| `almanac_step_unavailable` | No approved, entitled activity is available | `reason_code: not_ready` |
| `almanac_route_changed` | Learner voluntarily changes intent/time/bandwidth | `dimension: intent/duration/bandwidth` |

Collect these **only after** consent, versioned event review and a tested final outbound redaction filter; sample without identifying a learner or reconstructing sensitive activity. If privacy cannot be guaranteed, omit the event. Do not record free-text tutor questions or private graded-item content.

## Evaluation protocol

- **Baseline:** Have consented pilot participants try a specified task in the existing draft workspace; observe whether they can locate an authorized study action and explain the expected next step. Document the task, sample limits and errors, not invented conversion rates.
- **Treatment:** Same task using `/app/guide`. Record task outcome, quality of understanding, accessibility failures and reason-for-failure.
- **Primary outcome:** proportion who complete the instructed, approved first action and can describe its purpose.
- **Secondary outcomes:** confusion/recovery, successful return to the activity, number of unnecessary navigation detours, time-to-start, and user control over recommendations.
- **Learning evidence:** a separate reviewed retrieval/application check (do not treat time spent, videos played or quiz attempts as proof of mastery).
- **No personal analytics without informed consent.** Analytics entrants are a selected group; report consent/sample bias and do not generalize their rate to all learners.
- **Accessibility:** keyboard, mobile viewport, screen-reader labels/status, reduced motion and low-data behavior; use WCAG 2.2 AA as target.
- **Release threshold:** product owner and learning reviewer approve demonstrated usefulness, safety and coherent fallback; no fixed target invented before observing a baseline.

## Responsibilities

- **PostHog:** consented aggregate product usage, permitted feature flag and experiment exposure, optional deliberately short qualitative feedback. Not a protected student grade database.
- **Supabase:** authorized educational state, source approvals, permissions and approved progress; no raw student data mirrored into PostHog.
- **GitHub Product Studio:** versioned decision/evidence, scenarios, PRs and CI outcomes.
- **Netlify:** protected design/QA preview and controlled canonical release after genuine browser evidence.
- **Human reviewer:** validates content meaning, correctness, honest learning outcomes and accessibility before publication.

A release may carry a `pilot` flag, but flags are **never authorization**. Backend entitlement and content review checks are mandatory regardless of experiment assignment. Disable sensitive session replay by default in educational areas; do not enable it by importing the generalized PostHog product analytics setup.

**Product principle:** measure whether Almanac helped someone learn, not whether it kept them clicking.
