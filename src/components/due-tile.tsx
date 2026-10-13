"use client";

import Link from "next/link";
import { useDueCount } from "@/components/app-nav";
import { TileDecor } from "@/components/brand";
import { ArrowRightIcon } from "@/components/icons";

/** The violet "cards due" tile: the main action on Today. */
export function DueTile() {
  const due = useDueCount();
  return (
    <section aria-labelledby="due-heading" className="relative flex flex-col gap-3 overflow-hidden rounded-tile bg-violet p-7 text-white">
      <TileDecor className="pointer-events-none absolute -top-10 -right-12 h-[220px] w-[220px]" />
      <h2 id="due-heading" className="relative text-[15px] font-semibold text-violet-on">
        Cards due today
      </h2>
      <p className="relative flex flex-wrap items-baseline gap-3">
        <span className="font-display text-[72px] leading-[0.95] font-semibold">{due}</span>
        <span className="text-[17px] font-semibold">{due === 0 ? "All caught up" : `about ${Math.max(1, Math.round(due * 0.4))} min`}</span>
      </p>
      <Link href="/app/review" className="relative mt-1 inline-flex min-h-[52px] items-center justify-center gap-2.5 self-stretch rounded-full bg-tangerine px-7 font-bold text-ink hover:bg-[#ff8c4a] sm:self-start">
        {due === 0 ? "Open your cards" : "Start review"}
        <ArrowRightIcon size={16} />
      </Link>
    </section>
  );
}
