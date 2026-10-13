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
  /** 0 for Foundations, then textbook order. */
  number: number;
  title: string;
  /** Short line shown on the course outline. */
  blurb: string;
};

export type Lesson = {
  id: string;
  moduleId: string;
  index: number;
  title: string;
  shortTitle?: string;
  /** Display length, e.g. "4:48". */
  duration?: string;
  /** Clip file in the media store, without extension (mp4, jpg and vtt share the name). */
  video?: string;
  objective: string;
  /** Why and how this is tested; the trap it hides. */
  hook?: string;
  /** The mechanism in steps. */
  summary?: { title: string; body: string }[];
  /** What the nurse assesses, does first, reports or teaches. */
  priorities?: string[];
  /** What wrong answers look like; the confusable concept nearby. */
  traps?: string[];
  /** Where the video says something inaccurate, and the correct version. */
  corrections?: { at: string; said: string; correct: string }[];
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
