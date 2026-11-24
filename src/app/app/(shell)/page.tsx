"use client";

import Link from "next/link";
import { Avatar } from "@/components/page-header";
import { TodaySession } from "@/components/today-session";
import { modulesInCourse, openCourses } from "@/content/course";
import type { Course } from "@/content/types";
import { moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { firstName, useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";


/** "More ways to study": secondary routes, disclosed on request so the next step stays the one clear action. */
function MoreWays({ course, sprint }: { course?: Course; sprint: boolean }) {
  const { answers } = useStudent();
  const { questions, cases } = useCourse(course?.id ?? "");
  const checkDone = Boolean(course) && answers.some((a) => a.mode === "check" && questions.some((q) => q.id === a.questionId));
  const items = [
    { title: "Guided study (pilot)", sub: "Tell Almanac your goal and time; get one suggested step and the reason for it.", href: "/app/learning-compass" },
    course && !checkDone && questions.length >= 5 && { title: "Take the starting check", sub: "See where you stand across the sections.", href: `/app/exam/check?course=${course.id}` },
    course && cases[0] && { title: `NGN case: ${cases[0].title}`, sub: "Six items, from cues to outcomes.", href: `/app/case/${cases[0].id}` },
    sprint && { title: "NUR-635 midterm sprint", sub: "Eight topics: lessons, practice, flashcards and simulations.", href: "/app/midterm/nur635" },
    { title: "Ask a coach", sub: "Send a question about any page or answer.", href: "/app/coach" },
  ].filter(Boolean) as { title: string; sub: string; href: string }[];
  return (
    <details className="group rounded-[20px] border border-border bg-canvas">
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 rounded-[20px] px-5 text-[14px] font-bold text-text [&::-webkit-details-marker]:hidden">
        More ways to study
        <span aria-hidden="true" className="text-text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none">
          ⌄
        </span>
      </summary>
      <ul className="flex flex-col border-t border-border px-2 py-2">
        {items.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="flex min-h-[52px] flex-col justify-center gap-0.5 rounded-[12px] px-3 py-2.5 hover:bg-studio">
              <span className="text-[14px] font-semibold text-text">{t.title}</span>
              <span className="text-[12.5px] text-text-muted">{t.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** "This week": readiness for the sections in this plan week, plus the starting check. */
function ThisWeek({ course }: { course: Course }) {
  const { state, answers } = useStudent();
  const { modules, questions, scored } = useCourse(course.id);
  const plan = planFor(state, course.id);
  const weeks = plan ? moduleWeeks(plan, course.id) : null;
  const week = plan ? weekToday(plan) : null;
  const sections = modules.filter((m) => m.kind === "section");
  const thisWeek = weeks && week ? sections.filter((m) => weeks[m.id] === week || weeks[m.id] === week + 1).slice(0, 2) : sections.slice(0, 2);
  const rows = (thisWeek.length ? thisWeek : sections.slice(0, 2)).map((m) => {
    const r = readiness(questions.filter((q) => q.moduleId === m.id), scored);
    return { title: m.title, label: readinessLabel[r.level], tone: readinessTone[r.level], pct: r.percent ?? 0 };
  });
  const checkDone = answers.some((a) => a.mode === "check" && questions.some((q) => q.id === a.questionId));
  rows.push({ title: "Starting check", label: checkDone ? "Done" : "Not started", tone: checkDone ? readinessTone.ready : readinessTone["not-started"], pct: checkDone ? 100 : 0 });
  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-hairline bg-white px-[18px] py-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-bold">This week</h2>
        <Link href={`/app/courses/${course.id}`} className="text-[12px] font-bold text-violet-700">
          Course outline
        </Link>
      </div>
      {rows.map((x) => (
        <div key={x.title} className="flex flex-col gap-[5px]">
          <div className="flex items-start justify-between gap-2 text-[12.5px]">
            <span className="font-bold">{x.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${x.tone.chip}`}>{x.label}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#EFEDF5]">
            <div className={`h-full rounded-full ${x.tone.bar}`} style={{ width: `${x.pct}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}

/**
 * Learner home (Learning Studio, issue #33). The first view answers
 * where am I, what should I work on next and how am I progressing,
 * around one primary action. Everything else is one disclosure away.
 */
export default function Today() {
  const { profile, authorizedCourses } = useStudent();
  const name = firstName(profile);
  const owned = openCourses.filter((c) => authorizedCourses.includes(c.id));
  const courses = owned.filter((c) => modulesInCourse(c.id).length > 0);
  const sprint = authorizedCourses.includes("advanced-pharmacology");
  const main = courses[0];
  return (
    <div className="mx-auto max-w-[1144px]">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-text-muted">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
          <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.035em] sm:text-[32px]">{name ? `Hi, ${name}` : "Today"}</h1>
        </div>
        <Avatar />
      </div>

      {!main && !sprint ? (
        <section aria-labelledby="no-courses" className="rounded-[20px] border border-border bg-canvas p-6 sm:p-7">
          <h2 id="no-courses" className="font-display text-[22px] font-bold">Your courses appear here</h2>
          <p className="mt-2 text-[14px] text-text-body">Once an enrollment is approved, this page shows the one thing to study next and how you&apos;re progressing.</p>
          <Link href="/app/courses" className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 text-[14px] font-bold text-white hover:bg-primary-hover">
            Your courses →
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            {courses.map((c) => (
              <TodaySession key={c.id} course={c} />
            ))}
            {!main && sprint && (
              <section aria-labelledby="next-sprint" className="flex flex-col gap-3 rounded-[20px] border border-border bg-canvas p-5 sm:p-7">
                <p className="text-[12px] font-semibold text-text-muted">NUR-635 Advanced Pharmacology · Midterm sprint</p>
                <p className="text-[11px] font-extrabold tracking-[.12em] text-primary-hover uppercase">Your next step</p>
                <h2 id="next-sprint" className="font-display text-[24px] font-bold tracking-[-.03em] sm:text-[30px]">Continue the midterm sprint</h2>
                <p className="text-[14px] text-text-body">Eight topics, each with a lesson, practice, flashcards and a simulation.</p>
                <Link href="/app/midterm/nur635" className="inline-flex min-h-[48px] w-fit items-center rounded-full bg-primary px-6 text-[15px] font-bold text-white hover:bg-primary-hover">
                  Open the sprint →
                </Link>
              </section>
            )}
            <MoreWays course={main} sprint={Boolean(main) && sprint} />
          </div>
          {main && (
            <aside aria-label="Progress this week" className="flex flex-col gap-3.5">
              <ThisWeek course={main} />
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
