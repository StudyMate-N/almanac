"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { toneBg } from "@/components/site/chrome";
import { comingCourses, lessons as allLessons, modulesInCourse, openCourses } from "@/content/course";
import { daysUntil, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

export default function Courses() {
  const { state } = useStudent();
  const { questions, latest, lessonOpen } = useCourse();

  return (
    <>
      <PageHeader eyebrow="Almanac" title="Your courses" />
      <div className="grid gap-4 md:grid-cols-2">
        {openCourses.map((c) => {
          const mods = modulesInCourse(c.id).map((m) => m.id);
          const qs = questions.filter((q) => mods.includes(q.moduleId));
          const r = readiness(qs, latest);
          const ls = allLessons.filter((l) => mods.includes(l.moduleId) && lessonOpen(l.id));
          const watched = ls.filter((l) => state.lessons[l.id]).length;
          const plan = planFor(state, c.id);
          const toFinal = daysUntil(plan?.final);
          return (
            <Link key={c.id} href={`/app/courses/${c.id}`} className={`flex flex-col gap-2 rounded-tile p-6 hover:brightness-[0.97] ${toneBg[c.tone]}`}>
              <p className="text-xs font-bold text-ink-muted">{c.category}</p>
              <h2 className="font-display text-[24px] leading-tight font-semibold">{c.title}</h2>
              <p className="text-sm text-ink-body">
                {plan ? `Week ${weekToday(plan)} of ${plan.courseWeeks}` : "No plan yet"}
                {toFinal !== null && toFinal >= 0 ? ` · final in ${toFinal} day${toFinal === 1 ? "" : "s"}` : ""}
                {ls.length ? ` · ${watched} of ${ls.length} lessons watched` : ""}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                {qs.length > 0 ? <span className={`rounded-full px-3 py-1 text-xs font-bold ${readinessTone[r.level].chip}`}>{readinessLabel[r.level]}</span> : <span className="text-xs font-bold text-ink-muted">Content in review</span>}
                <span className="inline-flex items-center gap-1 font-bold text-violet-700">
                  Open <ArrowRightIcon size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {comingCourses.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 font-display text-[21px] font-semibold">Coming to Almanac</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {comingCourses.map((c) => (
              <article key={c.id} className="rounded-tile bg-white p-5">
                <p className="text-xs font-bold text-ink-muted">{c.category}</p>
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-ink-muted">{c.blurb}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
