"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FocusBar, FocusProgress } from "@/components/focus-bar";
import { ReportButton, TutorButton } from "@/components/tutor";
import { lessonById, modules, questions as allQuestions } from "@/content/course";
import type { Question } from "@/content/types";
import { shuffled } from "@/lib/hash";
import { minutesFor } from "@/lib/minutes";
import { isCorrect, type Answer, type AnswerMode } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useDueCount } from "@/lib/use-cards";

/** One answer to record. */
export type AnswerRow = { q: Question; sel: string[]; correct: boolean; seconds: number };
/** A step on the results revision path. */
export type PathItem = { title: string; sub: string; min: number; href?: string; onClick?: () => void };

/** Shown on the exam pre-start card (design 15a). */
export type ExamIntro = { scope: string; total: number; repeats: number; showRepeats: boolean };

type Props = {
  /** Course name, shown as the violet eyebrow in the top bar. */
  eyebrow?: string;
  title: string;
  questions: Question[];
  mode: "tutor" | "exam";
  kind: AnswerMode;
  minutes?: number;
  backHref?: string;
  backLabel?: string;
  intro?: ExamIntro;
  passMark?: number;
  /** Keeps an exam in progress on this device, so leaving keeps answers and the timer running. */
  persistKey?: string;
  /** Saves answers somewhere other than the course record (course packs). May throw: the learner sees "Retry". */
  record?: (rows: AnswerRow[], phase: "check" | "submit") => void | Promise<void>;
  /** Revision path for results; the default links to course pages, cards and missed questions. */
  revision?: (r: { weakest?: string; missed: Question[] }) => PathItem[];
  /** Called when the learner closes the runner (used when it runs inside another player). */
  onClose?: () => void;
};

type Stage = "intro" | "run" | "timeup" | "results";
type Saved = { ids: string[]; picks: Record<string, string[]>; endsAt: number | null; startedAt: number; index: number };

const fmtClock = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
const qById = new Map(allQuestions.map((q) => [q.id, q]));
const storeKey = (k: string) => `almanac.exam.${k}`;
const load = (k?: string): Saved | null => {
  if (!k) return null;
  try {
    return JSON.parse(localStorage.getItem(storeKey(k)) ?? "null");
  } catch {
    return null;
  }
};
const save = (k: string | undefined, v: Saved | null) => {
  if (!k) return;
  try {
    if (v) localStorage.setItem(storeKey(k), JSON.stringify(v));
    else localStorage.removeItem(storeKey(k));
  } catch {}
};
/** Where a question belongs for grouping: its topic page, or its section for test and quiz questions. */
export function topicOf(q: Question) {
  const page = q.lessonId ? lessonById(q.lessonId) : undefined;
  if (page?.kind === "topic") return page.shortTitle ?? page.title;
  if (/: (Test|Summary)$/.test(q.topic) || /^Quiz/.test(q.topic)) {
    const mod = modules.find((m) => m.id === q.moduleId);
    const n = q.moduleId.match(/-s(\d+)$/)?.[1];
    return mod ? (n ? `Section ${n} · ${mod.title}` : mod.title) : q.topic;
  }
  return q.topic;
}

/** "1.1 Fluids and electrolytes" → "Topic 1.1 · Fluids and electrolytes". */
const topicChip = (t: string) => {
  const m = t.match(/^(\d+\.\d+)\s+(.*)$/);
  return m ? `Topic ${m[1]} · ${m[2]}` : t;
};

/**
 * Runs a question set (design 8a, 15a–15d, 10c/10d).
 * Tutor: each answer locks on "Check answer" and shows the rationale for the correct option and the pick.
 * Exam: no feedback until submit; answers can change until submit or time-up, then they are scored once.
 */
