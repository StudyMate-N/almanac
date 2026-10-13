"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, XIcon } from "@/components/icons";
import { ReportButton } from "@/components/tutor";
import type { CaseItem, CaseStudy } from "@/content/types";
import { useStudent } from "@/lib/store";

type Resp = Record<string, string[] | number[] | Record<string, number>>;

/** Score an NGN item: plus-minus for highlight and multiple response, 0/1 per row or drop-down otherwise. */
function score(item: CaseItem, r: unknown): { got: number; max: number } {
  if (item.kind === "highlight" || item.kind === "multi") {
    const sel = (r as string[] | undefined) ?? [];
    const plus = sel.filter((s) => item.correct.includes(s)).length;
    const minus = sel.length - plus;
    return { got: Math.max(0, plus - minus), max: item.correct.length };
  }
  const map = (r as Record<string, number> | undefined) ?? {};
  if (item.kind === "matrix") return { got: item.rows.filter((row) => map[row.id] === row.correct).length, max: item.rows.length };
  const drops = item.parts.filter((p): p is Exclude<typeof p, string> => typeof p !== "string");
  return { got: drops.filter((d) => map[d.id] === d.correct).length, max: drops.length };
}

export function CaseRunner({ study }: { study: CaseStudy }) {
  const { addAnswers } = useStudent();
  const [stage, setStage] = useState(0);
  const [resp, setResp] = useState<Resp>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const sessionId = useMemo(() => `case-${Date.now().toString(36)}`, []);
  const done = stage >= study.stages.length;
  const updates = study.stages.slice(0, Math.min(stage + 1, study.stages.length)).map((s) => s.update).filter(Boolean) as string[];

  const total = study.stages.reduce(
    (acc, s) => {
      const sc = score(s.item, resp[s.item.id]);
      return { got: acc.got + sc.got, max: acc.max + sc.max };
    },
    { got: 0, max: 0 },
  );

  const header = (
    <header className="sticky top-0 z-10 bg-ground/95 px-4 pt-3.5 pb-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <Link href="/app/practice" aria-label="Close case" className="grid h-11 w-11 place-items-center rounded-full bg-white">
          <XIcon size={18} />
        </Link>
        <div className="flex-1">
          <p className="text-xs font-semibold text-violet-600">Case study · {study.title}</p>
          <p className="font-display text-[17px] font-semibold">{done ? "Results" : `Item ${stage + 1} of ${study.stages.length} · ${study.stages[stage].item.step}`}</p>
        </div>
      </div>
    </header>
  );

  if (done)
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 pb-10 sm:px-6">
          <section className="rounded-tile bg-violet p-7 text-white">
            <p className="font-semibold text-violet-on">Case score</p>
            <p className="font-display text-[56px] leading-none font-semibold">
              {total.got}/{total.max}
            </p>
            <p className="mt-2 text-violet-on">Points are scored the NGN way: each correct choice earns a point, and in select-all items each wrong choice takes one away.</p>
          </section>
          <ReportButton itemId={study.id} itemType="case" />
          <Link href="/app/practice" className="inline-flex min-h-[52px] items-center self-start rounded-full bg-white px-6 font-bold text-violet-600">
            Back to practice
          </Link>
        </main>
      </>
    );

  const item = study.stages[stage].item;
  const isChecked = checked[item.id];
  const r = resp[item.id];
  const sc = score(item, r);
  const set = (v: Resp[string]) => !isChecked && setResp((x) => ({ ...x, [item.id]: v }));

  return (
    <>
      {header}
      <main className="mx-auto flex max-w-2xl flex-col gap-3.5 px-4 pb-36 sm:px-6">
        <section className="rounded-3xl bg-white p-5 text-[15px] leading-relaxed">
          <p>{study.intro}</p>
          {updates.map((u) => (
            <p key={u} className="mt-3 rounded-2xl bg-sky px-3.5 py-2.5 text-sky-ink">
              {u}
            </p>
          ))}
        </section>
        <p className="font-display text-[17px] font-semibold">{item.prompt}</p>

        {item.kind === "highlight" && (
          <p className="rounded-3xl bg-white p-5 text-[15px] leading-loose">
            {item.parts.map((p, i) => {
              if (typeof p === "string") return <span key={i}>{p}</span>;
              const on = ((r as string[]) ?? []).includes(p.id);
              const ok = item.correct.includes(p.id);
              const tone = isChecked ? (ok ? (on ? "bg-mint ring-2 ring-correct" : "bg-mint") : on ? "bg-rose ring-2 ring-incorrect" : "") : on ? "bg-violet-200" : "bg-mist";
              return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => set(on ? ((r as string[]) ?? []).filter((x) => x !== p.id) : [...((r as string[]) ?? []), p.id])} className={`rounded px-1 ${tone}`}>
                  {p.text}
                </button>
              );
            })}
          </p>
        )}

        {item.kind === "multi" && (
          <div className="flex flex-col gap-2">
            {item.options.map((o) => {
              const on = ((r as string[]) ?? []).includes(o.id);
              const ok = item.correct.includes(o.id);
              return (
                <label key={o.id} className={`flex items-center gap-3 rounded-card border-2 p-3.5 ${isChecked ? (ok ? "border-correct bg-mint" : on ? "border-incorrect bg-rose" : "border-transparent bg-white") : on ? "border-violet bg-white" : "border-transparent bg-white"}`}>
                  <input type="checkbox" checked={on} disabled={isChecked} onChange={() => set(on ? ((r as string[]) ?? []).filter((x) => x !== o.id) : [...((r as string[]) ?? []), o.id])} className="h-5 w-5 accent-violet" />
                  <span className="font-semibold">{o.text}</span>
                </label>
              );
            })}
          </div>
        )}

        {item.kind === "matrix" && (
          <div className="overflow-x-auto rounded-3xl bg-white p-3">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">Finding</th>
                  {item.columns.map((c) => (
                    <th key={c} className="p-2 text-center">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row) => {
                  const map = (r as Record<string, number>) ?? {};
                  return (
                    <tr key={row.id} className={`border-t border-hairline ${isChecked ? (map[row.id] === row.correct ? "bg-mint" : "bg-rose") : ""}`}>
                      <td className="p-2 font-semibold">{row.text}</td>
                      {item.columns.map((c, ci) => (
                        <td key={c} className="p-2 text-center">
                          <input type="radio" name={row.id} aria-label={`${row.text}: ${c}`} checked={map[row.id] === ci} disabled={isChecked} onChange={() => set({ ...map, [row.id]: ci })} className="h-5 w-5 accent-violet" />
                          {isChecked && row.correct === ci && <span className="sr-only"> (correct)</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {item.kind === "cloze" && (
          <p className="rounded-3xl bg-white p-5 text-[15px] leading-[2.4]">
            {item.parts.map((p, i) => {
              if (typeof p === "string") return <span key={i}>{p}</span>;
              const map = (r as Record<string, number>) ?? {};
              return (
                <select
                  key={p.id}
                  aria-label="Choose an option"
                  value={map[p.id] ?? ""}
                  disabled={isChecked}
                  onChange={(e) => set({ ...map, [p.id]: Number(e.target.value) })}
                  className={`mx-1 max-w-full rounded-lg border-2 px-2 py-1 ${isChecked ? (map[p.id] === p.correct ? "border-correct bg-mint" : "border-incorrect bg-rose") : "border-violet-200"}`}
                >
                  <option value="">Select…</option>
                  {p.options.map((o, oi) => (
                    <option key={o} value={oi}>
                      {o}
                    </option>
                  ))}
                </select>
              );
            })}
          </p>
        )}

        {isChecked && (
          <section className="rounded-3xl bg-lilac p-5 text-[15px] leading-relaxed">
            <p className="font-bold text-violet-700">
              {sc.got} of {sc.max} points
            </p>
            <p className="mt-1">{item.rationale}</p>
          </section>
        )}
      </main>
      <footer className="fixed inset-x-0 bottom-0 bg-ground/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),18px)] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl">
          {!isChecked ? (
            <button
              type="button"
              onClick={() => {
                setChecked((c) => ({ ...c, [item.id]: true }));
                addAnswers([{ questionId: item.id, moduleId: study.moduleId, lessonId: study.lessonId, selected: [JSON.stringify(r ?? null)], correct: sc.got === sc.max, seconds: 0, mode: "case", sessionId, at: new Date().toISOString() }]);
              }}
              className="min-h-[54px] flex-1 rounded-full bg-violet font-bold text-white hover:bg-violet-600"
            >
              Check
            </button>
          ) : (
            <button type="button" onClick={() => setStage((s) => s + 1)} className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-violet font-bold text-white">
              {stage + 1 === study.stages.length ? "See results" : "Next item"} <ArrowRightIcon size={16} />
            </button>
          )}
        </div>
      </footer>
    </>
  );
}
