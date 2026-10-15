"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/brand";
import {
  NavCards,
  NavCoach,
  NavCourses,
  NavOrders,
  NavPractice,
  NavProgress,
  NavToday,
} from "@/components/nav-icons";
import {
  lessons as allLessons,
  modulesInCourse,
  openCourses,
} from "@/content/course";
import { rpc } from "@/lib/api";
import { planFor, weekToday } from "@/lib/plan";
import { useStudent } from "@/lib/store";
import { useDueCount } from "@/lib/use-cards";

/* Workspace navigation (design handoff 6a/6b, "Uniformity rules").
   Set and order: Today · Courses · Practice · Cards [due] · Progress · Orders · Ask a coach. */

type Item = {
  href: string;
  label: string;
  Icon: (p: { size?: number }) => React.ReactElement;
  match: (p: string) => boolean;
};

const items: Item[] = [
  {
    href: "/app",
    label: "Today",
    Icon: NavToday,
    match: (p) => p === "/app" || p === "/app/setup",
  },
  {
    href: "/app/courses",
    label: "Courses",
    Icon: NavCourses,
    match: (p) =>
      p.startsWith("/app/courses") ||
      p.startsWith("/app/learn") ||
      p.startsWith("/app/guide"),
  },
  {
    href: "/app/practice",
    label: "Practice",
    Icon: NavPractice,
    match: (p) =>
      p.startsWith("/app/practice") ||
      p.startsWith("/app/exam") ||
      p.startsWith("/app/case"),
  },
  {
    href: "/app/review",
    label: "Cards",
    Icon: NavCards,
    match: (p) => p.startsWith("/app/review"),
  },
  {
    href: "/app/progress",
    label: "Progress",
    Icon: NavProgress,
    match: (p) => p.startsWith("/app/progress"),
  },
  {
    href: "/app/orders",
    label: "Orders",
    Icon: NavOrders,
    match: (p) => p.startsWith("/app/orders"),
  },
  {
    href: "/app/coach",
    label: "Ask a coach",
    Icon: NavCoach,
    match: (p) => p.startsWith("/app/coach"),
  },
];

export { useDueCount };

/* ── Orders "New" badge: live data. It shows when an order's visible state
   has changed since the student last opened Orders. ───────────────────── */
type OrderSig = {
  id: string;
  status: string;
  paymentStatus: string;
  planStatus: string | null;
  releasedCount: number;
  packPublished: boolean;
};
const SEEN_KEY = "almanac.orders.seen";
let ordersCache: { token: string; sig: string } | null = null;
const signature = (rows: OrderSig[]) =>
  rows
    .map((r) =>
      [
        r.id,
        r.status,
        r.paymentStatus,
        r.planStatus,
        r.releasedCount,
        r.packPublished,
      ].join(":"),
    )
    .sort()
    .join("|");
const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
};

/** Called by the Orders page once it has loaded the student's orders. */
export function markOrdersSeen(rows: OrderSig[]) {
  const sig = signature(rows);
  try {
    localStorage.setItem(SEEN_KEY, sig);
  } catch {}
  ordersCache = ordersCache ? { ...ordersCache, sig } : ordersCache;
  window.dispatchEvent(new Event("almanac:orders-seen"));
}

function useOrdersNew() {
  const { token } = useStudent();
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    if (!token) return;
    let live = true;
    const decide = (sig: string) =>
      live && setIsNew(sig !== "" && sig !== readSeen());
    if (ordersCache?.token === token) decide(ordersCache.sig);
    else
      rpc<OrderSig[]>("learning_student_orders", { p_token: token })
        .then((rows) => {
          const sig = signature(Array.isArray(rows) ? rows : []);
          ordersCache = { token, sig };
          decide(sig);
        })
        .catch(() => {});
    const onSeen = () => live && setIsNew(false);
    window.addEventListener("almanac:orders-seen", onSeen);
    return () => {
      live = false;
      window.removeEventListener("almanac:orders-seen", onSeen);
    };
  }, [token]);
  return isNew;
}

