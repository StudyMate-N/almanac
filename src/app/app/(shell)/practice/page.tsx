"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { courseById, lessons, openCourses } from "@/content/course";
import { EXAMS } from "@/lib/config";
import { topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

/* Practice (design 16a): quick sets first, then the set builder with a live count. */

const SIZES = [5, 10, 20, 40] as const;
const on = "bg-white text-violet-deep shadow-[0_1px_2px_rgba(27,21,48,.08)]";
const off = "text-ink-body hover:text-ink";

function Segmented<T extends string>({ title, value, options, onChange }: { title: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-[13px] font-bold">{title}</legend>
      <div className="flex flex-col gap-1 rounded-[14px] bg-mist p-1">
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={`flex min-h-10 items-center rounded-[10px] px-3 text-left text-[13.5px] font-bold ${value === v ? on : off}`}>
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
  const { state, authorizedCourses } = useStudent();
  const sp = useSearchParams();
  const owned = openCourses.filter((c) => authorizedCourses.includes(c.id));
  const [courseId, setCourseId] = useState(() => courseById(sp.get("course") ?? "")?.id ?? owned[0]?.id ?? openCourses[0].id);
  const { modules, questions, latest, cases, course } = useCourse(courseId);
  const [mods, setMods] = useState<string[]>([]);
  const [type, setType] = useState<"all" | "single" | "multiple">("all");
  const [level, setLevel] = useState<"all" | "recall" | "application" | "analysis">("all");
  const [pool, setPool] = useState<"all" | "new" | "missed" | "flagged">(() => sp.get("pool") === "missed" ? "missed" : "all");
  const [want, setWant] = useState<number>(10);
  const [mode, setMode] = useState<"tutor" | "exam">("tutor");

  const withQs = modules.filter((m) => questions.some((q) => q.moduleId === m.id));
  const sectionNo = (id: string) => id.match(/-s(\d+)$/)?.[1];
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
  const take = Math.min(want, available);
  const none = take === 0;
  const minutes = Math.max(1, Math.round(take * 1.2));
  const levelOptions = ([["all", "All levels"], ["recall", "Recall"], ["application", "Application"], ["analysis", "Analysis"]] as [typeof level, string][]).filter(([v]) => v === "all" || questions.some((q) => q.level === v));
  const href = `/app/practice/custom?m=${(mods.length ? mods : withQs.map((m) => m.id)).join(",")}&t=${type}&l=${level}&p=${pool}&n=${want}&mode=${mode}&timer=${mode === "exam" ? 1 : 0}`;

  // Quick sets.
  const weak = topicStats(questions, latest).filter((t) => !/: Test$/.test(t.topic) && t.percent < 100);
  const missedCount = questions.filter((q) => latest.get(q.id)?.correct === false).length;
  const flaggedCount = questions.filter((q) => state.flags[q.id]).length;
  const quick = [
    { key: "weak", tone: "text-violet-700", title: "Your weak spots", sub: weak.length ? `10 questions from your ${Math.min(3, weak.length)} lowest topic${weak.length === 1 ? "" : "s"}` : "Answer a few questions first", href: weak.length ? "/app/practice/weak" : undefined },
    { key: "missed", tone: "text-violet-700", title: "Questions you missed", sub: missedCount ? `${missedCount} question${missedCount === 1 ? "" : "s"} · wrong last time` : "Nothing missed yet", href: missedCount ? "/app/practice/missed" : undefined },
    { key: "flagged", tone: "text-[#A8430A]", title: "Flagged questions", sub: flaggedCount ? `${flaggedCount} flagged for review` : "Flag a question to find it here", href: flaggedCount ? "/app/practice/flagged" : undefined },
  ];
  const lessonSets = lessons.filter((l) => questions.some((q) => q.lessonId === l.id));

  return (
    <div className="max-w-[1040px]">
      <PageHeader eyebrow={course?.title} title="Practice" />
      {owned.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Course">
          {owned.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={courseId === c.id}
              onClick={() => {
                setCourseId(c.id);
                setMods([]);
              }}
              className={`h-10 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-bold ${courseId === c.id ? "border-violet bg-lilac text-violet-deep" : "border-hairline bg-white text-ink-body"}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
      {questions.length === 0 ? (
        <p className="rounded-[18px] border border-hairline bg-white p-6 text-ink-body">{authorizedCourses.length ? "Practice questions appear once our nurse reviewer approves them." : "Practice becomes available with an approved paid enrollment."}</p>
      ) : (
        <div className="flex flex-col gap-5">
          <section aria-label="Quick sets" className="grid gap-3 sm:grid-cols-3">
            {quick.map((q) => {
              const inner = (
                <>
                  <span className={`text-[11px] font-extrabold tracking-[.12em] ${q.tone}`}>QUICK SET</span>
                  <span className="font-display text-[19px] font-bold">{q.title}</span>
                  <span className="text-[13px] text-ink-body">{q.sub}</span>
                </>
              );
              return q.href ? (
                <Link key={q.key} href={q.href} className="flex flex-col gap-1.5 rounded-[18px] border border-hairline bg-white p-[18px] text-ink hover:border-[#C9BEF7]">
                  {inner}
                </Link>
              ) : (
                <div key={q.key} className="flex flex-col gap-1.5 rounded-[18px] border border-hairline bg-white p-[18px] opacity-70">
                  {inner}
                </div>
              );
            })}
          </section>

          <section className="flex flex-col gap-5 rounded-[20px] border border-hairline bg-white p-5 sm:p-6" aria-labelledby="build-title">
            <h2 id="build-title" className="font-display text-[22px] font-bold">
              Build your own set
            </h2>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-[13px] font-bold">Sections</legend>
              <div className="flex flex-wrap gap-2">
                {withQs.map((m) => {
                  const sel = mods.includes(m.id);
                  const n = sectionNo(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={sel}
                      onClick={() => setMods(sel ? mods.filter((x) => x !== m.id) : [...mods, m.id])}
                      className={`flex h-10 items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-bold ${sel ? "border-violet bg-lilac text-violet-deep" : "border-hairline bg-white text-ink-body hover:border-[#C9BEF7]"}`}
                    >
                      {sel ? "✓ " : ""}
                      {n ? `${n} · ` : ""}
                      {m.title}
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] text-ink-muted">{mods.length ? `${mods.length} selected` : "None selected means every section."}</p>
            </fieldset>
            <div className="grid gap-[18px] md:grid-cols-3">
              <Segmented title="Question type" value={type} onChange={setType} options={[["all", "All types"], ["single", "Single best answer"], ["multiple", "Select all that apply"]]} />
              <Segmented title="Level" value={level} onChange={setLevel} options={levelOptions} />
              <Segmented title="Which questions" value={pool} onChange={setPool} options={[["all", "All"], ["new", "New to you"], ["missed", "Missed last time"], ["flagged", "Flagged"]]} />
            </div>
            <div className="grid gap-[18px] md:grid-cols-2">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-[13px] font-bold">Number of questions</legend>
                <div className="flex gap-1.5">
                  {SIZES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={want === n}
                      onClick={() => setWant(n)}
                      className={`h-11 w-16 rounded-[12px] border-[1.5px] text-[14px] font-bold ${want === n ? "border-violet bg-lilac text-violet-deep" : "border-hairline bg-white text-ink-body"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-[13px] font-bold">Mode</legend>
                <div className="grid grid-cols-2 gap-1 rounded-[14px] bg-mist p-1">
                  {(
                    [
                      ["tutor", "Tutor", "Rationale after each answer"],
                      ["exam", "Exam", "Timed, rationales at the end"],
                    ] as const
                  ).map(([v, l, sub]) => (
                    <button key={v} type="button" aria-pressed={mode === v} onClick={() => setMode(v)} className={`flex min-h-[52px] flex-col justify-center rounded-[10px] px-3 py-1.5 text-left ${mode === v ? on : off}`}>
                      <span className="text-[13.5px] font-bold">{l}</span>
                      <span className="text-[12px] font-medium text-ink-muted">{sub}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EEEBF7] pt-[18px]">
              <div className="flex flex-col gap-0.5" aria-live="polite">
                <span className="text-[14px] font-bold">{none ? "No questions match" : `${take} questions · ${mode === "exam" ? `about ${minutes} min, timed` : "untimed, tutor mode"}`}</span>
                <span className={`text-[13px] ${none || take < want ? "text-[#A8430A]" : "text-ink-muted"}`}>
                  {none ? "Add a section or widen “Which questions”." : take < want ? `Only ${available} match these filters, so the set is shorter than ${want}.` : `${available} questions match. The set is fixed once it starts.`}
                </span>
              </div>
              <Link
                href={href}
                aria-disabled={none}
                className={`flex h-[52px] items-center rounded-[12px] px-6 text-[15px] font-bold whitespace-nowrap text-white ${none ? "pointer-events-none bg-[#A99BF0]" : "bg-violet hover:bg-[#4A2DE6]"}`}
              >
                {none ? "Start" : `Start ${take} questions`}
              </Link>
            </div>
          </section>

          <section aria-label="Exam simulations and cases" className="grid gap-3 sm:grid-cols-3">
            {(["midterm", "final"] as const).map((k) => (
              <Link key={k} href={`/app/exam/${k}?course=${courseId}`} className="flex flex-col gap-1.5 rounded-[18px] bg-violet-deep p-[18px] text-white hover:bg-[#3E25C9]">
                <span className="text-[11px] font-extrabold tracking-[.12em] text-[#C9BEF7]">EXAM SIMULATION</span>
                <span className="font-display text-[19px] font-bold">{EXAMS[k].label}</span>
                <span className="text-[13px] text-[#D9D2F3]">
                  {Math.min(EXAMS[k].questions, questions.length)} of {EXAMS[k].questions} questions · timed · practice rehearsal, not an official exam
                </span>
              </Link>
            ))}
            {cases.map((c) => (
              <Link key={c.id} href={`/app/case/${c.id}`} className="flex flex-col gap-1.5 rounded-[18px] border border-hairline bg-white p-[18px] hover:border-[#C9BEF7]">
                <span className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">NGN CASE STUDY</span>
                <span className="font-display text-[19px] font-bold">{c.title}</span>
                <span className="text-[13px] text-ink-body">Six items, from cues to outcomes</span>
              </Link>
            ))}
          </section>

          {lessonSets.length > 0 && (
            <details className="group rounded-[20px] border border-hairline bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 font-display text-[18px] font-bold sm:px-6 [&::-webkit-details-marker]:hidden">
                Practice by page
                <span aria-hidden="true" className="text-[16px] text-ink-muted group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden text-[16px] text-ink-muted group-open:inline">
                  –
                </span>
              </summary>
              <ul className="grid gap-2 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">
                {lessonSets.map((l) => {
                  const qs = questions.filter((q) => q.lessonId === l.id);
                  const seen = qs.filter((q) => latest.has(q.id));
                  const right = seen.filter((q) => latest.get(q.id)!.correct).length;
                  return (
                    <li key={l.id}>
                      <Link href={`/app/practice/${l.id}`} className="flex min-h-11 items-center justify-between gap-3 rounded-[12px] bg-mist px-3.5 py-2 hover:bg-lilac">
                        <span className="text-[13.5px] font-semibold">{l.shortTitle ?? l.title}</span>
                        <span className="text-[12px] font-bold text-ink-muted">{seen.length ? `${right}/${seen.length}` : `${qs.length} Qs`}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
