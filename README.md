# Almanac

Short courses that stick: topic pages with a predict-first question and learning checks, questions with a rationale for every option, and flashcards scheduled with FSRS. First course: Advanced Pathophysiology for graduate nursing students.

## How it works

- **Students** sign in with a pilot code. Their plan, notes, card states, page progress and every answer live in Supabase (all access goes through security-definer RPC functions, `src/lib/api.ts`). A copy is cached on the device, so the app works offline and syncs when the connection returns (`src/lib/store.tsx`).
- **Content** is written in TypeScript under `src/content/patho/` (one file per section: `s1.ts` to `s7.ts`, plus `start.ts` and `final.ts`). `author.ts` → `build()` turns sections into pages, questions and cards, and runs the course-standard checks in `lint()`.
- **Review.** A student sees a page, question, card or image only once the nurse reviewer has approved that exact version. Approvals store a hash of the item (`src/lib/hash.ts`), so any edit sends it back for review. Reviewers and coaches work in `/coach`, the content review queue. Signed in there, the student app shows everything in preview.
- **Images** live in `public/images/patho/{id}.png`. `scripts/image-sizes.mjs` records each file's byte length before `dev`, `build` and `typecheck`, so a replaced file needs approval again.
- **Video** clips are served from `NEXT_PUBLIC_MEDIA_BASE` (mp4, jpg poster and vtt captions per clip id). Without it, video blocks show an "in production" card and topic pages render read-led.

## Course standard v1

Every section is: an opener, 3–6 topic pages, lesson quizzes, one summary (with "Commonly confused" and "Key values") and a 10-item test. Each topic page has one essential question, 3–5 key points, at least one predict, 1–2 learning checks, one explain prompt, one textbook reading and at most 600 words of prose. `lint()` throws for a topic page that breaks these rules. A topic page whose video block has `stops` renders video-led.

Keep question and card ids stable when editing: student answers and FSRS states are keyed by them. Mark new items with `// REVIEW: new`.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Sales page |
| `/courses/[courseId]` | Course sales pages |
| `/app` | Today: today's session, cards due, readiness |
| `/app/courses`, `/app/courses/[courseId]` | My courses and the course outline |
| `/app/learn/[pageId]` | Course player (e.g. `s5-tp3`) |
| `/app/practice` | Practice presets and the set builder |
| `/app/practice/[setId]` | A page's questions, `missed`, `flagged`, `weak` (`?n`, `?topic`) or `custom` |
| `/app/exam/[kind]` | Starting check, midterm and final simulations |
| `/app/review` | Flashcard review |
| `/app/guide/[moduleId]` | Printable study guide |
| `/app/progress`, `/app/setup` | Progress, and the student's plan |
| `/coach` | Coach inbox, reports and content review |

## Stack

- Next.js 16 (App Router) and TypeScript, deployed on Vercel. Read `AGENTS.md` first: this Next.js version has breaking changes.
- Supabase (Postgres + RPC functions) for students, answers, state and approvals
- Tailwind CSS v4; every colour, font and radius is a token in `src/app/globals.css`
- Outfit and Plus Jakarta Sans via Fontsource (self-hosted)
- ts-fsrs for spaced repetition (`src/lib/deck.ts`)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run typecheck` and `npm run build` before every commit.
