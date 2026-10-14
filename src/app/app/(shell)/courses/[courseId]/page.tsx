"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRightIcon, CheckIcon, PlayIcon } from "@/components/icons";
import { Ring } from "@/components/player/outline";
import { courseById, groupsInModule } from "@/content/course";
import { EXAMS } from "@/lib/config";
import { moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

const tints = ["bg-lilac", "bg-peach", "bg-mint", "bg-sky"];
const inks = ["text-violet-700", "text-peach-ink", "text-mint-ink", "text-sky-ink"];

export default function CourseOutline() {
  const { courseId } = useParams<{ courseId: string }>();
  const { state } = useStudent();
  const { modules, lessons, questions, scored } = useCourse(courseId);
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

  const open = new Set(lessons.map((l) => l.id));
  const done = (id: string) => Boolean(state.lessons[id]);
  const allPages = modules.flatMap((m) => groupsInModule(m.id).flatMap((g) => g.pages));
  const doneCount = allPages.filter((p) => done(p.id)).length;
  const resume = allPages.find((p) => open.has(p.id) && !done(p.id)) ?? allPages.find((p) => open.has(p.id));
  const start = modules.find((m) => m.kind === "start");
  const final = modules.find((m) => m.kind === "final");
  const sections = modules.filter((m) => m.kind === "section");
  const firstOpen = (moduleId: string) => {
    const ps = groupsInModule(moduleId).flatMap((g) => g.pages).filter((p) => open.has(p.id));
    return ps.find((p) => !done(p.id)) ?? ps[0];
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm font-semibold text-ink-muted">
        <Link href="/app/courses" className="hover:text-ink">
          Courses
        </Link>{" "}
        / {course.title}
      </nav>

      <section className="relative mb-5 overflow-hidden rounded-tile bg-violet p-6 text-white sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-violet-decor" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-[46%] hidden h-44 w-44 rounded-full bg-tangerine/90 lg:block" />
        <div className="relative flex flex-wrap items-end gap-6">
          <div className="min-w-0 flex-[1_1_380px]">
            <p className="text-sm font-bold text-violet-on">{course.category}</p>
            <h1 className="font-display text-[34px] leading-tight font-semibold sm:text-[42px]">{course.title}</h1>
            <p className="mt-2 max-w-xl text-violet-on">{course.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {resume && (
                <Link href={`/app/learn/${resume.id}`} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-tangerine px-6 font-bold text-ink">
                  <PlayIcon size={14} /> {doneCount ? "Continue" : "Start the course"}
                </Link>
              )}
              <Link href={`/app/setup?course=${course.id}`} className="inline-flex min-h-[52px] items-center rounded-full bg-white/15 px-5 font-bold text-white hover:bg-white/25">
                {plan ? `Week ${week} of ${plan.courseWeeks} · edit plan` : "Set up your plan"}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-card bg-white/10 p-4">
            <Ring done={doneCount} total={allPages.length} size={64} tone="white" />
            <div>
              <p className="font-display text-[26px] leading-none font-semibold">
                {doneCount}
                <span className="text-[16px] text-violet-on"> / {allPages.length}</span>
              </p>
              <p className="text-sm text-violet-on">pages done</p>
            </div>
          </div>
        </div>
      </section>
      <p className="mb-6 max-w-2xl text-sm text-ink-muted">{course.fit} Almanac is independent and not affiliated with any school or publisher.</p>

      {start && (
        <Link href={firstOpen(start.id) ? `/app/learn/${firstOpen(start.id)!.id}` : "#"} className="mb-5 flex flex-wrap items-center gap-4 rounded-tile bg-white p-5 hover:bg-mist">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-lilac font-display text-xl text-violet-700" aria-hidden="true">
            ★
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold tracking-wide text-violet-600 uppercase">Start here</span>
            <span className="block font-display text-[19px] font-semibold">{start.title}</span>
            <span className="block text-sm text-ink-muted">{start.blurb}</span>
          </span>
          <Ring done={groupsInModule(start.id).flatMap((g) => g.pages).filter((p) => done(p.id)).length} total={groupsInModule(start.id).flatMap((g) => g.pages).length} size={40} />
        </Link>
      )}

      <h2 className="mb-3 font-display text-[22px] font-semibold">Seven competencies</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((m, i) => {
          const groups = groupsInModule(m.id);
          const pages = groups.flatMap((g) => g.pages);
          const d = pages.filter((p) => done(p.id)).length;
          // Topic pages (course standard v1); sections not yet restructured list their lessons.
          const topics = pages.filter((p) => p.kind === "topic");
          const rows = topics.length
            ? topics.map((p) => ({ id: p.id, title: p.title, pages: [p] }))
            : groups.filter((g) => /^Lesson \d+:/.test(g.title));
          const r = readiness(
            questions.filter((q) => q.moduleId === m.id),
            scored,
          );
          const go = firstOpen(m.id);
          const test = pages.find((p) => p.kind === "test");
          return (
            <section key={m.id} aria-labelledby={`sec-${m.id}`} className="flex flex-col rounded-tile bg-white p-5">
              <div className="mb-3 flex items-start gap-3">
                <span className={`grid h-12 w-12 flex-none place-items-center rounded-2xl font-display text-[22px] font-semibold ${tints[i % 4]} ${inks[i % 4]}`}>{m.number}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">
                    Section {m.number}
                    {weeks ? ` · week ${weeks[m.id]}${week === weeks[m.id] ? " (now)" : ""}` : ""}
                  </p>
                  <h3 id={`sec-${m.id}`} className="font-display text-[19px] leading-snug font-semibold">
                    {m.title}
                  </h3>
                </div>
                <Ring done={d} total={pages.length} size={38} />
              </div>
              <p className="mb-3 text-sm text-ink-body">{m.blurb}</p>
              <ul className="mb-4 flex flex-col gap-1.5">
                {rows.map((g) => {
                  const gd = g.pages.filter((p) => done(p.id)).length;
                  const gOpen = g.pages.find((p) => open.has(p.id));
                  const single = g.pages.length === 1;
                  return (
                    <li key={g.id}>
                      {gOpen ? (
                        <Link href={`/app/learn/${gOpen.id}`} className="flex items-center gap-2 rounded-xl bg-mist px-3 py-2 text-[14px] font-semibold hover:bg-lilac">
                          <span className="min-w-0 flex-1">{g.title}</span>
                          {single ? (
                            gd > 0 && (
                              <span className="grid h-5 w-5 place-items-center rounded-full bg-correct text-white" aria-label="Done">
                                <CheckIcon size={10} />
                              </span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-ink-muted">
                              {gd}/{g.pages.length}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 rounded-xl bg-mist px-3 py-2 text-[14px] font-semibold opacity-70">
                          <span className="min-w-0 flex-1">{g.title}</span>
                          <span className="text-xs font-bold text-ink-muted">In review</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                {go ? (
                  <Link href={`/app/learn/${go.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-violet px-4 text-sm font-bold text-white">
                    {d ? "Continue" : "Begin"} <ArrowRightIcon size={14} />
                  </Link>
                ) : (
                  <span className="rounded-full bg-mist px-4 py-2 text-sm font-bold text-ink-muted">Pages in review</span>
                )}
                {test && open.has(test.id) && (
                  <Link href={`/app/learn/${test.id}`} className="min-h-11 rounded-full bg-mist px-4 py-2.5 text-sm font-bold text-violet-700">
                    Section test
                  </Link>
                )}
                {r.total > 0 && <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${readinessTone[r.level].chip}`}>{readinessLabel[r.level]}</span>}
              </div>
            </section>
          );
        })}
      </div>

      {final && (
        <section className="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Link href={firstOpen(final.id) ? `/app/learn/${firstOpen(final.id)!.id}` : "#"} className="rounded-tile bg-mint p-6 hover:brightness-95">
            <p className="text-xs font-extrabold tracking-wide text-mint-ink uppercase">Finish</p>
            <p className="font-display text-[22px] font-semibold">{final.title}</p>
            <p className="text-sm text-mint-ink">{final.blurb}</p>
          </Link>
          <Link href={`/app/exam/final?course=${course.id}`} className="flex flex-col justify-between rounded-tile bg-ink p-6 text-white hover:bg-violet-deep">
            <p className="text-xs font-extrabold tracking-wide text-violet-200 uppercase">Full-length simulation</p>
            <p className="font-display text-[22px] font-semibold">
              {EXAMS.final.questions} questions · {EXAMS.final.minutes} minutes
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 font-bold text-tangerine">
              Start when ready <ArrowRightIcon size={14} />
            </span>
          </Link>
        </section>
      )}
    </>
  );
}
