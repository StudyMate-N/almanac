"use client";

import Link from "next/link";

export type StaffNavItem = { key: string; label: string; badge?: number | null; href?: string; onClick?: () => void; active?: boolean };

/** White Almanac mark for the plum staff sidebar. */
function StaffLogo() {
  return (
    <Link href="/coach" className="flex items-center gap-2 px-2">
      <span className="grid h-6 w-6 flex-none place-items-center rounded-[7px] bg-violet">
        <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white">
          <span className="absolute top-0 right-0 h-1 w-1 rounded-full bg-[#F2711C]" />
        </span>
      </span>
      <span className="font-display text-[20px] font-extrabold tracking-[-.045em] text-white">Almanac</span>
      <span className="rounded-[6px] bg-white/15 px-1.5 py-0.5 text-[10.5px] font-extrabold tracking-[.12em] text-[#E4DFF5]">COACH</span>
    </Link>
  );
}

/**
 * Staff console shell (design 11a/11b): plum 232px sidebar with a COACH tag,
 * staff nav with live counts, and the signed-in staff member at the bottom.
 * On small screens the nav becomes a plum top bar with a scrolling row.
 */
export function StaffShell({ items, user, role, onSignOut, children }: { items: StaffNavItem[]; user?: string; role?: string; onSignOut?: () => void; children: React.ReactNode }) {
  const row = (it: StaffNavItem, compact = false) => {
    const cls = `flex items-center gap-2.5 rounded-[10px] text-[13.5px] whitespace-nowrap ${compact ? "h-9 px-3" : "h-10 px-3"} ${it.active ? "bg-white/15 font-extrabold text-white" : "font-semibold text-[#D9D2F3] hover:bg-white/10 hover:text-white"}`;
    const inner = (
      <>
        <span className="flex-1">{it.label}</span>
        {it.badge ? <span className="rounded-full bg-[#FFE9DC] px-2 py-px text-[11px] font-extrabold text-[#A8430A]">{it.badge}</span> : null}
      </>
    );
    return it.href ? (
      <Link key={it.key} href={it.href} aria-current={it.active ? "page" : undefined} className={cls}>
        {inner}
      </Link>
    ) : (
      <button key={it.key} type="button" onClick={it.onClick} aria-current={it.active ? "page" : undefined} className={`${cls} text-left`}>
        {inner}
      </button>
    );
  };
  const initial = (user ?? "?").trim().charAt(0).toUpperCase();
  return (
    <div className="alm-staff-shell flex min-h-dvh bg-[#F7F6FB] max-lg:flex-col">
      <aside className="hidden w-[232px] flex-none bg-violet-deep lg:block">
        <div className="sticky top-0 flex h-dvh flex-col gap-[22px] px-3.5 py-5">
          <StaffLogo />
          <nav aria-label="Staff" className="flex flex-col gap-0.5">
            {items.map((it) => row(it))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4">
            <Link href="/app" className="px-3 text-[12.5px] font-bold text-[#C9BEF7] hover:text-white">
              Preview student app →
            </Link>
            <div className="flex items-center gap-2.5 px-2">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lilac text-[13px] font-extrabold text-violet-deep">{initial}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-bold text-white">{user}</span>
                <span className="truncate text-[11.5px] text-[#C9BEF7] capitalize">{role}</span>
              </span>
            </div>
            {onSignOut && (
              <button type="button" onClick={onSignOut} className="mx-1 h-9 rounded-[10px] text-left text-[12.5px] font-bold text-[#C9BEF7] hover:bg-white/10 hover:text-white">
                <span className="px-2">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex flex-col gap-2 bg-violet-deep px-4 pt-3 pb-2.5 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <StaffLogo />
          {onSignOut && (
            <button type="button" onClick={onSignOut} className="text-[12.5px] font-bold text-[#C9BEF7]">
              Sign out
            </button>
          )}
        </div>
        <nav aria-label="Staff" className="-mx-4 flex gap-1 overflow-x-auto px-4">
          {items.map((it) => row(it, true))}
        </nav>
      </header>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
