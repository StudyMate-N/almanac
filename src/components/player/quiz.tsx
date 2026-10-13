"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon, XIcon } from "@/components/icons";
import { ReportButton, TutorButton } from "@/components/tutor";
import type { Question } from "@/content/types";
import { isCorrect, latestByQuestion, type Answer } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { QuestionCard } from "./question";

type Props = { qs: Question[]; mode: "practice" | "test"; pageId: string; onComplete: () => void };

function ScoreTile({ right, total, mode, onRetake }: { right: number; total: number; mode: "practice" | "test"; onRetake: () => void }) {
  const pct = Math.round((right / Math.max(1, total)) * 100);
  const passed = right / Math.max(1, total) >= 0.8;
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-tile bg-violet p-6 text-white">
      <div className="relative grid h-24 w-24 flex-none place-items-center">
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15.5" fill="none" stroke={passed ? "#7ee2b0" : "#ff7a2f"} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 97.4} 97.4`} />
        </svg>
        <span className="font-display text-[26px] font-semibold">
          {right}/{total}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[22px] font-semibold">{passed ? "Ready to move on" : mode === "test" ? "Review, then retake" : "Worth another pass"}</p>
        <p className="text-violet-on">
          {pct}% correct. {mode === "test" ? "Aim for 8 of 10 or better before the next section." : "Read every rationale below, including the ones you got right."}
        </p>
      </div>
      <button onClick={onRetake} className="min-h-12 rounded-full bg-white px-5 font-bold text-violet-700">
        Retake
      </button>
    </div>
  );
}

