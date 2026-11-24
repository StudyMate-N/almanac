"use client";

import Link from "next/link";
import { useDueCount } from "@/components/app-nav";
import { CheckIcon } from "@/components/icons";
import { lessons as allLessons, moduleById } from "@/content/course";
import type { Course, Lesson } from "@/content/types";
import { dayKey } from "@/lib/deck";
import { minutesFor } from "@/lib/minutes";
import { daysUntil, moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

type Row = { key: string; verb: string; text: string; minutes: number; href?: string; done: boolean };

const isToday = (iso: string | undefined) => Boolean(iso) && dayKey(new Date(iso!)) === dayKey();

/**
 * Today's session data: one topic to read, questions to answer and the cards due.
 * Pure derivation from the learner's entitled, approved content and saved progress.
 */
export function useTodaySession(course: Course) {
  const { state, answers } = useStudent();
  const { modules, questions, latest, lessonOpen } = useCourse(course.id);
  const due = useDueCount();
  const plan = planFor(state, course.id);
  const week = plan ? weekToday(plan) : null;
  const weeks = plan ? moduleWeeks(plan, course.id) : null;

  const pages = allLessons.filter((l) => modules.some((m) => m.id === l.moduleId));
  const topics = pages.filter((l) => l.kind === "topic" && lessonOpen(l.id));
  const doneAt = (l: Lesson) => state.lessons[l.id]?.at;
  if (!topics.length) return null;

  // Read: the next unfinished topic in this plan week (or the course, without a plan).
  const weekTopics = weeks && week ? topics.filter((t) => weeks[t.moduleId] === week) : [];
  const nextTopic = (weekTopics.length ? weekTopics : topics).find((t) => !doneAt(t)) ?? topics.find((t) => !doneAt(t));
  const readToday = topics.filter((t) => isToday(doneAt(t))).sort((a, b) => doneAt(b)!.localeCompare(doneAt(a)!))[0];
  const read: Row = readToday
    ? { key: "read", verb: "Read", text: readToday.title, minutes: minutesFor(readToday), href: `/app/learn/${readToday.id}`, done: true }
    : nextTopic
      ? { key: "read", verb: "Read", text: nextTopic.title, minutes: minutesFor(nextTopic), href: `/app/learn/${nextTopic.id}`, done: false }
      : { key: "read", verb: "Read", text: "Every topic is done", minutes: 0, done: true };

  // Answer: the quiz after the last finished topic if it isn't done, otherwise the weakest topic.
  const answeredToday = new Set(answers.filter((a) => (a.mode === "tutor" || a.mode === "exam") && isToday(a.at)).map((a) => a.questionId)).size;
  const lastDone = topics.filter((t) => doneAt(t)).sort((a, b) => doneAt(b)!.localeCompare(doneAt(a)!))[0];
  // The page after the last finished topic is its lesson quiz only when that topic ends the lesson.
  const after = lastDone ? pages.slice(pages.indexOf(lastDone) + 1).find((p) => p.moduleId === lastDone.moduleId && (p.kind === "quiz" || p.kind === "topic")) : undefined;
  const quiz = after?.kind === "quiz" ? after : undefined;
  const openQuiz = quiz && lessonOpen(quiz.id) && !doneAt(quiz) ? quiz : undefined;
  const weakest = topicStats(questions, latest).find((t) => !/: Test$/.test(t.topic));
  let answer: Row;
  if (answeredToday >= 5 || (quiz && isToday(doneAt(quiz)))) answer = { key: "answer", verb: "Answer", text: `${answeredToday} question${answeredToday === 1 ? "" : "s"} today`, minutes: 0, done: true };
  else if (openQuiz) answer = { key: "answer", verb: "Answer", text: openQuiz.title, minutes: minutesFor(openQuiz), href: `/app/learn/${openQuiz.id}`, done: false };
  else if (weakest) answer = { key: "answer", verb: "Answer", text: `5 questions from your weakest topic, ${weakest.topic}`, minutes: 6, href: `/app/practice/weak?n=5&topic=${encodeURIComponent(weakest.topic)}`, done: false };
  else {
    const mod = (nextTopic ?? topics[0]).moduleId;
    answer = { key: "answer", verb: "Answer", text: "5 questions you haven't seen", minutes: 6, href: `/app/practice/custom?m=${mod}&t=all&l=all&p=new&n=5&mode=tutor&timer=0`, done: false };
  }

  // Review: the cards due today.
  const reviewed = state.deck?.log?.[dayKey()] ?? 0;
  const review: Row =
    due > 0
      ? { key: "review", verb: "Review", text: `${due} card${due === 1 ? "" : "s"} due`, minutes: Math.max(1, Math.round(due * 0.4)), href: "/app/review", done: false }
      : { key: "review", verb: "Review", text: reviewed ? `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed` : "No cards due", minutes: 0, done: true };

  const rows = [read, answer, review];
  const left = rows.filter((r) => !r.done);
  const minutes = left.reduce((n, r) => n + r.minutes, 0);
  const next = left.find((r) => r.href);

  // Where am I: the section of the next topic (or the last one finished).
  const here = moduleById((nextTopic ?? lastDone ?? topics[0]).moduleId);

  // The next exam date from the plan, as plain text.
  const toMid = daysUntil(plan?.midterm);
  const toFinal = daysUntil(plan?.final);
  const exam =
    toMid !== null && toMid >= 0
      ? { label: "Midterm", days: toMid, href: `/app/exam/midterm?course=${course.id}` }
      : toFinal !== null && toFinal >= 0
        ? { label: "Final", days: toFinal, href: `/app/exam/final?course=${course.id}` }
        : null;

  return { rows, left, minutes, next, plan, week, here, exam };
}

const verbLabel: Record<string, string> = { read: "Read the next topic", answer: "Answer practice questions", review: "Review your due cards" };

/**
 * Next step (Learning Studio, issue #33): one panel that answers
 * where am I, what should I do next, and how am I progressing,
 * around a single primary action. Today's three rows stay as a quiet checklist.
 */
export function TodaySession({ course }: { course: Course }) {
  const s = useTodaySession(course);
  // Explicit state, never a dead end: nothing reviewed and open yet in this course.
  if (!s)
    return (
      <section aria-labelledby={`next-${course.id}`} className="flex flex-col gap-3 rounded-[20px] border border-border bg-canvas p-5 sm:p-7">
        <p className="text-[12px] font-semibold text-text-muted">{course.title}</p>
        <h2 id={`next-${course.id}`} className="font-display text-[22px] font-bold tracking-[-.03em] text-text">
          No lessons are open yet
        </h2>
        <p className="text-[14px] text-text-body">Lessons open here once they have been reviewed and released for your course. Almanac won&apos;t show anything that isn&apos;t ready.</p>
        <Link href={`/app/courses/${course.id}`} className="inline-flex min-h-[44px] w-fit items-center rounded-full border border-border bg-canvas px-5 text-[14px] font-bold text-primary-deep hover:bg-studio">
          View the course outline →
        </Link>
      </section>
    );
  const { rows, left, minutes, next, plan, week, here, exam } = s;
  const doneCount = rows.length - left.length;
  const where = [course.title, here && here.kind === "section" ? `Section ${here.number} · ${here.title}` : here?.title, plan && week ? `Week ${week} of ${plan.courseWeeks}` : null].filter(Boolean);
  return (
    <section aria-labelledby={`next-${course.id}`} className="flex flex-col gap-5 rounded-[20px] border border-border bg-canvas p-5 sm:p-7">
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold text-text-muted">
          <span className="sr-only">Where you are: </span>
          {where.join(" · ")}
        </p>
        <p className="text-[11px] font-extrabold tracking-[.12em] text-primary-hover uppercase">{next ? "Your next step" : "Today"}</p>
        <h2 id={`next-${course.id}`} className="font-display text-[24px] leading-[1.15] font-bold tracking-[-.03em] text-text sm:text-[30px]">
          {next ? next.text : "You're done for today"}
        </h2>
        <p className="text-[14px] text-text-body">
          {next
            ? `${verbLabel[next.key]} · about ${next.minutes} min${left.length > 1 ? `, then ${left.length - 1} more step${left.length > 2 ? "s" : ""} (${minutes} min in all)` : ""}.`
            : "Everything planned for today is finished. Your next session appears here tomorrow."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {next ? (
          <Link href={next.href!} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold text-white transition-colors duration-150 hover:bg-primary-hover">
            Start: {next.verb.toLowerCase()} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-success-tint px-6 text-[15px] font-bold text-success">
            <CheckIcon size={14} /> Today&apos;s plan is done
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <h3 className="text-[12px] font-bold text-text-muted">Today&apos;s plan</h3>
        <ol className="flex flex-col gap-1">
          {rows.map((r) => {
            const inner = (
              <>
                <span aria-hidden="true" className={`grid h-[22px] w-[22px] flex-none place-items-center rounded-full ${r.done ? "bg-success text-white" : "border-[1.5px] border-border bg-canvas"}`}>
                  {r.done && <CheckIcon size={11} />}
                </span>
                <span className={`min-w-0 flex-1 text-[14px] ${r.done ? "text-text-muted line-through decoration-text-muted/40" : "text-text"}`}>
                  <b className="font-semibold">{r.verb}:</b> {r.text}
                  <span className="sr-only">{r.done ? " (done)" : ""}</span>
                </span>
                <span className="text-[12px] whitespace-nowrap text-text-muted">{r.done ? "Done" : r.minutes ? `${r.minutes} min` : ""}</span>
              </>
            );
            const cls = "flex min-h-[44px] items-center gap-3 rounded-[10px] px-2 -mx-2";
            return (
              <li key={r.key}>
                {r.href && !r.done ? (
                  <Link href={r.href} className={`${cls} hover:bg-studio`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-[13px] text-text-body">
        <span>
          <span className="sr-only">Progress: </span>
          {doneCount} of {rows.length} done today
        </span>
        {exam && (
          <Link href={exam.href} className="inline-flex min-h-[44px] items-center font-semibold text-primary-hover underline decoration-primary/30 underline-offset-4 hover:decoration-primary sm:min-h-0">
            {exam.days === 0 ? `${exam.label} is today` : `${exam.label} in ${exam.days} ${exam.days === 1 ? "day" : "days"}`} · practise the simulation
          </Link>
        )}
      </p>
    </section>
  );
}
