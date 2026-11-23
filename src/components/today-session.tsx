"use client";

import Link from "next/link";
import { useDueCount } from "@/components/app-nav";
import { CheckIcon } from "@/components/icons";
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

  const next = left.find((r) => r.href);
  return (
    <section
      aria-labelledby={`session-${course.id}`}
      className="flex flex-col gap-3.5 rounded-[20px] border border-hairline p-4 sm:p-5"
      style={{ background: "radial-gradient(60% 120% at 100% 0%,#ECE7FF 0%,rgba(236,231,255,0) 70%),#FFFFFF" }}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-[3px]">
          <span className="text-[11px] font-extrabold tracking-[.12em] text-violet-700 uppercase">
            Today&apos;s session{plan && week ? ` · week ${week} of ${plan.courseWeeks}` : ""}
          </span>
          <h2 id={`session-${course.id}`} className="font-display text-[22px] font-bold tracking-[-.03em] sm:text-[24px]">
            {left.length ? `About ${minutes} min` : "Done for today"}
          </h2>
        </div>
        <span className="rounded-full bg-lilac px-[11px] py-[5px] text-[12px] font-bold whitespace-nowrap text-violet-deep">
          {rows.length - left.length} of {rows.length} done
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {rows.map((r) => {
          const inner = (
            <>
              <span aria-hidden="true" className={`grid h-[26px] w-[26px] place-items-center rounded-full text-[12px] font-extrabold text-white ${r.done ? "bg-correct" : "border-[1.5px] border-[#D9D2F3] bg-white"}`}>
                {r.done && <CheckIcon size={12} />}
              </span>
              <span className={`min-w-0 text-[14px] ${r.done ? "text-[#14532D]" : "text-ink"}`}>
                <b>{r.verb}:</b> {r.text}
                {r.done && <span className="sr-only"> (done)</span>}
              </span>
              <span
                className={`rounded-full px-[9px] py-[3px] text-[12px] font-bold whitespace-nowrap ${r.done ? "bg-mint text-correct" : r.key === "review" ? "bg-[#FFE9DC] text-[#A8430A]" : "bg-mist text-ink-muted"} ${!r.done && !r.minutes ? "invisible" : ""}`}
              >
                {r.done ? "Done" : `${r.minutes} min`}
              </span>
              <span className="w-3.5 text-[15px] font-bold text-violet-700" aria-hidden="true">
                {r.done || !r.href ? "" : "→"}
              </span>
            </>
          );
          const cls = `grid min-h-[52px] grid-cols-[28px_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-[14px] border px-3.5 py-1.5 ${r.done ? "border-[#BFE6D1] bg-[#F2FBF6]" : "border-hairline bg-white hover:border-[#C9BEF7]"}`;
          return <li key={r.key}>{r.href && !r.done ? <Link href={r.href} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>}</li>;
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        {next ? (
          <Link href={next.href!} className="flex h-[42px] items-center rounded-full bg-violet px-5 text-[14px] font-bold text-white hover:bg-[#4A2DE6]">
            Continue: {next.verb.toLowerCase()} →
          </Link>
        ) : (
          <span className="flex h-[42px] items-center rounded-full bg-mint px-5 text-[14px] font-bold text-correct">✓ Today&apos;s plan is done</span>
        )}
        <span className="text-[12px] text-ink-muted">{next ? "Rows turn green as you finish them today." : "Your next session appears here tomorrow."}</span>
      </div>
    </section>
  );
}