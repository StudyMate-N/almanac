/**
 * The Almanac catalog: every course, its modules in textbook order, lessons,
 * questions, cards and case studies, plus lookups. Advanced Pathophysiology
 * is the first open course; each new course adds its modules and content here.
 */
import { heartFailureCase } from "./case-heart-failure";
import { foundationsCards, foundationsLessons } from "./foundations";
import { foundationsQuestions, legacyQuestions } from "./questions";
import type { Card, CaseStudy, Course, Lesson, Module, Question } from "./types";

const MH = "McCance & Huether, Pathophysiology";
const PATHO = "advanced-pathophysiology";


export const modules: Module[] = [
  { id: "f", courseId: PATHO, number: 0, title: "Start here: Foundations", blurb: "The ideas every later module builds on, in eleven short lessons." },
  { id: "m1", courseId: PATHO, number: 1, title: "Cellular injury and adaptation", blurb: "How cells adapt to stress, get injured and die." },
  { id: "m2", courseId: PATHO, number: 2, title: "Inflammation and healing", blurb: "Acute and chronic inflammation, and tissue repair." },
  { id: "m3", courseId: PATHO, number: 3, title: "Immunity and hypersensitivity", blurb: "Innate and adaptive immunity, and the four hypersensitivity types." },
  { id: "m4", courseId: PATHO, number: 4, title: "Genetics and cancer biology", blurb: "Inheritance patterns, oncogenes and tumor suppressors." },
  { id: "m5", courseId: PATHO, number: 5, title: "Hematology", blurb: "Red cells, white cells, platelets and clotting." },
  { id: "m6", courseId: PATHO, number: 6, title: "Cardiovascular", blurb: "Atherosclerosis, hypertension and heart failure." },
  { id: "m7", courseId: PATHO, number: 7, title: "Pulmonary", blurb: "Obstructive and restrictive disease, and gas exchange." },
  { id: "m8", courseId: PATHO, number: 8, title: "Renal, fluids, electrolytes and acid–base", blurb: "Kidney injury, fluid balance and acid–base disorders." },
  { id: "m9", courseId: PATHO, number: 9, title: "Endocrine", blurb: "Diabetes, thyroid and adrenal disorders." },
  { id: "m10", courseId: PATHO, number: 10, title: "Neurological and musculoskeletal", blurb: "Stroke, seizures, dementia, and bone and joint disease." },
  { id: "m11", courseId: PATHO, number: 11, title: "Gastrointestinal and reproductive", blurb: "GI, liver and reproductive disorders." },
];

const module3Lessons: Lesson[] = [
  { id: "m3-l1", moduleId: "m3", index: 1, title: "Innate vs adaptive immunity", objective: "Contrast innate and adaptive immune responses." },
  { id: "m3-l2", moduleId: "m3", index: 2, title: "Antibodies and antigen presentation", objective: "Explain how antigens are presented and how antibodies work." },
  {
    id: "m3-l3",
    moduleId: "m3",
    index: 3,
    title: "Type I hypersensitivity: IgE and mast cells",
    shortTitle: "Type I: IgE and mast cells",
    objective: "Explain the sensitization, early phase and late phase of a Type I reaction.",
    summary: [
      { title: "Sensitization", body: "On first exposure, Th2 cells drive B cells to make IgE, which binds FcεRI receptors on mast cells and basophils." },
      { title: "Re-exposure", body: "The allergen cross-links IgE already bound to mast cells, and they degranulate within minutes." },
      { title: "Early phase", body: "Histamine, leukotrienes and prostaglandins dilate vessels, make them leaky and constrict bronchial smooth muscle." },
      { title: "Late phase", body: "Two to 24 hours later, mast-cell cytokines recruit eosinophils and other leukocytes, which keep the inflammation going." },
    ],
    source: `${MH}: Alterations in immunity and inflammation.`,
  },
  { id: "m3-l4", moduleId: "m3", index: 4, title: "Types II and III: antibodies and immune complexes", objective: "Contrast antibody-mediated and immune-complex reactions." },
  { id: "m3-l5", moduleId: "m3", index: 5, title: "Type IV: T cell–mediated reactions", objective: "Explain delayed, T cell–mediated hypersensitivity." },
  { id: "m3-l6", moduleId: "m3", index: 6, title: "Immunodeficiency and autoimmunity", objective: "Explain primary and acquired immunodeficiency and loss of self-tolerance." },
];

