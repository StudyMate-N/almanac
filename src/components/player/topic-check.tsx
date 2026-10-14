"use client";

import { useRef, useState } from "react";
import { TutorButton } from "@/components/tutor";
import type { Question } from "@/content/types";
import { isCorrect } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useOptions } from "./question";

const LETTERS = "ABCDEFGH";

/** The student's last answer to a question on this page, if any. */
function useLastAnswer(q: Question) {
  const { answers } = useStudent();
  return [...answers].reverse().find((a) => a.questionId === q.id);
}

/**
 * One learning check in the course-standard style (design/Topic Page 5.3):
 * stem card, lettered option rows, then every option's reason with a
 * Correct / Your answer badge and a takeaway. `action` renders the big button
 * once the answer is checked ("Next check →", "Done", "Continue the video ▶").
 */
export function CheckCard({ q, pageId, action }: { q: Question; pageId: string; action?: { label: string; onClick: () => void } }) {
  const { addAnswers } = useStudent();
  const options = useOptions(q);
  const last = useLastAnswer(q);
  const [picks, setPicks] = useState<string[]>(() => last?.selected ?? []);
  const [checked, setChecked] = useState(Boolean(last));
  const shown = useRef(Date.now());
  const multi = q.type === "multiple";

  const pick = (id: string) => {
    if (checked) return;
    setPicks(multi ? (picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id]) : [id]);
  };
  const check = () => {
    if (!picks.length) return;
    setChecked(true);
    addAnswers([
      { questionId: q.id, moduleId: q.moduleId, lessonId: pageId, selected: picks, correct: isCorrect(q, picks), seconds: (Date.now() - shown.current) / 1000, mode: "tutor", sessionId: `check-${q.id}-${Date.now().toString(36)}`, at: new Date().toISOString() },
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 rounded-3xl bg-white p-5">
        {q.stem && <p className="text-[16px] leading-relaxed text-ink">{q.stem}</p>}
        <p className="font-display text-[17px] leading-[1.35] font-semibold">
          {q.ask}
          {multi && <span className="ml-2 align-middle text-[12px] font-bold text-ink-muted">Select all that apply</span>}
        </p>
      </div>
      <div className="flex flex-col gap-2.5" role={multi ? "group" : "radiogroup"} aria-label="Answer options">
        {options.map((o, i) => {
          const chosen = picks.includes(o.id);
          const right = q.correct.includes(o.id);
          let tone = chosen ? "border-violet bg-white" : "border-transparent bg-white";
          if (checked) tone = right ? "border-correct bg-mint" : chosen ? "border-incorrect bg-rose" : "border-transparent bg-mist";
          return (
            <button
              key={o.id}
              onClick={() => pick(o.id)}
              aria-pressed={chosen}
              disabled={checked}
              className={`flex flex-col gap-2 rounded-card border-2 p-3.5 text-left text-ink disabled:cursor-default ${tone}`}
            >
              <span className="flex w-full items-center gap-3">
                <span className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] text-[13px] font-bold ${chosen ? "bg-violet text-white" : "bg-white text-ink-muted"}`}>{LETTERS[i]}</span>
                <span className="flex-1 text-[15px] font-semibold">{o.text}</span>
                {checked && (right || chosen) && (
                  <span className={`flex-none rounded-full bg-white px-2.5 py-0.5 text-[12px] font-bold ${right ? "text-mint-ink" : "text-rose-ink"}`}>
                    {right ? (chosen ? "✓ Correct" : "✓ Correct answer") : "✕ Your answer"}
                  </span>
                )}
              </span>
              {checked && <span className="ml-11 text-[14px] leading-normal text-ink-body">{o.rationale}</span>}
            </button>
          );
        })}
      </div>
      {checked && q.takeaway && (
        <p role="status" className="rounded-2xl bg-lilac px-4 py-3 text-[15px] text-ink-body">
          <strong className="text-violet-700">Takeaway. </strong>
          {q.takeaway}
        </p>
      )}
      {!checked ? (
        <button onClick={check} disabled={!picks.length} className="min-h-[54px] rounded-full bg-violet text-[16px] font-bold text-white disabled:bg-violet-300">
          Check answer
        </button>
      ) : (
        action && (
          <button onClick={action.onClick} className="min-h-[54px] rounded-full bg-violet text-[16px] font-bold text-white">
            {action.label}
          </button>
        )
      )}
      {checked && (
        <div className="flex flex-wrap gap-3 text-sm">
          <TutorButton questionId={q.id} lessonId={pageId} selected={picks} label="Ask the tutor about this" />
          <button
            onClick={() => {
              setPicks([]);
              setChecked(false);
              shown.current = Date.now();
            }}
            className="font-bold text-violet-700"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

/** A page's learning checks as one section: "Learning check n of N" with number tabs. */
export function CheckGroup({ qs, pageId, onDone }: { qs: Question[]; pageId: string; onDone?: () => void }) {
  const { answers } = useStudent();
  const [i, setI] = useState(() => Math.max(0, qs.findIndex((q) => !answers.some((a) => a.questionId === q.id))));
  if (!qs.length) return null;
  const q = qs[Math.min(i, qs.length - 1)];
  const answered = (x: Question) => answers.some((a) => a.questionId === x.id);
  const last = i >= qs.length - 1;
  return (
    <section aria-label="Learning checks" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">
          Learning check {i + 1} of {qs.length}
        </p>
        {qs.length > 1 && (
          <div className="flex gap-1.5" role="tablist" aria-label="Learning checks">
            {qs.map((x, n) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={n === i}
                aria-label={`Learning check ${n + 1}${answered(x) ? ", answered" : ""}`}
                onClick={() => setI(n)}
                className={`grid h-9 min-w-9 place-items-center rounded-[10px] text-[13px] font-bold ${n === i ? "bg-violet text-white" : answered(x) ? "bg-mint text-mint-ink" : "bg-white text-ink-muted"}`}
              >
                {n + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <CheckCard key={q.id} q={q} pageId={pageId} action={last ? { label: "Done", onClick: () => onDone?.() } : { label: "Next check →", onClick: () => setI(i + 1) }} />
    </section>
  );
}
