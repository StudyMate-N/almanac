# Almanac — operating journey and release runbook

**Status:** Development preview; do not publish or take unrestricted paid orders until the launch gates are satisfied. Source branch: `feat/custom-learning-orders-v1`; draft PR #3. This runbook intentionally excludes visual refinement and artwork.

## Customer experience

1. **Arrive and explore.** Learn what Almanac offers, browse the open Pathophysiology pilot and the on-request catalog, or request a personalized module, exam pack, or complete course.
2. **Define the learning scope.** Choose the complete $49 / $149 / $399 package; describe the subject, goal, and required module coverage. All listed core videos, practice, slides, cards and assessments are included in the package price.
3. **Tailor the experience.** Select a study preference at no extra fee. Quantified enhancements may include deep-dive videos, independent exam simulations or complete extra learning modules. Staff must review these before scheduling work.
4. **Share course material (optional).** Upload authorized syllabus, lecture notes, presentation files and relevant course resources. Eight attachments maximum, 10 MB each, 40 MB combined. Learners can supply files later using their private invoice link. Avoid confidential student/patient records.
5. **Choose a timeline.** Standard / Priority / Express availability is subject to capacity. The eight-module Complete Course does **not** offer automatic three-day Express; only Standard (14 days) and Priority (7 days) are presented. Focused Study Module and Exam Prep may have faster options within their preset limits. The deadline is not started by completing the form, reporting a transfer or merely issuing an access code.
6. **Acknowledge the service terms.** Request form validates the explicit consent flag on client and server; the date is recorded with the order.
7. **Create invoice.** Backend independently validates the package and USD price, fetches the latest available Bank of Canada USD/CAD published reference rate, and locks the CAD payable total on the order. The unpaid quote is valid for seven days.
8. **Save the private link.** Customer receives an invoice URL with a secret token and may copy or bookmark it. Automatic transactional email is OPTIONAL and not active without a verified sender/provider. The confirmation page states whether mail was actually sent and provides recovery guidance.
9. **Pay by bank transfer.** Invoice shows copyable CAD amount, invoice reference, bank beneficiary, account and transit/institution fields. Customers should confirm their bank can actually route the transfer using the supplied details. Never transfer USD face value to the CAD account.
10. **Report payment.** Upload a private receipt (PDF, PNG or JPG, 5 MB each, up to two) or submit the bank reference, with date. Reports do not verify bank settlement.
11. **Verify payment.** Staff check independently in the receiving bank and enter the *actual* CAD amount credited. The database rejects a mismatch and issues a single student access code only when the amount equals the order total. Failed/partial/late payments require direct support; no automatic re-payment prompt.
12. **Enter the workspace.** After staff send the access code using the verified customer email, the client signs in and sees only orders linked to that account. Already-established learners can link new paid orders from a private invoice if both account email addresses match.
13. **Confirm learning plan.** Staff examine uploaded materials and share defined modules, objectives and dates. Learner confirms or requests a revision within the agreed scope.
14. **Start production.** Staff ensure required source files and payment are received, then explicitly start production. The actual target delivery timestamp is recorded at this point.
15. **Build and review resources.** Staff assemble the purchased lessons, narrated videos, slides, practice, flashcards, assessments, study schedule and downloads. Use the secure file library for media; use the structured JSON import for interactive lessons, quizzes, flashcards and exam simulation questions.
16. **Publish interactive content and release assets.** Staff validate the minimum package content volume, review answers, rationale, rights and clinical/academic accuracy, publish the interactive pack, and selectively release private media files.
17. **Complete the order.** Database refuses to mark delivered until included and enhanced resource categories are released. Workspace delivery also requires a published interactive pack unless the user chose files-only delivery. Learner sees the files, module player, explained questions and saved progress.

## Staff dashboard

- Open `/coach`; sign in with staff code; choose *Learning orders & payments*.
- New orders: verify scope, view course uploads, review the fixed CAD quote, and publish a learning plan. Reach out to the client if syllabus coverage is unclear.
- Reported transfers: open any submitted receipt, independently check actual bank settlement, enter the exact CAD amount received, verify and issue access. **Never approve from a screenshot alone.**
- After the source files are complete, select **Start production**, then use the order's recorded deadline.
- Use **Manage course resources** for private files. Resource types: lesson, video, slides, practice, flashcards, simulation, plan and other. Confirm accuracy and right to share before releasing each file.
- Use **Interactive module content** to download a JSON template, fill exact module coverage, import/save a draft, and publish after the structural and volume checks pass. The interactive learner player is at `/app/orders/[orderId]/learn`.
- Drafts are not visible to learners. Republishing after changes requires renewed review.
- Mark an order **Delivered** only after the backend completeness guard passes and the learner can access the published content and files. The Complete Course additionally requires a separate released written lesson, video and slide summary for **every** purchased module; simply attaching duplicate files to one module cannot satisfy it.
- Owner-only controls: invoice-link reissue, access-code reset, and refresh of an expired/unpaid CAD quote. Old private links and credentials are invalidated on rotation.

## Standard content importer

JSON document root:
```json
{
  "version": 1,
  "modules": [
    {
      "title": "Module 1 — Example",
      "objectives": ["Explain a relevant principle."],
      "lesson": "A complete instructional explanation with examples and at least 150 characters.",
      "practice": [
        {
          "stem": "Which of these best explains the principle?",
          "options": ["A", "B", "C", "D"],
          "correctIndex": 0,
          "explanation": "A thoughtful explanation of why this answer is correct."
        }
      ],
      "flashcards": [
        {"front": "Define a key idea.", "back": "A clear definition."}
      ]
    }
  ],
  "simulations": [
    {"title": "Practice assessment", "minutes": 60, "questions": []}
  ]
}
```

