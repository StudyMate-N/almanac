# Campaign performance measurement schema

Each CSV row is one **source-identified snapshot** of a single published post, not necessarily a reporting period. Use Africa/Nairobi wall time for user screenshot readings and explicit timezone for exact publication times. If unknown, leave a field empty. **Unknown is not zero.** Capture organic/paid context when verified. Never store student email addresses or patient data here.

Columns:
- `campaign_id,post_id,observed_at_local,post_age_reported,platform,views,reach,shares,saves,comments,reactions,qualified_inquiries,offer_requests,verified_customers,repeat_customers,source,evidence_note`.
- Views, reach, shares etc. are counts as displayed; metric definitions differ by Facebook format.
- `qualified_inquiries`: inbound learning request for an identifiable subject/exam with an explicit need; record aggregate number, not identities.
- `verified_customers`: only actual confirmed lawful sales; count cannot be inferred from form submissions.
- Use subsequent snapshots at comparable post ages (24h, 72h, 7d), if available.
- `source`: screenshot filename or approved direct analytics export. Do not assume automatic account access.

Decision making: prioritize request conversion and learner value, with educational quality and accuracy as hard guards. Small cohorts are exploratory, not statistical proof.
