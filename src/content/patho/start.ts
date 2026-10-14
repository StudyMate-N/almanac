import type { ASection } from "./author";

export const start: ASection = {
  id: "start",
  title: "Start Here",
  num: 0,
  kind: "start",
  blurb: "How the course works, the big-picture videos, and the word parts that unlock medical terms.",
  groups: [
    {
      id: "start-g",
      title: "Start Here",
      pages: [
        {
          id: "welcome",
          title: "How This Course Works",
          kind: "reading",
          blocks: [
            {
              t: "h2",
              text: "Welcome",
            },
            {
              t: "p",
              html: "This course follows the seven competency areas of a pathophysiology course, one section per area. Each section uses the same pattern, so after the first one you always know where you are.",
            },
            {
              t: "table",
              head: ["Part", "What it does", "Scored?"],
              rows: [
                ["Section introduction", "Introduces the patients you will follow and the questions you should be able to answer by the end.", "No"],
                ["Lesson pages", "Short readings built around one idea each, with tables you can come back to.", "No"],
                ["Learning checks", "One question inside a lesson page. You see the answer and the reasoning right away.", "No"],
                ["Lesson quiz", "Five questions per lesson, each with instant feedback.", "Practice"],
                ["Section test", "Ten mixed questions. Rationales appear after you submit the whole test.", "Practice"],
                ["Flashcards", "Values, rules and definitions for quick recall.", "No"],
              ],
            },
            {
              t: "h2",
              text: "A good way through each section",
            },
            {
              t: "ol",
              items: [
                "Read the section introduction and look closely at the two patients.",
                "Work through each lesson page and try the learning checks before you read on.",
                "Take the lesson quiz. Read every rationale, including the ones for questions you got right.",
                "Review the flashcards on the lesson summary page.",
                "Take the section test. Aim for 8 of 10 or better before you move on.",
              ],
            },
            {
              t: "callout",
              title: "About the questions",
              html: "Every question in this course is written for this course to teach the concept. None are copied from any exam. When a rationale explains why a wrong answer is wrong, read it: that is usually where the learning happens.",
            },
          ],
        },
        {
          id: "big-picture",
          title: "The Big Picture: Course Video",
          kind: "video",
          blocks: [
            {
              t: "p",
              html: "The course video is a whiteboard lecture cut into eleven short clips. Each clip sits on the page where its idea is taught, so you meet it at the right moment. Start with these two: they set up the language the whole course uses.",
            },
            {
              t: "video",
              clip: "foundations-02",
            },
            {
              t: "video",
              clip: "foundations-03",
            },
            {
              t: "h2",
              text: "Where the other clips appear",
            },
            {
              t: "table",
              head: ["Clip", "Where you will find it"],
              rows: [
                ["Homeostasis and allostasis", "Section 1, Lesson 1 introduction"],
                ["The cell's environment: electrolytes, glucose, toxins and pH", "Section 1, Lesson 1.1"],
                ["Protein problems: receptors, antibodies and autoimmunity", "Section 1, Lesson 2.1"],
                ["DNA and cancer; inherited genetic disorders", "Section 1, Lesson 2.2"],
                ["Case: a 72-year-old with heart failure", "Section 4, Lesson 6.3"],
                ["HIV: entry, replication and how drugs block each step", "Section 4, Lesson 7.2"],
              ],
            },
            {
              t: "callout",
              title: "Corrections are shown under each clip",
              html: "Our reviewers checked the lecture against current sources. Where a clip says something inaccurate or out of date, the correct version appears directly under the video, with the time it occurs.",
            },
          ],
        },
        {
          id: "assessment",
          title: "Practice and Assessment",
          kind: "reading",
          blocks: [
            {
              t: "h2",
              text: "Two kinds of practice",
            },
            {
              t: "p",
              html: "<strong>Practice quizzes teach.</strong> You answer one question, submit it, and read the reasoning before moving on. Use them while you are still learning a topic.",
            },
            {
              t: "p",
              html: "<strong>Section tests rehearse.</strong> You answer every question first, then submit once and see your score with all rationales. That is closer to how a final exam feels, so take them when you think you are ready.",
            },
            {
              t: "h2",
              text: "How progress is tracked",
            },
            {
              t: "ul",
              items: [
                "A reading or activity page is marked complete when you open it.",
                "A quiz is complete when every question has been submitted.",
                "A test is complete when you submit it.",
                "Rings in the course outline fill as you go. A green check means everything in that part is done.",
              ],
            },
            {
              t: "callout",
              title: "Your progress follows you",
              html: "Progress is saved to your Almanac account as you go, so it follows you to any device you sign in on. If you lose your connection, your work is kept on this device and syncs when you are back online.",
            },
          ],
        },
        {
          id: "terms",
          title: "Medical Terminology Toolkit",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "Most pathophysiology terms are built from a few dozen parts. If you can split a word into its parts, you can usually work out what it means, even if you have never seen it.",
            },
            {
              t: "table",
              head: ["Word part", "Meaning", "Example"],
              rows: [
                ["patho-", "disease, suffering", "pathogen: something that produces disease"],
                ["-logy", "study of", "pathology"],
                ["homeo-", "same, unchanging", "homeostasis"],
                ["-stasis", "standing still, stable", "hemostasis: stopping blood flow"],
                ["hyper- / hypo-", "above normal / below normal", "hyperkalemia / hyponatremia"],
                ["-emia", "condition of the blood", "kal (potassium) + emia"],
                ["-itis", "inflammation", "nephritis"],
                ["-osis", "abnormal condition", "acidosis"],
                ["-plasia", "formation, growth", "hyperplasia, dysplasia"],
                ["dys-", "abnormal, difficult", "dyspnea"],
                ["-penia", "deficiency", "neutropenia"],
                ["-megaly", "enlargement", "cardiomegaly"],
                ["tachy- / brady-", "fast / slow", "tachypnea / bradycardia"],
                ["-uria", "urine", "oliguria: low urine output"],
              ],
            },
            {
              t: "cards",
              id: "fc-terms",
              title: "Word parts",
              cards: [
                // REVIEW: each word part now carries a worked example
                { topic: "Word parts", q: "hyper-", a: "Above normal", why: "Hyperkalemia: potassium above normal." },
                { topic: "Word parts", q: "hypo-", a: "Below normal", why: "Hyponatremia: sodium below normal." },
                { topic: "Word parts", q: "-emia", a: "In the blood", why: "Hyperkalemia, anemia, uremia: the condition is in the blood." },
                { topic: "Word parts", q: "kal-", a: "Potassium", why: "Hyperkalemia: high potassium, seen on the monitor as tall peaked T waves." },
                { topic: "Word parts", q: "natr-", a: "Sodium", why: "Hyponatremia: low sodium; brain cells swell, causing confusion and seizures." },
                { topic: "Word parts", q: "-plasia", a: "Formation or growth of cells", why: "Hyperplasia: more cells. Dysplasia: disordered growth." },
                { topic: "Word parts", q: "dys-", a: "Abnormal or difficult", why: "Dyspnea: difficult breathing. Dysplasia: abnormal growth." },
                { topic: "Word parts", q: "-osis", a: "Abnormal condition", why: "Osteoporosis, cirrhosis, thrombosis." },
                { topic: "Word parts", q: "-penia", a: "Deficiency", why: "Neutropenia: too few neutrophils, so a high risk of infection." },
                { topic: "Word parts", q: "oligo-", a: "Few, scanty", why: "Oliguria: low urine output, as in acute kidney injury." },
              ],
            },
          ],
        },
      ],
    },
  ],
};