export function Runner({ eyebrow, title, questions: initial, mode, kind, minutes, backHref = "/app/practice", backLabel, intro, passMark, persistKey, record, revision, onClose }: Props) {
  const { profile, state, update, addAnswers } = useStudent();
  const exam = mode === "exam";
  const [set, setSet] = useState(initial);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [stage, setStage] = useState<Stage>(intro && minutes ? "intro" : "run");
  const [endsAt, setEndsAt] = useState<number | null>(() => (minutes && !intro ? Date.now() + minutes * 60_000 : null));
  const [now, setNow] = useState(() => Date.now());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const seconds = useRef<Record<string, number>>({});
  const shownAt = useRef(Date.now());
  const sessionId = useMemo(() => `${kind}-${Date.now().toString(36)}`, [kind]);
  const [retry, setRetry] = useState<null | (() => void)>(null);

  /** Records answers; on failure the pick stays and the learner can retry (design 14c). */
  const recordRows = useCallback(
    async (rows: AnswerRow[], phase: "check" | "submit") => {
      try {
        if (record) await record(rows, phase);
        else {
          const at = new Date().toISOString();
          addAnswers(rows.map<Answer>((r) => ({ questionId: r.q.id, moduleId: r.q.moduleId, lessonId: r.q.lessonId, selected: r.sel, correct: r.correct, seconds: r.seconds, mode: kind, sessionId, at })));
        }
        setRetry(null);
      } catch {
        setRetry(() => () => void recordRows(rows, phase));
      }
    },
    [record, addAnswers, kind, sessionId],
  );

  // Resume an exam left in progress on this device.
  useEffect(() => {
    const saved = load(persistKey);
    if (!saved) return;
    const qs = saved.ids.map((id) => qById.get(id)).filter((q): q is Question => Boolean(q));
    if (qs.length !== saved.ids.length || !qs.length) return save(persistKey, null);
    setSet(qs);
    setPicks(saved.picks);
    setIndex(Math.min(saved.index, qs.length - 1));
    setEndsAt(saved.endsAt);
    setStartedAt(saved.startedAt);
    setStage("run");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (stage === "run" && exam) save(persistKey, { ids: set.map((q) => q.id), picks, endsAt, startedAt, index });
  }, [stage, exam, persistKey, set, picks, endsAt, startedAt, index]);

  const q = set[index];
  const options = useMemo(() => (q ? (q.fixedOrder ? q.options : shuffled(q.options, `${q.id}:${profile?.id ?? ""}`)) : []), [q, profile?.id]);
  const timeLeft = endsAt ? Math.round((endsAt - now) / 1000) : 0;

  const tick = () => {
    if (!q) return;
    seconds.current[q.id] = (seconds.current[q.id] ?? 0) + (Date.now() - shownAt.current) / 1000;
    shownAt.current = Date.now();
  };

  const finish = useCallback(
    (auto = false) => {
      tick();
      if (exam) void recordRows(set.map((x) => ({ q: x, sel: picks[x.id] ?? [], correct: isCorrect(x, picks[x.id] ?? []), seconds: seconds.current[x.id] ?? 0 })), "submit");
      save(persistKey, null);
      setConfirmOpen(false);
      setMapOpen(false);
      setFinishedAt(Date.now());
      setStage(auto ? "timeup" : "results");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exam, set, picks, persistKey, recordRows],
  );

  useEffect(() => {
    if (!endsAt || stage !== "run") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt, stage]);
  useEffect(() => {
    if (endsAt && stage === "run" && now >= endsAt) finish(true);
  }, [now, endsAt, stage, finish]);

  const start = () => {
    setStartedAt(Date.now());
    setEndsAt(minutes ? Date.now() + minutes * 60_000 : null);
    setNow(Date.now());
    shownAt.current = Date.now();
    setStage("run");
  };

  const go = (i: number) => {
    tick();
    setIndex(Math.max(0, Math.min(set.length - 1, i)));
    setNoteOpen(false);
    setMapOpen(false);
  };

  const toggle = (id: string) => {
    if (!q || checked[q.id]) return;
    const cur = picks[q.id] ?? [];
    const next = q.type === "single" ? [id] : cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setPicks((p) => ({ ...p, [q.id]: next }));
  };

  const check = () => {
    if (!q || !(picks[q.id] ?? []).length) return;
    tick();
    const sel = picks[q.id] ?? [];
    setChecked((c) => ({ ...c, [q.id]: true }));
    void recordRows([{ q, sel, correct: isCorrect(q, sel), seconds: seconds.current[q.id] ?? 0 }], "check");
  };
  const tryAgain = () => {
    if (!q) return;
    setChecked((c) => ({ ...c, [q.id]: false }));
    setPicks((p) => ({ ...p, [q.id]: [] }));
    shownAt.current = Date.now();
  };

  const restart = (qs: Question[]) => {
    setSet(qs);
    setIndex(0);
    setPicks({});
    setChecked({});
    setFinishedAt(null);
    seconds.current = {};
    shownAt.current = Date.now();
    setStartedAt(Date.now());
    setEndsAt(minutes && exam ? Date.now() + Math.max(1, Math.round((minutes * qs.length) / Math.max(1, initial.length))) * 60_000 : null);
    setNow(Date.now());
    setStage("run");
  };

  const flagged = q ? Boolean(state.flags[q.id]) : false;
  const toggleFlag = () => {
    if (!q) return;
    const f = { ...state.flags };
    if (f[q.id]) delete f[q.id];
    else f[q.id] = true;
    update("flags", f);
  };

  const answeredIds = set.filter((x) => (exam ? (picks[x.id] ?? []).length > 0 : checked[x.id]));
  const answered = answeredIds.length;
  const flaggedCount = set.filter((x) => state.flags[x.id]).length;
  const close = backHref;

  /* ── Top bar ─────────────────────────────────────────────────────────── */
  const timer = endsAt && stage === "run" && (
    <span
      aria-label="Time left"
      className={`rounded-full px-3 py-1.5 font-mono text-[12.5px] font-bold whitespace-nowrap ${exam ? "border border-[#FFD9C2] bg-[#FFF4EC] text-[#A8430A]" : "bg-mist text-ink-body"}`}
    >
      ⏱ {fmtClock(timeLeft)}
      <span className="hidden sm:inline"> left</span>
    </span>
  );

  if (set.length === 0)
    return (
      <div className="alm-focus min-h-dvh">
        <FocusBar closeHref={close} onClose={onClose} eyebrow={eyebrow} title={title} />
        <main className="mx-auto max-w-[640px] px-4 py-10">
          <p className="rounded-[20px] border border-hairline bg-white p-6 text-ink-body">No questions match yet. Questions appear here once our nurse reviewer approves them.</p>
        </main>
      </div>
    );

  /* ── 15a Pre-start ───────────────────────────────────────────────────── */
  if (stage === "intro" && intro) {
    const partial = set.length < intro.total;
    return (
      <div className="alm-focus flex min-h-dvh flex-col">
        <FocusBar closeHref={close} onClose={onClose} eyebrow={eyebrow} title={title} />
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:p-10">
          <section className="flex w-full max-w-[640px] flex-col gap-[22px] rounded-[24px] border border-hairline bg-white p-6 shadow-[0_12px_32px_rgba(27,21,48,.06)] sm:px-10 sm:py-9">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold tracking-[.14em] text-violet-700 uppercase">Timed practice · {intro.scope}</span>
              <h1 className="font-display text-[30px] leading-[1.08] font-bold tracking-[-.035em] sm:text-[36px]">{title}</h1>
            </div>
            <div className={`grid gap-2.5 ${passMark ? "grid-cols-3" : "grid-cols-2"}`}>
              <div className="flex flex-col gap-0.5 rounded-[14px] bg-mist px-4 py-3.5">
                <span className="font-display text-[26px] font-bold">{set.length}</span>
                <span className="text-[12.5px] text-ink-body">questions</span>
              </div>
              <div className="flex flex-col gap-0.5 rounded-[14px] bg-[#FFE9DC] px-4 py-3.5">
                <span className="font-display text-[26px] font-bold text-[#A8430A]">{minutes} min</span>
                <span className="text-[12.5px] text-[#A8430A]">time limit</span>
              </div>
              {passMark ? (
                <div className="flex flex-col gap-0.5 rounded-[14px] bg-mist px-4 py-3.5">
                  <span className="font-display text-[26px] font-bold">{passMark}%</span>
                  <span className="text-[12.5px] text-ink-body">pass mark</span>
                </div>
              ) : null}
            </div>
            <ul className="flex flex-col gap-2.5 text-[14px] leading-[1.55] text-ink-body">
              {partial && (
                <li className="flex gap-2.5">
                  <span className="font-extrabold text-violet">—</span>
                  <span>
                    <b className="text-ink">
                      {set.length} of {intro.total} questions are available so far.
                    </b>{" "}
                    The time limit is scaled to match. More questions are added after nurse review.
                  </span>
                </li>
              )}
              <li className="flex gap-2.5">
                <span className="font-extrabold text-violet">—</span>
                <span>Answers and rationales show after you submit. You can change an answer until then.</span>
              </li>
              {intro.showRepeats && (
                <li className="flex gap-2.5">
                  <span className="font-extrabold text-violet">—</span>
                  <span>
                    Questions you haven&apos;t seen come first.{intro.repeats > 0 ? ` ${intro.repeats} of these you have answered before.` : ""}
                  </span>
                </li>
              )}
              <li className="flex gap-2.5">
                <span className="font-extrabold text-violet">—</span>
                <span>This is original study practice, not your school&apos;s proctored exam.</span>
              </li>
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEBF7] pt-5">
              <Link href={close} onClick={onClose} className="text-[14px] font-bold text-violet-700 hover:text-violet-deep">
                ← {backLabel ?? "Back"}
              </Link>
              <button type="button" onClick={start} className="h-[52px] rounded-[12px] bg-violet px-[26px] text-[15px] font-bold text-white hover:bg-[#4A2DE6]">
                Start the timer →
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* ── 15c Time's up ───────────────────────────────────────────────────── */
  if (stage === "timeup") {
    const un = set.length - answered;
    return (
      <div className="alm-focus flex min-h-dvh flex-col">
        <FocusBar closeHref={close} onClose={onClose} eyebrow={eyebrow} title={title} />
        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <section className="flex w-full max-w-[520px] flex-col gap-4 rounded-[24px] border border-hairline bg-white p-8" role="alert">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-[16px] bg-[#FFE9DC] text-[22px] text-[#A8430A]" aria-hidden="true">
              ⏱
            </span>
            <h1 className="font-display text-[30px] font-bold tracking-[-.03em]">Time&apos;s up</h1>
            <p className="text-[15px] leading-relaxed text-ink-body">
              Your {answered} answer{answered === 1 ? " was" : "s were"} submitted automatically.
              {un > 0 ? ` ${un} unanswered question${un === 1 ? " counts" : "s count"} as incorrect.` : ""}
            </p>
            <div>
              <button type="button" autoFocus onClick={() => setStage("results")} className="h-12 rounded-[12px] bg-violet px-[22px] text-[15px] font-bold text-white hover:bg-[#4A2DE6]">
                See results
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* ── 10c Results ─────────────────────────────────────────────────────── */
  if (stage === "results") return <Results {...{ eyebrow, title, set, picks, passMark, startedAt, finishedAt, close, onClose, revision, retakeLabel: exam ? "Retake the exam" : "Try the set again", onRetake: () => restart(shuffled(initial, String(Date.now()))) }} />;

  /* ── 8a / 15b / 15d Running ──────────────────────────────────────────── */
  const sel = picks[q.id] ?? [];
  const isChecked = !exam && checked[q.id];
  const lesson = q.lessonId ? lessonById(q.lessonId) : undefined;
  const last = index + 1 === set.length;
  const primary = exam
    ? last
      ? { label: "Review and submit", onClick: () => setConfirmOpen(true), muted: false }
      : { label: "Next question →", onClick: () => go(index + 1), muted: false }
    : !isChecked
      ? { label: "Check answer", onClick: check, muted: !sel.length }
      : { label: last ? "See results →" : "Next question →", onClick: () => (last ? finish() : go(index + 1)), muted: false };

  const grid = (cols: string) => (
    <div className="flex flex-col gap-3 rounded-[14px] border border-hairline bg-white p-3.5">
      <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">QUESTIONS</span>
      <div className={`grid gap-1.5 ${cols}`}>
        {set.map((x, i) => {
          const cur = i === index;
          const done = exam ? (picks[x.id] ?? []).length > 0 : checked[x.id];
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Question ${i + 1}${done ? ", answered" : ""}${state.flags[x.id] ? ", flagged" : ""}`}
              aria-current={cur ? "true" : undefined}
              className={`relative grid h-9 place-items-center rounded-[9px] border-[1.5px] text-[12px] font-bold ${cur ? "border-violet" : done ? "border-lilac" : "border-hairline"} ${done ? "bg-lilac text-violet-deep" : cur ? "bg-white text-violet-deep" : "bg-white text-ink-muted"}`}
            >
              {i + 1}
              {state.flags[x.id] && <span className="absolute top-[3px] right-1 h-1.5 w-1.5 rounded-full bg-[#EA6512]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5 text-[12px] text-ink-body">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[4px] bg-lilac" />
          Answered
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[4px] border-[1.5px] border-violet" />
          Current
        </span>
        <span className="flex items-center gap-2">
          <span className="mx-0.5 h-2 w-2 rounded-full bg-[#EA6512]" />
          Flagged for review
        </span>
      </div>
      {exam && (
        <button type="button" onClick={() => setConfirmOpen(true)} className="h-[46px] rounded-[12px] border-[1.5px] border-violet text-[14px] font-bold text-violet-700 hover:bg-mist">
          Submit exam
        </button>
      )}
    </div>
  );

  return (
    <div className="alm-focus min-h-dvh">
      {/* Desktop bar */}
      <div className="hidden sm:block">
        <FocusBar
          closeHref={close}
          onClose={onClose}
          eyebrow={eyebrow}
          title={title}
          right={
            <>
              {timer}
              <FocusProgress value={exam ? answered / set.length : (index + 1) / set.length} label={exam ? `${answered} of ${set.length} answered` : `Question ${index + 1} of ${set.length}`} />
            </>
          }
        />
      </div>
      {/* Mobile bar (15d) */}
      <div className="sticky top-0 z-30 sm:hidden">
        <div className="flex h-14 items-center gap-2.5 border-b border-[#EEEBF7] bg-white pr-2 pl-1.5">
          <Link href={close} onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center text-[15px]">
            ✕
          </Link>
          <span className="flex-1 text-[13.5px] font-bold">
            Question {index + 1} of {set.length}
          </span>
          {timer}
          <button type="button" onClick={() => setMapOpen(true)} aria-label="All questions" className="grid h-11 w-11 place-items-center text-[16px]">
            ☰
          </button>
        </div>
        <div className="h-1 bg-[#EFEDF5]">
          <div className="h-full bg-violet transition-[width] duration-300" style={{ width: `${Math.round(((exam ? answered : index + 1) / set.length) * 100)}%` }} />
        </div>
      </div>

      <div className="grid items-start gap-7 px-4 pt-4 pb-32 sm:px-6 sm:pt-7 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="mx-auto flex w-full max-w-[780px] flex-col gap-3 sm:gap-4">
          <div className="hidden flex-wrap gap-1.5 text-[12px] font-bold sm:flex">
            <span className="rounded-full bg-lilac px-2.5 py-1 text-violet-deep">{exam ? `Question ${index + 1} of ${set.length}` : q.type === "multiple" ? "Select all that apply" : "Single best answer"}</span>
            <span className="rounded-full border border-hairline bg-white px-2.5 py-1 text-ink-body">{topicChip(topicOf(q))}</span>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[16px] border border-hairline bg-white p-4 sm:gap-3 sm:rounded-[18px] sm:px-[22px] sm:py-5">
            {q.stem && <p className="text-[14px] leading-[1.55] text-ink-body sm:text-[14.5px] sm:leading-[1.6]">{q.stem}</p>}
            <p className="text-[16.5px] leading-[1.4] font-bold sm:text-[18px]">{q.ask}</p>
            {q.type === "multiple" && <p className="text-[13px] font-bold text-violet-700 sm:hidden">Select all that apply.</p>}
          </div>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="sr-only">Answer options</legend>
            {options.map((o, i) => {
              const picked = sel.includes(o.id);
              const right = q.correct.includes(o.id);
              const c = isChecked;
              // Answer option states (Figma "Answer option"): 14px radius, 2px state border, semantic tokens.
              const border = c && right ? "border-success" : c && picked ? "border-danger" : picked ? "border-primary" : "border-border hover:border-border-strong";
              const bg = c && right ? "bg-success-tint" : c && picked ? "bg-danger-tint" : picked ? "bg-primary-tint" : "bg-canvas";
              const mark = c && right ? "border-transparent bg-success text-white" : c && picked ? "border-transparent bg-danger text-white" : picked ? "border-transparent bg-primary text-white" : "border-[#D6CFF0] bg-white text-ink-muted";
              return (
                <label key={o.id} className={`flex flex-col overflow-hidden rounded-[14px] border-2 ${border} ${bg} ${c ? "" : "cursor-pointer"} has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus`}>
                  <span className="flex min-h-[52px] items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-3.5">
                    <input type={q.type === "single" ? "radio" : "checkbox"} name={q.id} checked={picked} onChange={() => toggle(o.id)} disabled={c} className="sr-only" />
                    <span className={`grid h-7 w-7 flex-none place-items-center rounded-full border-[1.5px] text-[12px] font-extrabold ${mark}`} aria-hidden="true">
                      {c && right ? "✓" : c && picked ? "✕" : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-[14.5px] leading-[1.4] font-semibold sm:text-[15px]">{o.text}</span>
                    {c && (right || picked) && <span className={`text-[12px] font-extrabold ${right ? "text-success" : "text-danger"}`}>{right ? "CORRECT" : "YOUR ANSWER"}</span>}
                  </span>
                  {c && (right || picked) && <span className="pr-3.5 pb-3 pl-[54px] text-[13.5px] leading-[1.55] text-ink-body">{o.rationale}</span>}
                </label>
              );
            })}
          </fieldset>

          {retry && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] px-3.5 py-2.5 text-[13.5px] text-ink">
              <span>Your answer wasn&apos;t saved. Check your connection.</span>
              <button type="button" onClick={() => retry()} className="font-bold text-violet-700">
                Retry
              </button>
            </div>
          )}
          {/* Feedback panel (Figma "Feedback panel"): always mounted so the result is announced. The one next step is the primary button below. */}
          <div aria-live="polite">
            {isChecked && (
              <section aria-label="Feedback" className={`flex flex-col gap-1.5 rounded-[20px] p-5 ${isCorrect(q, sel) ? "bg-success-tint" : "bg-danger-tint"}`}>
                <h2 className={`font-display text-[17px] font-bold ${isCorrect(q, sel) ? "text-success" : "text-danger"}`}>
                  {isCorrect(q, sel) ? "Correct — here's why" : "Not quite — here's the reasoning"}
                </h2>
                {q.takeaway && <p className="text-[14.5px] leading-relaxed text-text-body">{q.takeaway}</p>}
              </section>
            )}
          </div>

          <div className="hidden items-center justify-between gap-3 sm:flex">
            <button
              type="button"
              onClick={toggleFlag}
              aria-pressed={flagged}
              className={`flex h-11 items-center gap-2 rounded-[12px] border-[1.5px] bg-white px-4 text-[13.5px] font-bold ${flagged ? "border-[#EA6512] text-[#A8430A]" : "border-hairline text-ink-body hover:border-violet"}`}
            >
              {flagged ? "⚑ Flagged" : "⚐ Flag for review"}
            </button>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="h-12 rounded-[12px] border-[1.5px] border-violet px-[18px] text-[14px] font-bold whitespace-nowrap text-violet-700 hover:bg-mist disabled:opacity-40">
                ← Previous
              </button>
              <button
                type="button"
                onClick={primary.onClick}
                disabled={primary.muted}
                className="h-12 rounded-[12px] bg-violet px-[22px] text-[15px] font-bold whitespace-nowrap text-white hover:bg-violet-700 disabled:bg-[#A99BF0]"
              >
                {primary.label}
              </button>
            </div>
          </div>

          {exam ? (
            <p className="text-[12.5px] text-ink-muted">Saved · answers and rationales show after you submit.</p>
          ) : (
            isChecked && (
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-bold">
                  <button type="button" onClick={tryAgain} className="text-violet-700 hover:text-violet-deep">
                    Try again
                  </button>
                  <TutorButton lessonId={q.lessonId} questionId={q.id} selected={sel} />
                  {lesson && (
                    <Link href={`/app/learn/${lesson.id}`} className="text-violet-700 hover:text-violet-deep">
                      Open the lesson page
                    </Link>
                  )}
                  <button type="button" onClick={() => setNoteOpen((v) => !v)} className="text-ink-muted hover:text-ink">
                    {state.notes[q.id] ? "Your note" : "Add a note"}
                  </button>
                </div>
                {noteOpen && (
                  <textarea
                    defaultValue={state.notes[q.id] ?? ""}
                    onBlur={(e) => update("notes", { ...state.notes, [q.id]: e.target.value })}
                    rows={3}
                    placeholder="Your note on this question (saved to your account)"
                    className="rounded-[14px] border-[1.5px] border-hairline bg-white p-3 text-[14px] outline-none focus:border-violet"
                  />
                )}
                <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-ink-muted">
                  <span>Source: {q.source}</span>
                  <ReportButton itemId={q.id} itemType="question" />
                </div>
              </div>
            )
          )}
        </main>

        <aside className="sticky top-[80px] hidden flex-col gap-3 lg:flex">
          {grid(exam ? "grid-cols-6" : "grid-cols-5")}
          <p className="rounded-[14px] border border-hairline bg-white p-3.5 text-[12.5px] leading-[1.55] text-ink-body">
            {exam ? (
              <>
                <b className="text-ink">Exam mode.</b> No rationales until you submit. Leaving keeps your answers and the timer running.
              </>
            ) : (
              <>
                <b className="text-ink">Practice mode.</b> Rationales show after each answer. Switch to exam mode to see them only at the end.
              </>
            )}
          </p>
        </aside>
      </div>

      {/* Mobile action bar (15d) */}
      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 border-t border-[#EEEBF7] bg-white px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)] sm:hidden">
        <button
          type="button"
          onClick={toggleFlag}
          aria-pressed={flagged}
          aria-label={flagged ? "Flagged for review" : "Flag for review"}
          className={`grid h-[52px] w-[52px] place-items-center rounded-[12px] border-[1.5px] text-[18px] ${flagged ? "border-[#EA6512] text-[#A8430A]" : "border-hairline text-ink-body"}`}
        >
          {flagged ? "⚑" : "⚐"}
        </button>
        <button type="button" onClick={primary.onClick} disabled={primary.muted} className="h-[52px] rounded-[12px] bg-violet text-[15px] font-bold text-white disabled:bg-[#A99BF0]">
          {primary.label}
        </button>
      </div>

      {/* Mobile question map (☰) */}
      {mapOpen && (
        <div className="fixed inset-0 z-40 flex items-end bg-[rgba(27,21,48,.32)] sm:hidden" onClick={() => setMapOpen(false)}>
          <div className="w-full rounded-t-[20px] bg-white p-4 pb-[max(env(safe-area-inset-bottom),16px)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="All questions">
            {grid("grid-cols-6")}
          </div>
        </div>
      )}

      {/* Submit confirm (15b) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,21,48,.32)] p-4" role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div className="flex w-full max-w-[480px] flex-col gap-4 rounded-[20px] bg-white p-7 shadow-[0_24px_64px_rgba(27,21,48,.24)]">
            <h2 id="submit-title" className="font-display text-[26px] font-bold tracking-[-.03em]">
              Submit your answers?
            </h2>
            <dl className="flex flex-col gap-2 text-[14px] text-ink-body">
              <div className="flex justify-between">
                <dt>Answered</dt>
                <dd className="font-bold text-ink">
                  {answered} of {set.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Unanswered (scored as incorrect)</dt>
                <dd className="font-bold text-ink">{set.length - answered}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Flagged</dt>
                <dd className="font-bold text-[#A8430A]">{flaggedCount}</dd>
              </div>
              {endsAt && (
                <div className="flex justify-between">
                  <dt>Time left</dt>
                  <dd className="font-bold text-ink">{fmtClock(timeLeft)}</dd>
                </div>
              )}
            </dl>
            <p className="text-[13px] leading-normal text-ink-muted">After you submit, answers are locked and you&apos;ll see your score, rationales and weakest topics.</p>
            <div className="flex justify-end gap-2.5">
              <button type="button" onClick={() => setConfirmOpen(false)} className="h-[46px] rounded-[12px] border-[1.5px] border-[#D9D2F3] px-[18px] text-[14px] font-bold text-violet-deep hover:bg-mist">
                Keep working
              </button>
              <button type="button" autoFocus onClick={() => finish()} className="h-[46px] rounded-[12px] bg-violet px-5 text-[14px] font-bold text-white hover:bg-[#4A2DE6]">
                Submit and see results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Results (10c / 10d) ────────────────────────────────────────────────── */
function Results({
  eyebrow,
  title,
  set,
  picks,
  passMark,
  startedAt,
  finishedAt,
  close,
  onClose,
  revision,
  retakeLabel,
  onRetake,
}: {
  eyebrow?: string;
  title: string;
  set: Question[];
  picks: Record<string, string[]>;
  passMark?: number;
  startedAt: number;
  finishedAt: number | null;
  close: string;
  onClose?: () => void;
  revision?: Props["revision"];
  retakeLabel: string;
  onRetake: () => void;
}) {
  const due = useDueCount();
  const [open, setOpen] = useState<string | null>(null);
  const [why, setWhy] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const results = set.map((q, i) => ({ q, n: i + 1, sel: picks[q.id] ?? [], ok: isCorrect(q, picks[q.id] ?? []) }));
  const right = results.filter((r) => r.ok).length;
  const pct = Math.round((right / set.length) * 100);
  const missed = results.filter((r) => !r.ok);

  const topics = useMemo(() => {
    const by = new Map<string, typeof results>();
    for (const r of results) by.set(topicOf(r.q), [...(by.get(topicOf(r.q)) ?? []), r]);
    return [...by.entries()]
      .map(([name, rs]) => ({ name, right: rs.filter((r) => r.ok).length, total: rs.length, missed: rs.filter((r) => !r.ok), lessonId: rs[0].q.lessonId }))
      .sort((a, b) => a.right / a.total - b.right / b.total || b.total - a.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, picks]);
  const weakest = topics.find((t) => t.missed.length);
  const need = passMark ? Math.max(0, Math.ceil((passMark / 100) * set.length) - right) : 0;
  const weakPage = weakest?.lessonId ? lessonById(weakest.lessonId) : undefined;
  const weakTopicPage = weakPage && weakPage.kind === "topic" ? weakPage : undefined;
  const defaultPath = () => [
    weakTopicPage && { title: `Revisit ${weakTopicPage.shortTitle ?? weakTopicPage.title}`, sub: "Key points and the reading for your weakest topic", min: minutesFor(weakTopicPage), href: `/app/learn/${weakTopicPage.id}` },
    due > 0 && { title: `Review ${due} card${due === 1 ? "" : "s"} due`, sub: "Spaced review keeps today's fixes", min: Math.max(1, Math.round(due * 0.4)), href: "/app/review" },
    missed.length > 0 && { title: `Retry the ${missed.length} question${missed.length === 1 ? "" : "s"} you missed`, sub: "Practice mode, with rationales after each answer", min: Math.max(1, Math.round(missed.length * 1.2)), href: "/app/practice/missed" },
  ];
  const path = (revision ? revision({ weakest: weakest?.name, missed: missed.map((r) => r.q) }) : defaultPath()).filter(Boolean) as PathItem[];
  const pathMin = path.reduce((a, p) => a + p.min, 0);
  const mins = finishedAt ? Math.max(1, Math.round((finishedAt - startedAt) / 60_000)) : null;
  const when = new Date(finishedAt ?? Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const rationale = (r: (typeof results)[number]) => (
    <ul className="mt-2 flex flex-col gap-2 pl-10 text-[13.5px] leading-[1.5]">
      {r.q.options.map((o) => {
        const ok = r.q.correct.includes(o.id);
        const mine = r.sel.includes(o.id);
        return (
          <li key={o.id}>
            <span className={`font-semibold ${ok ? "text-correct" : mine ? "text-[#A8430A]" : "text-ink"}`}>
              {ok ? "✓ " : mine ? "✕ " : ""}
              {o.text}
              {ok ? " · Correct" : mine ? " · Your answer" : ""}
            </span>
            {(ok || mine) && <span className="block text-ink-body">{o.rationale}</span>}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="alm-focus min-h-dvh">
      <FocusBar closeHref={close} onClose={onClose} eyebrow={eyebrow} title={`${title} · Results`} right={<span className="hidden text-[12.5px] text-ink-muted sm:inline">Finished {when}{mins ? ` · ${mins} min` : ""}</span>} />
      <main className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 pt-5 pb-12 sm:gap-5 sm:px-6 sm:pt-8">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section className="flex flex-col gap-4 rounded-[20px] border border-hairline bg-white p-5 shadow-[0_18px_40px_rgba(42,27,120,.08)] sm:p-[26px]">
            <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">YOUR SCORE</span>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-[52px] leading-none font-extrabold tracking-[-.045em] sm:text-[64px]">{pct}%</span>
              <span className="text-[15px] font-bold text-ink-body">
                {right} of {set.length} correct
              </span>
            </div>
            <div className={`relative h-2.5 rounded-full bg-[#EFEDF5] ${passMark ? "mb-5" : ""}`}>
              <div className="h-full origin-left rounded-full bg-violet motion-safe:animate-[almFill_700ms_cubic-bezier(.2,.7,.2,1)]" style={{ width: `${pct}%` }} />
              {passMark ? (
                <>
                  <div className="absolute -top-1.5 -bottom-1.5 w-0.5 bg-ink" style={{ left: `${passMark}%` }} />
                  <span className="absolute top-[18px] -translate-x-1/2 text-[11.5px] font-bold whitespace-nowrap text-ink" style={{ left: `${passMark}%` }}>
                    Pass mark {passMark}%
                  </span>
                </>
              ) : null}
            </div>
            {passMark ? (
              need > 0 ? (
                <p className="flex items-start gap-2.5 rounded-[12px] bg-[#FFF6F0] px-3.5 py-3 text-[14px] leading-normal text-[#6B2A06]">
                  <span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-[#F2711C]" aria-hidden="true" />
                  <span>
                    <b>
                      {need === 1 ? "One question" : `${need} questions`} short of the pass mark.
                    </b>
                    {weakest ? ` Most misses are in ${weakest.name.replace(/^\d+\.\d+\s+/, "")}.` : ""}
                    {weakest && weakest.missed.length >= need ? " Fixing that topic alone would put you over." : ""}
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-2.5 rounded-[12px] bg-[#F1FBF6] px-3.5 py-3 text-[14px] leading-normal text-[#14532D]">
                  <span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-correct" aria-hidden="true" />
                  <span>
                    <b>Above the pass mark.</b>
                    {weakest ? ` Your weakest topic is ${weakest.name.replace(/^\d+\.\d+\s+/, "")}; a short revision keeps it there.` : ""}
                  </span>
                </p>
              )
            ) : null}
          </section>

          {path.length > 0 && (
            <section className="flex flex-col gap-3.5 rounded-[20px] bg-violet-deep p-5 text-white sm:p-[26px]">
              <span className="text-[11px] font-extrabold tracking-[.12em] text-[#C9BEF7]">YOUR REVISION PATH · ABOUT {pathMin} MIN</span>
              {path.map((p, i) => {
                const inner = (
                  <>
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-white font-display text-[14px] font-bold text-violet-deep">{i + 1}</span>
                    <span className="flex flex-1 flex-col gap-0.5 text-left">
                      <span className="text-[14.5px] font-bold">{p.title}</span>
                      <span className="text-[12.5px] text-[#D9D2F3]">{p.sub}</span>
                    </span>
                    <span className="text-[12px] font-bold text-[#D9D2F3]">{p.min} min</span>
                  </>
                );
                const cls = "flex w-full items-center gap-3 rounded-[14px] bg-white/8 px-3.5 py-3 hover:bg-white/12";
                return p.href ? (
                  <Link key={p.title} href={p.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <button key={p.title} type="button" onClick={p.onClick} className={cls}>
                    {inner}
                  </button>
                );
              })}
              {path[0].href ? (
                <Link href={path[0].href} className="mt-auto flex h-12 items-center justify-center rounded-[12px] bg-white text-[15px] font-bold text-violet-deep hover:bg-lilac">
                  Start revision →
                </Link>
              ) : (
                <button type="button" onClick={path[0].onClick} className="mt-auto h-12 rounded-[12px] bg-white text-[15px] font-bold text-violet-deep hover:bg-lilac">
                  Start revision →
                </button>
              )}
            </section>
          )}
        </div>

        <section className="overflow-hidden rounded-[20px] border border-hairline bg-white">
          <div className="flex items-center justify-between border-b border-[#EEEBF7] px-[22px] py-[18px]">
            <h2 className="font-display text-[20px] font-bold tracking-[-.02em]">By topic</h2>
            <span className="text-[12.5px] text-ink-muted">Weakest first</span>
          </div>
          {topics.map((t) => {
            const p = t.right / t.total;
            const weak = p < 0.6;
            const ok = p < 0.85;
            const isOpen = open === t.name && t.missed.length > 0;
            return (
              <div key={t.name} className="border-b border-[#EEEBF7] last:border-b-0">
                <button
                  type="button"
                  onClick={() => t.missed.length && setOpen(isOpen ? null : t.name)}
                  aria-expanded={t.missed.length ? isOpen : undefined}
                  className={`grid min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-[22px] py-2 text-left sm:grid-cols-[minmax(0,1fr)_240px_60px_110px_24px] ${t.missed.length ? "hover:bg-[#FBFAFE]" : "cursor-default"}`}
                >
                  <span className="text-[14.5px] font-bold">{t.name}</span>
                  <span className={`justify-self-end rounded-full px-2.5 py-1 text-[12px] font-bold whitespace-nowrap sm:order-4 sm:justify-self-start ${weak ? "bg-[#FFE9DC] text-[#A8430A]" : ok ? "bg-lilac text-violet-deep" : "bg-mint text-correct"}`}>
                    {weak ? "Needs work" : ok ? "Nearly there" : "Strong"}
                  </span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-[#EFEDF5] sm:order-2">
                    <span className="block h-full origin-left motion-safe:animate-[almFill_700ms_cubic-bezier(.2,.7,.2,1)]" style={{ width: `${Math.round(p * 100)}%`, background: weak ? "#F2711C" : ok ? "#5B3DF5" : "#1E7A4F" }} />
                  </span>
                  <span className="text-right text-[13.5px] font-bold sm:order-3">
                    {t.right}/{t.total}
                  </span>
                  <span className="hidden text-[16px] text-ink-muted sm:order-5 sm:block">{t.missed.length ? (isOpen ? "–" : "+") : ""}</span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-2 px-[22px] pb-4">
                    {t.missed.map((r) => (
                      <div key={r.q.id} className="rounded-[12px] bg-[#F7F6FB] px-3.5 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="w-7 text-[12px] font-extrabold text-ink-muted">Q{r.n}</span>
                          <span className="flex-1 text-[13.5px] leading-[1.45]">{r.q.ask}</span>
                          <button type="button" onClick={() => setWhy(why === r.q.id ? null : r.q.id)} aria-expanded={why === r.q.id} className="text-[13px] font-bold whitespace-nowrap text-violet-700">
                            {why === r.q.id ? "Hide rationale" : "See rationale"}
                          </button>
                        </div>
                        {why === r.q.id && rationale(r)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {all && (
          <section className="flex flex-col gap-2 rounded-[20px] border border-hairline bg-white p-4" aria-label="All questions">
            {results.map((r) => (
              <div key={r.q.id} className="rounded-[12px] bg-[#F7F6FB] px-3.5 py-2.5">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-[12px] text-white ${r.ok ? "bg-correct" : "bg-[#C2410C]"}`} aria-hidden="true">
                    {r.ok ? "✓" : "✕"}
                  </span>
                  <span className="flex-1 text-[13.5px] leading-[1.45]">
                    <b>
                      Q{r.n} · {r.ok ? "Correct" : r.sel.length ? "Missed" : "Not answered"}
                    </b>{" "}
                    {r.q.ask}
                  </span>
                </div>
                {rationale(r)}
              </div>
            ))}
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all} className="text-[14px] font-bold text-violet-700 hover:text-violet-deep">
            {all ? "Hide the questions" : `Review all ${set.length} questions`}
          </button>
          <div className="flex gap-2.5">
            <Link href="/app" className="flex h-[46px] items-center rounded-[12px] border-[1.5px] border-[#D9D2F3] px-[18px] text-[14px] font-bold text-violet-deep hover:bg-mist">
              Back to Today
            </Link>
            <button type="button" onClick={onRetake} className="h-[46px] rounded-[12px] bg-violet px-5 text-[14px] font-bold text-white hover:bg-[#4A2DE6]">
              {retakeLabel}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
