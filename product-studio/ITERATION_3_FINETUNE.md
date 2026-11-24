# Learning Studio: iteration 3 fine-tune (24 Nov 2026)

**Inputs:** seven owner references.
- A Pareto quote card.
- A paper note with a paperclip and icon chips.
- "How to build trust on your website" pinned cards.
- A soft lavender meeting dashboard.
- The EduSphere course and video layout.
- The TimeFrame calendar.
- A grid of tinted tool cards.

**Rule:** these show *how* to present things. Almanac keeps its own identity, and nothing in the references licenses invented proof (testimonials, badges, stats).

## The Pareto lens

The Pareto card's point is that a small share of causes drives most effects. We apply it twice:

1. **To this pass:** fine-tune first the surfaces learners touch most.
   - The home Next step.
   - The topic page.
   - The format switcher.
   - Flashcards.
   - The homepage hero and trust section.
2. **To the product:** time and emphasis follow the course blueprint, not page count. That rule already lives in the exam-prep content rules. Visually, the one or two words that carry a sentence get the emphasis.

## Patterns and where they go

| Reference | Pattern | Almanac fine-tune |
|---|---|---|
| Pareto card, paper note | Key words bold and in brand colour; the rest stays quiet | `Emphasis`: Label weight in `color/primary/deep`, at most 1–2 phrases per sentence, never colour alone |
| Paper note | Answer on a paper sheet with stacked sheets and a clip | Hero answer card sits on a **paper stack** (two offset sheets, a small clip); the public site only, never inside the studio |
| Paper note | Outlined statement plus 3 icon chips | Under the hero: an outlined statement and **icon chips** for true facts (Reviewed against the textbook · One next step · Several formats) |
| Pinned cards | Numbered tinted cards on a dashed path | "How lessons are made" as **pinned step cards** with a dashed connector on desktop; a plain list on mobile |
| Pinned cards | Trust checklist: testimonials, badges, contacts, case studies, refund policy | **Trust section** built only from real items (below) |
| Lavender dashboard | Soft lavender ground, large radii, icon tiles, check buttons on upcoming items | Studio ground stays `color/bg/studio`; plan rows get a check circle; done rows are struck through and muted |
| EduSphere | Media in the centre; Files / Videos / Audio tabs; lesson list with play icons and durations; active row highlighted; syllabus card with counts | **Topic page:** "Study this topic as" tabs, a media player block and a lesson list with durations. **Course card:** honest counts (pages, videos, minutes) |
| TimeFrame | Daily/Weekly toggle; week strip; one fresh accent marks "now" | **Week strip** on learner home (Figma; code later); `color/accent/fresh` (lime) only marks *today/now*, always behind dark text |
| Tinted tool cards | Each card has its own soft tint and an icon pair | **Format tints:** each study format gets its own pastel tile (`color/format/*`); cards stay white; the tint sits on the icon tile only, so it stays legible |

## Trust section: real items only

| Reference slot | Almanac's honest version | Source of truth |
|---|---|---|
| Testimonials | Not shown until real learners give written consent to quote them. The component exists; the section hides it while it is empty | Owner decision |
| Trust badges | "Reviewed against McCance & Huether, 10th ed." · "Independent: not affiliated with any school or publisher" | Course content, footer |
| Contacts | "Email a person: almanacstudy.support@gmail.com" · Help centre | `ALMANAC_SUPPORT_EMAIL` |
| Case study | "See what's in a course": the real public course outline | `/courses/advanced-pathophysiology` |
| Refund policy | "Refund and cancellation terms are confirmed with you before any payment." (Terms page, pre-launch draft) | `/terms` |

## Tokens added

All are added in every mode of "Studio Color".
- `color/format/read|watch|listen|see|practise|remember|rehearse`: pastel icon-tile backgrounds. Icons stay `color/primary/deep`, which is ≥ 7:1 on every tint.
- `color/accent/fresh` (lime): marks today/now only, always behind `color/text/default`.

The code uses the same names (`--color-format-*`, `--color-fresh`).

## Out of scope (separate gates)

Prices, checkout, analytics, testimonials (they need consent), audio hosting, and the per-day calendar. The plan engine has weeks, not day schedules; the week strip shows sections per week, not invented appointments.
