"use client";

import Link from "next/link";
import { useCardQueue } from "@/lib/use-cards";
import { ArrowRightIcon } from "@/components/icons";

/** The violet "cards due" tile: the main action on Today. */
export function DueTile() {
  const { queue, locked } = useCardQueue();
  const due = queue.length;
  return (
    <section aria-labelledby="due-heading" className="relative flex flex-col gap-3 overflow-hidden rounded-[18px] border border-hairline bg-white p-5 text-ink">
      <h2 id="due-heading" className="relative text-[15px] font-semibold text-ink-muted">
        Cards due today
      </h2>
      <p className="relative flex flex-wrap items-baseline gap-3">
        <span className="font-display text-[42px] leading-[0.95] font-semibold">{due}</span>
        <span className="text-[17px] font-semibold">{due > 0 ? `about ${Math.max(1, Math.round(due * 0.4))} min` : locked > 0 ? "Cards open as you study each section" : "All caught up"}</span>
      </p>
      <Link href="/app/review" className="relative mt-1 inline-flex min-h-[52px] items-center justify-center gap-2.5 self-stretch rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600 sm:self-start">
        {due === 0 ? "Open your cards" : "Start review"}
        <ArrowRightIcon size={16} />
      </Link>
    </section>
  );
}
