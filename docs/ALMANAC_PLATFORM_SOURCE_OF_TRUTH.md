# Almanac platform source of truth — Netlify (2026-11-23)

**Decision:** The owner confirms that Netlify hosts the refined Almanac experience. The separate Vercel Almanac site is an older draft. **Netlify is the canonical release platform.** The Vercel draft should be retired in stages, **not deleted immediately**.

## Verified platform inventory

| Component | Verified role | Evidence |
|---|---|---|
| Netlify site `almanac-study` | **Canonical production** | Site ID `c0462460-f265-450b-a38c-023ff0a1e546`; public URL `https://almanac-study.netlify.app` |
| Netlify production deploy | Ready, published 2026-11-22 | Deploy ID `6b0259d8c528d3f775bc660f`, source Git commit `15c2c1d45ce16dd3ce143cbcb0a2feb9d4f4e23f` |
| Netlify production source branch | **`feat/custom-learning-orders-v1`** | Production deploy's `branch` and `commit_ref` fields — **not** `main` |
| Refined UI | Netlify branch implementation | `src/app/page.tsx` contains current refined hero, resource types, personalized-order journey and art; `src/app/layout.tsx` includes Almanac public/workspace styles and metadata |
| GitHub `main` | **Older draft code line** | Older `src/app/page.tsx`: “Hard courses, broken into weekly steps”; differs materially from Netlify home |
| Vercel `almanac` | **Legacy draft** — archive candidate | GitHub Vercel PR preview bot refers to project `prj_J5EoOHXB7bqf5o57LUQF7E0XSgug` under team `robinsons-projects-4991f331`. The connected Vercel app can see only the separate Unemployed Professor project, so Vercel settings/traffic are not verified. |
| Almanac Supabase backend | Independent production blocker | Previously detected inactive project `pebkqsyfliytbowxzyun`. Validate again at release; do not equate a ready frontend with working learner/order backend. |

## Immediate guardrails

1. **Do not merge Vercel-era `main` changes, PR #15, PR #18, or preview PR #19 into the refined branch without porting changes independently.** Their UI and metadata are not the Netlify implementation. PR #19 is closed, unmerged.
2. Preserve Netlify's existing public homepage, course catalogue, checkout/manual-payment safeguards, learner experience, contact/merchant separation, styles and media assets.
3. Do not rename or relocate the Netlify site, modify DNS, retarget the custom domain, create a second public Almanac site, or change project-wide environment variables as a side effect of analytics.
4. Keep distinct human review, build, security, privacy and backend gates. Treat Netlify production's unusual feature-branch source as a release-management risk; only switch to `main` after a separate, reviewed alignment plan that preserves the refined site.
5. Preserve a recoverable snapshot of the Vercel draft until its routes/domains, traffic, environment config, inbound links, auth and external callbacks have been inventoried. **No destructive deletion without a verified replacement path and rollback decision.**

## Workstreams to migrate onto the Netlify code line

### A. Security patch — high priority

The retired draft's PR #18 independently verified repairs for 1 critical and 3 high dependency advisories by pinning `next@16.4.6`, `@vercel/oidc@4.0.9` and regenerating the npm lockfile. **Those results do not prove that the refined Netlify branch is patched.** It currently declares `next:^16.4.0` and `@vercel/oidc:^4.0.0`, and requires an isolated clean-lockfile audit.

- Create a fresh branch from `feat/custom-learning-orders-v1`.
- Use `npm install --save-exact next@16.4.6 @vercel/oidc@4.0.9`; commit both the package manifest and npm-generated `package-lock.json`.
- Run `npm ci`, `npm audit --omit=dev`, `npm audit`, existing contact/payment integrity checks, `npm run typecheck`, `npm run build`, and Netlify preview smoke checks on the **refined** UI.
- Keep deployment pending until all unrelated backend/merchant checks are explicitly satisfied.

### B. PostHog analytics — port, do not cherry-pick the UI

- Reuse the seven-event typed/privacy allowlist, consent policy, final outbound redaction, and headless browser QA from PR #15 as source *references*.
- Port as a fresh PR based on the refined branch. Its different `src/app/page.tsx` and `layout.tsx` must be **preserved**. Wire catalogue-view events to the actual refined catalogue section; do not replace the existing homepage.
- `PostHog Almanac — Pilot` is project ID `760516`, US Cloud, with IP anonymization enabled. Default tracking is **off**.
- No analytics for real learners before consent/privacy review. Use an isolated, branch-specific preview, not Netlify's project-wide `deploy-preview` environment values.
- Verify synthetic-only, consented delivery to real PostHog followed by revocation and outbound field inspection; only then consider release.

### C. Legacy Vercel retirement

1. Preserve GitHub commit/PR evidence and any required reference pages, then inventory Vercel domains, redirects, SEO/indexing, live traffic, OAuth callbacks, webhook endpoints and environment variables.
2. Once authorized for that Vercel project, disable **automatic Git deployments** for the old draft and keep it protected/private; remove legacy custom-domain bindings only after checking DNS and actual traffic.
3. If links exist, redirect only known public legacy destinations to their verified Netlify equivalents. Do not invent URLs or silently reroute authenticated paths.
4. Observe the rollback window and verify no production dependency points at the legacy deployment before choosing deletion. The correct default is **archive, not delete**.
5. Continue Unemployed Professor Vercel operations untouched; it is a separate project and remains legitimate.

## Definition of done

- One canonical **Netlify** deployment and reviewed source/release branch documented.
- Security fixes and telemetry integrated against Netlify branch without visual regressions or cross-brand contact leakage.
- Netlify preview, npm/security, browser, consent and backend/merchant release gates verified independently.
- Old Vercel draft no longer triggers duplicate Almanac deployments; old domains are accounted for.
- No unexplained deletion or broken legacy URLs.

**Current state:** Source-of-truth decision documented. This document does not itself modify Netlify or Vercel infrastructure, merge code, or activate telemetry.
