"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckIcon, LockIcon, PlayIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { courseById, lessonsInModule } from "@/content/course";
import { moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

export default function CourseOutline() {
  const { courseId } = useParams<{ courseId: string }>();
  const { state } = useStudent();
  const { modules, questions, latest, lessonOpen } = useCourse(courseId);
  const course = courseById(courseId);
  const plan = planFor(state, courseId);
  const weeks = plan ? moduleWeeks(plan, courseId) : null;
  const week = plan ? weekToday(plan) : null;
  if (!course || course.status !== "open")
    return (
      <p className="rounded-tile bg-white p-6">
        This course isn&apos;t open yet. <Link href="/app/courses" className="font-bold text-violet-600">All courses</Link>
      </p>
    );

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm font-semibold text-ink-muted">
        <Link href="/app/courses" className="hover:text-ink">
          Courses
        </Link>{" "}
        / {course.title}
      </nav>
      <PageHeader eyebrow={course.category} title={course.title} />
      <p className="-mt-3 mb-4 max-w-2xl text-ink-body">{course.fit} Almanac is independent and not affiliated with any school or publisher.</p>
      <div className="mb-6 flex flex-wrap gap-2 text-sm font-bold">
        <Link href={`/app/setup?course=${course.id}`} className="rounded-full bg-white px-4 py-2 text-violet-700">
          {plan ? `Week ${week} of ${plan.courseWeeks} · edit plan` : "Set up your plan"}
        </Link>
        <Link href={`/app/practice?course=${course.id}`} className="rounded-full bg-white px-4 py-2 text-violet-700">
          Practice this course
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {modules.map((m) => {
          const ls = lessonsInModule(m.id);
          const qs = questions.filter((q) => q.moduleId === m.id);
          const r = readiness(qs, latest);
          const open = ls.filter((l) => lessonOpen(l.id));
          return (
            <section key={m.id} aria-labelledby={`mod-${m.id}`} className={`rounded-tile p-5 ${m.id === "f" ? "bg-lilac" : "bg-white"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-violet-700">
                    {m.number === 0 ? "Start here" : `Module ${m.number}`}
                    {weeks ? ` · week ${weeks[m.id]}${week === weeks[m.id] ? " (this week)" : ""}` : ""}
                  </p>
                  <h2 id={`mod-${m.id}`} className="font-display text-[22px] font-semibold">
                    {m.title}
                  </h2>
                  <p className="text-sm text-ink-muted">{m.blurb}</p>
                </div>
                {qs.length > 0 && <span className={`rounded-full px-3 py-1 text-xs font-bold ${readinessTone[r.level].chip}`}>{readinessLabel[r.level]}</span>}
              </div>
              {ls.length > 0 && (
                <ol className="mt-3 flex flex-col gap-1">
                  {ls.map((l) => {
                    const isOpen = lessonOpen(l.id);
                    const done = Boolean(state.lessons[l.id]);
                    const inner = (
                      <>
                        <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${done ? "bg-correct text-white" : isOpen ? "bg-violet text-white" : "bg-mist text-ink-faint"}`} aria-hidden="true">
                          {done ? <CheckIcon size={13} /> : isOpen ? <PlayIcon size={12} /> : <LockIcon size={13} />}
                        </span>
                        <span className="min-w-0 flex-1 text-[15px] font-semibold">{l.shortTitle ?? l.title}</span>
                        <span className="text-sm text-ink-muted">{isOpen ? (l.duration ?? "") : l.summary ? "In review" : "In production"}</span>
                      </>
                    );
                    return (
                      <li key={l.id}>
                        {isOpen ? (
                          <Link href={`/app/learn/${l.id}`} className="flex min-h-12 items-center gap-3 rounded-2xl px-2 hover:bg-white/70">
                            {inner}
                          </Link>
                        ) : (
                          <div className="flex min-h-12 items-center gap-3 px-2 opacity-70">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
              {open.length > 0 && (
                <Link href={`/app/guide/${m.id}`} className="mt-3 inline-block text-sm font-bold text-violet-700">
                  Study guide for this module
                </Link>
              )}
              {ls.length === 0 && qs.length === 0 && <p className="mt-2 text-sm text-ink-muted">Lessons for this module are in production.</p>}
            </section>
          );
        })}
      </div>

    </>
  );
}
