# Almanac

Short courses that stick: video lessons, questions with a rationale for every option, and flashcards scheduled with FSRS. First course: Advanced Pathophysiology for graduate nursing students.

This is the **preview build**. It has the full Bright Bento interface and a working study loop, but no backend yet:

- Progress figures on Today and Progress are sample data (`src/content/patho.ts`, `sampleProgress`).
- Practice answers live only in the page session.
- Flashcard scheduling is real (ts-fsrs) and saved in the visitor's browser (`localStorage`), so each visitor has their own deck.
- The early-access form confirms on screen but does not store emails.
- All questions and cards are drafts. They must be checked against the course text and signed off by a credentialed nurse before going live.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Sales page |
| `/app` | Today |
| `/app/courses` | My courses and course outline |
| `/app/learn/[lessonId]` | Lesson player (`m3-l3` has a summary) |
| `/app/practice/[setId]` | Practice questions in tutor mode (`type-1-hypersensitivity`, `cellular-adaptation`) |
| `/app/review` | Flashcard review |
| `/app/progress` | Progress |

## Stack

- Next.js (App Router) and TypeScript, deployed on Vercel
- Tailwind CSS v4; every colour, font and radius is a token in `src/app/globals.css`
- Outfit and Plus Jakarta Sans via Fontsource (self-hosted, no Google Fonts request)
- ts-fsrs for spaced repetition (`src/lib/deck.ts`)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Next steps

1. Connect Supabase: Magic Link sign-in, content tables (questions, flashcards, lessons), answers, and per-student FSRS card states, with row-level security.
2. Move content from `src/content/patho.ts` into the content repo and import script.
3. Video hosting (Bunny Stream) for the lesson player.
4. Email capture for early access, then Paystack checkout.
