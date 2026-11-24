"use client";

import { useMemo, useRef, useState } from "react";
import { CheckIcon, XIcon } from "@/components/icons";
import { TutorButton } from "@/components/tutor";
import type { Question } from "@/content/types";
import { shuffled } from "@/lib/hash";
import { isCorrect } from "@/lib/progress";
import { useStudent } from "@/lib/store";

const LETTERS = "ABCDEFGH";

/** Options in a stable per-student order (unless the item keeps its order). */
export function useOptions(q: Question) {
  const { profile } = useStudent();
  return useMemo(() => (q.fixedOrder ? q.options : shuffled(q.options, `${q.id}:${profile?.id ?? ""}`)), [q, profile?.id]);
}

/**
 * One question: pick, submit, then every option shows its rationale.
 * `reveal` is controlled by the parent in test mode (rationales after the whole test).
 */
export function QuestionCard({
  q,
  number,
  picks,
  onPick,
  revealed,
  locked,
  next,
}: {
  q: Question;
  number?: string;
  picks: string[];
  onPick: (ids: string[]) => void;
  revealed: boolean;
  locked: boolean;
  /** The single forward action shown inside the feedback panel (Learning Studio: exactly one next step). */
  next?: React.ReactNode;
}) {
  const options = useOptions(q);
  const multi = q.type === "multiple";
  const toggle = (id: string) => {
    if (locked) return;
    onPick(multi ? (picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id]) : [id]);
  };
  const ok = isCorrect(q, picks);
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="contents">
        {number && <span className="mb-1 block text-xs font-bold tracking-wide text-ink-muted uppercase">{number}</span>}
        {q.stem && <p className="mb-2 text-[16px] leading-relaxed text-ink-body">{q.stem}</p>}
        <p className="mb-1 font-display text-[18px] leading-snug font-semibold">{q.ask}</p>
      </legend>
      <ul className="flex flex-col gap-2">
        {options.map((o, i) => {
          const picked = picks.includes(o.id);
          const right = q.correct.includes(o.id);
          // Answer option states (Figma "Answer option"): 14px radius, 2px state border.
          let tone = picked ? "border-primary bg-primary-tint" : "border-border bg-canvas hover:border-border-strong";
          if (revealed) tone = right ? "border-success bg-success-tint" : picked ? "border-danger bg-danger-tint" : "border-border bg-canvas";
          const tag = revealed && right ? (picked ? "Correct · your answer" : "Correct") : revealed && picked ? "Your answer" : null;
          return (
            <li key={o.id}>
              <button
                type="button"
                role={multi ? "checkbox" : "radio"}
                aria-checked={picked}
                disabled={locked}
                onClick={() => toggle(o.id)}
                className={`flex min-h-[52px] w-full items-start gap-3 rounded-[14px] border-2 px-4 py-3 text-left transition-colors duration-150 motion-reduce:transition-none ${tone} ${locked ? "cursor-default" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid h-7 w-7 flex-none place-items-center ${multi ? "rounded-lg" : "rounded-full"} text-xs font-extrabold ${
                    revealed && right ? "bg-success text-white" : revealed && picked ? "bg-danger text-white" : picked ? "bg-primary text-white" : "bg-mist text-text-muted"
                  }`}
                >
                  {revealed && right ? <CheckIcon size={13} /> : revealed && picked ? <XIcon size={13} /> : LETTERS[i]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-text">{o.text}</span>
                  {tag && (
                    <span className={`mt-1 block text-[12px] font-extrabold tracking-[.06em] uppercase ${right ? "text-success" : "text-danger"}`}>
                      {right ? "✓" : "✕"} {tag}
                    </span>
                  )}
                  {revealed && <span className={`mt-1 block text-sm ${right || picked ? "text-text-body" : "text-text-muted"}`}>{o.rationale}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {/* Always mounted so screen readers announce the feedback when it appears. */}
      <div aria-live="polite">
        {revealed && (
          <section aria-label="Feedback" className={`flex flex-col gap-2 rounded-[20px] p-5 ${ok ? "bg-success-tint" : "bg-danger-tint"}`}>
            <h3 className={`font-display text-[17px] font-bold ${ok ? "text-success" : "text-danger"}`}>
              {ok ? "Correct — here's why" : picks.length ? "Not quite — here's the reasoning" : "Not answered — here's the reasoning"}
            </h3>
            {q.takeaway && <p className="text-[14.5px] leading-relaxed text-text-body">{q.takeaway}</p>}
            {next && <div className="mt-2">{next}</div>}
          </section>
        )}
      </div>
    </fieldset>
  );
}

/** A learning check inside a page: answer, submit, read the reasoning. */
export function LearningCheck({ q, pageId }: { q: Question; pageId: string }) {
  const { addAnswers } = useStudent();
  const [picks, setPicks] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const shown = useRef(Date.now());
  const submit = () => {
    setDone(true);
    addAnswers([
      { questionId: q.id, moduleId: q.moduleId, lessonId: pageId, selected: picks, correct: isCorrect(q, picks), seconds: (Date.now() - shown.current) / 1000, mode: "tutor", sessionId: `check-${q.id}-${Date.now().toString(36)}`, at: new Date().toISOString() },
    ]);
  };
  return (
    <section aria-label="Learning check" className="rounded-[16px] bg-lilac p-5 sm:p-6">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-violet-700 uppercase">Learning check</p>
      <QuestionCard q={q} picks={picks} onPick={setPicks} revealed={done} locked={done} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!done ? (
          <button onClick={submit} disabled={!picks.length} className="min-h-12 rounded-full bg-primary px-6 font-bold text-white hover:bg-primary-hover disabled:opacity-40">
            Submit
          </button>
        ) : (
          <button
            onClick={() => {
              setPicks([]);
              setDone(false);
              shown.current = Date.now();
            }}
            className="min-h-11 rounded-full bg-white px-5 text-sm font-bold text-violet-700"
          >
            Try again
          </button>
        )}
        {done && <TutorButton questionId={q.id} lessonId={pageId} selected={picks} label="Ask the tutor about this" />}
      </div>
    </section>
  );
}