const legacyCards: Card[] = [
  { id: "c-ige", moduleId: "m3", lessonId: "m3-l3", topic: "Hypersensitivity types I–IV", front: "Which antibody coats mast cells and basophils in a Type I hypersensitivity reaction?", back: "IgE", detail: "It sits on FcεRI receptors. When an allergen cross-links it, the cell degranulates and releases histamine.", source: MH },
  { id: "c-type4", moduleId: "m3", lessonId: "m3-l5", topic: "Hypersensitivity types I–IV", front: "What mediates a Type IV hypersensitivity reaction, and how fast does it appear?", back: "T cells, over 24–72 hours", detail: "It is a delayed reaction. Examples: a positive tuberculin skin test and contact dermatitis.", source: MH },
  { id: "c-metaplasia", moduleId: "m1", topic: "Cellular adaptation", front: "What is metaplasia?", back: "One mature cell type replaced by another", detail: "The new type better tolerates the stress, e.g. columnar cells replacing squamous lining in Barrett esophagus.", source: MH },
  { id: "c-lvh", moduleId: "m1", topic: "Cellular adaptation", front: "Why does the heart respond to pressure overload with hypertrophy rather than hyperplasia?", back: "Adult myocytes can barely divide", detail: "So each cell enlarges instead, and the ventricular wall thickens.", source: MH },
  { id: "c-swelling", moduleId: "m1", topic: "Cell injury", front: "What is usually the earliest change in hypoxic cell injury?", back: "Cellular swelling", detail: "ATP falls, the Na⁺/K⁺ pump fails, and sodium and water enter the cell. It is reversible.", source: MH },
  { id: "c-nuclear", moduleId: "m1", topic: "Cell injury", front: "Which three nuclear changes mark irreversible injury?", back: "Pyknosis, karyorrhexis, karyolysis", detail: "Shrinkage, fragmentation and dissolution of the nucleus.", source: MH },
  { id: "c-caseous", moduleId: "m1", topic: "Necrosis", front: "Which type of necrosis is typical of tuberculosis?", back: "Caseous necrosis", detail: "Cheese-like dead tissue at the center of granulomas.", source: MH },
  { id: "c-liquefactive", moduleId: "m1", topic: "Necrosis", front: "Which type of necrosis follows an infarct in the brain?", back: "Liquefactive necrosis", detail: "Enzymes digest the dead tissue into a liquid.", source: MH },
  { id: "c-apoptosis", moduleId: "m1", topic: "Cell death", front: "How does apoptosis differ from necrosis in its effect on surrounding tissue?", back: "Apoptosis causes no inflammation", detail: "Membranes stay intact and phagocytes clear the fragments. Necrosis ruptures cells and triggers inflammation.", source: MH },
  { id: "c-cardinal", moduleId: "m2", topic: "Inflammation", front: "Name the five cardinal signs of acute inflammation.", back: "Redness, heat, swelling, pain, loss of function", source: MH },
  { id: "c-vascular", moduleId: "m2", topic: "Inflammation", front: "After a brief arteriolar constriction, what are the vascular changes of acute inflammation?", back: "Vasodilation, then increased permeability", detail: "Fluid and protein leak out as an exudate, causing swelling.", source: MH },
  { id: "c-neutrophil", moduleId: "m2", topic: "Inflammation", front: "Which white cell dominates the first 24 hours of acute inflammation?", back: "Neutrophils", detail: "Macrophages take over as the main cell after about 24–48 hours.", source: MH },
];

export const lessons: Lesson[] = [...foundationsLessons, ...module3Lessons];
export const questions: Question[] = [...foundationsQuestions, ...legacyQuestions];
export const cards: Card[] = [...foundationsCards, ...legacyCards];
export const cases: CaseStudy[] = [heartFailureCase];

export const courses: Course[] = [
  {
    id: PATHO,
    title: "Advanced Pathophysiology",
    category: "Nursing · Graduate",
    blurb: "Disease mechanisms, body system by body system, tied to what the nurse assesses and does.",
    fit: "For graduate Advanced Pathophysiology courses, including those that use McCance & Huether.",
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
export const questionsForLesson = (lessonId: string) => questions.filter((q) => q.lessonId === lessonId);
export const questionById = (id: string) => questions.find((q) => q.id === id);
export const caseById = (id: string) => cases.find((c) => c.id === id);
export const caseForLesson = (lessonId: string) => cases.find((c) => c.lessonId === lessonId);

/** Every reviewable item, keyed by id, for the review screen and approval checks. */
export type ReviewableKind = "lesson" | "question" | "card" | "case";
export const reviewables: { id: string; kind: ReviewableKind; moduleId: string; lessonId?: string; item: unknown }[] = [
  ...lessons.filter((l) => l.summary).map((l) => ({ id: l.id, kind: "lesson" as const, moduleId: l.moduleId, lessonId: l.id, item: l })),
  ...questions.map((q) => ({ id: q.id, kind: "question" as const, moduleId: q.moduleId, lessonId: q.lessonId, item: q })),
  ...cards.map((c) => ({ id: c.id, kind: "card" as const, moduleId: c.moduleId, lessonId: c.lessonId, item: c })),
  ...cases.map((c) => ({ id: c.id, kind: "case" as const, moduleId: c.moduleId, lessonId: c.lessonId, item: c })),
];
