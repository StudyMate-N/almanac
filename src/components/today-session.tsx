"use client";

import Link from "next/link";
import { useDueCount } from "@/components/app-nav";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { lessons as allLessons } from "@/content/course";
import type { Course, Lesson } from "@/content/types";
import { dayKey } from "@/lib/deck";
import { minutesFor } from "@/lib/minutes";
import { moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

type Row = { key: string; verb: string; text: string; minutes: number; href?: string; done: boolean };

const isToday = (iso: string | undefined) => Boolean(iso) && dayKey(new Date(iso!)) === dayKey();

/**
 * Today's session: one topic to read, questions to answer and the cards due.
 * Each row turns green once it's done today.
 */
export function TodaySession({ course }: { course: Course }) {
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

  return (
    <section aria-labelledby={`session-${course.id}`} className="alm-desk-card alm-desk-panel p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="alm-desk-eyebrow">
            Today&apos;s session{plan && week ? ` · week ${week} of ${plan.courseWeeks}` : ""}
          </p>
          <h2 id={`session-${course.id}`} className="mt-1 font-display text-[25px] leading-tight font-bold">
            {left.length ? `About ${minutes} min` : "Done for today"}
          </h2>
        </div>
        <span className="alm-desk-chip">
          {rows.length - left.length} of {rows.length} done
        </span>
      </div>
      <ul className="flex flex-col gap-0">
        {rows.map((r) => {
          const inner = (
            <>
              <span aria-hidden="true" className={`grid h-7 w-7 flex-none place-items-center rounded-full ${r.done ? "bg-correct text-white" : "bg-lilac text-violet-700"}`}>
                {r.done && <CheckIcon size={13} />}
              </span>
              <span className="min-w-0 flex-1 text-[13.5px]">
                <strong className="font-bold">{r.verb}:</strong> {r.text}
                {r.done && <span className="sr-only"> (done)</span>}
              </span>
              {!r.done && r.minutes > 0 && <span className="flex-none text-[13px] font-semibold text-ink-muted">{r.minutes} min</span>}
              {!r.done && r.href && <ArrowRightIcon size={16} className="flex-none text-violet-700" />}
            </>
          );
          const cls = `flex min-h-[61px] items-center gap-3 border-b border-[#EEEBF7] px-1 py-2.5 ${r.done ? "text-mint-ink" : "text-ink"}`;
          return <li key={r.key}>{r.href && !r.done ? <Link href={r.href} className={`${cls} hover:bg-[#F8F7FD]`}>{inner}</Link> : <div className={cls}>{inner}</div>}</li>;
        })}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {left.find(r=>r.href) ? <Link href={left.find(r=>r.href)!.href!} className="alm-desk-btn">
          {left.find(r=>r.href)!.key==="review"?"Review cards":left.find(r=>r.href)!.key==="answer"?"Start practice":"Start learning"} <ArrowRightIcon size={15}/>
         </Link>:<span className="alm-desk-chip alm-chip-ready">✓ Today's plan complete</span>}
        <span className="text-[12px] text-ink-muted">{left.length? `${left.length} step${left.length===1?"":"s"} remaining · ${minutes} min estimated` : "Your next session will appear here."}</span>
      </div>
    </section>
  );
}
