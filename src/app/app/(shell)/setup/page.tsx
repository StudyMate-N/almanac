"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { courseById, openCourses } from "@/content/course";
import { PageHeader } from "@/components/page-header";
import { planFor, toIsoDate, weekToday } from "@/lib/plan";
import { useStudent } from "@/lib/store";

export default function SetupPage() {
  return (
    <Suspense>
      <Setup />
    </Suspense>
  );
}

function Setup() {
  const { state, update } = useStudent();
  const router = useRouter();
  const course = courseById(useSearchParams().get("course") ?? "") ?? openCourses[0];
  const p = planFor(state, course.id);
  const [courseWeeks, setCourseWeeks] = useState(p?.courseWeeks ?? 8);
  const [currentWeek, setCurrentWeek] = useState(p ? weekToday(p) : 1);
  const [midterm, setMidterm] = useState(p?.midterm ?? "");
  const [final, setFinal] = useState(p?.final ?? "");
  const field = "min-h-12 w-full rounded-2xl border-2 border-hairline bg-white px-4 outline-none focus:border-violet";

  return (
    <>
      <PageHeader eyebrow={`Your plan · ${course.title}`} title="Fit Almanac to your course" />
      <form
        className="flex max-w-xl flex-col gap-4 rounded-tile bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          update("plans", { ...state.plans, [course.id]: { courseWeeks, currentWeek: Math.min(currentWeek, courseWeeks), setOn: toIsoDate(new Date()), midterm: midterm || undefined, final: final || undefined } });
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
        <p className="text-sm text-ink-muted">Modules follow the standard textbook order, spread across your weeks. Foundations comes first. You can change this any time.</p>
        <button className="min-h-[52px] rounded-full bg-violet font-bold text-white hover:bg-violet-600">Save my plan</button>
      </form>
    </>
  );
}
