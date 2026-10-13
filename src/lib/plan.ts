import { modules } from "@/content/course";

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

/** Course week in which each module is scheduled. Foundations comes first, in week 1. */
export function moduleWeeks(plan: Pick<Plan, "courseWeeks">, courseId: string): Record<string, number> {
  const mods = modules.filter((m) => m.courseId === courseId);
  const numbered = mods.filter((m) => m.number > 0);
  const out: Record<string, number> = {};
  mods.filter((m) => m.number === 0).forEach((m) => (out[m.id] = 1));
  numbered.forEach((m, i) => {
    out[m.id] = Math.min(plan.courseWeeks, Math.max(1, Math.ceil(((i + 1) * plan.courseWeeks) / numbered.length)));
  });
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
