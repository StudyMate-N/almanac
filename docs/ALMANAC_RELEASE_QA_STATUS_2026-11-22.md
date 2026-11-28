# Almanac Release QA — Independent Workstream (22 Nov 2026)
**Status:** Backend-blocked, local build separately measurable. Proposal to split CI jobs in review; no product, checkout or student records modified.

## Verified signals
- **Frontend:** Netlify production had a ready release containing contact-isolation PR #10. This does not assert that all end-to-end flows are working.
- **Backend:** Supabase project `pebkqsyfliytbowxzyun` reported **INACTIVE** via connected Supabase project status; not a passing health check.
- **GitHub CI (historical):** Workflow run 44978236776 completed with failure. Local offer, request-origin and staff amount checks passed; contact isolation, typecheck and build passed; remote `check-private-endpoints.mjs` failed while backend was unreachable and checkout check was skipped. Run 44978149566 had checkout preflight failure `fetch failed`.
- **Secrets:** Live Almanac Netlify env no longer has the former cross-brand sender or Resend key; automated emails are intentionally unavailable pending a dedicated verified sender.
- **Dependency review:** Earlier npm-ci output mentioned 3 high and 1 critical package advisories. No vulnerable dependency was upgraded or audited to establish exploitability in this PR.
- **Payments:** Merchant approval not restored; separate AgentaOS review and terms assessment still required.

## Proposed CI reporting change
The release workflow now has two independent jobs:
1. `Local integrity / build` — package quote validation, request-origin, confirmation, cross-brand contact isolation, TypeScript and production build.
2. `Live backend / unauthorized-access probes` — genuine remote unauthorized file-access tests and a non-purchasing pricing check against the Supabase project.

**Neither job is suppressed.** A broken/inactive backend must continue to show a failed remote job, while giving maintainers a separate verified result for local changes. Both must pass before a payment or learner-access release can be called production-ready.

## Next independent work
- Authorized owner decides whether to restore/re-activate Supabase and pay any applicable infrastructure charges, then reruns remote probes against actual services; no blind DB reset.
- Revalidate entitlement/RLS and user-file isolation only after real backend connectivity.
- Validate invoice/order workflows without collecting funds and with approved email sender.
- Triage npm audit advisories with exact package versions and safe upgrades.
- Audit separate frontend/Backend config drift, including Vercel vs Netlify, and ensure no deployment accidentally reintroduces old contacts.
- Fix or document any issues via a dedicated QA branch, never overwriting learning or campaign PRs.

## Acceptance criteria
Source: `StudyMate-N/almanac` current feature branch; test evidence logged with CI URLs/status, GitHub issue #11. No claim of local or backend checks until an actual job completes with passing conclusion.
