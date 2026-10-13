"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, LockIcon } from "@/components/icons";
import { groupsInModule } from "@/content/course";
import type { Lesson, Module, PageKind } from "@/content/types";

export const kindLabel: Record<PageKind, string> = {
  reading: "Reading",
  activity: "Activity",
  summary: "Summary",
  quiz: "Quiz",
  test: "Test",
  video: "Video",
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
  return (
    <nav aria-label="Course outline" className="flex flex-col gap-2">
      {modules.map((m) => {
        const groups = groupsInModule(m.id);
        const pages = groups.flatMap((g) => g.pages);
        const done = pages.filter((p) => isDone(p.id)).length;
        const open = Boolean(expanded[m.id]);
        const here = m.id === currentModule;
        return (
          <section key={m.id} className={`rounded-card ${here ? "bg-white" : "bg-white/60"}`}>
            <button onClick={() => setExpanded((e) => ({ ...e, [m.id]: !open }))} aria-expanded={open} className="flex w-full items-center gap-3 rounded-card px-3.5 py-3 text-left hover:bg-white">
              <span className={`grid h-8 w-8 flex-none place-items-center rounded-xl font-display text-[15px] font-semibold ${here ? "bg-violet text-white" : "bg-lilac text-violet-700"}`}>
                {m.kind === "start" ? "★" : m.kind === "final" ? "✓" : m.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-extrabold tracking-wide text-ink-muted uppercase">{m.kind === "section" ? `Section ${m.number}` : m.kind === "start" ? "Start here" : "Finish"}</span>
                <span className="block text-[14.5px] leading-snug font-semibold">{m.title}</span>
              </span>
              <Ring done={done} total={pages.length} size={28} />
            </button>
            {open && (
              <div className="flex flex-col gap-1 px-2 pb-3">
                {groups.map((g) => (
                  <div key={g.id}>
                    {groups.length > 1 && g.pages.length > 1 && <p className="px-2 pt-2 pb-1 text-[12px] font-bold text-violet-700">{g.title}</p>}
                    <ol className="flex flex-col">
                      {g.pages.map((p) => {
                        const cur = p.id === currentId;
                        const ok = isOpen(p);
                        const d = isDone(p.id);
                        const inner = (
                          <>
                            <span
                              aria-hidden="true"
                              className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[10px] font-extrabold ${d ? "bg-correct text-white" : cur ? "bg-violet text-white" : ok ? "border-2 border-hairline bg-white" : "bg-mist text-ink-faint"}`}
                            >
                              {d ? <CheckIcon size={11} /> : !ok ? <LockIcon size={11} /> : p.kind === "quiz" ? "Q" : p.kind === "test" ? "T" : p.kind === "video" ? "▶" : ""}
                            </span>
                            <span className={`min-w-0 flex-1 text-[13.5px] leading-snug ${cur ? "font-bold text-violet-700" : "font-medium text-ink-body"}`}>{p.shortTitle ?? p.title}</span>
                          </>
                        );
                        return (
                          <li key={p.id}>
                            {ok ? (
                              <Link
                                href={`/app/learn/${p.id}`}
                                onClick={onNavigate}
                                aria-current={cur ? "page" : undefined}
                                className={`flex min-h-10 items-center gap-2.5 rounded-xl px-2 py-1.5 ${cur ? "bg-lilac" : "hover:bg-mist"}`}
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
