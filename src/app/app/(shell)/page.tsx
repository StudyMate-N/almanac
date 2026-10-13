"use client";

import Link from "next/link";
import { DueTile } from "@/components/due-tile";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { lessons as allLessons, modulesInCourse, openCourses } from "@/content/course";
import type { Course } from "@/content/types";
import { EXAMS, REVIEWER } from "@/lib/config";
import { daysUntil, formatDate, moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { firstName, useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

function CourseToday({ course, showTitle }: { course: Course; showTitle: boolean }) {
  const { state, answers } = useStudent();
  const { modules, questions, latest, lessonOpen, cases } = useCourse(course.id);
  const plan = planFor(state, course.id);
  const week = plan ? weekToday(plan) : 1;
  const weeks = plan ? moduleWeeks(plan, course.id) : null;
  const mods = modulesInCourse(course.id).map((m) => m.id);
  const openLessons = allLessons.filter((l) => mods.includes(l.moduleId) && lessonOpen(l.id));
  const nextLesson = openLessons.find((l) => !state.lessons[l.id]);
  const qIds = new Set(questions.map((q) => q.id));
  const checkDone = answers.some((a) => a.mode === "check" && qIds.has(a.questionId));
  const thisWeek = weeks ? modules.filter((m) => weeks[m.id] === week) : [];
  const toMid = daysUntil(plan?.midterm);
  const toFinal = daysUntil(plan?.final);
  const exam = toMid !== null && toMid >= 0 ? { kind: "midterm" as const, days: toMid, date: plan?.midterm } : toFinal !== null && toFinal >= 0 ? { kind: "final" as const, days: toFinal, date: plan?.final } : null;
  const q = `?course=${course.id}`;

  return (
    <section aria-label={course.title} className="mb-8">
      {showTitle && (
        <h2 className="mb-3 font-display text-[22px] font-semibold">
          <Link href={`/app/courses/${course.id}`}>{course.title}</Link>
        </h2>
      )}
      {!plan && (
        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-tile bg-peach p-6">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[22px] font-semibold">Set up your {course.title} plan</h3>
            <p className="text-[#5C3218]">Tell us your course week and exam dates. Almanac lays out every week between now and your final.</p>
          </div>
          <Link href={`/app/setup${q}`} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-violet px-6 font-bold text-white">
            Set up <ArrowRightIcon size={16} />
          </Link>
        </div>
      )}
      {openLessons.length === 0 && (
        <div className="mb-5 rounded-tile bg-white p-6">
          <h3 className="font-display text-[22px] font-semibold">Pages are in review</h3>
          <p className="mt-1 text-ink-body">
            Every page and question is checked {course.reviewer === "nurse" ? `by ${REVIEWER.name}, ${REVIEWER.credentials},` : "by a subject expert"} before it opens. They appear here as soon as they&apos;re approved.
          </p>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          {nextLesson && (
            <Link href={`/app/learn/${nextLesson.id}`} className="flex flex-col gap-2 rounded-tile bg-lilac p-6 hover:bg-violet-200">
              <p className="text-sm font-bold text-violet-700">Continue · {modulesInCourse(course.id).find((m) => m.id === nextLesson.moduleId)?.title}</p>
              <p className="font-display text-[24px] leading-tight font-semibold">{nextLesson.title}</p>
              <span className="mt-1 inline-flex items-center gap-2 font-bold text-violet-700">
                Open in the course player <ArrowRightIcon size={16} />
              </span>
            </Link>
          )}
          {!checkDone && questions.length >= 5 && (
            <Link href={`/app/exam/check${q}`} className="flex flex-col gap-1 rounded-tile bg-white p-6 hover:bg-mist">
              <p className="text-sm font-bold text-violet-600">Start here</p>
              <p className="font-display text-[20px] font-semibold">Take the starting check</p>
              <p className="text-sm text-ink-body">
                Up to {EXAMS.check.questions} questions across the modules, about {EXAMS.check.minutes} minutes. It shows where you stand.
              </p>
            </Link>
          )}
          {exam && (
            <div className="flex flex-col gap-1 rounded-tile bg-sky p-6">
              <p className="text-sm font-bold text-sky-ink">
                {exam.kind === "midterm" ? "Midterm" : "Final"} · {formatDate(exam.date)}
              </p>
              <p className="font-display text-[28px] font-semibold">{exam.days === 0 ? "Today" : `${exam.days} day${exam.days === 1 ? "" : "s"} to go`}</p>
              <Link href={`/app/exam/${exam.kind}${q}`} className="mt-1 font-bold text-sky-ink underline">
                Take the {exam.kind} simulation ({EXAMS[exam.kind].questions} questions, {EXAMS[exam.kind].minutes} min)
              </Link>
            </div>
          )}
          {cases.length > 0 && (
            <Link href={`/app/case/${cases[0].id}`} className="rounded-tile bg-white p-6 hover:bg-mist">
              <p className="text-sm font-bold text-violet-600">NGN case study</p>
              <p className="font-display text-[20px] font-semibold">{cases[0].title}</p>
            </Link>
          )}
        </div>
        <div className="rounded-tile bg-white p-6">
          <h3 className="mb-3 font-display text-[19px] font-semibold">{plan ? `This week (week ${week} of ${plan.courseWeeks})` : "Readiness"}</h3>
          <ul className="flex flex-col gap-3">
            {(thisWeek.length ? thisWeek : modules).filter((m) => m.kind !== "start" && m.kind !== "final").slice(0, thisWeek.length ? undefined : 3).map((m) => {
              const r = readiness(questions.filter((x) => x.moduleId === m.id), latest);
              return (
                <li key={m.id} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-semibold">{m.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${readinessTone[r.level].chip}`}>{r.total ? readinessLabel[r.level] : "Coming"}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-track">
                    <div className={`h-full ${readinessTone[r.level].bar}`} style={{ width: `${r.percent ?? 0}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href={`/app/courses/${course.id}`} className="mt-3 inline-block text-sm font-bold text-violet-600">
            Course outline
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Today() {
  const { profile } = useStudent();
  const name = firstName(profile);
  return (
    <>
      <PageHeader eyebrow={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} title={name ? `Hi, ${name}` : "Today"} />
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <DueTile />
        <Link href="/app/coach" className="rounded-tile bg-mint p-6 hover:brightness-95">
          <p className="font-display text-[19px] font-semibold text-mint-ink">Stuck? Ask a coach</p>
          <p className="text-sm text-mint-ink">A person replies within 3 hours.</p>
        </Link>
      </div>
      {openCourses.map((c) => (
        <CourseToday key={c.id} course={c} showTitle={openCourses.length > 1} />
      ))}
      {openCourses.length === 1 && (
        <p className="text-sm text-ink-muted">
          More courses are coming to Almanac. <Link href="/app/courses" className="font-bold text-violet-600">See what&apos;s next</Link>
        </p>
      )}
    </>
  );
}
