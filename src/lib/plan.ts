import { lessons, modules } from "@/content/course";

/**
 * A student's plan: modules in textbook order spread across their own course
 * length, anchored to the week they said they were in, with their midterm and
 * final dates. Nothing here is tied to a particular school's syllabus.
 */
export type Plan = {
  courseWeeks: number;
  /** Course week the student said they were in, on `setOn`. */
  currentWeek: number;
  setOn: string;
  midterm?: string;
  final?: string;
  /** Section ids in the order the student's school teaches them. Missing sections follow in textbook order. */
  order?: string[];
};

const DAY = 86_400_000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

export function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Course week today, from the week the student gave and the days since. */
export function weekToday(plan: Plan, now = new Date()): number {
  const set = parseDate(plan.setOn) ?? now;
  const weeks = Math.floor((startOfDay(now).getTime() - startOfDay(set).getTime()) / (7 * DAY));
  return Math.min(plan.courseWeeks, Math.max(1, plan.currentWeek + weeks));
}

/** Date a given course week starts. */
function weekStart(plan: Plan, week: number): Date {
  const set = startOfDay(parseDate(plan.setOn) ?? new Date());
  return new Date(set.getTime() + (week - plan.currentWeek) * 7 * DAY);
}

/** Week in which a date falls, clamped to the course. */
export function weekOfDate(plan: Plan, iso: string | undefined): number | null {
  const d = parseDate(iso);
  if (!d) return null;
  const w = plan.currentWeek + Math.floor((startOfDay(d).getTime() - weekStart(plan, plan.currentWeek).getTime()) / (7 * DAY));
  return Math.min(plan.courseWeeks, Math.max(1, w));
}

/** Sections in the student's order: their saved order first, then any others in textbook order. */
export function orderedSections(plan: Pick<Plan, "order"> | null | undefined, courseId: string) {
  const sections = modules.filter((m) => m.courseId === courseId && m.kind === "section");
  const saved = (plan?.order ?? []).map((id) => sections.find((m) => m.id === id)).filter((m): m is (typeof sections)[number] => Boolean(m));
  return [...saved, ...sections.filter((m) => !saved.includes(m))];
}

/**
 * Course week in which each module is scheduled. Start here is week 1. Sections
 * follow the student's order, each taking a share of the weeks in proportion
 * to its topic count, so a six-topic section gets more time than a three-topic
 * one. The final review comes last.
 */
export function moduleWeeks(plan: Pick<Plan, "courseWeeks" | "order">, courseId: string): Record<string, number> {
  const mods = modules.filter((m) => m.courseId === courseId);
  const out: Record<string, number> = {};
  mods.filter((m) => m.number === 0).forEach((m) => (out[m.id] = 1));
  const sections = orderedSections(plan, courseId);
  const rest = mods.filter((m) => m.number > 0 && m.kind !== "section");
  const topics = (id: string) => lessons.filter((l) => l.moduleId === id && l.kind === "topic").length;
  // Sections without topic pages yet count as one topic's worth.
  const weight = sections.map((m) => Math.max(1, topics(m.id)));
  const total = weight.reduce((a, b) => a + b, 0);
  let cum = 0;
  sections.forEach((m, i) => {
    cum += weight[i];
    out[m.id] = Math.min(plan.courseWeeks, Math.max(1, Math.ceil((cum * plan.courseWeeks) / total)));
  });
  rest.forEach((m) => (out[m.id] = plan.courseWeeks));
  return out;
}

export function daysUntil(iso: string | undefined, now = new Date()): number | null {
  const d = parseDate(iso);
  if (!d) return null;
  return Math.round((d.getTime() - startOfDay(now).getTime()) / DAY);
}

/** Modules a midterm (or final) covers: everything scheduled up to that exam's week. */
export function modulesBefore(plan: Plan, iso: string | undefined, courseId: string): string[] {
  const week = weekOfDate(plan, iso);
  const weeks = moduleWeeks(plan, courseId);
  if (week === null) return Object.keys(weeks);
  return Object.entries(weeks)
    .filter(([, w]) => w <= week)
    .map(([id]) => id);
}

export function formatDate(iso: string | undefined) {
  const d = parseDate(iso);
  return d ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
}

/** The student's plan for one course. Plans saved before multi-course support belong to the first course. */
export function planFor(state: { plans?: Record<string, Plan> | null; plan?: Plan | null }, courseId: string, firstCourseId = "advanced-pathophysiology"): Plan | null {
  return state.plans?.[courseId] ?? (courseId === firstCourseId ? (state.plan ?? null) : null);
}