function Badge({
  kind,
  children,
}: {
  kind: "due" | "new";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${kind === "due" ? "bg-[#FFE9DC] text-[#A8430A]" : "bg-mint text-[#1E7A4F]"}`}
    >
      {children}
    </span>
  );
}

/** Pages done in one course (for the sidebar card and the course header). */
export function useCoursePages(courseId: string) {
  const { state } = useStudent();
  return useMemo(() => {
    const mods = new Set(modulesInCourse(courseId).map((m) => m.id));
    const pages = allLessons.filter((l) => mods.has(l.moduleId));
    return {
      done: pages.filter((p) => state.lessons?.[p.id]).length,
      total: pages.length,
    };
  }, [state.lessons, courseId]);
}

/** The owned course pinned to the bottom of the sidebar: cover, week, pages done and a progress bar. */
function CourseWidget({ courseId }: { courseId: string }) {
  const { state } = useStudent();
  const { done, total } = useCoursePages(courseId);
  const course = openCourses.find((c) => c.id === courseId);
  if (!course) return null;
  const plan = planFor(state, courseId);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Link
      href={`/app/courses/${courseId}`}
      className="block overflow-hidden rounded-[12px] border border-hairline bg-white hover:border-[#D9D2F3]"
    >
      <span className="alm-cover block h-14 bg-[#E6E0F8]" aria-hidden="true" />
      <span className="flex flex-col gap-[5px] px-3 py-2.5">
        <span className="text-[12.5px] leading-[1.3] font-bold text-ink">
          {course.title}
        </span>
        <span className="text-[11.5px] text-ink-muted">
          {plan ? `Week ${weekToday(plan)} of ${plan.courseWeeks} · ` : ""}
          {done} of {total} pages
        </span>
        <span className="block h-1 overflow-hidden rounded-full bg-[#EFEDF5]">
          <span
            className="block h-full bg-violet"
            style={{ width: `${pct}%` }}
          />
        </span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const due = useDueCount();
  const ordersNew = useOrdersNew();
  const { authorizedCourses } = useStudent();
  const owned = openCourses.filter(
    (c) => authorizedCourses.includes(c.id) && modulesInCourse(c.id).length > 0,
  );
  const row = (active: boolean) =>
    `flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] ${active ? "bg-lilac font-extrabold text-violet-deep" : "font-semibold text-ink-body hover:bg-mist"}`;
  return (
    <div className="hidden w-[232px] flex-none border-r border-[#EEEBF7] bg-white lg:block">
      <aside className="sticky top-0 flex h-dvh flex-col gap-[22px] px-3.5 py-5">
        <div className="px-2">
          <Logo href="/app" size={24} textClass="text-[20px]" />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-0.5">
          {items.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={row(active)}
              >
                <span
                  className={`grid h-5 w-5 flex-none place-items-center ${active ? "" : "opacity-85"}`}
                >
                  <Icon />
                </span>
                <span className="flex-1">{label}</span>
                {label === "Cards" && due > 0 && (
                  <Badge kind="due">{due}</Badge>
                )}
                {label === "Orders" && ordersNew && (
                  <Badge kind="new">New</Badge>
                )}
              </Link>
            );
          })}
          {authorizedCourses.includes("advanced-pharmacology") && (
            <Link
              href="/app/midterm/nur635"
              aria-current={
                pathname.startsWith("/app/midterm/nur635") ? "page" : undefined
              }
              className={row(pathname.startsWith("/app/midterm/nur635"))}
            >
              <span className="grid h-5 w-5 flex-none place-items-center opacity-85">
                <NavCourses />
              </span>
              NUR-635 midterm
            </Link>
          )}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href="/app/coach"
            className="flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] font-semibold text-ink-body hover:bg-mist"
          >
            <span className="grid h-5 w-5 flex-none place-items-center">
              <NavCoach />
            </span>
            Ask a coach
          </Link>
          {owned.map((c) => (
            <CourseWidget key={c.id} courseId={c.id} />
          ))}
        </div>
      </aside>
    </div>
  );
}

/** Mobile bottom tabs: Today · Courses · Practice · Cards · Progress (Orders and coach sit in the top bar). */
export function TabBar() {
  const pathname = usePathname();
  const due = useDueCount();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-[#EEEBF7] bg-white px-1.5 pt-1.5 pb-[max(env(safe-area-inset-bottom),10px)] lg:hidden"
    >
      {items.slice(0, 5).map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-extrabold text-violet-deep" : "font-semibold text-ink-muted"}`}
          >
            <span
              className={`relative grid h-7 w-11 place-items-center rounded-full ${active ? "bg-lilac" : ""}`}
              aria-hidden="true"
            >
              <Icon />
              {label === "Cards" && due > 0 && (
                <span className="absolute -top-1.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-[#F2711C] px-1 text-[10px] leading-none font-extrabold text-white">
                  {due}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile 56px top bar: logo, Ask a coach, Orders (an orange dot when something changed). */
export function MobileTopBar() {
  const ordersNew = useOrdersNew();
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[#EEEBF7] bg-white px-4 lg:hidden">
      <Logo href="/app" size={26} textClass="text-[21px]" />
      <div className="flex gap-1">
        <Link
          href="/app/coach"
          aria-label="Ask a coach"
          className="grid h-11 w-11 place-items-center rounded-full hover:bg-mist"
        >
          <NavCoach />
        </Link>
        <Link
          href="/app/orders"
          aria-label={ordersNew ? "Orders, something has changed" : "Orders"}
          className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-mist"
        >
          <NavOrders />
          {ordersNew && (
            <span
              className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#F2711C]"
              aria-hidden="true"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
