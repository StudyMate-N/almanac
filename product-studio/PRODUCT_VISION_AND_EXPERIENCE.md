# 01 — Product Vision & Experience (approved 24 Nov 2026)

**Status:** approved design direction. Mirrored from the owner's ChatGPT Space page *01 — Product Vision & Experience* via the public copy in [issue #33](https://github.com/StudyMate-N/almanac/issues/33). If this file and that page disagree, the page wins and this file is updated.

**How it fits:** this file sets the *experience direction*. `PRODUCT_SYSTEM.md` and `RECONSTRUCTION_MAP.md` remain the *technical baseline* (routes, gates, dispositions). `docs/experience-standard.md` remains the measurable smooth/seamless standard. None of them is replaced.

## North star: Calm, Intelligent Learning Studio

Almanac is a premium personal learning companion with the measurable effectiveness of a serious exam-preparation platform. A sophisticated learning system should feel simple and trustworthy — clarity over complexity (inspired by PostHog's approach, not its branding or UI).

## Six non-negotiable principles

1. **Surface calm, system depth.** The first view is simple; advanced functionality appears progressively, when relevant.
2. **One clear next step.** Every meaningful screen makes the learner's recommended, authorized next action unmistakable.
3. **Learning mode is quiet mode.** Minimal chrome, menus, interruptions and motion while studying.
4. **Editorial, not salesy.** Clear, precise, academically credible language; no empty claims or hype.
5. **Progress is visible, never noisy.** Mastery, place in the plan and useful feedback — no gamification clutter.
6. **Earn trust through restraint.** Consistent interaction, explicit states, reviewed material, accessibility and privacy.

## Two connected environments

| | Public Almanac | Learner studio |
|---|---|---|
| Tone | Expressive, editorial, welcoming | Quiet, focused |
| Visuals | Strong typography, considered illustration and motion | Functional restraint |
| Job | Explain real benefits, preview actual learning, keep course discovery and custom requests obvious | First view answers **Where am I? What should I work on next? How am I progressing?** around one primary action |

Explanation, video, flashcards and assessment are parts of one connected study journey.

## Interaction and visual direction

- Progressive disclosure, not dashboard sprawl. Mobile-first. Explicit focus, hover, disabled, loading, empty and error states. Accessible contrast, labels and keyboard paths.
- Distinctive Almanac identity: richness on public pages, restraint in the studio. Keep brand continuity where useful. **The final violet / soft-palette treatment is still to be explored — not locked.**
- Motion clarifies transitions and feedback, respects reduced motion, and never delays the primary learner action.
- Avoid generic course-marketplace templates, dense card grids, gratuitous AI styling, decorative metrics and needless steps.

## Gates (unchanged by a design pass)

Preserve content review, access, payment, privacy and release gates. Do **not** reactivate analytics or live checkout as part of a visual redesign; production changes need their own approvals. Sensitive learner data, private access flows, PostHog consent and payment approval are separate protected gates. Figma uses fictional examples only.

## Review gates for the redesign

1. Public landing / discovery
2. Learner home / next action
3. Lesson → practice → feedback flow
4. Mobile and accessibility review
5. Functional Netlify preview with no regression to authorization, commerce or privacy

Deliver before/after previews and implementation evidence before promotion.

## Figma handoff (owner agent)

1. Reuse the canonical Almanac Figma file; do not create parallel versions.
2. Semantic tokens (type, colour, surfaces, spacing, radius, borders, shadows, motion) as Figma variables and styles, with an expressive-but-restrained violet-led variant and a softer variant to explore. Palette is not approved until reviewed.
3. Editable desktop and mobile frames: public landing, learner home with one next action, lesson/content viewer, practice and feedback, progress overview — plus loading, empty, restricted-access and error states. Prototype goal → learn → practise → feedback → next action.
4. Components and states for navigation, buttons, cards, progress, content modules, inputs, consent/access messaging and dialogs, annotated for keyboard/focus, reduced motion and screen readers. The studio stays noticeably quieter than marketing pages.
5. Map design names to existing routes/components before coding; record breakpoints and known gaps.
6. Same owner agent for Figma and implementation; update the canonical branch through normal PR/CI.

**Handoff deliverables:** Figma file link; tokens and component library; clickable desktop/mobile prototype; implementation mapping; accessible Netlify preview; before/after screenshots; validation notes for journeys, permissions and privacy.

## Implementation record

See `product-studio/LEARNING_STUDIO_IMPLEMENTATION.md` for the Figma link, token mapping, per-screen route mapping, breakpoints, previews and open gaps.
