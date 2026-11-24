# Learning Studio — implementation record

**Direction:** `PRODUCT_VISION_AND_EXPERIENCE.md` (approved 24 Nov 2026, issue #33). **Baseline:** `PRODUCT_SYSTEM.md`, `RECONSTRUCTION_MAP.md`, `docs/experience-standard.md`.
**Branch:** `design/almanac-learning-studio-v1`, stacked on PR #27 (`product/almanac-experience-engine-v1`) with the trunk hotfix merged in.

Figma file: <added by owner>

## Tokens: code ↔ Figma

The palette is **not approved**. Code ships the "Studio Violet" values, which match today's site. The Figma file also holds two exploration modes, "Soft Paper" and "Almanac Kit", under the same variable names. Adopting one after review means changing values in `src/app/globals.css`; nothing has to be rebuilt.

Figma variable names other than the four marked *(existing)* are proposed here; the owner confirms them against the file.

| Code (`@theme` in `globals.css`) | Figma variable | Studio Violet |
|---|---|---|
| `--color-primary` | `color/primary` | `#5b3df5` |
| `--color-primary-hover` | `color/primary/hover` | `#4b2fe0` |
| `--color-primary-deep` | `color/primary/deep` | `#2a1b78` |
| `--color-primary-tint` | `color/primary/tint` | `#ece7ff` |
| `--color-primary-on` | `color/primary/on` | `#ffffff` |
| `--color-canvas` | `color/bg/canvas` | `#ffffff` |
| `--color-studio` | `color/bg/studio` | `#f7f6fb` |
| `--color-surface` (existing) | `color/bg/surface` | `#ffffff` |
| `--color-mist` (existing) | `color/bg/subtle` | `#f6f4fb` |
| `--color-border` | `color/border` | `#e4dff5` |
| `--color-border-strong` | `color/border/strong` | `#c9bef7` |
| `--color-text` | `color/text` | `#1b1530` |
| `--color-text-body` | `color/text/body` | `#3d3654` |
| `--color-text-muted` | `color/text/muted` | `#5e5775` |
| `--color-violet-700` (existing) | `color/text/link` | `#3e25c9` |
| `--color-focus` | `color/focus` | `#5b3df5` |
| `--color-highlight` | `color/highlight` | `#ece7ff` |
| `--color-tangerine` (existing) | `color/accent` | `#f2711c` |
| `--color-success` / `-tint` | `color/success` / `color/success/tint` | `#1e7a4f` / `#dff5ea` |
| `--color-time` / `-tint` | `color/time` / `color/time/tint` | `#a8430a` / `#ffe9dc` |
| `--color-danger` / `-tint` | `color/danger` / `color/danger/tint` | `#a3173a` / `#fdebef` |
| `--radius-control` | `radius/sm` | 10px |
| `--radius-panel` | `radius/md` | 14px |
| `--radius-section` | `radius/lg` | 20px |
| `--radius-full` | `radius/full` | 999px |
| `--ease-calm` | `motion/ease` | `cubic-bezier(0.2,0.8,0.2,1)` |
| `--duration-exit` / `-enter` / `-panel` | `motion/exit` / `enter` / `panel` | 120 / 220 / 300 ms |

The radius tokens are named by role (`control`, `panel`, `section`). Overriding `--radius-sm/md/lg` would have changed Tailwind's `rounded-sm/md/lg`, which the code already uses in 10 places. Literal tokens such as `--color-violet` stay so that existing screens keep working.

## Screens: Figma frame → route → files

| Figma frame | Route | Files | Status in this branch |
|---|---|---|---|
| Public landing | `/` | `src/app/page.tsx`, `src/components/site/chrome.tsx`, `src/app/almanac-public.css` | **Changed.** The 6-tile grid and 4-card steps are replaced by one numbered session sequence and a labelled illustrative preview |
| Learner home: one next action | `/app` | `src/app/app/(shell)/page.tsx`, `src/components/today-session.tsx` | **Changed.** One Next step panel, a quiet checklist, a one-line progress summary and a "More ways to study" disclosure |
| Lesson / content viewer | `/app/learn/[lessonId]` | `src/app/app/(focus)/learn/[lessonId]/page.tsx`, `src/components/player/*`, `src/components/focus-bar.tsx` | Unchanged; next increment |
| Practice and feedback | `/app/practice/[setId]`, in-lesson quiz | `src/app/app/(focus)/practice/[setId]/page.tsx`, `src/components/runner.tsx`, `src/components/player/quiz.tsx` | Unchanged; next increment |
| Progress overview | `/app/progress` | `src/app/app/(shell)/progress/page.tsx` | Unchanged; next increment |
| Guided study (pilot) | `/app/learning-compass` | `src/components/guided-learning-entry.tsx`, `src/lib/learning-guide.ts` | Unchanged; now reached from "More ways to study" |
| States: loading, empty, restricted, error | `/app` and every app route | `src/components/gate.tsx` (loading, sign-in); `today-session.tsx` (new "No lessons are open yet" state); home "Your courses appear here" | Loading and sign-in unchanged. The restricted state is now explicit instead of a blank |
| Quiet mode | `/app/midterm/nur635` | `src/components/study-sprint.tsx` | **Changed.** The looping play-button pulse is removed |

## Breakpoints

| Frame width | Tailwind | Layout |
|---|---|---|
| 390 (mobile) | base, below `sm` 640 | One column, bottom tab bar, the next step first, then the disclosure, then This week |
| 768 (tablet) | `md` 768 | Public pages switch to two columns. The studio stays one column |
| 1280 / 1440 (desktop) | `lg` 1024 and up | Studio sidebar (232px), the next step column plus a 320px This-week rail |

## What changed and what didn't

- **Changed:** the semantic tokens; the learner home hierarchy; the landing page middle sections; the sprint pulse.
- **Logic unchanged:**
  - entitlement filtering (`useCourse`, `authorizedCourses`);
  - reviewer approvals (`isVisible`);
  - progress, FSRS and answer saving (`store.tsx`);
  - today's read/answer/review selection rules. These were moved verbatim into `useTodaySession`.
- **Out of scope and untouched:**
  - checkout, `/request`, invoice and payment flows;
  - Supabase functions;
  - sign-in and the gate;
  - PostHog and analytics (still off);
  - contact isolation.

## Evidence

Screenshots use a fictional learner. All Supabase RPCs are answered locally by `shoot.py`, so no real record, token or production write is involved.

- Before: `/home/claude/qa/before/*.jpg` (baseline build of the branch head before these commits)
- After: `/home/claude/qa/after/*.jpg`

Routes: landing, courses, home, compass, progress, lesson, sign-in, each at 1440 and 390 wide.

Checks run on this branch, all passing:
- `npm run typecheck`
- `npm run build`
- `check-almanac-contact-isolation`
- `check-learning-guide`
- `check-product-system`
- `check-learning-offers`
- `check-request-origin`
- `check-payment-confirmation`
- `check-private-endpoints` (read-only 403 probes)

## Known gaps

- **Not built in code yet:** the lesson viewer, practice/feedback and progress screens. They are designed in Figma and come next as separate PRs against the same tokens.
- **Palette:** "Soft Paper" and "Almanac Kit" exist only in Figma until the palette is reviewed.
- **Copy:** the custom-request panel still says "see your price". That copy predates this work; it sits next to the paused-orders note and should be reworded with the commercial decision (04 — Commercial Model), not in a visual pass.
- **"This week" readiness** can name a different section from the Next step panel. The plan's week mapping looks ahead one week, and the logic is unchanged here.
