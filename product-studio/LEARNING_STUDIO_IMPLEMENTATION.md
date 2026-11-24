# Learning Studio — implementation record

**Direction:** `PRODUCT_VISION_AND_EXPERIENCE.md` (approved 24 Nov 2026, issue #33). **Baseline:** `PRODUCT_SYSTEM.md`, `RECONSTRUCTION_MAP.md`, `docs/experience-standard.md`.
**Branch:** `design/almanac-learning-studio-v1`, stacked on PR #27 (`product/almanac-experience-engine-v1`) with the trunk hotfix merged in.

Figma file: https://www.figma.com/design/UN9TIpyezhf4paSLFglqLX — pages **Studio · Read me**, **Studio · Foundations**, **Studio · Components**, **Studio · Screens** (prototype flows "Desktop · Learner journey" and "Mobile · Learner journey"). The existing "Video frames" page is unrelated video work.

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
- **Lesson quiz:** resolved — the page-end link stays quiet (secondary) until the page's quiz or test is done, then becomes the primary action.
- **Practice end screen:** the score tile (`ScoreTile` in `quiz.tsx`) and the runner results screen keep their current styling; they are next to restyle.
- **Copy:** resolved on the homepage — iteration 2 removed the custom-request panel that said "see your price". Any pricing copy elsewhere waits for the commercial decision (04 — Commercial Model).
- **"This week" readiness** can name a different section from the Next step panel. The plan's week mapping looks ahead one week, and the logic is unchanged here.
- **Readiness colours:** now on semantic tokens (`bg-primary`, `bg-success`, `bg-tangerine`, `-tint`/`text-` pairs) with identical values; the "Not started" bar keeps its literal `#D9D2F3`, which has no token.

## Iteration 2 — study formats and homepage v2 (24 Nov 2026)

Spec: `product-studio/ITERATION_2_FINDINGS.md`. Figma page: **Studio · Iteration 2**.

### What changed

| Area | Change | Files |
|---|---|---|
| Format model | Seven study formats (Read, Watch, Listen, See, Practise, Remember, Rehearse). Status (`available`, `in_production`, `planned`) comes only from real content: Watch needs a playable clip **and** a media store (`NEXT_PUBLIC_MEDIA_BASE`). Listen needs published audio (none yet, so *In production*). See stays *Planned*. Nothing counts across courses. | `src/lib/study-formats.ts`, `src/lib/format-data.ts` |
| Guardrail | Node test, run in both CI workflows: Listen is never available without audio, Watch is never available without a media store or an existing clip, empty or other-course content gives nothing available, and alternatives never repeat the primary. | `scripts/check-study-formats.mjs`, `.github/workflows/product-studio.yml`, `.github/workflows/learning-orders.yml` |
| Homepage v2 | The page runs in this order. Nothing on it states prices, stats, testimonials or an affiliation. | `src/app/page.tsx` |
| | Product-first hero: plain h1, a learner's own question in quotes, and the real Next step panel answering it. The panel uses a real topic, 1.1 Fluids and electrolytes, with real counts, and is labelled *Illustrative*. | |
| | CTAs: Browse courses / See what's in a course. Quiet links: How lessons are made · Product update · Email a person. | |
| | "What does it do?" | |
| | "One topic, every way to study", using the format grid with honest status. | |
| | "Who is it for?" | |
| | A compact study-session sequence. | |
| | "How lessons are made": Sources → Draft with AI tools → Check against the textbook → Publish. | |
| | Courses, then "Questions?" (3 paths), then the closing next step. | |
| Course page | A "Ways to study this course" format strip directly under the hero (`#formats`). | `src/components/site/patho-page.tsx` |
| Learner home | Under the single primary button: "Or study it another way:" chips for the same next topic's other available formats, e.g. "5 questions · Section 1" or "34 cards · Section 1". Chips come from entitlement- and approval-filtered content and never repeat the primary's format or link. The row is hidden when there are none. | `src/components/today-session.tsx` |
| Shared UI | `FormatIcon` (one glyph per format), `FormatStatusChip` (always a word, never colour alone), `FormatGrid`. Mobile cards put the icon on the left, so seven formats stay scannable. | `src/components/study-formats-view.tsx` |

### Figma ↔ code (Studio · Iteration 2)

| Figma | Code |
|---|---|
| Study format card (Format × Status) | `FormatGrid` item + `FormatStatusChip` |
| Format switcher / "Or study it another way" chips | `alternativeFormats()` + chips in `TodaySession` |
| Homepage v2, desktop 1440 / mobile 390 | `/`, `src/app/page.tsx` |
| Course page with formats | `/courses/advanced-pathophysiology#formats` |
| Learner home v2 | `/app`, `src/components/today-session.tsx` |

### Evidence

Screenshots are in `/home/claude/qa/iter2/*.jpg`: landing, course, home and the rest of the existing set, at 1440 and 390, with a fictional learner and mocked RPCs.

Checks: `typecheck`, `build`, `check-study-formats` (7 tests), `check-almanac-contact-isolation`, `check-learning-guide`, `check-product-system`, `check-learning-offers`, `check-request-origin`, `check-payment-confirmation`.

### Known gaps (iteration 2)

- **Sample lesson:** there is no public sample lesson yet. Showing unreviewed lesson text publicly would bypass the reviewer gate, so the hero's secondary CTA is "See what's in a course" (course page), not "See a sample lesson".
- **Watch:** shows *In production* wherever `NEXT_PUBLIC_MEDIA_BASE` is empty, including local builds. Previews and production show *Available* only if that variable is set and the clip exists.
- **Listen / See:** stay *In production* / *Planned* until reviewed Gemini Notebook audio and concept maps are published. The counts arrive via `formatOptions.audioAssets` / `conceptMaps`, which are 0 today.
- **Topic-level cards and questions** are section-scoped, because the content keeps cards on section summary pages. The chips say so ("· Section 1").
- **Owner decision:** keep or reword the public line "drafted with AI tools from those sources only" (recommended in the findings), and confirm Google's terms for commercial use of Gemini Notebook outputs.

## Iteration 3: fine-tune (24 Nov 2026)

Spec: `product-studio/ITERATION_3_FINETUNE.md`. Figma page: **Studio · Iteration 3**.

### What changed

| Area | Change | Files |
|---|---|---|
| Tokens | One pastel tile per study format (`--color-format-read`, `-watch`, `-listen`, `-see`, `-practise`, `-remember`, `-rehearse`). A lime `--color-fresh` that only marks *now*, always behind dark text. An `.alm-em` emphasis utility (bold, primary-deep, at most 1–2 phrases a sentence). Contrast on every tint: primary-deep ≥ 11:1, text-muted ≥ 5.4:1. | `src/app/globals.css` |
| Format tiles | `FormatTile` and `FORMAT_TINT`: the format icon sits on its own tint, in primary-deep; cards stay white. Used in the format grid, the home chips and the homepage illustration. | `src/components/study-formats-view.tsx`, `src/components/today-session.tsx`, `src/app/page.tsx` |
| Homepage v3 | Hero lead emphasises "one reviewed next step" and "a reason". | `src/app/page.tsx` |
| | The illustrative Next step sits on a static paper stack (two offset sheets and a clip; decorative and `aria-hidden`). | |
| | Three outlined fact chips. | |
| | "How lessons are made" as pinned step cards: format tints, a coloured pin and a dashed path on desktop. | |
| | New **"Why you can trust what you study"** (`#trust`) with five real items: textbook review (`BOOK` constant), independence, a person answers, public outline, terms before payment. | |
| | Closing contact bar: email · Help · Terms · Privacy. | |
| | "Questions?" is folded into trust item 3, the hero link row and the contact bar, so the same three paths don't repeat. | |
| Testimonials gate | `TestimonialsSlot` renders nothing unless it gets quotes with a recorded consent date. None are passed. | `src/components/site/testimonials-slot.tsx` |
| Topic page | **"Study this topic as"** under the title. Read (this page, `aria-current`) plus Watch, Questions and Cards only when this learner can open them: `topicFormats` over `useCourse`'s entitled, approved content. | `src/components/player/study-as-tabs.tsx`, `src/app/app/(focus)/learn/[lessonId]/page.tsx` |
| | Watch scrolls to the topic's video. Questions and Cards open the section's existing practice and cards pages. | |
| | Hidden when Read would be alone. Counts are hidden below `sm`. | |
| Course page | "What's inside" (`#inside`) is now a section list in lesson-list style: tinted number tile, title, pages · videos · questions · cards and an estimated time. | `src/lib/format-data.ts` (`publicSectionsInside`), `src/components/site/patho-page.tsx` |
| | Videos are counted only with a media store, matching Watch. Time is the app's own per-page estimate, explained under the list. | |
| | The hero's secondary button now reads "See what's inside", because there is no example lesson. | |
| Learner home | Plan checklist: done rows keep the filled check, strikethrough and muted text. The current row gets a lime **Now** pill with a screen-reader label. | `src/components/today-session.tsx` |

### Figma ↔ code (Studio · Iteration 3)

| Figma | Code |
|---|---|
| Format tints `color/format/*`, `color/accent/fresh` | `--color-format-*`, `--color-fresh` |
| Emphasis | `.alm-em` |
| Paper stack | `NextStepShot` wrapper in `src/app/page.tsx` |
| Icon chip | `facts` chips in the homepage hero |
| Pinned step card | "How lessons are made" cards |
| Trust item / Trust section | `#trust` section and `TestimonialsSlot` |
| Lesson row (course list) | `#inside` section list |
| "Study this topic as" | `StudyAsTabs` |
| Plan row, Now marker | `TodaySession` checklist |

### Evidence

Screenshots are in `/home/claude/qa/iter3/*.jpg`, at 1440 and 390, with a fictional learner and mocked RPCs. They include a new `topic` shot (`/app/learn/s1-tp1`).

Checks: `typecheck`, `build`, `check-study-formats` (7 tests), `check-almanac-contact-isolation`, `check-learning-guide`, `check-product-system`, `check-learning-offers`, `check-request-origin`, `check-payment-confirmation`.

### Known gaps (iteration 3)

- **Week strip** (Day/Week toggle, TimeFrame pattern): designed in Figma, not coded. The plan engine has weeks, not day schedules.
- **Media player block** (EduSphere pattern: player, chapters, lesson list with durations) for Watch and Listen: not coded. It waits for published audio and the media store.
- **Cards results screen** ("review the ones you missed"): designed, not coded.
- **Testimonials:** gated on written consent. The slot exists and stays empty.
- **Watch locally:** still shows *In production* where `NEXT_PUBLIC_MEDIA_BASE` is empty, so the topic tabs show no Watch there.
