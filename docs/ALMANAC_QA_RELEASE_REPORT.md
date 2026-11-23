# Almanac — release candidate QA report

**Scope:** `StudyMate-N/almanac`, `feat/custom-learning-orders-v1`, draft pull request #3.  
**Date:** 2026-10-15.  
**Disposition:** **Code/test candidate passed; public bank-transfer launch remains gated.**

## Confirmed implementation

| Journey stage | What is implemented | Evidence |
|---|---|---|
| Discover and configure | Course catalog, approved $49 / $149 / $399 inclusive packages, quantity-limited extras, learning preference, custom syllabus uploads | GitHub price/format tests; Next build |
| Production capacity | $399 Complete Course restricted to 14-day Standard / 7-day Priority; 3-day Express disabled at client and server layers | Test suite, database migration |
| Consent | Explicit terms and privacy acknowledgment stored on each new CAD order | Server validation and DB function |
| Invoice | USD listing; Bank of Canada USD/CAD reference rate; seven-day CAD quote and fixed invoice; copyable bank details | Live exchange-rate quote dry-run, rollback-only DB quote test |
| Payment | Secure reference or private receipt reporting, bank confirmation via exact credited CAD amount; no automatic screenshot verification | Rollback-only staff payment verification test |
| Recovery | Owner-only invoice token reissue, expired quote refresh, access reset and old-session revocation | Rollback-only account isolation and reset tests; requote still needs staging test |
| Course scoping | Optional source documents and human-reviewed module learning plan; learner approval/revision | Applied migrations, database test |
| Resource fulfillment | Private uploads, staff QC/release, per-module lessons/videos/slides plus packages and enhancements | Dedicated release guard and rolled-back 8-module test |
| Interactive learning | Subject-agnostic lesson, explained practice question, flashcard and timed simulation engine; per-learner progress | Rolled-back answer/flashcard persistence tests, TS/build |
| Student access | Assigned paid orders and authorized resources only; returning learner can link further paid orders | Rolled-back cross-order isolation/account linking tests |
| Support | Configured WhatsApp +1 (205) 727-9363, working contact inbox support@unemployedproff.com, help and recovery pages | Source review |
| Legal | Draft Privacy and Terms pages linked in footer; explicit pre-launch warnings | Source review; **legal approval outstanding** |

## Recorded verification

1. **GitHub Actions run 38646702452:** package/pricing tests, official checkout dry run (intentionally wrong amount must be rejected), seven live unauthorized-resource access probes, TypeScript, and Next.js build **all passed**.
2. **Full rollback-only Supabase transaction:** created CAD order; rejected an incorrect credited amount; verified payment with correct amount; issued access; started production; saved and published lesson/questions/cards; saved quiz and flashcard progress; registered and released customer-specific files; marked delivered when complete. **Passed; transaction rolled back.**
3. **Identity and recovery rollback-only transaction:** cross-order access rejected; invoice reissued with earlier token revoked; reset code/sessions; existing-account second purchase linked; cancelled order access revoked. **Passed; transaction rolled back.**
4. **Eight-module content completeness rollback-only transaction:** eight files assigned to one module were insufficient despite matching total counts; one complete lesson/video/slides set per module was sufficient. **Passed; transaction rolled back.**
5. **Privilege query:** anonymous and ordinary authenticated roles have **no EXECUTE** permission on `learning_request_create_cad`; anonymous role also cannot invoke the privileged FX re-quote. Service role retains access.
6. **Buckets:** `almanac-course-sources`, `almanac-payment-receipts`, and `almanac-deliverables` are marked private. Unauthorized Edge API requests returned only 4xx responses, without file paths.
7. **Secure student file names:** authorization RPC now provides the actual authorized filename to the download service; Supabase Edge function `learning-deliverables` version 2 deployed.

## Not yet validated end-to-end

- **Vercel fresh preview:** Vercel API returned 402 `api-deployments-free-per-day`, limit exceeded (over 100 API deployments/day). Available CLI fallback is unavailable in this execution environment (no CLI/source/auth). Code is committed and builds in GitHub; the newest build is **not guaranteed to be on the older preview URL**. Retry after the Vercel quota window or address team billing limits. **Do not publish production as a workaround.**
- **Actual upload/download of real customer materials:** private-file metadata/auth tests pass; complete browser PDF/PPTX/MP4 upload and authorized download require a person to test the deployed preview when available. Malware scanning and retention/deletion control need operational/legal decisions.
- **Bank settlement:** confirmed support for CAD quotes is not evidence that funds can be received via the specified international banking instructions. Beneficiary, routing, fees, refund handling and actual receipt must be independently verified.
- **Email:** `support@unemployedproff.com` is the temporary support contact. Automatic email code exists but provider credentials and verified sender address are **not configured**. Until configured, staff must send/recover links and codes manually from the staff dashboard.
- **Legal:** service identity, governing law, cancellation/refund terms, record retention periods and final Privacy/Terms approval are unconfirmed.
- **Learning delivery:** actual authored videos, study guides, quiz rationales and clinical accuracy require professional QA. Automated checks validate format/quantity, **not subject-matter truth** or production capacity.
- **CAD re-quote test:** a rollback-only test call was blocked by the execution tool's safety checks; owner re-quote should be tested in a controlled staging environment before paid launch.
- **Visuals/mobile:** final artwork and visual refinement are intentionally outside this engineering pass.

## Launch policy

Do **not** merge PR #3 or advertise unrestricted payment collection until the externally dependent checks above are complete. The database migrations and Edge functions have already been applied to the configured Supabase project; this backend may be shared with other environments, so any future changes must be additive and audited. The Next.js production deployment remains unchanged by this draft PR.

**Operator runbook:** [ALMANAC_OPERATIONS_AND_RELEASE.md](./ALMANAC_OPERATIONS_AND_RELEASE.md).
