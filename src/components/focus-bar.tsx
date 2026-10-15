import Link from "next/link";

/**
 * Focus-mode top bar (design handoff "Workspace layout"): 60px on desktop with a
 * 40px close circle, course name as a violet eyebrow and the screen title.
 * `right` holds the timer, progress or finish time.
 */
export function FocusBar({ closeHref, eyebrow, title, right, onClose }: { closeHref: string; eyebrow?: string; title: string; right?: React.ReactNode; onClose?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3.5 border-b border-[#EEEBF7] bg-white px-4 sm:px-6" style={{ viewTransitionName: "focus-bar" }}>
      <Link href={closeHref} onClick={onClose} aria-label="Close" className="grid h-10 w-10 flex-none place-items-center rounded-full border border-hairline text-[15px] text-ink hover:bg-mist">
        ✕
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        {eyebrow && <span className="truncate text-[11.5px] font-bold text-violet-700">{eyebrow}</span>}
        <span className="truncate font-display text-[15px] font-bold text-ink">{title}</span>
      </div>
      {right}
    </header>
  );
}

/** 120×5 progress bar with a label, as in 8a/15b. */
export function FocusProgress({ value, label }: { value: number; label: string }) {
  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      <div className="h-[5px] w-[120px] overflow-hidden rounded-full bg-[#EFEDF5]">
        <div className="h-full bg-violet transition-[width] duration-300" style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }} />
      </div>
      <span className="text-[12.5px] font-bold whitespace-nowrap text-ink-body">{label}</span>
    </div>
  );
}
