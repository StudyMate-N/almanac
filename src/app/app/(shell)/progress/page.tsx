"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { modulesInCourse, openCourses } from "@/content/course";
import { daysUntil, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone, topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

/**
 * Progress overview (Learning Studio, issue #33): where you are in the plan,
 * one row per section, then one thing to revisit. Visible, never noisy:
 * existing readiness data only, no new metrics or decorative numbers.
 */
export default function Progress() {
  const { answers, state, authorizedCourses } = useStudent();
  const { modules, questions, latest, scored } = useCourse();
  const course = openCourses.find((c) => authorizedCourses.includes(c.id) && modulesInCourse(c.id).length > 0);

  const seen = questions.filter((q) => latest.has(q.id));
  const missed = seen.filter((q) => !latest.get(q.id)!.correct).length;
  const weakest = topicStats(questions, latest)
    .filter((t) => !/: Test$/.test(t.topic))
    .slice(0, 3);

  // Plan line: "Week 3 of 11 · Midterm in 12 days".
  const plan = course ? planFor(state, course.id) : null;
  const week = plan ? weekToday(plan) : null;
  const toMid = daysUntil(plan?.midterm);
  const toFinal = daysUntil(plan?.final);
  const exam = toMid !== null && toMid >= 0 ? { label: "Midterm", days: toMid } : toFinal !== null && toFinal >= 0 ? { label: "Final", days: toFinal } : null;
  const planLine = [
    plan && week ? `Week ${week} of ${plan.courseWeeks}` : null,
    exam ? (exam.days === 0 ? `${exam.label} is today` : `${exam.label} in ${exam.days} ${exam.days === 1 ? "day" : "days"}`) : null,
  ].filter(Boolean);

  const sections = modules
    .map((m) => ({ m, r: readiness(questions.filter((q) => q.moduleId === m.id), scored) }))
    .filter(({ r }) => r.total > 0);

  const sims = answers.filter((a) => ["midterm", "final", "check"].includes(a.mode));
  const simSessions = [...new Map(sims.map((a) => [a.sessionId, a])).values()].map((a) => {
    const rows = sims.filter((s) => s.sessionId === a.sessionId);
    return { id: a.sessionId, mode: a.mode, at: a.at, n: rows.length, right: rows.filter((r) => r.correct).length };
  });

  // One thing to revisit, with one primary action.
  const revisit =
    missed > 0
      ? { title: weakest[0] ? `Start with ${weakest[0].topic}` : "Revisit what you missed", body: `${missed} question${missed === 1 ? "" : "s"} you answered last time ${missed === 1 ? "was" : "were"} not correct. Redo them with the explanations open.`, href: "/app/practice/missed", action: `Redo the ${missed} you missed` }
      : weakest[0]
        ? { title: `Strengthen ${weakest[0].topic}`, body: `Your lowest topic so far (${weakest[0].percent}% of ${weakest[0].seen}). A short set keeps it from slipping.`, href: `/app/practice/weak?n=5&topic=${encodeURIComponent(weakest[0].topic)}`, action: "Practise 5 questions" }
        : { title: "Nothing to revisit yet", body: "Answer a few practice questions and the topic that needs attention will show here.", href: "/app/practice", action: "Go to practice" };

  if (!course && sections.length === 0)
    return (
      <>
        <PageHeader eyebrow="Your progress" title="Where you stand" />
        <section aria-labelledby="no-progress" className="rounded-[20px] border border-border bg-canvas p-6 sm:p-7">
          <h2 id="no-progress" className="font-display text-[22px] font-bold">Your progress appears here</h2>
          <p className="mt-2 text-[14px] text-text-body">Once an enrollment is approved, this page shows your place in the plan and how each section is going.</p>
          <Link href="/app/courses" className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 text-[14px] font-bold text-white hover:bg-primary-hover">
            Your courses →
          </Link>
        </section>
      </>
    );

  return (
    <>
      <PageHeader eyebrow="Your progress" title="Where you stand" />
      {planLine.length > 0 && (
        <p className="-mt-2 mb-5 text-[14px] font-semibold text-text-body">
          <span className="sr-only">Plan: </span>
          {course ? `${course.title} · ` : ""}
          {planLine.join(" · ")}
        </p>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="by-section" className="rounded-[20px] border border-border bg-canvas p-5 sm:p-6">
          <h2 id="by-section" className="font-display text-[18px] font-bold">By section</h2>
          <ul className="mt-2 flex flex-col">
            {sections.map(({ m, r }) => (
              <li key={m.id} className="flex flex-col gap-2 border-t border-border py-3.5 first:border-t-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[14px] font-semibold text-text">{m.title}</span>
                  <span className="flex items-center gap-2.5">
                    <span className="text-[12.5px] text-text-muted">{r.percent === null ? `0 of ${r.total} answered` : `${r.percent}% correct · ${r.answered} of ${r.total}`}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold whitespace-nowrap ${readinessTone[r.level].chip}`}>{readinessLabel[r.level]}</span>
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-track"
                  role="progressbar"
                  aria-label={`${m.title}: ${readinessLabel[r.level]}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={r.percent ?? 0}
                >
                  <div className={`h-full rounded-full ${readinessTone[r.level].bar}`} style={{ width: `${r.percent ?? 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="flex flex-col gap-4">
          <section aria-labelledby="revisit" className="flex flex-col gap-3 rounded-[20px] border border-border bg-canvas p-5 sm:p-6">
            <p className="text-[11px] font-extrabold tracking-[.12em] text-primary-hover uppercase">What to revisit</p>
            <h2 id="revisit" className="font-display text-[19px] leading-snug font-bold">{revisit.title}</h2>
            <p className="text-[14px] text-text-body">{revisit.body}</p>
            {weakest.length > 1 && (
              <ul className="flex flex-col gap-1 border-t border-border pt-3 text-[13px] text-text-body">
                {weakest.map((t) => (
                  <li key={t.topic} className="flex justify-between gap-2">
                    <span>{t.topic}</span>
                    <span className="text-text-muted">
                      {t.percent}% of {t.seen}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={revisit.href} className="mt-1 inline-flex min-h-[48px] w-fit items-center rounded-full bg-primary px-5 text-[14px] font-bold text-white hover:bg-primary-hover">
              {revisit.action} →
            </Link>
          </section>

          <details className="rounded-[20px] border border-border bg-canvas">
            <summary className="flex min-h-[52px] cursor-pointer items-center px-5 text-[14px] font-bold text-text">Simulation history</summary>
            <div className="border-t border-border px-5 py-4">
              {simSessions.length === 0 ? (
                <p className="text-[13px] text-text-muted">
                  No simulations yet. They&apos;re in{" "}
                  <Link href="/app/practice" className="font-bold text-violet-700 underline underline-offset-2">
                    Practice
                  </Link>
                  .
                </p>
              ) : (
                <ul className="flex flex-col gap-2 text-[13px]">
                  {simSessions.map((s) => (
                    <li key={s.id} className="flex justify-between gap-2">
                      <span className="font-semibold capitalize">
                        {s.mode === "check" ? "Starting check" : s.mode} · {new Date(s.at).toLocaleDateString()}
                      </span>
                      <span>
                        {s.right}/{s.n} ({Math.round((s.right / s.n) * 100)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </aside>
      </div>
    </>
  );
}
