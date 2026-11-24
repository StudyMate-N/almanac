# Learning Studio — implementation record

**Direction:** `PRODUCT_VISION_AND_EXPERIENCE.md` (approved 24 Nov 2026, issue #33). **Baseline:** `PRODUCT_SYSTEM.md`, `RECONSTRUCTION_MAP.md`, `docs/experience-standard.md`.
**Branch:** `design/almanac-learning-studio-v1`, stacked on PR #27 (`product/almanac-experience-engine-v1`) with the trunk hotfix merged in.

Figma file: <added by owner>

## Tokens: code ↔ Figma

The palette is **not approved**. Code ships the "Studio Violet" values, which match today's site. The Figma file also holds two exploration modes, "Soft Paper" and "Almanac Kit", under the same variable names. Adopting one after review means changing values in `src/app/globals.css`; nothing has to be rebuilt. Each Figma variable's WEB code syntax points at the code name below.

| Figma variable | Code (`@theme` in `globals.css`) | Studio Violet |
|---|---|---|
| `color/bg/canvas` | `--color-canvas` | `#ffffff` |
| `color/bg/studio` | `--color-studio` | `#f7f6fb` |
| `color/bg/surface` | `--color-surface` (existing) | `#ffffff` |
| `color/bg/subtle` | `--color-mist` (existing) | `#f6f4fb` |
| `color/primary` | `--color-primary` | `#5b3df5` |
| `color/primary/hover` | `--color-primary-hover` | `#4b2fe0` |
| `color/primary/deep` | `--color-primary-deep` | `#2a1b78` |
| `color/primary/tint` | `--color-primary-tint` | `#ece7ff` |
| `color/text/default` | `--color-text` | `#1b1530` |
| `color/text/body` | `--color-text-body` | `#3d3654` |
| `color/text/muted` | `--color-text-muted` | `#5e5775` |
| `color/text/on-primary` | `--color-primary-on` | `#ffffff` |
| `color/text/link` | `--color-violet-700` (existing) | `#3e25c9` |
| `color/border/default` | `--color-border` | `#e4dff5` |
| `color/border/strong` | `--color-border-strong` | `#c9bef7` |
| `color/focus` | `--color-focus` | `#5b3df5` |
| `color/success` · `color/success/tint` | `--color-success` · `--color-success-tint` | `#1e7a4f` · `#dff5ea` |
| `color/time` · `color/time/tint` | `--color-time` · `--color-time-tint` | `#a8430a` · `#ffe9dc` |
| `color/danger` · `color/danger/tint` | `--color-danger` · `--color-danger-tint` | `#a3173a` · `#fdebef` |
| `color/accent` | `--color-tangerine` (existing) | `#f2711c` |
| `color/highlight` | `--color-highlight` | `#ece7ff` |
| `space/1` … `space/20` | Tailwind spacing (4px scale: `1` = 4px … `20` = 80px) | 4–80px |
| `radius/sm` | `--radius-control` | 10px |
| `radius/md` | `--radius-panel` | 14px |
| `radius/lg` | `--radius-section` | 20px |
| `radius/full` | `--radius-full` | 999px |
| `motion/duration/exit` | `--duration-exit` | 120ms |
| `motion/duration/enter` | `--duration-enter` | 220ms |
| `motion/duration/slow` | `--duration-panel` | 300ms |
| (easing) | `--ease-calm` | `cubic-bezier(0.2,0.8,0.2,1)` |

The radius tokens are named by role (`control`, `panel`, `section`). Overriding `--radius-sm/md/lg` would have changed Tailwind's `rounded-sm/md/lg`, which the code already uses in 10 places. Literal tokens such as `--color-violet` stay so that existing screens keep working.

**Text styles:** Studio/Display/XL, Display/L, Heading/M, Heading/S, Body/L, Body/M, Body/S, Label/M, Eyebrow. In code they are Tailwind type sizes on `font-display` (Outfit) and `font-sans` (Plus Jakarta Sans); no text-style tokens yet.

**Components (Figma) → code:**

| Figma component | Code |
|---|---|
| Button | Inline Tailwind (`bg-primary` pill, `min-h-[44px]`/`48px`); `.alm-action`, `.alm-desk-btn` |
| Status chip | `readinessTone` chips (`src/lib/progress.ts`) |
| Nav item | `src/components/app-nav.tsx` |
| Progress bar | Progress overview rows; `FocusProgress` (`src/components/focus-bar.tsx`) |
| Checklist row | Today's plan rows (`src/components/today-session.tsx`) |
| Answer option | `QuestionCard` (`src/components/player/question.tsx`); runner options (`src/components/runner.tsx`) |
| Feedback panel | The same two files: tinted 20px panel, `aria-live="polite"` |
| Notice | Paused-orders banner (`site/chrome.tsx`); preview/offline notices (`workspace-shell.tsx`) |
| Text field | Sign-in fields (`src/components/gate.tsx`) |
| Dialog | Outline drawer (lesson); runner submit confirm |
| Next step panel | `TodaySession` (`src/components/today-session.tsx`) |

## Screens: Figma frame → route → files

| Figma frame | Route | Files | Status in this branch |
|---|---|---|---|
| Public landing | `/` | `src/app/page.tsx`, `src/components/site/chrome.tsx`, `src/app/almanac-public.css` | **Changed.** The 6-tile grid and 4-card steps are replaced by one numbered session sequence and a labelled illustrative preview |
| Learner home: one next action | `/app` | `src/app/app/(shell)/page.tsx`, `src/components/today-session.tsx` | **Changed.** One Next step panel, a quiet checklist, a one-line progress summary and a "More ways to study" disclosure |
| Lesson / content viewer | `/app/learn/[lessonId]` | `src/app/app/(focus)/learn/[lessonId]/page.tsx`, `src/components/player/*`, `src/components/focus-bar.tsx` | **Changed.** Reading column narrowed to 680px. Next is the one primary pill button and Back is a quiet text link. No decorative motion. Gating, progress saving and view transitions are unchanged |
| Practice and feedback | `/app/practice/[setId]`, in-lesson quiz and learning checks | `src/components/player/question.tsx`, `src/components/player/quiz.tsx`, `src/components/runner.tsx` | **Changed.** Answer options use a 14px radius and a 2px state border: primary when selected, success + ✓ + "Correct", danger + ✕ + "Your answer". The feedback panel is a tinted 20px panel titled "Correct — here's why" or "Not quite — here's the reasoning", announced politely, with one next step inside it (in-lesson quiz) or as the one primary button (runner). Keyboard, roles and data writes are unchanged |
| Progress overview | `/app/progress` | `src/app/app/(shell)/progress/page.tsx` | **Changed.** A plan line, then one row per section (label, % text, 6px bar, status chip), then one "What to revisit" card with one primary action. Simulation history sits behind a disclosure; an empty state was added |
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

- **Changed:** the semantic tokens; the learner home hierarchy; the landing page middle sections; the sprint pulse; the lesson reading column and forward action; answer and feedback states (in-lesson quiz, learning checks, practice runner); the progress overview. The 700 ms decorative fill on `.alm-desk-progress` bars is removed (over the 400 ms motion limit).
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

Routes: landing, courses, home, compass, progress, lesson, sign-in, in-lesson quiz (`practice`), quiz after checking an answer (`practice-feedback`) and practice runner after checking (`runner-feedback`), each at 1440 and 390 wide.

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

- **Palette:** "Soft Paper" and "Almanac Kit" exist only in Figma until the palette is reviewed.
- **Progress page:** the "Questions answered / Correct last time / Pages done / Cards reviewed" tiles were removed as decorative numbers. The figures behind them are still in the data and can come back as plain text if the review asks for them.
- **Lesson quiz:** while a quiz is in progress, the page-end "Next topic" button sits below the in-panel "Next question" button. It could be demoted to secondary until the quiz is finished.
- **Practice end screen:** the score tile (`ScoreTile` in `quiz.tsx`) and the runner results screen keep their current styling; they are next to restyle.
- **Copy:** the custom-request panel still says "see your price". That copy predates this work; it sits next to the paused-orders note and should be reworded with the commercial decision (04 — Commercial Model), not in a visual pass.
- **"This week" readiness** can name a different section from the Next step panel. The plan's week mapping looks ahead one week, and the logic is unchanged here.
- **Readiness bar colours** (`readinessTone`) still use literal values; they should move to the semantic tokens once the palette is chosen.