/** Practice quiz (feedback after each item) or section test (feedback after submitting the whole test). */
export function QuizBlock({ qs, mode, pageId, onComplete }: Props) {
  const { answers, addAnswers } = useStudent();
  const prior = useMemo(() => {
    const mine = answers.filter((a) => a.lessonId === pageId && qs.some((q) => q.id === a.questionId));
    const latest = latestByQuestion(mine);
    return qs.every((q) => latest.has(q.id)) ? latest : null;
    // Only read prior attempts on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [picks, setPicks] = useState<Record<string, string[]>>(() => (prior ? Object.fromEntries(qs.map((q) => [q.id, prior.get(q.id)!.selected])) : {}));
  const [checked, setChecked] = useState<Record<string, boolean>>(() => (prior ? Object.fromEntries(qs.map((q) => [q.id, true])) : {}));
  const [submitted, setSubmitted] = useState(Boolean(prior));
  const [index, setIndex] = useState(prior ? qs.length : 0);
  const started = useRef(Date.now());
  const sessionId = useRef(`${mode}-${pageId}-${Date.now().toString(36)}`);
  const kind = mode === "test" ? "exam" : "tutor";

  const record = (list: Question[]) => {
    const at = new Date().toISOString();
    const secs = (Date.now() - started.current) / 1000 / Math.max(1, list.length);
    addAnswers(
      list.map<Answer>((q) => ({ questionId: q.id, moduleId: q.moduleId, lessonId: pageId, selected: picks[q.id] ?? [], correct: isCorrect(q, picks[q.id] ?? []), seconds: secs, mode: kind, sessionId: sessionId.current, at })),
    );
    started.current = Date.now();
  };

  const retake = () => {
    setPicks({});
    setChecked({});
    setSubmitted(false);
    setIndex(0);
    started.current = Date.now();
    sessionId.current = `${mode}-${pageId}-${Date.now().toString(36)}`;
  };

  const right = qs.filter((q) => isCorrect(q, picks[q.id] ?? [])).length;
  const allDone = mode === "test" ? submitted : qs.every((q) => checked[q.id]);

  if (mode === "test") {
    const answered = qs.filter((q) => (picks[q.id] ?? []).length).length;
    return (
      <div className="flex flex-col gap-4">
        {submitted && <ScoreTile right={right} total={qs.length} mode="test" onRetake={retake} />}
        <ol className="flex flex-col gap-4">
          {qs.map((q, i) => (
            <li key={q.id} className="rounded-tile bg-white p-5 sm:p-6">
              <QuestionCard q={q} number={`Question ${i + 1} of ${qs.length}${q.type === "multiple" ? " · Select all that apply" : ""}`} picks={picks[q.id] ?? []} onPick={(p) => setPicks((x) => ({ ...x, [q.id]: p }))} revealed={submitted} locked={submitted} />
              {submitted && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <TutorButton questionId={q.id} lessonId={pageId} selected={picks[q.id] ?? []} label="Ask the tutor" />
                  <ReportButton itemId={q.id} itemType="question" />
                </div>
              )}
            </li>
          ))}
        </ol>
        {!submitted && (
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-tile bg-ink p-4 pl-6 text-white shadow-lg">
            <p className="flex-1 text-sm font-semibold">
              {answered} of {qs.length} answered{answered < qs.length ? ". Unanswered questions count as wrong." : ". Ready when you are."}
            </p>
            <button
              onClick={() => {
                record(qs);
                setSubmitted(true);
                onComplete();
              }}
              className="min-h-12 rounded-full bg-tangerine px-6 font-bold text-ink"
            >
              Submit test
            </button>
          </div>
        )}
      </div>
    );
  }

  // Practice: one at a time.
  if (allDone && index >= qs.length)
    return (
      <div className="flex flex-col gap-4">
        <ScoreTile right={right} total={qs.length} mode="practice" onRetake={retake} />
        <ol className="flex flex-col gap-2">
          {qs.map((q, i) => {
            const ok = isCorrect(q, picks[q.id] ?? []);
            return (
              <li key={q.id} className={`rounded-card p-4 ${ok ? "bg-mint" : "bg-rose"}`}>
                <details>
                  <summary className="flex cursor-pointer items-start gap-3 text-[15px]">
                    <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-white ${ok ? "bg-correct" : "bg-incorrect"}`} aria-hidden="true">
                      {ok ? <CheckIcon size={12} /> : <XIcon size={12} />}
                    </span>
                    <span>
                      <span className="font-bold">{i + 1}.</span> {q.ask}
                    </span>
                  </summary>
                  <div className="mt-3 rounded-2xl bg-white p-4">
                    <QuestionCard q={q} picks={picks[q.id] ?? []} onPick={() => {}} revealed locked />
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </div>
    );

  const q = qs[Math.min(index, qs.length - 1)];
  const isChecked = Boolean(checked[q.id]);
  return (
    <div className="rounded-tile bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-1.5" aria-label={`Question ${index + 1} of ${qs.length}`}>
        {qs.map((x, i) => (
          <span
            key={x.id}
            className={`h-2 flex-1 rounded-full ${checked[x.id] ? (isCorrect(x, picks[x.id] ?? []) ? "bg-correct" : "bg-incorrect") : i === index ? "bg-violet" : "bg-track"}`}
          />
        ))}
      </div>
      <QuestionCard
        q={q}
        number={`Question ${index + 1} of ${qs.length}${q.type === "multiple" ? " · Select all that apply" : ""}`}
        picks={picks[q.id] ?? []}
        onPick={(p) => setPicks((x) => ({ ...x, [q.id]: p }))}
        revealed={isChecked}
        locked={isChecked}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!isChecked ? (
          <button
            disabled={!(picks[q.id] ?? []).length}
            onClick={() => {
              setChecked((c) => ({ ...c, [q.id]: true }));
              record([q]);
              if (qs.every((x) => x.id === q.id || checked[x.id])) onComplete();
            }}
            className="min-h-12 rounded-full bg-violet px-6 font-bold text-white disabled:opacity-40"
          >
            Submit
          </button>
        ) : (
          <button onClick={() => setIndex(index + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tangerine px-6 font-bold text-ink">
            {index + 1 < qs.length ? "Next question" : "See your score"} <ArrowRightIcon size={16} />
          </button>
        )}
        {isChecked && <TutorButton questionId={q.id} lessonId={pageId} selected={picks[q.id] ?? []} label="Ask the tutor" />}
        {isChecked && <ReportButton itemId={q.id} itemType="question" />}
      </div>
    </div>
  );
}
