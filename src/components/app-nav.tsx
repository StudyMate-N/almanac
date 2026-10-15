"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand";
import { BookIcon, CardsIcon, ChartIcon, HomeIcon, PlayIcon } from "@/components/icons";
import { openCourses } from "@/content/course";
import { planFor, weekToday } from "@/lib/plan";
import { useStudent } from "@/lib/store";
import { useDueCount } from "@/lib/use-cards";

const items = [
  { href: "/app", label: "Today", Icon: HomeIcon, match: (p: string) => p === "/app" || p === "/app/setup" },
  { href: "/app/courses", label: "Courses", Icon: BookIcon, match: (p: string) => p.startsWith("/app/courses") || p.startsWith("/app/learn") || p.startsWith("/app/guide") },
  { href: "/app/practice", label: "Practice", Icon: PlayIcon, match: (p: string) => p.startsWith("/app/practice") },
  { href: "/app/review", label: "Cards", Icon: CardsIcon, match: (p: string) => p.startsWith("/app/review") },
  { href: "/app/progress", label: "Progress", Icon: ChartIcon, match: (p: string) => p.startsWith("/app/progress") },
  { href: "/app/orders", label: "Orders", Icon: BookIcon, match: (p: string) => p.startsWith("/app/orders") },
];

export { useDueCount };

export function Sidebar() {
  const pathname = usePathname();
  const due = useDueCount();
  const { state } = useStudent();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[232px] flex-none flex-col gap-7 border-r border-hairline bg-white px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo href="/app" />
      </div>
      <nav aria-label="Main" className="flex flex-col gap-0.5">
        {items.filter(({label})=>label!=="Orders").map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[43px] items-center gap-3 rounded-[11px] px-3 text-[13px] font-semibold ${active ? "bg-lilac font-bold text-violet-700" : "text-ink-muted hover:bg-mist hover:text-ink"}`}
            >
              <Icon />
              {label}
              {label === "Cards" && due > 0 && <span className="ml-auto rounded-full bg-[#FFF4EC] px-2.5 py-0.5 text-[11px] font-bold text-[#9D3E0E]">{due}</span>}
              {label === "Orders" && <span className="ml-auto rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">Open</span>}
            </Link>
          );
        })}
        <Link href="/app/coach" className={`flex min-h-12 items-center gap-3 rounded-[14px] px-3.5 font-semibold ${pathname.startsWith("/app/coach") ? "bg-lilac font-bold text-violet-700" : "text-ink-muted hover:bg-mist hover:text-ink"}`}>
          <img src="/almanac-art/icon-support.svg" alt="" className="alm-workspace-icon" />
          Ask a coach
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        {openCourses.map((c) => {
          const plan = planFor(state, c.id);
          return (
            <Link key={c.id} href={`/app/courses/${c.id}`} className="rounded-[14px] border border-hairline bg-[#F6F4FB] p-4 hover:bg-lilac">
              <p className="font-display text-[15px] leading-snug font-semibold">{c.title}</p>
              <p className="mt-1 text-[12px] text-ink-muted">{plan ? `Week ${weekToday(plan)} of ${plan.courseWeeks}` : "Set up your plan"}</p>
              <div className="alm-desk-progress mt-3"><span style={{ width: plan ? `${Math.min(100, Math.round((weekToday(plan) / plan.courseWeeks) * 100))}%` : "0%" }} /></div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function TabBar() {
  const pathname = usePathname();
  const due = useDueCount();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 gap-1 rounded-t-3xl bg-surface px-2 pt-2 pb-[max(env(safe-area-inset-bottom),14px)] shadow-[0_-1px_0_var(--color-hairline)] lg:hidden">
      {items.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs ${active ? "font-bold text-violet-700" : "font-semibold text-ink-muted"}`}>
            <span className={`relative grid h-[30px] w-[48px] place-items-center rounded-full ${active ? "bg-lilac" : ""}`} aria-hidden="true">
              <Icon />
              {label === "Cards" && due > 0 && <span className="absolute -top-0.5 right-0 rounded-full bg-[#FFF4EC] px-1.5 text-[10px] leading-4 font-extrabold text-[#9D3E0E]">{due}</span>}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
