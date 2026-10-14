/**
 * Content model for Almanac courses.
 *
 * Every item (lesson, question, card, case, guide) carries a stable id. A
 * student only sees an item once the nurse reviewer has approved the exact
 * version they will see (see src/lib/review.ts): approvals are stored with a
 * hash of the item, so any edit sends it back for review automatically.
 */

export type Level = "recall" | "application" | "analysis";

export type Course = {
  /** Also the URL slug. */
  id: string;
  title: string;
  /** Short line under the title, e.g. "Nursing · Graduate". */
  category: string;
  blurb: string;
  /** Which courses at a school this fits; shown on the course page. */
  fit?: string;
  /** "open": students can use it now. "coming": listed, not yet available. */
  status: "open" | "coming";
  tone: "lilac" | "peach" | "mint" | "sky";
  /** Nursing courses are signed off by a credentialed nurse; others by a subject expert. */
  reviewer?: "nurse" | "expert";
};

export type Module = {
  /** Unique across all courses. New courses prefix their ids, e.g. "pharm-m1". */
  id: string;
  courseId: string;
  /** 0 for "Start here", then section order. */
  number: number;
  title: string;
  /** Short line shown on the course outline. */
  blurb: string;
  kind?: "start" | "section" | "final";
  /** The competency statement this section is built to. */
  competency?: string;
};

/* Course player content: sections → lessons → pages → blocks. */

export type PageKind = "reading" | "activity" | "summary" | "quiz" | "test" | "video" | "topic";

export type LabRow = [name: string, unit: string, ...rest: (string | number)[]];

/** One box in a page diagram. `key` places it on a fixed layout (the rule-of-nines body map). */
export type DiagramItem = { label: string; sub?: string; tag?: string; key?: string };

export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; html: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][]; caption?: string }
  | { t: "callout"; title: string; html: string }
  | { t: "case"; title: string; html: string }
  /** Lab panel: rows are [name, unit, ...values per column, range, abnormal flag (1/0)]. */
  | { t: "labs"; caption?: string; cols: string[]; rows: LabRow[] }
  /** Essential question for the page. */
  | { t: "eq"; text: string }
  /** One of the course's own video clips, by clip id. */
  | { t: "video"; clip: string; note?: string; stops?: { at: string; ref: string }[] }
  /** 3–5 key points shown with the essential question. HTML allowed. */
  | { t: "keypoints"; items: string[] }
  /** Ungraded prediction before reading. Stored in notes, never scored. */
  | { t: "predict"; id: string; stem: string; options: { id: string; text: string }[]; correct: string; reveal: string }
  /** Course image from /images/patho/{id}.png. Labels are page text, never in the image. */
  | { t: "img"; id: string; alt: string; panels: { label: string; sub?: string }[]; aspect?: "3:1" | "3:2" }
  /**
   * A page diagram drawn as HTML/SVG with real text labels (image manifest, "Built as page
   * diagrams"). Every label lives here, so the page's review hash covers it.
   */
  | {
      t: "diagram";
      id: string;
      layout: "loop" | "chain" | "quad" | "columns" | "membrane" | "nines";
      title: string;
      alt: string;
      items: DiagramItem[];
      columns?: { title: string; steps: string[] }[];
      flows?: DiagramItem[];
      feedback?: string;
      note?: string;
    }
  /** "Commonly confused" pairs: [a, b, the difference]. */
  | { t: "confused"; rows: [a: string, b: string, difference: string][] }
  /** "Key values": [name, value, note?]. */
  | { t: "values"; rows: ([name: string, value: string] | [name: string, value: string, note: string])[] }
  /** A learning check: one question, answered in place. */
  | { t: "check"; id: string }
  /** A write-then-compare prompt with an expert answer. */
  | { t: "open"; id: string; stem: string; expert: string }
  /** Practice quiz (feedback after each item) or section test (feedback after submitting). */
  | { t: "quiz"; mode: "practice" | "test"; ids: string[] }
  | { t: "cards"; title: string; ids: string[] }
  /** Textbook reading: page ranges in the course text. */
  | { t: "read"; items: { ref: string; note?: string }[] };

/**
 * A page of the course player. Pages are grouped into lessons ("group") and
 * sections (the module). Each page is reviewed and approved as one item.
 */
export type Lesson = {
  id: string;
  moduleId: string;
  /** Order within the section. */
  index: number;
  title: string;
  shortTitle?: string;
  kind: PageKind;
  groupId: string;
  groupTitle: string;
  /** The essential question or one-line aim of the page. */
  objective: string;
  blocks: Block[];
  source?: string;
};

export type Option = { id: string; text: string; rationale: string };

export type Question = {
  id: string;
  moduleId: string;
  lessonId?: string;
  topic: string;
  /** "single" = one best answer; "multiple" = select all that apply. */
  type: "single" | "multiple";
  level: Level;
  stem: string;
  ask: string;
  options: Option[];
  correct: string[];
  source: string;
  /** The one idea to take away, shown after the answer. */
  takeaway?: string;
  /** Seconds into the lesson clip where this is taught. */
  clip?: number;
  /** Options with a natural order (numbers, sequences) are never shuffled. */
  fixedOrder?: boolean;
};

export type Card = {
  id: string;
  moduleId: string;
  lessonId?: string;
  topic: string;
  front: string;
  back: string;
  detail?: string;
  source: string;
};

/* NGN unfolding case study. */

export type HighlightItem = {
  kind: "highlight";
  id: string;
  step: CjmmStep;
  prompt: string;
  /** The note, split into selectable phrases; plain strings are not selectable. */
  parts: (string | { id: string; text: string })[];
  correct: string[];
  rationale: string;
};

export type MatrixItem = {
  kind: "matrix";
  id: string;
  step: CjmmStep;
  prompt: string;
  columns: string[];
  rows: { id: string; text: string; correct: number }[];
  rationale: string;
};

export type ClozeItem = {
  kind: "cloze";
  id: string;
  step: CjmmStep;
  prompt: string;
  /** Sentence pieces; objects are drop-downs. */
  parts: (string | { id: string; options: string[]; correct: number })[];
  rationale: string;
};

export type MultiItem = {
  kind: "multi";
  id: string;
  step: CjmmStep;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string[];
  rationale: string;
};

export type CaseItem = HighlightItem | MatrixItem | ClozeItem | MultiItem;

export type CjmmStep =
  | "Recognize cues"
  | "Analyze cues"
  | "Prioritize hypotheses"
  | "Generate solutions"
  | "Take action"
  | "Evaluate outcomes";

export type CaseStudy = {
  id: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  intro: string;
  /** Each stage adds new information before its item. */
  stages: { update?: string; item: CaseItem }[];
  source: string;
};
