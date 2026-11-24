"use client";

import Link from "next/link";
import { FORMAT_TINT, FormatIcon } from "@/components/study-formats-view";
import type { TopicFormat } from "@/lib/study-formats";

const SHORT: Record<string, string> = { read: "Read", watch: "Watch", practise: "Questions", remember: "Cards" };
/** Labels that fit four equal columns at 390px; the full name stays in aria-label. */
const NARROW: Record<string, string> = { read: "Read", watch: "Watch", practise: "Quiz", remember: "Cards" };

/**
 * "Study this topic as" (Learning Studio iteration 3; Figma: Studio · Iteration 2/3, Topic v2/v3).
 * The same reviewed topic in its other available formats. Read is the page itself (aria-current);
 * Watch scrolls to this page's video; Questions and Cards open the section's existing practice and
 * cards pages. Only formats with real, entitled, approved items appear, and the bar is hidden when
 * Read would be alone. These navigate, so they are links/buttons in a labelled nav, not ARIA tabs.
 */
export function StudyAsTabs({ formats, onWatch }: { formats: readonly TopicFormat[]; onWatch: () => void }) {
  const items = formats.filter((f) => f.status === "available" && f.format.id in SHORT && (f.format.id === "read" || f.format.id === "watch" || f.href));
  if (items.length < 2) return null;
  const pill = "inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full px-2 text-[13.5px] font-bold whitespace-nowrap transition-colors duration-150 sm:w-auto sm:flex-none sm:justify-start sm:gap-2 sm:px-3.5";
  return (
    <nav aria-label="Study this topic as" className="mb-6">
      <p className="mb-2 text-[12px] font-semibold text-text-muted">Study this topic as</p>
      <ul className="grid gap-1 rounded-full bg-mist p-1 sm:inline-flex sm:max-w-full" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((f) => {
          const id = f.format.id;
          const label = SHORT[id];
          const meta = id === "read" ? (f.minutes ? `${f.minutes} min` : "") : id === "watch" ? (f.minutes ? `${f.minutes} min` : "") : String(f.count);
          const full = f.chip ?? label;
          const inner = (
            <>
              <span aria-hidden="true" className={`grid h-6 w-6 place-items-center rounded-full text-primary-deep ${FORMAT_TINT[id]}`}>
                <FormatIcon icon={f.format.icon} size={14} />
              </span>
              <span className="sm:hidden">{NARROW[id]}</span>
              <span className="hidden sm:inline">{label}</span>
              {meta && <span className="hidden font-semibold text-text-muted sm:inline">{meta}</span>}
            </>
          );
          if (id === "read")
            return (
              <li key={id}>
                <span aria-current="page" aria-label={`${full} (this page)`} className={`${pill} bg-canvas text-primary-deep shadow-[0_2px_8px_rgba(27,21,48,.08)]`}>
                  {inner}
                </span>
              </li>
            );
          if (id === "watch")
            return (
              <li key={id}>
                <button type="button" onClick={onWatch} aria-label={`${full}: jump to this topic's video`} className={`${pill} text-text-body hover:bg-canvas`}>
                  {inner}
                </button>
              </li>
            );
          return (
            <li key={id}>
              <Link href={f.href!} aria-label={full} className={`${pill} text-text-body hover:bg-canvas`}>
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
