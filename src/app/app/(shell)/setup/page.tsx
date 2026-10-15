"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { courseById, openCourses } from "@/content/course";
import { PageHeader } from "@/components/page-header";
import { moduleWeeks, orderedSections, planFor, toIsoDate, weekToday } from "@/lib/plan";
import { useStudent } from "@/lib/store";

export default function SetupPage() {
  return (
    <Suspense>
      <Setup />
    </Suspense>
  );
}

function Setup() {
  const { state, update, authorizedCourses } = useStudent();
  const router = useRouter();
  const course = courseById(useSearchParams().get("course") ?? "") ?? openCourses[0];
  const p = planFor(state, course.id);
  const [courseWeeks, setCourseWeeks] = useState(p?.courseWeeks ?? 8);
  const [currentWeek, setCurrentWeek] = useState(p ? weekToday(p) : 1);
  const [midterm, setMidterm] = useState(p?.midterm ?? "");
  const [final, setFinal] = useState(p?.final ?? "");
  const [order, setOrder] = useState(() => orderedSections(p, course.id).map((m) => m.id));
  const sections = orderedSections({ order }, course.id);
  const weeks = moduleWeeks({ courseWeeks, order }, course.id);
  const move = (i: number, by: -1 | 1) => {
    const next = order.slice();
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setOrder(next);
  };
  const field = "min-h-12 w-full rounded-2xl border-2 border-hairline bg-white px-4 outline-none focus:border-violet";

  if (!authorizedCourses.includes(course.id)) return <section className="alm-desk-card mx-auto max-w-xl p-6">
    <p className="alm-desk-eyebrow">Approved learning</p>
    <h1 className="mt-3 text-[24px] font-bold">Choose an enrolled course first.</h1>
    <p className="mt-3 text-sm text-ink-body">Study planning is available for courses included in your approved enrollment.</p>
  </section>;
  return (
    <>
      <PageHeader eyebrow={`Your plan · ${course.title}`} title="Fit Almanac to your course" />
      <form
        className="flex max-w-xl flex-col gap-4 rounded-tile bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          update("plans", { ...state.plans, [course.id]: { courseWeeks, currentWeek: Math.min(currentWeek, courseWeeks), setOn: toIsoDate(new Date()), midterm: midterm || undefined, final: final || undefined, order } });
          router.push("/app");
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          How many weeks is your course?
          <select className={field} value={courseWeeks} onChange={(e) => setCourseWeeks(Number(e.target.value))}>
            {[6, 8, 10, 11, 12, 15, 16].map((w) => (
              <option key={w} value={w}>
                {w} weeks
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Which week are you in now?
          <input className={field} type="number" min={1} max={courseWeeks} value={currentWeek} onChange={(e) => setCurrentWeek(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Midterm date <span className="font-normal text-ink-muted">(leave blank if none)</span>
          <input className={field} type="date" value={midterm} onChange={(e) => setMidterm(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Final exam date
          <input className={field} type="date" value={final} onChange={(e) => setFinal(e.target.value)} />
        </label>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-semibold">Section order</legend>
          <p className="mb-1 text-sm text-ink-muted">Move sections to match the order your school teaches them. Sections with more topics get more time. You can change this any time.</p>
          <ol className="flex flex-col gap-2">
            {sections.map((m, i) => (
              <li key={m.id} className="flex min-h-14 items-center gap-3 rounded-2xl bg-mist py-2 pr-2 pl-4">
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">
                    Section {m.number}: {m.title}
                  </span>
                  <span className="block text-[13px] text-ink-muted">Week {weeks[m.id]}</span>
                </span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${m.title} earlier`} className="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-violet-700 disabled:opacity-30">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} aria-label={`Move ${m.title} later`} className="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-violet-700 disabled:opacity-30">
                  ↓
                </button>
              </li>
            ))}
          </ol>
        </fieldset>
        <button className="min-h-[52px] rounded-full bg-violet font-bold text-white hover:bg-violet-600">Save my plan</button>
      </form>
    </>
  );
}