The template illustrates shape, not final volume. The publisher enforces the configured module count, at least 15 explained questions and 15 flashcards per module for a Focused Module and Complete Course, or 10 per module for Exam Prep. It also enforces the core exam simulations (50 or 80 questions as appropriate) and any purchased extra simulations. The **actual promised quantity and clinical correctness must still be checked by a human**. Slides, videos and download packs are uploaded separately.

## Customer support and recovery

- Temporary support address: **support@unemployedproff.com**.
- WhatsApp: **+1 (205) 727-9363**, using prefilled order references but never private invoice tokens.
- If the customer loses a private link: confirm their email and invoice reference, then an authorized owner reissues the invoice link. The earlier link stops working.
- If the customer loses the access code: authorized owner resets the code and sessions; send new code to the verified email. Old code and sessions are invalidated.
- If a customer already has a paid workspace: use the link-order feature after payment verification. It requires a current authenticated student session and an unexpired private invoice token; both account emails must match.
- If payment is reported but not received: do not issue access, and do not ask for a duplicate transfer until bank reconciliation is complete.
- If a quote expires: hide transfer instructions. An authorized owner can obtain a fresh locked CAD amount, rotate the invoice token and send the new private link. A transfer genuinely initiated before expiry can still be reported using its original date.
- If delivery is late: update the client promptly and document the revised date; do not silently change the agreed package or promise a shorter deadline.

## Environments and provider configuration

The development Vercel project stores bank details and WhatsApp number as sensitive configuration. Supabase holds private buckets for uploaded source documents, payment proofs and order-specific deliverables. Runtime email integration is implemented but disabled unless configured:

- `ALMANAC_RESEND_API_KEY`: a real transactional-email API key.
- `ALMANAC_EMAIL_FROM`: a sender at a domain verified with the provider.
- `ALMANAC_OPERATIONS_EMAIL`: staff mailbox for new order and reported-payment alerts (default support@unemployedproff.com).

### October 15 Netlify / Resend integration status

- Domain `unemployedproff.com` is VERIFIED in Resend (DKIM, SPF TXT/MX, return-path CNAME).
- Transactional sender: `Almanac <support@unemployedproff.com>`; operations email: `support@unemployedproff.com`.
- A sending-only API key restricted to this domain has been generated and submitted to Netlify as the secret `ALMANAC_RESEND_API_KEY`. Never store the key or its plaintext in this repository.
- Netlify environment variables require a fresh deployment and then a real delivery test to establish runtime readiness.
- Real bank details must be supplied from the confirmed protected configuration separately. Do not mark a payment verified or email access until bank settlement has been independently confirmed.
- Preview currently has team-login protection; keep it until the final acceptance tests are approved.

**Never use the support email as a sending identity without verified domain authorization.** Email failures never invalidate an accepted order; staff must monitor the inbox/dashboard and send invoices/access emails manually until sending is configured.

## Tests performed

- Pricing, limits and urgency tests in GitHub Actions.
- TypeScript and Next.js production builds via GitHub Actions.
- Official FX lookup and intentional invalid-quote dry run (rejects incorrect prices without creating orders).
- Rollback-only Supabase transactions: create a quote and invoice; reject incorrect payment attestation; issue access; start the delivery deadline; save/publish module content; answer a question; persist flashcard review; register and release files; enforce package completion; link customer accounts; confirm delivery.
- Rollback-only identity tests: prevent cross-account reads; rotate invoice links; revoke old access codes/sessions; link a second paid order; prevent cancelled orders from appearing.
- Seven-day quote renewal transaction **not validated**: the attempted dynamic rollback-only test was blocked by the available execution safety guard. Requires a controlled manual staging test.
- Read-only GitHub CI security probes confirm that unknown students and staff receive 4xx errors for private source, receipt and delivery endpoints. These probes never upload files, alter real orders or read private data.
- A separate rollback-only course guard test confirmed that duplicate assets all assigned to one module cannot count as complete course delivery.

No real bank transfer, customer money, live email delivery or externally uploaded/video file has been represented as successfully tested.

## Explicit launch gates

1. **Real bank-routing verification:** confirm beneficiary, account type, international routing requirements, expected CAD settlement amount and fee treatment with the receiving bank. Process a supervised low-risk real transaction only when the operator approves.
2. **Verified transactional sending:** provision provider credentials and verify `support@unemployedproff.com` can send and receive (or confirm a manual communications roster and response SLA).
3. **Real upload/download checks:** test PDF/PPTX/video upload, correct learner authorization, staff download, private object accessibility, browser file size and network interruption handling. Add malware-scanning and a concrete retention/deletion policy.
4. **Content readiness and capacity:** prepare a real complete test module, validate lesson and video quality, exact question counts and QA; confirm whether seven-day and three-day course timelines can actually be fulfilled at expected demand.
5. **Financial exception policy:** choose treatment of bank shortfalls, refunds, cancellation after work starts, bank fees, and unsuccessful international transfers.
6. **Legal review:** confirm operating legal identity, governing law, privacy retention schedule, cancellation/refund wording and publishable Terms/Privacy. Current copy is labeled pre-launch.
7. **Cross-device UAT:** desktop/mobile order, upload, invoice, screenshot, recovery, WhatsApp, coach operations and learner downloads; verify actual live domain and access behavior.
8. **Deployment approval:** visually refine artwork and design as separately planned, review draft PR #3, merge only after acceptance, deploy production, and re-test domain and critical paths.

**Launch decision:** not production-complete until the above externally dependent and real-environment checks pass; the order-to-learning code is suitable for controlled preview QA, not unrestricted paid marketing.
