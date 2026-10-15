# Experience standard: smooth and seamless

Almanac is used in short, tired sessions after a shift. Every bit of friction costs attention the student needs for the material. These two words are defined as rules we can test, not as a feeling.

## Smooth: how each moment feels

Smooth is about a single interaction: a tap, a flip, a page change.

| # | Rule | Target | How we check |
| --- | --- | --- | --- |
| S1 | **Instant response.** Every tap or key shows a change within one frame. Nothing the student does waits on the network. | Visible feedback in under 100 ms; saves happen in the background. | Grade, flip and navigate with network delayed to 600 ms; the UI must not wait. |
| S2 | **Calm motion.** Things move only to explain a change. Exits are quicker than entrances, and only one thing moves at a time. | 120–300 ms, ease-out. Nothing over 400 ms. Transform and opacity only, except the card opening (shrink and expand), which animates its own height once. | Review the CSS durations; a frame trace has no long frames. |
| S3 | **Stable layout.** Nothing jumps when data arrives, and buttons don't move between states. | Cumulative layout shift under 0.05 per page. | A PerformanceObserver records layout shift on every app route. |
| S4 | **Reduced motion is respected.** With the system setting on, nothing slides or fades; changes are instant. | No animation under `prefers-reduced-motion`. | Emulate reduced motion and confirm no animations run. |

## Seamless: how the journey holds together

Seamless is about the joins between moments: between screens, between sessions, between devices.

| # | Rule | Target | How we check |
| --- | --- | --- | --- |
| C1 | **No waiting screens after the first sign-in.** The device shows what it already knows, then syncs quietly. | Content on screen in under 100 ms on return visits; no "Loading…" screen. | Reload each app route with the API delayed; the first frame is content. |
| C2 | **Continuity between screens.** The sidebar, tab bar and topic header stay still while the content changes: the old page fades out (120 ms) and the new one rises in (220 ms). Previous and next topic slide in the direction of travel. | Every in-app navigation animates (unless motion is reduced). | Click through the tabs and the previous/next topic links. |
| C3 | **Nothing is lost.** Progress is saved after every action, and stopping at any point keeps it. | Reload mid-session and progress is still there. | Grade cards, reload, and check the deck. |
| C4 | **No dead ends.** Every finished screen offers the next step. | Finished review, pause and done screens each have a forward action. | Walk the review flow to the end. |
| C5 | **One way of doing things.** The same control sits in the same place and the same keys work everywhere. Cards behave the same in review and on summary pages. | Space shows, Space continues; the question stays visible when the answer opens. | Use the review screen and the summary-page cards with the keyboard. |
| C6 | **Stopping is safe.** Natural stopping points come every few minutes, and undo is always available. | A pause every 10 cards; undo on every grade. | Walk the review flow. |

## Where the rules apply

- **Flashcards:** S1–S4, C3–C6 (the review screen and the summary-page card viewer).
- **Every app route:** S3, C1, C2.
- **New screens** are built to this standard. A change that breaks a rule needs a reason written in the PR.

## How the app meets it (October 2026)

| Rule | Implementation | Measured |
| --- | --- | --- |
| S1 | Grades, flips and page progress update locally; saves sync in the background. | No interaction waits on the API. |
| S2 | Card entrance 220 ms; page fade 120 ms out / 220 ms in; topic slide 160 / 260 ms (`globals.css`). | — |
| S3 | Fixed-height card and one action dock in review; content rendered from cache. | Layout shift 0–0.02 on every app route. |
| S4 | `motion-safe:` utilities; a reduced-motion block turns off view-transition animations. | 0 running animations with reduced motion. |
| C1 | `store.tsx` renders the cached copy and cached approvals at once, then syncs. A first-ever visit shows an app-shaped placeholder that fades in only after 200 ms. | Return visits: content in 110–160 ms, no loading screen (was 370–600 ms). |
| C2 | `PageTransition` (React `ViewTransition`) in both app layouts; previous/next topic links carry `nav-back` / `nav-forward`. | One view transition per navigation. |
| C3 | The deck is saved after every grade. | — |
| C4–C6 | Rounds of 10 with a pause screen; finish screen links back to Today; undo on every grade; Space shows and Space again grades Good, with a 300 ms guard and held keys ignored. | Pause after 10 cards; a held Space never grades. |
