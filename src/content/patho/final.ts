import type { ASection } from "./author";

export const final: ASection = {
  id: "final",
  num: 8,
  title: "Final Review",
  kind: "final",
  blurb: "Check your readiness across all seven sections, then rehearse with a full-length timed exam.",
  groups: [
    {
      id: "final-g",
      title: "Final Review",
      pages: [
        {
          id: "final",
          title: "Final Steps",
          kind: "reading",
          blocks: [
            { t: "p", html: "You have reached the end of the course. Before you sit the final assessment, aim for 8 of 10 or better on every section test, then take the full-length simulation under timed conditions." },
            { t: "h2", text: "What the whole course asks you to do" },
            {
              t: "ul",
              items: [
                "See the patient as a whole and explain how a disorder in one body system affects the others.",
                "Describe how disorders develop, how they show up, their complications, and how they vary between patients.",
                "Use patient data to recognize early changes and act to prevent complications.",
              ],
            },
            { t: "h2", text: "The seven competencies" },
            {
              t: "table",
              head: ["Section", "Competency", "Ready when you can…"],
              rows: [
                ["1", "Homeostasis and Cellular Responses", "Read a blood gas, name the mechanism of edema, and tell adaptation from injury"],
                ["2", "Musculoskeletal and Integumentary Systems", "Spot compartment syndrome early, classify a burn, and tell OA from RA"],
                ["3", "Neurological System", "Separate ischemic from hemorrhagic stroke, recognize rising ICP, and match a sensory loss to its disorder"],
                ["4", "Cardiovascular and Lymphatic Systems", "Tell left from right heart failure, classify an anemia, and explain infection risk in leukemia"],
                ["5", "Respiratory System", "Tell obstructive from restrictive disease and recognize PE, pneumothorax and ARDS"],
                ["6", "Gastrointestinal and Renal Systems", "Tell Crohn disease from ulcerative colitis, stage CKD by GFR, and recognize pancreatitis"],
                ["7", "Endocrine and Reproductive Systems", "Tell hypo- from hyperthyroidism, DKA from HHS, and PCOS from endometriosis"],
              ],
            },
            { t: "h2", text: "A sensible last week" },
            {
              t: "ol",
              items: [
                "Retake every section test. Note the topics you miss twice.",
                "For each weak topic, reread the lesson page and redo its learning checks.",
                "Clear your flashcard reviews each day.",
                "Take the full-length simulation once, timed, in one sitting. Read every rationale afterwards.",
                "Sleep before the exam. A rested brain recalls better than a crammed one.",
              ],
            },
            { t: "callout", title: "Full-length simulation", html: "The final simulation draws 100 questions across all seven sections, weighted by section, with 120 minutes on the clock. Rationales appear after you submit. Open it from Practice, or from the button below." },
          ],
        },
      ],
    },
  ],
};
