# Almanac observability integration contract (draft)

Status: **Staged on draft PR #15. Browser SDK installed with npm-generated lockfile, opt-in UI and tests added. No live event collection or production deployment.**

Date: 2026-11-23

## Observed baseline

- GitHub: `StudyMate-N/almanac`, default `main`, Next.js App Router, npm lockfile.
- Netlify: `almanac-study` frontend deployed; frontend readiness must not imply backend readiness.
- Supabase project `pebkqsyfliytbowxzyun` is `INACTIVE` as of this audit.
- Existing blocker [#11](https://github.com/StudyMate-N/almanac/issues/11) and draft release-check PR [#12](https://github.com/StudyMate-N/almanac/pull/12) govern backend recovery. Do **not** redefine unreachable checks as passed.
- PostHog organization is restricted to one project. The user explicitly approved renaming the unused project ID `760516` to **Almanac — Pilot**; the rename is verified. Region remains **US Cloud**. At the time of this work, no events were ingested. Project setting `anonymize_ips` is **false**; this is an open privacy-review item before public traffic.

## Implemented on draft PR #15 (2026-11-23)

- Installed PostHog's browser SDK with `npm install --save posthog-js@1` on GitHub Actions, using the project's checked-out npm workspace. Both `package.json` and npm-generated `package-lock.json` are committed. Locked SDK version: **1.453.2**.
- Next.js `src/instrumentation-client.ts` calls a guarded initializer: it is inactive unless `NEXT_PUBLIC_ALMANAC_ANALYTICS_ENABLED=true`, valid token/host values exist and the visitor **explicitly grants consent**. Empty env values never break production.
- Added an optional consent UI (`src/components/analytics-consent.tsx`) with allow/decline and a preference control to revoke the choice later. Consent is remembered locally; SDK event persistence is in memory, and the visitor has no direct identifier.
- Disabled automatic capture, pageviews, page-leave events, recordings, surveys and feature flags. `before_send` drops unapproved SDK events and strips URL/query/referrer/device/context fields from allowed events, preserving only approved enum fields, the SDK's public ingest token and its transient distinct ID. No raw learner or clinical case content is sent.
- Added an observed catalogue-impression integration (`src/components/catalog-telemetry.tsx`); it fires an approved event only if consented capture is active. **The other six approved events are contract-only, not falsely counted as implemented.** Future branches should attach them to verified business transitions.
- Added nine privacy/consent/test cases to `scripts/check-observability-contract.mjs` and a permanent GitHub workflow running `npm ci`, `npm run test:telemetry`, `npm run typecheck` and `npm run build`. The temporary lockfile bootstrap workflow was removed.
- A pre-final bootstrap action already passed full npm reproducibility, privacy tests, TypeScript and Next.js build. **Final branch CI must also pass before readiness.** No PostHog production environment variables, server-side tracking or deployment have been configured.

## Staging and release checklist

1. Confirm privacy notice, consent copy, handling of IP addresses (PostHog project `anonymize_ips=true` verified on 2026-11-23) and appropriateness of US region. Keep auto-replay and sensitive capture disabled.
2. On a **preview deployment only**, set `NEXT_PUBLIC_ALMANAC_ANALYTICS_ENABLED=true`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` from the confirmed Almanac — Pilot project, and `NEXT_PUBLIC_POSTHOG_HOST` from its `api_host` setting. Never hardcode either value in the repo.
3. Browser QA: decline and verify no events, allow and verify exactly one `almanac_catalog_viewed` event on entering the catalogue viewport, revoke and verify capturing stops. Inspect network requests and received event properties for any unexpected URLs or identifying content.
4. Simulate network blocking and consent-storage failure. Course browsing, learning, invoices, access controls and payment operations must remain functional.
5. Validate PostHog ingestion only with test traffic. Do not infer delivery from a successful `posthog.capture` call or from a passing build.
6. Revisit user identification only when stable learner account ID and authentication lifecycle have been reviewed. Do not identify by email, name or case content.
7. Keep payment settlement authoritative: proof-of-payment uploads and invoice events are not completed purchases.
8. Continue backend restoration and live security QA through existing issue #11 and PR #12, independently of client telemetry. Do not merge/deploy until all relevant release gates pass.

## Pilot configuration template

```env
NEXT_PUBLIC_ALMANAC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=
```

The default values are intentionally off. A repository build does **not** turn on live tracking.

## Isolated browser QA — release blocker (2026-11-23)

- Added a GitHub Actions Chromium/Playwright QA job against a local Next.js **production build**, using a fake PostHog token and a browser firewall: all external browser requests are blocked or mocked; no real learner data and no live PostHog ingestion.
- QA validates refusal, grant, intended catalogue event, redacted URL-token transport and revocation. The dependency and browser installation work on pinned Ubuntu 24.04. The independent privacy/TypeScript/Next.js build pipeline **passes** (GitHub run [45101981886](https://github.com/StudyMate-N/almanac/actions/runs/45101981886)).
- The strict browser test **fails** (run [45101981881](https://github.com/StudyMate-N/almanac/actions/runs/45101981881)): the user opts in, the SDK reports enabled and loaded, the catalogue is visible and `capture()` is attempted, but no event reaches the `before_send` callback or mock ingestion endpoint. PostHog attempts to load a third-party asset script, blocked by the browser firewall. Changes to opt-in, initialization readiness, remote dependency loading and a bundled SDK import did not resolve it.
- **No live browser preview deployment was verified**; the connected Vercel account does not expose Almanac's earlier Vercel status deployment, and current Netlify preview builds belong to different branches. Do not treat their READY statuses as PR #15 verification.
- **Issue [#17](https://github.com/StudyMate-N/almanac/issues/17) is the explicit unresolved browser release blocker.** Do not disable the browser assertions or declare the PR ready based on passing static checks.
- GitHub clean `npm ci` output independently reported **3 high and 1 critical dependency advisories**. Triage is tracked under [#16](https://github.com/StudyMate-N/almanac/issues/16); no dependency fix has been verified yet.
- **PostHog project** `Almanac — Pilot` (ID 760516) has IP anonymization enabled. There is still no verified application event ingestion, and the production analytics switch remains off.

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

## Privacy and reliability acceptance criteria

- No raw user data, medical case content or uploaded file names in events.
- URL/query strings that carry tokens never transmitted.
- Missing PostHog configuration: development signals clearly, production app remains usable.
- PostHog network outage or ad blocker: all core flows still function.
- No unapproved tracking on consent-restricted surfaces.
- No new public Supabase permissions or secrets in client bundle.
- Build, static checks, and local event-shape tests pass.
- Browser QA must test opt-in, opt-out, revocation, duplicate event suppression and safe network payloads; browser E2E still pending.
- Real analytics arrival is checked separately in an approved PostHog project.
- Backend security probes remain blocked until Supabase is restored and tested.

## Ownership and dependencies

- **Telemetry lane:** scoped to analytics code, test fixtures, event schema and privacy controls. Separate branch from release QA, merchant/contact and learning-experience branches.
- **Backend recovery:** tracked in issue #11; not prerequisite to writing client telemetry tests but prerequisite for end-to-end checkout evaluation.
- **Human approval required:** privacy notice/consent and US processing, project IP anonymization settings, and production activation. The user has already approved renaming the unused destination project. Session replay stays disabled.
- **Release result:** `NOT DEPLOYED`. Installing a library in a draft PR is not deploying analytics.

## Measurement

Compare baseline vs subsequent weeks for: incident detection time, time to reproduce client errors, PR first-pass CI pass rate, percentage of events conforming to approved schema, and verified request funnel completion. Report evidence and definitions; never fabricate baseline values.

## References

- [PostHog Next.js integration](https://posthog.com/docs/libraries/next-js)
- [PostHog privacy/data collection](https://posthog.com/docs/privacy/data-collection)
- [PostHog before_send filtering](https://posthog.com/docs/libraries/js/usage#amending-or-sampling-events)
- [Almanac backend blocker #11](https://github.com/StudyMate-N/almanac/issues/11)
- [Almanac release QA PR #12](https://github.com/StudyMate-N/almanac/pull/12)
