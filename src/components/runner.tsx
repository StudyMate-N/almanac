"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon, XIcon } from "@/components/icons";
import { ReportButton, TutorButton } from "@/components/tutor";
import { lessonById } from "@/content/course";
import type { Question } from "@/content/types";
import { shuffled } from "@/lib/hash";
import { isCorrect, topicStats, type Answer, type AnswerMode } from "@/lib/progress";
import { useStudent } from "@/lib/store";

type Props = {
  title: string;
  questions: Question[];
  mode: "tutor" | "exam";
  kind: AnswerMode;
  minutes?: number;
  backHref?: string;
};

const fmtClock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;
const fmtClip = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Runs a question set. Tutor mode shows every rationale after each answer; exam mode holds them to the end. */
export function Runner({ title, questions: initial, mode, kind, minutes, backHref = "/app/practice" }: Props) {
  const { profile, state, update, addAnswers } = useStudent();
  const [set, setSet] = useState(initial);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(minutes ? minutes * 60 : 0);
  const [noteOpen, setNoteOpen] = useState(false);
  const seconds = useRef<Record<string, number>>({});
  const shownAt = useRef(Date.now());
  const sessionId = useMemo(() => `${kind}-${Date.now().toString(36)}`, [kind]);

  const q = set[index];
  const options = useMemo(() => (q ? (q.fixedOrder ? q.options : shuffled(q.options, `${q.id}:${profile?.id ?? ""}`)) : []), [q, profile?.id]);

  const tick = () => {
    if (!q) return;
    seconds.current[q.id] = (seconds.current[q.id] ?? 0) + (Date.now() - shownAt.current) / 1000;
    shownAt.current = Date.now();
  };

  const finish = () => {
    tick();
    if (mode === "exam") {
      const at = new Date().toISOString();
      addAnswers(
        set.map<Answer>((x) => {
          const sel = picks[x.id] ?? [];
          return { questionId: x.id, moduleId: x.moduleId, lessonId: x.lessonId, selected: sel, correct: isCorrect(x, sel), seconds: seconds.current[x.id] ?? 0, mode: kind, sessionId, at };
        }),
      );
    }
    setFinished(true);
  };

  useEffect(() => {
    if (!minutes || finished) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [minutes, finished]);
  useEffect(() => {
    if (minutes && timeLeft <= 0 && !finished) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const go = (i: number) => {
    tick();
    setIndex(i);
    setNoteOpen(false);
  };

  const toggle = (id: string) => {
    if (!q || checked[q.id]) return;
    const cur = picks[q.id] ?? [];
    const next = q.type === "single" ? [id] : cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setPicks((p) => ({ ...p, [q.id]: next }));
  };

  const check = () => {
    if (!q) return;
    tick();
    const sel = picks[q.id] ?? [];
    setChecked((c) => ({ ...c, [q.id]: true }));
    addAnswers([{ questionId: q.id, moduleId: q.moduleId, lessonId: q.lessonId, selected: sel, correct: isCorrect(q, sel), seconds: seconds.current[q.id] ?? 0, mode: kind, sessionId, at: new Date().toISOString() }]);
  };

  const restart = (qs: Question[]) => {
    setSet(qs);
    setIndex(0);
    setPicks({});
    setChecked({});
    setFinished(false);
    seconds.current = {};
    shownAt.current = Date.now();
  };

  const flagged = q ? Boolean(state.flags[q.id]) : false;
  const toggleFlag = () => {
    if (!q) return;
    const f = { ...state.flags };
    if (f[q.id]) delete f[q.id];
    else f[q.id] = true;
    update("flags", f);
  };

  const header = (
    <header className="sticky top-0 z-10 bg-ground/95 px-4 pt-3.5 pb-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <Link href={backHref} aria-label="Close" className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-ink hover:bg-mist">
          <XIcon size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-violet-600">{title}</p>
          <p className="font-display text-[17px] font-semibold">{finished ? "Results" : `Question ${index + 1} of ${set.length}`}</p>
        </div>
        {minutes && !finished ? (
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${timeLeft < 120 ? "bg-rose text-rose-ink" : "bg-white text-ink"}`} aria-label="Time left">
            {fmtClock(timeLeft)}
          </span>
        ) : (
          <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-muted sm:inline">{mode === "tutor" ? "Tutor mode" : "Exam mode"}</span>
        )}
      </div>
    </header>
  );

  if (set.length === 0)
    return (
      <>
        {header}
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <p className="rounded-tile bg-white p-6 text-ink-body">No questions match yet. Questions appear here once our nurse reviewer approves them.</p>
        </main>
      </>
    );

  if (finished) {
    const results = set.map((x) => ({ q: x, sel: picks[x.id] ?? [], ok: isCorrect(x, picks[x.id] ?? []) }));
    const right = results.filter((r) => r.ok).length;
    const missed = results.filter((r) => !r.ok).map((r) => r.q);
    const latest = new Map(results.map((r) => [r.q.id, { correct: r.ok } as Answer]));
    const topics = topicStats(set, latest);
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pt-2 pb-10 sm:px-6">
          <section className="rounded-tile bg-violet p-7 text-white">
            <p className="text-[15px] font-semibold text-violet-on">Your score</p>
            <p className="font-display text-[64px] leading-none font-semibold">
              {right}/{set.length}
            </p>
            <p className="mt-2 text-violet-on">{Math.round((right / set.length) * 100)}% correct</p>
          </section>
          {topics.length > 1 && (
            <section className="rounded-tile bg-white p-5">
              <h2 className="mb-2 font-display text-lg font-semibold">By topic, weakest first</h2>
              <ul className="flex flex-col gap-1.5 text-sm">
                {topics.map((t) => (
                  <li key={t.topic} className="flex justify-between gap-3">
                    <span>{t.topic}</span>
                    <span className="font-bold">{t.percent}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <ol className="flex flex-col gap-2.5">
            {results.map(({ q: x, sel, ok }, i) => (
              <li key={x.id} className={`rounded-card p-4 ${ok ? "bg-mint" : "bg-rose"}`}>
                <details>
                  <summary className="flex cursor-pointer items-start gap-3 text-sm">
                    <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-white ${ok ? "bg-correct" : "bg-incorrect"}`} aria-hidden="true">
                      {ok ? <CheckIcon size={12} /> : <XIcon size={12} />}
                    </span>
                    <span>
                      <span className="font-bold">
                        {i + 1}. {ok ? "Correct" : sel.length ? "Missed" : "Not answered"}
                      </span>{" "}
                      · {x.ask}
                    </span>
                  </summary>
                  <ul className="mt-3 flex flex-col gap-2 pl-9 text-sm">
                    {x.options.map((o) => (
                      <li key={o.id}>
                        <span className={`font-semibold ${x.correct.includes(o.id) ? "text-mint-ink" : sel.includes(o.id) ? "text-rose-ink" : ""}`}>
                          {x.correct.includes(o.id) ? "✓ " : sel.includes(o.id) ? "✗ " : ""}
                          {o.text}
                        </span>
                        <span className="block text-ink-body">{o.rationale}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2.5">
            {missed.length > 0 && (
              <button type="button" onClick={() => restart(missed)} className="inline-flex min-h-[52px] items-center rounded-full bg-tangerine px-6 font-bold text-ink hover:bg-[#ff8c4a]">
                Redo the {missed.length} missed
              </button>
            )}
            <Link href="/app/progress" className="inline-flex min-h-[52px] items-center rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
              See your progress
            </Link>
            <Link href={backHref} className="inline-flex min-h-[52px] items-center rounded-full bg-white px-6 font-bold text-violet-600 hover:bg-mist">
              Done
            </Link>
          </div>
        </main>
      </>
    );
  }

  const sel = picks[q.id] ?? [];
  const isChecked = mode === "tutor" && checked[q.id];
  const lesson = q.lessonId ? lessonById(q.lessonId) : undefined;

  return (
    <>
      {header}
      <main className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pt-1 pb-40 sm:px-6">
        {mode === "exam" && (
          <nav aria-label="Questions" className="flex flex-wrap gap-1.5">
            {set.map((x, i) => (
              <button
                key={x.id}
                onClick={() => go(i)}
                aria-current={i === index ? "true" : undefined}
                className={`h-8 min-w-8 rounded-lg px-1.5 text-xs font-bold ${i === index ? "bg-violet text-white" : picks[x.id]?.length ? "bg-lilac text-violet-700" : "bg-white text-ink-muted"} ${state.flags[x.id] ? "ring-2 ring-tangerine" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        )}
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-bold text-ink-muted capitalize">{q.level}</span>
            <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-bold text-ink-muted">{q.topic}</span>
          </div>
          <p className="text-base leading-relaxed">{q.stem}</p>
          <p className="font-display text-[17px] leading-snug font-semibold">{q.ask}</p>
          {q.type === "multiple" && <p className="text-sm font-semibold text-violet-700">Select all that apply.</p>}
        </div>

        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="sr-only">Answer options</legend>
          {options.map((o, i) => {
            const chosen = sel.includes(o.id);
            const right = q.correct.includes(o.id);
            let tone = chosen ? "border-violet bg-white" : "border-transparent bg-white hover:border-violet-200";
            if (isChecked) tone = right ? "border-correct bg-mint" : chosen ? "border-incorrect bg-rose" : "border-transparent bg-white";
            return (
              <label key={o.id} className={`flex cursor-pointer flex-col gap-2 rounded-card border-2 p-3.5 ${tone}`}>
                <span className="flex items-center gap-3">
                  <input type={q.type === "single" ? "radio" : "checkbox"} name={q.id} checked={chosen} onChange={() => toggle(o.id)} disabled={isChecked} className="sr-only" />
                  <span className={`grid h-8 w-8 flex-none place-items-center text-[13px] font-bold ${q.type === "single" ? "rounded-[10px]" : "rounded-md"} ${chosen ? "bg-violet text-white" : "bg-ground text-ink-muted"}`} aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[15px] font-semibold">{o.text}</span>
                  {isChecked && (right || chosen) && (
                    <span className={`ml-auto inline-flex flex-none items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold ${right ? "text-mint-ink" : "text-rose-ink"}`}>
                      {right ? <CheckIcon size={13} /> : <XIcon size={13} />}
                      {right ? (chosen ? "Correct" : "Correct answer") : "Your answer"}
                    </span>
                  )}
                </span>
                {isChecked && <span className="ml-11 text-[14px] leading-normal text-ink-body">{o.rationale}</span>}
              </label>
            );
          })}
        </fieldset>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={toggleFlag} aria-pressed={flagged} className={`min-h-10 rounded-full px-4 text-sm font-bold ${flagged ? "bg-tangerine text-ink" : "bg-white text-ink-muted"}`}>
            {flagged ? "Flagged" : "Flag"}
          </button>
          <button type="button" onClick={() => setNoteOpen((v) => !v)} className="min-h-10 rounded-full bg-white px-4 text-sm font-bold text-ink-muted">
            {state.notes[q.id] ? "Your note" : "Add note"}
          </button>
          {isChecked && <TutorButton lessonId={q.lessonId} questionId={q.id} selected={sel} />}
          {isChecked && lesson?.video && q.clip !== undefined && (
            <Link href={`/app/learn/${lesson.id}?t=${q.clip}`} className="min-h-10 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-violet-600">
              Watch at {fmtClip(q.clip)}
            </Link>
          )}
        </div>
        {noteOpen && (
          <textarea
            defaultValue={state.notes[q.id] ?? ""}
            onBlur={(e) => update("notes", { ...state.notes, [q.id]: e.target.value })}
            rows={3}
            placeholder="Your note on this question (saved to your account)"
            className="rounded-2xl border-2 border-hairline bg-white p-3 outline-none focus:border-violet"
          />
        )}
        {isChecked && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <span>Source: {q.source}</span>
            <ReportButton itemId={q.id} itemType="question" />
          </div>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 bg-ground/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),18px)] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl gap-2.5">
          {mode === "exam" ? (
            <>
              <button type="button" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0} className="min-h-[54px] rounded-full bg-white px-6 font-bold text-violet-600 disabled:opacity-40">
                Back
              </button>
              {index + 1 < set.length ? (
                <button type="button" onClick={() => go(index + 1)} className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-violet font-bold text-white hover:bg-violet-600">
                  Next <ArrowRightIcon size={16} />
                </button>
              ) : (
                <button type="button" onClick={finish} className="min-h-[54px] flex-1 rounded-full bg-tangerine font-bold text-ink">
                  Submit and see results
                </button>
              )}
            </>
          ) : !isChecked ? (
            <button type="button" onClick={check} disabled={!sel.length} className="min-h-[54px] flex-1 rounded-full bg-violet font-bold text-white hover:bg-violet-600 disabled:bg-violet-300">
              Check answer
            </button>
          ) : (
            <button type="button" autoFocus onClick={() => (index + 1 === set.length ? finish() : go(index + 1))} className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-violet font-bold text-white hover:bg-violet-600">
              {index + 1 === set.length ? "See results" : "Next question"} <ArrowRightIcon size={16} />
            </button>
          )}
        </div>
      </footer>
    </>
  );
}
