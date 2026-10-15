"use client";

import { initials, useStudent } from "@/lib/store";

/** The signed-in learner's avatar (lilac with plum initials, 40px / 36px mobile) with the sign-out menu. */
export function Avatar() {
  const { profile, signOut } = useStudent();
  return (
    <details className="relative flex-none">
      <summary aria-label={`Signed in as ${profile?.name ?? profile?.label}`} className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-lilac text-[13px] font-extrabold text-violet-deep sm:h-10 sm:w-10">
        {initials(profile)}
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-56 rounded-[14px] border border-hairline bg-white p-3 shadow-[0_18px_40px_rgba(42,27,120,.12)]">
        <p className="px-2 text-sm font-bold">{profile?.name ?? "Student"}</p>
        <p className="px-2 text-xs text-ink-muted">{profile?.email ?? profile?.label}</p>
        <button onClick={() => void signOut()} className="mt-2 min-h-10 w-full rounded-[10px] px-2 text-left text-sm font-semibold text-ink-body hover:bg-mist">
          Sign out
        </button>
      </div>
    </details>
  );
}

/**
 * Page header (design "Uniformity rules"): an eyebrow that carries information
 * (course name, count, step; never the brand) above a 32px / 26px H1.
 */
export function PageHeader({ eyebrow, title, right, avatar = true }: { eyebrow?: string; title: string; right?: React.ReactNode; avatar?: boolean }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && <p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700 uppercase">{eyebrow}</p>}
        <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.035em] sm:text-[32px]">{title}</h1>
      </div>
      <div className="flex flex-none items-center gap-2.5">
        {right}
        {avatar && <Avatar />}
      </div>
    </div>
  );
}
