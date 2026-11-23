# Almanac observability integration contract (draft)

Status: **PR-level implementation started. Allowlisted event schema, tests, CI and empty configuration placeholders added; no SDK installed, no telemetry deployed, no production changes.**

Date: 2026-11-23

## Observed baseline

- GitHub: `StudyMate-N/almanac`, default `main`, Next.js App Router, npm lockfile.
- Netlify: `almanac-study` frontend deployed; frontend readiness must not imply backend readiness.
- Supabase project `pebkqsyfliytbowxzyun` is `INACTIVE` as of this audit.
- Existing blocker [#11](https://github.com/StudyMate-N/almanac/issues/11) and draft release-check PR [#12](https://github.com/StudyMate-N/almanac/pull/12) govern backend recovery. Do **not** redefine unreachable checks as passed.
- PostHog connection is available, but its organization currently lists only `Default project` (ID 760516), with no ingested events. That destination is **not yet confirmed** as Almanac-owned. Do not copy the token or emit events until the destination is approved.

## Implemented in draft PR #15 (2026-11-23)

- Added `src/lib/observability/event-contract.ts` with seven strictly allowlisted events and safe enum-only property values. It has no network requests or third-party SDK dependency.
- Added `scripts/check-observability-contract.mjs` with five Node tests for validity, unknown-event rejection, PII stripping, invalid enum rejection and no network calls. All five passed in the local isolated test, plus strict `tsc --noEmit` for the contract module.
- Added `npm run test:telemetry`, `.env.example` with blank analytics placeholders, and a scoped GitHub Actions privacy-contract job. Hosted CI must pass separately; local tests are not a release approval.
- The connected PostHog organization's `organizations_projects` limit is **1**, already used by the unused `Default project` (ID 760516, no ingested events). A separate project cannot be created under the current plan. Updating the default project's name/settings requires the user's explicit confirmation and is not authorized by this draft.
- **No SDK is installed or capturing events.** An analytics destination and consent review are prerequisites for instrumentation.

## Proposed rollout (separate from backend work)

1. Confirm or provision **Almanac-specific** PostHog project, region, retention and account permissions. Do not combine with Unemployed Professor, Payment Recovery or other brands.
2. Install `posthog-js@1` with `npm install --save posthog-js@1` from a checked-out repository and commit both `package.json` and `package-lock.json`. Never hand-edit the lockfile. Run `npm ci`, `npm run typecheck` and `npm run build`.
3. Initialize via Next.js `src/instrumentation-client.ts` following the installed PostHog Next.js guidance, with `defaults: '2026-08-30'`. Read `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` optionally. An unset token must not break production; show a clear development error. Commit placeholder names only to `.env.example`, no real key.
4. Do not auto-enable session recording, autocapture of forms, surveys, text capture or URL query capture. Almanac is a learning platform and may handle case documents, account tokens, invoices and uploaded material. Review privacy notice, consent requirements, retention, PII redaction and data processing region before optional replay.
5. Introduce **manual allowlisted analytics events only**, with non-identifying enum metadata (no document titles, case IDs, user-entered text, invoice identifiers, student names, email addresses, access codes or private URLs).
6. Identify signed-in users only with the application's stable internal account ID after authentication, not email, and reset on logout. Keep anonymous visitors anonymous. No identification change until existing auth implementation is reviewed.
7. Stage the instrumentation in a preview branch. Verify the events appear in the approved PostHog project with controlled test traffic. Only then consider production promotion.
8. Respect all existing checkout/merchant/manual-payment, access-control, contact-separation and release gates. Analytics must never block application functionality or bypass authorization.

## Event contract v1

| Event | Trigger | Allowed metadata |
|---|---|---|
| `almanac_catalog_viewed` | Public catalogue opened | `surface: 'public'` |
| `almanac_request_started` | Request builder opened | `request_kind: 'custom'|'catalog'` |
| `almanac_request_step_completed` | A flow step completes | `step: 'scope'|'preferences'|'review'` |
| `almanac_request_submitted` | Server confirms acceptance | `request_kind` |
| `almanac_invoice_viewed` | Invoice page rendered to authorized user | `surface: 'invoice'` |
| `almanac_learning_opened` | Authorized learner enters learning workspace | `surface: 'learner'` |
| `almanac_client_error` | Explicitly handled expected error class | `area`, `error_code` allowlists only |

**No purchase_completed event** until payment settlement is authoritative. Do not mark invoice submission, payment-proof uploads, or merchant-approval requests as completed purchases.

## Privacy and reliability tests

- No raw user data, medical case content or uploaded file names in events.
- URL/query strings that carry tokens never transmitted.
- Missing PostHog configuration: development signals clearly, production app remains usable.
- PostHog network outage or ad blocker: all core flows still function.
- No unapproved tracking on consent-restricted surfaces.
- No new public Supabase permissions or secrets in client bundle.
- Build, static checks, and local event-shape tests pass.
- Browser QA tests event emission with an approved mock; capture exactly once and verify consent handling.
- Real analytics arrival is checked separately in an approved PostHog project.
- Backend security probes remain blocked until Supabase is restored and tested.

## Ownership and dependencies

- **Telemetry lane:** scoped to analytics code, test fixtures, event schema and privacy controls. Separate branch from release QA, merchant/contact and learning-experience branches.
- **Backend recovery:** tracked in issue #11; not prerequisite to writing client telemetry tests but prerequisite for end-to-end checkout evaluation.
- **Human approval required:** PostHog project destination/region, privacy policy and consent, optional replay, and production activation.
- **Release result:** `NOT DEPLOYED` until reviewed PR is merged and destination verified.

## Measurement

Compare baseline vs subsequent weeks for: incident detection time, time to reproduce client errors, PR first-pass CI pass rate, percentage of events conforming to approved schema, and verified request funnel completion. Report evidence and definitions; never fabricate baseline values.

## References

- [PostHog Next.js integration](https://posthog.com/docs/libraries/next-js)
- [Almanac backend blocker #11](https://github.com/StudyMate-N/almanac/issues/11)
- [Almanac release QA PR #12](https://github.com/StudyMate-N/almanac/pull/12)
