"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { Runner } from "@/components/runner";
import { courseById, lessonById, modules } from "@/content/course";
import { shuffled } from "@/lib/hash";
import { topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

function Session() {
  const { setId } = useParams<{ setId: string }>();
  const sp = useSearchParams();
  const { state } = useStudent();
  const { questions, latest } = useCourse();
  const [seed] = useState(() => String(Date.now()));

  const cfg = useMemo(() => {
    const lesson = lessonById(setId);
    if (lesson) return { title: lesson.shortTitle ?? lesson.title, qs: questions.filter((q) => q.lessonId === setId), mode: "tutor" as const, minutes: undefined };
    if (setId === "missed") return { title: "Questions you missed", qs: questions.filter((q) => latest.get(q.id)?.correct === false), mode: "tutor" as const, minutes: undefined };
    if (setId === "weak") {
      // Weakest topics first (lowest share right last time); within a topic, missed questions first.
      const n = Number(sp.get("n") ?? 10);
      const only = sp.get("topic");
      const ranked = topicStats(questions, latest).filter((t) => !/: Test$/.test(t.topic) && (!only || t.topic === only));
      const qs = ranked.flatMap((t) => {
        const pool = shuffled(questions.filter((q) => q.topic === t.topic), seed);
        return [...pool.filter((q) => latest.get(q.id)?.correct === false), ...pool.filter((q) => latest.get(q.id)?.correct !== false)];
      });
      return { title: only ? `Weak spot: ${only}` : "Your weak spots", qs: qs.slice(0, n), mode: "tutor" as const, minutes: undefined };
    }
    if (setId === "flagged") return { title: "Flagged questions", qs: questions.filter((q) => state.flags[q.id]), mode: "tutor" as const, minutes: undefined };
    // Custom set from the practice builder.
    const mods = (sp.get("m") ?? "").split(",").filter(Boolean);
    const type = sp.get("t") ?? "all";
    const level = sp.get("l") ?? "all";
    const pool = sp.get("p") ?? "all";
    const n = Number(sp.get("n") ?? 10);
    const mode = sp.get("mode") === "exam" ? ("exam" as const) : ("tutor" as const);
    let qs = questions.filter(
      (q) =>
        (!mods.length || mods.includes(q.moduleId)) &&
        (type === "all" || q.type === type) &&
        (level === "all" || q.level === level) &&
        (pool === "all" ||
          (pool === "new" && !latest.has(q.id)) ||
          (pool === "missed" && latest.get(q.id)?.correct === false) ||
          (pool === "flagged" && state.flags[q.id])),
    );
    qs = shuffled(qs, seed).slice(0, n > 0 ? n : qs.length);
    return { title: "Your practice set", qs, mode, minutes: sp.get("timer") === "1" ? Math.max(1, Math.round(qs.length * 1.2)) : undefined };
    // The set is fixed once built, so later answers don't reshuffle it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId, seed]);

  // /app/practice/weak with no set parameters shows the weak-spots list (design 16b).
  if (setId === "weak" && !sp.get("n") && !sp.get("topic")) return <WeakSpots />;
  const courseId = modules.find((m) => m.id === cfg.qs[0]?.moduleId)?.courseId;
  const eyebrow = courseId ? courseById(courseId)?.title : undefined;
  return <Runner eyebrow={eyebrow} title={cfg.title} questions={cfg.qs} mode={cfg.mode} kind={cfg.mode === "exam" ? "exam" : "tutor"} minutes={cfg.minutes} />;
}

/** Weak spots (design 16b): topics by last-attempt % correct, lowest first, each with its own set. */
function WeakSpots() {
  const { questions, latest } = useCourse();
  const topics = topicStats(questions, latest).filter((t) => !/: Test$/.test(t.topic));
  const missed = (t: string) => questions.filter((q) => q.topic === t && latest.get(q.id)?.correct === false).length;
  return (
    <div className="alm-focus min-h-dvh pb-28">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#EEEBF7] bg-white px-1.5 sm:h-[60px] sm:px-4">
        <Link href="/app/practice" aria-label="Back to Practice" className="grid h-11 w-11 place-items-center text-[18px]">
          ←
        </Link>
        <span className="font-display text-[15px] font-bold">Practice</span>
      </header>
      <main className="mx-auto flex max-w-[640px] flex-col gap-3 px-4 pt-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">LOWEST SCORE FIRST</span>
          <h1 className="font-display text-[26px] leading-tight font-bold tracking-[-.03em]">Your weak spots</h1>
          <p className="text-[14px] leading-normal text-ink-body">Based on your latest answer to each question. Missed questions come first in each set.</p>
        </div>
        {topics.length === 0 && <p className="rounded-[16px] border border-hairline bg-white p-5 text-[14px] text-ink-body">Answer a few practice questions first. Your weakest topics appear here.</p>}
        {topics.map((t) => {
          const strong = t.percent >= 75;
          const m = missed(t.topic);
          return (
            <div key={t.topic} className="flex flex-col gap-3 rounded-[16px] border border-hairline bg-white p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-bold">{t.topic}</span>
                <span className={`font-display text-[18px] font-bold ${strong ? "text-correct" : "text-ink"}`}>{t.percent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#EFEDF5]">
                <div className={`h-full ${strong ? "bg-correct" : "bg-violet"}`} style={{ width: `${t.percent}%` }} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-ink-muted">
                  {m} of {t.seen} missed last time
                </span>
                <Link href={`/app/practice/weak?topic=${encodeURIComponent(t.topic)}&n=10`} className="flex h-11 items-center rounded-[12px] border-[1.5px] border-violet px-4 text-[14px] font-bold text-violet-700 hover:bg-mist">
                  Practise
                </Link>
              </div>
            </div>
          );
        })}
      </main>
      {topics.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-[#EEEBF7] bg-white px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <Link href="/app/practice/weak?n=10" className="mx-auto flex h-[52px] max-w-[640px] items-center justify-center rounded-[12px] bg-violet text-[15px] font-bold text-white">
            Start 10 questions
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PracticeSession() {
  return (
    <Suspense>
      <Session />
    </Suspense>
  );
}
