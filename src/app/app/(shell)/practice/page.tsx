"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { courseById, lessons, openCourses } from "@/content/course";
import { EXAMS } from "@/lib/config";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={`min-h-10 rounded-full px-4 text-sm font-bold ${value === v ? "bg-violet text-white" : "bg-mist text-ink-muted"}`}>
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function PracticePage() {
  return (
    <Suspense>
      <Practice />
    </Suspense>
  );
}

function Practice() {
  const { state } = useStudent();
  const sp = useSearchParams();
  const [courseId, setCourseId] = useState(() => courseById(sp.get("course") ?? "")?.id ?? openCourses[0].id);
  const { modules, questions, latest, cases, course } = useCourse(courseId);
  const [mods, setMods] = useState<string[]>([]);
  const [type, setType] = useState<"all" | "single" | "multiple">("all");
  const [level, setLevel] = useState<"all" | "recall" | "application" | "analysis">("all");
  const [pool, setPool] = useState<"all" | "new" | "missed" | "flagged">("all");
  const [count, setCount] = useState<"5" | "10" | "20" | "0">("10");
  const [mode, setMode] = useState<"tutor" | "exam">("tutor");
  const [timer, setTimer] = useState<"0" | "1">("0");

  const available = useMemo(
    () =>
      questions.filter(
        (q) =>
          (!mods.length || mods.includes(q.moduleId)) &&
          (type === "all" || q.type === type) &&
          (level === "all" || q.level === level) &&
          (pool === "all" || (pool === "new" && !latest.has(q.id)) || (pool === "missed" && latest.get(q.id)?.correct === false) || (pool === "flagged" && state.flags[q.id])),
      ).length,
    [questions, mods, type, level, pool, latest, state.flags],
  );
  const size = count === "0" ? available : Math.min(Number(count), available);
  const withQs = modules.filter((m) => questions.some((q) => q.moduleId === m.id));
  const lessonSets = lessons.filter((l) => questions.some((q) => q.lessonId === l.id));
  // Only offer levels that have questions.
  const levelOptions = ([["all", "Any"], ["recall", "Recall"], ["application", "Application"], ["analysis", "Analysis"]] as [typeof level, string][]).filter(
    ([v]) => v === "all" || questions.some((q) => q.level === v),
  );
  const cq = `?course=${courseId}`;
  const href = `/app/practice/custom?m=${(mods.length ? mods : withQs.map((m) => m.id)).join(",")}&t=${type}&l=${level}&p=${pool}&n=${count}&mode=${mode}&timer=${timer}`;

  return (
    <>
      <PageHeader eyebrow={`${course?.title ?? ""} · ${questions.length} questions available`} title="Practice" />
      {openCourses.length > 1 && (
        <div className="mb-5">
          <Chips label="Course" value={courseId} onChange={(v) => { setCourseId(v); setMods([]); }} options={openCourses.map((c) => [c.id, c.title] as [string, string])} />
        </div>
      )}
      {questions.length === 0 && <p className="mb-5 rounded-tile bg-white p-6 text-ink-body">Questions appear here once our nurse reviewer approves them.</p>}

      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        {(["midterm", "final"] as const).map((k) => (
          <Link key={k} href={`/app/exam/${k}${cq}`} className="rounded-tile bg-sky p-5 text-sky-ink hover:brightness-95">
            <p className="text-xs font-bold">Exam simulation</p>
            <p className="font-display text-lg font-semibold">{EXAMS[k].label}</p>
            <p className="text-sm">
              {Math.min(EXAMS[k].questions, questions.length)} of {EXAMS[k].questions} questions available · timed · new questions first, answers at the end
            </p>
          </Link>
        ))}
        {cases.map((c) => (
          <Link key={c.id} href={`/app/case/${c.id}`} className="rounded-tile bg-mint p-5 text-mint-ink hover:brightness-95">
            <p className="text-xs font-bold">NGN case study</p>
            <p className="font-display text-lg font-semibold">{c.title}</p>
            <p className="text-sm">Six items, from cues to outcomes</p>
          </Link>
        ))}
      </section>

      <section className="mb-5 flex flex-col gap-4 rounded-tile bg-white p-6">
        <h2 className="font-display text-[21px] font-semibold">Build a practice set</h2>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Modules</legend>
          <div className="flex flex-wrap gap-2">
            {withQs.map((m) => {
              const on = mods.includes(m.id);
              return (
                <button key={m.id} type="button" aria-pressed={on} onClick={() => setMods(on ? mods.filter((x) => x !== m.id) : [...mods, m.id])} className={`min-h-10 rounded-full px-4 text-sm font-bold ${on ? "bg-violet text-white" : "bg-mist text-ink-muted"}`}>
                  {m.title}
                </button>
              );
            })}
            {withQs.length === 0 && <span className="text-sm text-ink-muted">None yet</span>}
          </div>
        </fieldset>
        <Chips label="Question type" value={type} onChange={setType} options={[["all", "All"], ["single", "One best answer"], ["multiple", "Select all that apply"]]} />
        <Chips label="Level" value={level} onChange={setLevel} options={levelOptions} />
        <Chips label="Questions" value={pool} onChange={setPool} options={[["all", "All"], ["new", "Not seen yet"], ["missed", "Missed last time"], ["flagged", "Flagged"]]} />
        <Chips label="How many" value={count} onChange={setCount} options={[["5", "5"], ["10", "10"], ["20", "20"], ["0", "All"]]} />
        <Chips label="Mode" value={mode} onChange={setMode} options={[["tutor", "Tutor: rationale after each"], ["exam", "Exam: rationales at the end"]]} />
        <Chips label="Timer" value={timer} onChange={setTimer} options={[["0", "Off"], ["1", "On (72 s per question)"]]} />
        <div className="flex flex-wrap items-center gap-3">
          <Link href={href} aria-disabled={size === 0} className={`inline-flex min-h-[52px] items-center rounded-full px-6 font-bold ${size ? "bg-violet text-white hover:bg-violet-600" : "pointer-events-none bg-violet-300 text-white"}`}>
            Start
          </Link>
          <span className="text-sm font-semibold text-ink-muted" aria-live="polite">
            Your set will have {size} question{size === 1 ? "" : "s"}.
          </span>
        </div>
      </section>

      {lessonSets.length > 0 && (
        <section className="rounded-tile bg-white p-6">
          <h2 className="mb-3 font-display text-[21px] font-semibold">By lesson</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {lessonSets.map((l) => {
              const qs = questions.filter((q) => q.lessonId === l.id);
              const seen = qs.filter((q) => latest.has(q.id));
              const right = seen.filter((q) => latest.get(q.id)!.correct).length;
              return (
                <li key={l.id}>
                  <Link href={`/app/practice/${l.id}`} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-2 hover:bg-lilac">
                    <span className="text-sm font-semibold">{l.shortTitle ?? l.title}</span>
                    <span className="text-xs font-bold text-ink-muted">{seen.length ? `${right}/${seen.length}` : `${qs.length} Qs`}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/app/practice/missed" className="rounded-full bg-peach px-4 py-2 text-sm font-bold text-peach-ink">
              Redo everything I missed
            </Link>
            <Link href="/app/practice/flagged" className="rounded-full bg-mist px-4 py-2 text-sm font-bold text-ink-muted">
              My flagged questions
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
