"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { courseById, openCourses } from "@/content/course";
import { Runner } from "@/components/runner";
import { EXAMS } from "@/lib/config";
import { shuffled } from "@/lib/hash";
import { modulesBefore, planFor } from "@/lib/plan";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

/** Midterm and final simulations, and the starting check. Timed, answers at the end. */
export default function ExamPage() {
  return (
    <Suspense>
      <Exam />
    </Suspense>
  );
}

function Exam() {
  const { kind } = useParams<{ kind: "midterm" | "final" | "check" }>();
  const courseId = courseById(useSearchParams().get("course") ?? "")?.id ?? openCourses[0].id;
  const { state } = useStudent();
  const { questions, course } = useCourse(courseId);
  const [seed] = useState(() => String(Date.now()));
  const spec = EXAMS[kind] ?? EXAMS.check;

  const qs = useMemo(() => {
    const plan = planFor(state, courseId);
    let pool = questions;
    if (kind === "midterm" && plan) {
      const mods = modulesBefore(plan, plan.midterm, courseId);
      pool = questions.filter((q) => mods.includes(q.moduleId));
    }
    // Spread the starting check across modules.
    if (kind === "check") {
      const byMod = new Map<string, typeof questions>();
      for (const q of shuffled(questions, seed)) byMod.set(q.moduleId, [...(byMod.get(q.moduleId) ?? []), q]);
      const out: typeof questions = [];
      while (out.length < spec.questions && [...byMod.values()].some((l) => l.length)) {
        for (const l of byMod.values()) if (l.length && out.length < spec.questions) out.push(l.shift()!);
      }
      return out;
    }
    return shuffled(pool, seed).slice(0, spec.questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, seed, courseId]);

  // Scale the time if the bank cannot fill the full length yet.
  const minutes = Math.max(5, Math.round((spec.minutes * qs.length) / spec.questions));
  const base = `${course?.title ?? ""} · ${spec.label}`;
  const title = qs.length < spec.questions ? `${base} · ${qs.length} of ${spec.questions} questions available` : base;
  return <Runner title={title} questions={qs} mode="exam" kind={kind} minutes={minutes} backHref={kind === "check" ? "/app" : "/app/practice"} />;
}
