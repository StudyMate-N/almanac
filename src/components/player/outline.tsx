"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, LockIcon } from "@/components/icons";
import { groupsInModule } from "@/content/course";
import type { Lesson, Module, PageKind } from "@/content/types";
import { minutesFor } from "@/lib/minutes";

export const kindLabel: Record<PageKind, string> = {
  reading: "Reading",
  activity: "Activity",
  summary: "Summary",
  quiz: "Quiz",
  test: "Test",
  video: "Video",
  topic: "Topic",
};

export function Ring({ done, total, size = 34, tone = "violet" }: { done: number; total: number; size?: number; tone?: "violet" | "white" }) {
  const pct = total ? done / total : 0;
  const full = total > 0 && done >= total;
  return (
    <span className="relative inline-grid flex-none place-items-center" style={{ width: size, height: size }} aria-label={`${done} of ${total} pages done`}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="none" stroke={tone === "white" ? "rgba(255,255,255,.25)" : "var(--color-track)"} strokeWidth="5" />
        {pct > 0 && <circle cx="18" cy="18" r="15" fill="none" stroke={full ? "var(--color-correct)" : tone === "white" ? "#fff" : "var(--color-violet)"} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${pct * 94.2} 94.2`} />}
      </svg>
      {full && <CheckIcon size={size * 0.38} className="text-correct" />}
    </span>
  );
}

/** Outline label: short title, without the "Section N:" prefix the section heading already shows. */
const rowLabel = (p: Lesson) => (p.kind === "test" ? "Section test" : (p.shortTitle ?? p.title).replace(/^Section \d+:\s*/, ""));

type Props = {
  modules: Module[];
  currentId: string;
  isDone: (id: string) => boolean;
  isOpen: (p: Lesson) => boolean;
  onNavigate?: () => void;
};

/** The course outline rail: sections, then lessons, then pages, each with its state. */
export function Outline({ modules, currentId, isDone, isOpen, onNavigate }: Props) {
  const currentModule = modules.find((m) => groupsInModule(m.id).some((g) => g.pages.some((p) => p.id === currentId)))?.id;
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => (currentModule ? { [currentModule]: true } : {}));
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (currentModule) setExpanded((prev) => prev[currentModule] ? prev : { ...prev, [currentModule]: true });
  }, [currentModule]);
  useEffect(() => {
    if (!currentModule || !expanded[currentModule]) return;
    const frame = requestAnimationFrame(() => {
      const nav = navRef.current;
      const rail = nav?.closest<HTMLElement>("[data-outline-scroll]");
      const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
      if (!rail || !active) return;
      const box = rail.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      if (rect.top < box.top + 12) rail.scrollTop -= (box.top + 12 - rect.top);
      else if (rect.bottom > box.bottom - 12) rail.scrollTop += (rect.bottom - box.bottom + 12);
    });
    return () => cancelAnimationFrame(frame);
  }, [currentId, currentModule, expanded]);
  return (
    <nav ref={navRef} aria-label="Course outline" className="flex flex-col gap-2">
      {modules.map((m) => {
        const groups = groupsInModule(m.id);
        const pages = groups.flatMap((g) => g.pages);
        const done = pages.filter((p) => isDone(p.id)).length;
        const open = Boolean(expanded[m.id]);
        const here = m.id === currentModule;
        const allDone = pages.length > 0 && done === pages.length;
        const mins = pages.reduce((n, p) => n + minutesFor(p), 0);
        const eyebrow = (m.kind === "section" ? `Section ${m.number}` : m.kind === "start" ? "Start here" : "Finish") + (pages.length > 0 ? ` · about ${mins} min` : "");
        return (
          <section key={m.id} className="rounded-[14px] border border-hairline bg-white">
            <button onClick={() => setExpanded((e) => ({ ...e, [m.id]: !open }))} aria-expanded={open} className="flex min-h-[50px] w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left hover:bg-[#FBFAFE]">
              <span
                className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] font-display text-[15px] font-bold ${allDone ? "bg-mint text-correct" : here ? "bg-violet-deep text-white" : "border-[1.5px] border-[#D9D2F3] text-ink-body"}`}
                aria-label={allDone ? `${done} of ${pages.length} pages done` : undefined}
              >
                {allDone ? <CheckIcon size={14} /> : m.kind === "start" ? "★" : m.kind === "final" ? "F" : m.number}
              </span>
              <span className="min-w-0 flex-1">
                {(open || here || m.kind !== "section") && <span className="block text-[10.5px] font-extrabold tracking-[.1em] text-ink-muted uppercase">{eyebrow}</span>}
                <span className={`block leading-snug ${open || here ? "text-[14px] font-bold" : "text-[13.5px] font-semibold text-ink-body"}`}>{m.title}</span>
              </span>
            </button>
            {open && (
              <div className="flex flex-col gap-1 px-2 pb-3">
                {groups.map((g) => (
                  <div key={g.id}>
                    {groups.length > 1 && g.pages.length > 1 && <p className="px-2 pt-2 pb-1 text-[10.5px] font-extrabold tracking-[.1em] text-ink-muted uppercase">{g.title}</p>}
                    <ol className="flex flex-col">
                      {g.pages.map((p) => {
                        const cur = p.id === currentId;
                        const ok = isOpen(p);
                        const d = isDone(p.id);
                        const inner = (
                          <>
                            <span
                              aria-hidden="true"
                              className={`grid h-5 w-5 flex-none place-items-center rounded-full text-[9.5px] font-extrabold ${d ? "bg-correct text-white" : cur ? "border-[1.5px] border-violet bg-white text-violet-700" : ok ? "border-[1.5px] border-[#D9D2F3] bg-white text-ink-body" : "bg-mist text-ink-faint"}`}
                            >
                              {d ? <CheckIcon size={10} /> : !ok ? <LockIcon size={11} /> : p.kind === "quiz" ? "Q" : p.kind === "test" ? "T" : p.kind === "summary" ? "S" : p.kind === "video" ? "▶" : String(p.title.match(/^\d+\.(\d+)/)?.[1] ?? "•")}
                            </span>
                            <span className={`min-w-0 flex-1 text-[13px] leading-snug ${cur ? "font-bold text-violet-deep" : "font-medium text-ink"}`}>{rowLabel(p)}</span>
                            <span className="flex-none text-[11.5px] text-ink-muted">{minutesFor(p)}m</span>
                          </>
                        );
                        return (
                          <li key={p.id}>
                            {ok ? (
                              <Link
                                href={`/app/learn/${p.id}`}
                                onClick={onNavigate}
                                aria-current={cur ? "page" : undefined}
                                className={`flex min-h-10 items-center gap-2.5 rounded-[10px] px-2 py-1.5 ${cur ? "bg-lilac" : "hover:bg-mist"}`}
                              >
                                {inner}
                              </Link>
                            ) : (
                              <div className="flex min-h-10 items-center gap-2.5 px-2 py-1.5 opacity-60" title="Opens once it is approved">
                                {inner}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </nav>
  );
}
