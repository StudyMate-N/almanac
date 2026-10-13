"use client";

import { initials, useStudent } from "@/lib/store";

/** Page title row used on the app's main screens. */
export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { profile, signOut } = useStudent();
  return (
    <div className="mb-6 flex items-start justify-between gap-4 sm:items-center">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-violet-600">{eyebrow}</p>
        <h1 className="font-display text-[28px] leading-tight font-semibold tracking-[-0.02em] sm:text-[36px]">{title}</h1>
      </div>
      <details className="relative flex-none">
        <summary
          aria-label={`Signed in as ${profile?.name ?? profile?.label}`}
          className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full bg-peach text-sm font-bold text-peach-ink sm:h-12 sm:w-12"
        >
          {initials(profile)}
        </summary>
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-card bg-white p-3 shadow-lg">
          <p className="px-2 text-sm font-bold">{profile?.name ?? "Pilot student"}</p>
          <p className="px-2 text-xs text-ink-muted">{profile?.label}</p>
          <button onClick={() => void signOut()} className="mt-2 min-h-10 w-full rounded-xl px-2 text-left text-sm font-semibold text-rose-ink hover:bg-rose">
            Sign out
          </button>
        </div>
      </details>
    </div>
  );
}
