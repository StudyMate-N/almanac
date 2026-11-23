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

  const kindName: Record<CaseItem["kind"], string> = { highlight: "Highlight", multi: "Select all that apply", matrix: "Matrix", cloze: "Drop-down" };
  const header = (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EEEBF7] bg-white px-4 sm:h-[60px] sm:gap-3.5 sm:px-6" style={{ viewTransitionName: "focus-bar" }}>
      <Link href="/app/practice" aria-label="Close case" className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline hover:bg-mist sm:h-10 sm:w-10">
        <XIcon size={16} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[11.5px] font-bold text-violet-700">NGN case study</span>
        <span className="truncate font-display text-[15px] font-bold">{study.title}</span>
      </div>
      <ol className="hidden items-center gap-1.5 md:flex" aria-label="Case items">
        {study.stages.map((st, i) => (
          <li key={st.item.id} aria-current={i === stage ? "step" : undefined} className={`flex h-8 items-center gap-1.5 rounded-full ${i === stage ? "bg-lilac pr-3 pl-1 font-bold text-violet-deep" : "px-1"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11.5px] font-bold ${i === stage ? "bg-violet text-white" : i < stage || done ? "bg-correct text-white" : "bg-mist text-ink-muted"}`}>{i < stage || done ? "✓" : i + 1}</span>
            {i === stage && <span className="text-[13px]">{st.item.step}</span>}
          </li>
        ))}
      </ol>
      {!done && <span className="text-[12.5px] font-bold text-ink-muted md:hidden">{stage + 1} of {study.stages.length}</span>}
    </header>
  );

  if (done)
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-[720px] flex-col gap-4 px-4 py-6 sm:py-10">
          <section className="rounded-[20px] bg-violet-deep p-7 text-white">
            <p className="text-[11px] font-extrabold tracking-[.12em] text-[#C9BEF7]">CASE SCORE</p>
            <p className="mt-1 font-display text-[56px] leading-none font-bold">
              {total.got}/{total.max}
            </p>
            <p className="mt-3 text-[14.5px] text-[#E4DFF5]">Points are scored the NGN way: each correct choice earns a point, and in select-all and highlight items each wrong choice takes one away (never below zero).</p>
          </section>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/app/practice" className="flex h-12 items-center rounded-[12px] bg-violet px-6 font-bold text-white hover:bg-[#4A2DE6]">
              Back to practice
            </Link>
            <ReportButton itemId={study.id} itemType="case" />
          </div>
        </main>
      </>
    );

  const item = study.stages[stage].item;
  const isChecked = checked[item.id];
  const r = resp[item.id];
  const sc = score(item, r);
  const set = (v: Resp[string]) => !isChecked && setResp((x) => ({ ...x, [item.id]: v }));
  const picked = item.kind === "highlight" || item.kind === "multi" ? ((r as string[]) ?? []).length : null;
  const plusMinus = item.kind === "highlight" || item.kind === "multi";
  const newUpdate = Boolean(study.stages[stage].update) && stage > 0;
  const wrong = "bg-[#FFF6F0] ring-2 ring-[#C2410C]";
  const check = () => {
    setChecked((c) => ({ ...c, [item.id]: true }));
    addAnswers([{ questionId: item.id, moduleId: study.moduleId, lessonId: study.lessonId, selected: [JSON.stringify(r ?? null)], correct: sc.got === sc.max, seconds: 0, mode: "case", sessionId, at: new Date().toISOString() }]);
  };

  const notes = (
    <>
      <p>{study.intro}</p>
      {updates.map((u, i) => (
        <p key={u} className={`mt-3 rounded-[12px] px-3.5 py-2.5 ${i === updates.length - 1 && newUpdate ? "bg-[#FFF4EC] text-[#7A2E06]" : "bg-mist text-ink-body"}`}>
          <span className="mb-0.5 block text-[11px] font-extrabold tracking-[.1em]">UPDATE {i + 1}</span>
          {u}
        </p>
      ))}
    </>
  );

  return (
    <>
      {header}
      <main className="mx-auto grid max-w-[1440px] items-start gap-4 px-4 pt-4 pb-36 sm:px-6 sm:pt-6 lg:grid-cols-2 lg:gap-6 lg:pb-10">
        <section className="overflow-hidden rounded-[16px] border border-hairline bg-white lg:sticky lg:top-[84px]">
          <div className="flex gap-1 border-b border-[#EEEBF7] px-3">
            <span className="relative border-b-2 border-violet px-3 py-3 text-[14px] font-bold text-violet-deep">
              {item.kind === "highlight" ? "Chart" : "Nurse's notes"}
              {newUpdate && <span aria-label="New data" className="absolute top-2.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#F2711C]" />}
            </span>
          </div>
          <div className="p-5 text-[15px] leading-relaxed">
            {item.kind === "highlight" ? (
              <>
                <p className="mb-2 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">TAP THE PHRASES TO HIGHLIGHT</p>
                <p className="leading-[2.1]">
                  {item.parts.map((p, i) => {
                    if (typeof p === "string") return <span key={i}>{p}</span>;
                    const on = ((r as string[]) ?? []).includes(p.id);
                    const ok = item.correct.includes(p.id);
                    const tone = isChecked ? (ok ? (on ? "bg-mint ring-2 ring-correct" : "bg-mint") : on ? wrong : "border border-[#EEEBF7]") : on ? "bg-lilac ring-[1.5px] ring-violet" : "border border-[#EEEBF7] hover:bg-[#FBFAFE]";
                    return (
                      <button key={p.id} type="button" aria-pressed={on} onClick={() => set(on ? ((r as string[]) ?? []).filter((x) => x !== p.id) : [...((r as string[]) ?? []), p.id])} className={`mx-0.5 rounded-[6px] px-1 ${tone}`}>
                        {p.text}
                      </button>
                    );
                  })}
                </p>
                <details className="mt-4 text-[14px] text-ink-body">
                  <summary className="cursor-pointer font-bold text-violet-700">Nurse&apos;s notes</summary>
                  <div className="mt-2">{notes}</div>
                </details>
              </>
            ) : (
              notes
            )}
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-[16px] border border-hairline bg-white p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-lilac px-2.5 py-1 text-[12px] font-bold text-violet-deep">
                Item {stage + 1} of {study.stages.length} · {kindName[item.kind]}
              </span>
              {plusMinus && <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] font-bold text-ink-body">+/− scoring</span>}
            </div>
            <p className="font-display text-[17px] leading-snug font-bold sm:text-[18px]">{item.prompt}</p>
            {picked !== null && !isChecked && <p className="text-[13px] text-ink-muted">{picked} {item.kind === "highlight" ? "highlighted · tap again to remove" : "selected"}</p>}

            {item.kind === "multi" && (
              <div className="flex flex-col gap-2">
                {item.options.map((o) => {
                  const on = ((r as string[]) ?? []).includes(o.id);
                  const ok = item.correct.includes(o.id);
                  return (
                    <label key={o.id} className={`flex min-h-12 items-center gap-3 rounded-[12px] border-[1.5px] p-3.5 ${isChecked ? (ok ? "border-correct bg-mint" : on ? "border-[#C2410C] bg-[#FFF6F0]" : "border-hairline bg-white") : on ? "border-violet bg-lilac" : "border-hairline bg-white hover:bg-[#FBFAFE]"}`}>
                      <input type="checkbox" checked={on} disabled={isChecked} onChange={() => set(on ? ((r as string[]) ?? []).filter((x) => x !== o.id) : [...((r as string[]) ?? []), o.id])} className="h-5 w-5 accent-violet" />
                      <span className="font-semibold">{o.text}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {item.kind === "matrix" && (
              <div className="overflow-x-auto rounded-[12px] border border-[#EEEBF7]">
                <table className="w-full text-sm">
                  <thead className="bg-[#FBFAFE]">
                    <tr>
                      <th className="p-2.5 text-left">Finding</th>
                      {item.columns.map((c) => (
                        <th key={c} className="p-2.5 text-center">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.map((row) => {
                      const map = (r as Record<string, number>) ?? {};
                      return (
                        <tr key={row.id} className={`border-t border-[#EEEBF7] ${isChecked ? (map[row.id] === row.correct ? "bg-mint" : "bg-[#FFF6F0]") : ""}`}>
                          <td className="p-2.5 font-semibold">{row.text}</td>
                          {item.columns.map((c, ci) => (
                            <td key={c} className="p-2.5 text-center">
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
              <p className="text-[15px] leading-[2.4]">
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
                      className={`mx-1 max-w-full rounded-[8px] border-[1.5px] px-2 py-1 ${isChecked ? (map[p.id] === p.correct ? "border-correct bg-mint" : "border-[#C2410C] bg-[#FFF6F0]") : "border-[#D9D2F3] bg-white"}`}
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
              <div className="rounded-[12px] bg-lilac p-4 text-[15px] leading-relaxed">
                <p className="font-bold text-violet-deep">
                  {sc.got} of {sc.max} points
                </p>
                {plusMinus && (() => {
                  const sel = (r as string[] | undefined) ?? [];
                  const minus = sel.filter((x) => !item.correct.includes(x)).length;
                  return minus > 0 ? <p className="text-[13.5px] text-ink-body">{minus} wrong pick{minus === 1 ? "" : "s"} took {minus === 1 ? "a point" : `${minus} points`} away (never below zero).</p> : null;
                })()}
                <p className="mt-1">{item.rationale}</p>
              </div>
            )}
          </section>

          <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-[#EEEBF7] bg-white p-4 pb-[max(env(safe-area-inset-bottom),16px)] lg:static lg:border-0 lg:bg-transparent lg:p-0">
            <span className="hidden flex-1 text-[13px] text-ink-muted lg:block">Progress saves after each item.</span>
            {!isChecked ? (
              <button type="button" onClick={check} className="h-12 flex-1 rounded-[12px] bg-violet px-7 font-bold text-white hover:bg-[#4A2DE6] lg:flex-none">
                Check
              </button>
            ) : (
              <button type="button" onClick={() => setStage((s) => s + 1)} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] bg-violet px-7 font-bold text-white hover:bg-[#4A2DE6] lg:flex-none">
                {stage + 1 === study.stages.length ? "See results" : "Next item"} <ArrowRightIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
