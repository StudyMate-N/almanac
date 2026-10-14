"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Runner } from "@/components/runner";
import { lessonById } from "@/content/course";
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

  return <Runner title={cfg.title} questions={cfg.qs} mode={cfg.mode} kind={cfg.mode === "exam" ? "exam" : "tutor"} minutes={cfg.minutes} />;
}

export default function PracticeSession() {
  return (
    <Suspense>
      <Session />
    </Suspense>
  );
}
