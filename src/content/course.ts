/**
 * The Almanac catalog: every course, its modules, pages, questions, cards and
 * case studies, plus lookups. Advanced Pathophysiology is the first open
 * course; its course player content lives in ./patho.
 */
import { patho } from "./patho";
import type { Card, CaseStudy, Course, Lesson, Module, Question } from "./types";

const PATHO = "advanced-pathophysiology";

export const modules: Module[] = [...patho.modules];
/** Course player pages, in reading order. */
export const lessons: Lesson[] = [...patho.pages];
export const questions: Question[] = [...patho.questions];
export const cards: Card[] = [...patho.cards];
export const cases: CaseStudy[] = [];

export const courses: Course[] = [
  {
    id: PATHO,
    title: "Advanced Pathophysiology",
    category: "Nursing · Graduate",
    blurb: "Seven competencies, from homeostasis to every body system: how disease develops, shows up, complicates and varies.",
    fit: "Built around the seven competencies of a pathophysiology course and paced to the course text, McCance & Huether.",
    status: "open",
    tone: "lilac",
    reviewer: "nurse",
  },
  {
    id: "advanced-pharmacology",
    title: "Advanced Pharmacology",
    category: "Nursing · Graduate",
    blurb: "Drug classes, mechanisms and safety, in the same watch, answer and review loop.",
    status: "coming",
    tone: "peach",
    reviewer: "nurse",
  },
  {
    id: "practical-ai-skills",
    title: "Practical AI skills",
    category: "Everyday skills",
    blurb: "Use AI tools for research, writing and planning, and check what they give you.",
    status: "coming",
    tone: "mint",
    reviewer: "expert",
  },
  {
    id: "editing-and-proofreading",
    title: "Editing and proofreading",
    category: "Writing",
    blurb: "Tighten, correct and polish your own writing, one habit at a time.",
    status: "coming",
    tone: "sky",
    reviewer: "expert",
  },
];
export const openCourses = courses.filter((c) => c.status === "open");
export const comingCourses = courses.filter((c) => c.status === "coming");

/* Lookups */

export const courseById = (id: string) => courses.find((c) => c.id === id);
export const modulesInCourse = (courseId: string) => modules.filter((m) => m.courseId === courseId);
export const courseOfModule = (moduleId: string) => courseById(modules.find((m) => m.id === moduleId)?.courseId ?? "");
export const moduleById = (id: string) => modules.find((m) => m.id === id);
export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const lessonsInModule = (moduleId: string) => lessons.filter((l) => l.moduleId === moduleId);
/** Pages grouped into their lessons, in order. */
export function groupsInModule(moduleId: string) {
  const out: { id: string; title: string; pages: Lesson[] }[] = [];
  for (const p of lessonsInModule(moduleId)) {
    const g = out.find((x) => x.id === p.groupId);
    if (g) g.pages.push(p);
    else out.push({ id: p.groupId, title: p.groupTitle, pages: [p] });
  }
  return out;
}
export const cardById = (id: string) => cards.find((c) => c.id === id);
export const questionsForLesson = (lessonId: string) => questions.filter((q) => q.lessonId === lessonId);
export const questionById = (id: string) => questions.find((q) => q.id === id);
export const caseById = (id: string) => cases.find((c) => c.id === id);
export const caseForLesson = (lessonId: string) => cases.find((c) => c.lessonId === lessonId);

/** Every reviewable item, keyed by id, for the review screen and approval checks. */
export type ReviewableKind = "page" | "question" | "card" | "case";
export const reviewables: { id: string; kind: ReviewableKind; moduleId: string; lessonId?: string; item: unknown }[] = [
  ...lessons.map((l) => ({ id: l.id, kind: "page" as const, moduleId: l.moduleId, lessonId: l.id, item: l })),
  ...questions.map((q) => ({ id: q.id, kind: "question" as const, moduleId: q.moduleId, lessonId: q.lessonId, item: q })),
  ...cards.map((c) => ({ id: c.id, kind: "card" as const, moduleId: c.moduleId, lessonId: c.lessonId, item: c })),
  ...cases.map((c) => ({ id: c.id, kind: "case" as const, moduleId: c.moduleId, lessonId: c.lessonId, item: c })),
];
