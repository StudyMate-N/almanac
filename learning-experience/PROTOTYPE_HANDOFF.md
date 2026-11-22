# Multimodal prototype handoff — 22 November 2026

**Status:** Two functional low-fidelity prototypes produced and verified as files in the requesting conversation; not deployed, owner-approved or clinically released. The files are downloadable as `Almanac_Multimodal_Starter_Pilots.zip` in the conversation. A sandbox conversation path is not a durable GitHub asset URL.

## 1. PowerPoint branching story
- Exact filename: `Almanac_Branching_Story_Pilot.pptx`; 8 slides, widescreen, original topic 'The Explain Test' / decision after a correct answer without an explanation.
- Slide 2 offers A/B/C clickable choices, directing to consequence slides 3/4/5; each branches back to debrief slide 6. Further links go to a transfer task and closing. The ZIP contains a playable editable presentation.
- Validated: converted to 8-page PDF for internal slide render inspection; slide 2 displayed correctly; slide 2 PowerPoint relationship XML contained internal links to slides 3, 4 and 5.
- Limitations: live PowerPoint interactivity depends on viewer's hyperlink support; exported static PDF does not provide equivalent branching in all viewers. Accessibility and instructional effectiveness require further testing.

## 2. Web learning response lab
- Exact filename: `Almanac_Learning_Response_Lab.html`; self-contained offline, no server, sign-in or network requests.
- Contains a three-choice story with explanations and a four-action classify/feedback microgame. Uses only original general study-method examples, not real assessment items, medical content or personal learner data.
- Distinguish from a deployed app feature; no actual user testing yet. Need cross-browser, keyboard/screen reader and mobile QA before broader use.
- Separate repository-resident draft code proof is at `learning-experience/prototypes/learning-response-lab.html`; the downloadable conversation file is a separately packaged local adaptation of that concept, not a byte-for-byte exported GitHub snapshot.

## 3. Pilot acceptance test
- A learner independently chooses a next review action after a new missed or guessed question and gives a reason.
- Story/game responses explain decisions and do not assert every reread is useless or every correct answer is a guess.
- The story and game do not claim adaptive AI, test-bank access, medical advice or proven retention gains.
- For a potential product implementation: content approval, version hash, source/rights review, accessibility and secure progress events required.

## Scope note
The repository pull request is a **design and prototype branch**; production app code has not been changed. Paid offers, current checkout and public Facebook publishing remain unchanged.
