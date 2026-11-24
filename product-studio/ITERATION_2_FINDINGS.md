# Learning Studio — iteration 2 (24 Nov 2026)

**Inputs:**
- The owner's PostHog references: product page, pricing, sign-up/authorize flow, welcome email.
- Quizlet's study activities, plus a 10-card sample set built from Section 1 cards through the Quizlet connector.
- The current output types of Gemini Notebook (formerly NotebookLM), which the owner has chosen as Almanac's production house.

**Applies to:** issue #33 and `PRODUCT_VISION_AND_EXPERIENCE.md`. This is not a rebrand: Almanac keeps its own identity and borrows *how* these products communicate, not their look.

## What we take from PostHog

| Pattern | What it does there | Almanac version |
|---|---|---|
| Real product first | Product pages open on an actual screenshot, not stock art | Hero shows the real Next step panel, the thing a learner gets |
| Plain headline + a quoted request | The headline names the product; the subhead is a request in the user's own words | "Know what to study next." + a learner's question in quotes, answered by the product shot |
| Two CTAs + a quiet link row | Primary and secondary buttons, then small links (demo, docs, a human) | Browse courses · See a sample lesson, then *How lessons are made · Email a person* |
| "What does it do?" | One plain paragraph before any features | One paragraph: reviewed lessons in several formats, one next step at a time |
| "Who is it for?" | Roles mapped to concrete jobs | Learner situations mapped to what Almanac does for them |
| Every section ends in a next step | Each block ends in a CTA, a link or a clickable prompt | Each section ends in one action; no dead ends (C4) |
| Candid money copy | "Free" stated as a fact, near every CTA | State what is true now: orders paused; existing learners keep access. No prices until the commercial decision |
| Single-card flows | Sign-up and authorize are one card, one button, explicit choices | Sign-in, restricted access and consent stay one card, one primary action |
| "Questions?" paths | Numbered routes, from self-serve to a human | Help centre → product update → email a person |

**Not taken:** PostHog's mascot, colours, jokes or "Install with AI". Almanac's tone stays editorial and calm. Analytics stays off unless separately approved (PostHog consent is its own gate).

## What we take from Quizlet

- **One set, many ways to study.** The same cards power Flashcards, Learn, Test and Match. Almanac: one reviewed topic, studied as Read · Watch · Listen · Practise · Remember · Rehearse.
- **The modes sit at the top of the content.** Almanac adds a "Study this topic as" bar on the topic page and on the home Next step panel. One format is primary; the others are quiet alternatives.
- **Not taken:** games, streak pressure, "95% improved grades" claims and paywalled modes. Progress stays evidence, not decoration.

## Production house: Gemini Notebook

Gemini Notebook's Studio outputs map onto Almanac formats like this:

| Studio output | Almanac format | Status today (Advanced Pathophysiology) |
|---|---|---|
| Reports / study guide | **Read**: reviewed lesson | Available |
| Video Overview (incl. Cinematic) | **Watch**: video overview | Available where a lesson has a reviewed clip |
| Audio Overview | **Listen**: audio overview | In production |
| Mind map / infographic | **See**: concept map | Planned |
| Quiz | **Practise**: questions with rationales | Available |
| Flashcards | **Remember**: spaced-repetition cards | Available |
| (assembled in Almanac) | **Rehearse**: exam simulation | Available |

Code works out availability from real, approved, entitled content. A format is never shown as available because a plan says so.

**Pipeline, unchanged in principle:**
1. Sources (course material plus an authoritative textbook).
2. Gemini Notebook draft.
3. Fact-check against the sources; anything uncovered is tagged `⚠ verify`.
4. Branded in Figma.
5. Reviewer approval (the existing `approved_items` hash gate).
6. Published.

No leaked or recalled exam banks are used.

**Owner checks before launch:**
- Confirm Google's terms allow commercial distribution of Gemini Notebook outputs, Audio/Video Overview voices included.
- Decide whether the site says lessons are "drafted with AI tools and checked by a reviewer". Recommended: yes; it is honest and builds trust.

## Iteration-2 deliverables

1. **Homepage v2:**
   - Product-first hero with a quoted learner question.
   - "What does it do?"
   - "One topic, every way to study" (formats + honest status).
   - "Who is it for?"
   - "How lessons are made".
   - Course discovery.
   - "Questions?"
   - A closing next step.
2. **Study format system:** a format catalogue plus per-course and per-topic availability (`src/lib/study-formats.ts`). Figma components: Study format card (Format × Status) and Format switcher.
3. **Learner home v2:** the Next step panel offers the same topic in its other available formats as quiet chips under one primary action.
4. **Course page:** a format strip with honest status.

Out of scope (separate gates): prices and checkout, analytics, audio hosting, and publishing any Gemini Notebook output before it is reviewed.
