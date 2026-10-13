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
}: {
  q: Question;
  number?: string;
  picks: string[];
  onPick: (ids: string[]) => void;
  revealed: boolean;
  locked: boolean;
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
          let tone = picked ? "border-violet bg-lilac" : "border-hairline bg-white hover:border-violet-300";
          if (revealed) tone = right ? "border-correct bg-mint" : picked ? "border-incorrect bg-rose" : "border-hairline bg-white";
          return (
            <li key={o.id}>
              <button
                type="button"
                role={multi ? "checkbox" : "radio"}
                aria-checked={picked}
                disabled={locked}
                onClick={() => toggle(o.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${tone} ${locked ? "cursor-default" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid h-7 w-7 flex-none place-items-center ${multi ? "rounded-lg" : "rounded-full"} text-xs font-extrabold ${
                    revealed && right ? "bg-correct text-white" : revealed && picked ? "bg-incorrect text-white" : picked ? "bg-violet text-white" : "bg-mist text-ink-muted"
                  }`}
                >
                  {revealed && right ? <CheckIcon size={13} /> : revealed && picked ? <XIcon size={13} /> : LETTERS[i]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{o.text}</span>
                  {revealed && (
                    <span className={`mt-1 block text-sm ${right ? "text-mint-ink" : picked ? "text-rose-ink" : "text-ink-muted"}`}>
                      <span className="font-bold">{right ? "Correct. " : picked ? "Not this one. " : ""}</span>
                      {o.rationale}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className={`rounded-2xl px-4 py-3 text-[15px] ${ok ? "bg-mint text-mint-ink" : "bg-peach text-peach-ink"}`} role="status">
          <span className="font-bold">{ok ? "You got it." : picks.length ? "Not quite." : "Not answered."}</span> {q.takeaway}
        </div>
      )}
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
    <section aria-label="Learning check" className="rounded-tile bg-sky/70 p-5 sm:p-6">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-sky-ink uppercase">Learning check</p>
      <QuestionCard q={q} picks={picks} onPick={setPicks} revealed={done} locked={done} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!done ? (
          <button onClick={submit} disabled={!picks.length} className="min-h-12 rounded-full bg-violet px-6 font-bold text-white disabled:opacity-40">
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
