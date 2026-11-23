"use client";

import Link from "next/link";
import { Avatar } from "@/components/page-header";
import { NavCoach } from "@/components/nav-icons";
import { TodaySession } from "@/components/today-session";
import { lessons as allLessons, modulesInCourse, openCourses } from "@/content/course";
import type { Course } from "@/content/types";
import { minutesFor } from "@/lib/minutes";
import { daysUntil, moduleWeeks, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { firstName, useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

const sectionNo = (moduleId: string) => moduleId.match(/-s(\d+)$/)?.[1];
const shortDate = (iso?: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
};

/** "Continue" card: the next unfinished page, with the orange play button when it's a video topic. */
function ContinueCard({ course }: { course: Course }) {
  const { state } = useStudent();
  const { lessonOpen } = useCourse(course.id);
  const mods = new Set(modulesInCourse(course.id).map((m) => m.id));
  const open = allLessons.filter((l) => mods.has(l.moduleId) && lessonOpen(l.id));
  const next = open.find((l) => !state.lessons[l.id]);
  if (!next) return null;
  const video = next.blocks.some((b) => b.t === "video");
  const n = sectionNo(next.moduleId);
  return (
    <Link
      href={`/app/learn/${next.id}`}
      className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-[20px] border border-hairline bg-white p-3 hover:shadow-[0_12px_28px_rgba(42,27,120,.08)] sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:gap-4"
    >
      <span
        className="flex h-[72px] items-center rounded-[12px] bg-[#E6E0F8] pl-3 sm:h-[104px] sm:pl-[18px]"
        style={{ background: `#E6E0F8 url(/almanac-art/${video ? "video-poster-pathophysiology.png" : "cover-pathophysiology.png"}) 70% 50%/cover no-repeat` }}
      >
        {video && (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EA6512] motion-safe:animate-[almPulse_2.4s_ease-out_infinite]" aria-hidden="true">
            <span className="ml-[3px] h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">CONTINUE{n ? ` · SECTION ${n}` : ""}</span>
        <span className="font-display text-[17px] leading-snug font-bold tracking-[-.02em] sm:text-[20px]">{next.shortTitle ?? next.title}</span>
        <span className="text-[12.5px] text-ink-muted">
          {video ? "Video topic" : "Reading"} · about {minutesFor(next)} min<span className="hidden sm:inline"> · opens in the course player</span>
        </span>
      </span>
      <span className="hidden pr-2 text-[18px] font-bold text-violet-700 sm:block" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/** Start here / NGN case tiles. */
function SmallTiles({ course }: { course: Course }) {
  const { answers } = useStudent();
  const { questions, cases } = useCourse(course.id);
  const checkDone = answers.some((a) => a.mode === "check" && questions.some((q) => q.id === a.questionId));
  const tiles = [
    !checkDone && questions.length >= 5 && { eyebrow: "START HERE", title: "Take the starting check", sub: "It shows where you stand across the sections.", href: `/app/exam/check?course=${course.id}` },
    cases[0] && { eyebrow: "NGN CASE STUDY", title: `Case: ${cases[0].title}`, sub: "Six items, from cues to outcomes", href: `/app/case/${cases[0].id}` },
  ].filter(Boolean) as { eyebrow: string; title: string; sub: string; href: string }[];
  if (!tiles.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tiles.map((t) => (
        <Link key={t.href} href={t.href} className="flex flex-col gap-[3px] rounded-[16px] border border-hairline bg-white px-4 py-3.5 hover:border-[#C9BEF7]">
          <span className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">{t.eyebrow}</span>
          <span className="text-[15px] font-bold">{t.title}</span>
          <span className="text-[12.5px] text-ink-muted">{t.sub}</span>
        </Link>
      ))}
    </div>
  );
}

/** The next exam date from the student's plan, as a plum countdown (orange number = time). */
function ExamCountdown({ course, compact = false }: { course: Course; compact?: boolean }) {
  const { state } = useStudent();
  const plan = planFor(state, course.id);
  const toMid = daysUntil(plan?.midterm);
  const toFinal = daysUntil(plan?.final);
  const exam = toMid !== null && toMid >= 0 ? { kind: "midterm" as const, days: toMid, date: plan?.midterm } : toFinal !== null && toFinal >= 0 ? { kind: "final" as const, days: toFinal, date: plan?.final } : null;
  if (!exam) return null;
  const label = exam.kind === "midterm" ? "Midterm" : "Final";
  const href = `/app/exam/${exam.kind}?course=${course.id}`;
  if (compact)
    return (
      <Link href={href} className="flex items-center justify-between gap-3 rounded-[16px] bg-violet-deep px-4 py-3.5 text-white">
        <span className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-[.12em] text-[#C9BEF7]">
            {label.toUpperCase()} · {shortDate(exam.date)}
          </span>
          <span className="text-[14px] font-bold">Take the simulation →</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-display text-[30px] leading-none font-bold text-[#FFB27F]">{exam.days}</span>
          <span className="text-[12px] font-bold">{exam.days === 1 ? "day" : "days"}</span>
        </span>
      </Link>
    );
  return (
    <section className="flex flex-col gap-1 rounded-[20px] bg-violet-deep p-[18px] text-white">
      <span className="text-[11px] font-extrabold tracking-[.12em] text-[#C9BEF7]">
        {label.toUpperCase()} · {shortDate(exam.date)}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-display text-[40px] leading-none font-bold text-[#FFB27F]">{exam.days}</span>
        <span className="text-[15px] font-bold">{exam.days === 0 ? "exam day" : exam.days === 1 ? "day to go" : "days to go"}</span>
      </span>
      <Link href={href} className="mt-1.5 text-[13px] font-bold text-white underline decoration-white/40">
        Take the {label.toLowerCase()} simulation →
      </Link>
    </section>
  );
}

/** "This week": readiness for the sections in this plan week, plus the starting check. */
function ThisWeek({ course }: { course: Course }) {
  const { state, answers } = useStudent();
  const { modules, questions, scored } = useCourse(course.id);
  const plan = planFor(state, course.id);
  const weeks = plan ? moduleWeeks(plan, course.id) : null;
  const week = plan ? weekToday(plan) : null;
  const sections = modules.filter((m) => m.kind === "section");
  const thisWeek = weeks && week ? sections.filter((m) => weeks[m.id] === week || weeks[m.id] === week + 1).slice(0, 2) : sections.slice(0, 2);
  const rows = (thisWeek.length ? thisWeek : sections.slice(0, 2)).map((m) => {
    const r = readiness(questions.filter((q) => q.moduleId === m.id), scored);
    return { title: m.title, label: readinessLabel[r.level], tone: readinessTone[r.level], pct: r.percent ?? 0 };
  });
  const checkDone = answers.some((a) => a.mode === "check" && questions.some((q) => q.id === a.questionId));
  rows.push({ title: "Starting check", label: checkDone ? "Done" : "Not started", tone: checkDone ? readinessTone.ready : readinessTone["not-started"], pct: checkDone ? 100 : 0 });
  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-hairline bg-white px-[18px] py-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-bold">This week</h2>
        <Link href={`/app/courses/${course.id}`} className="text-[12px] font-bold text-violet-700">
          Course outline
        </Link>
      </div>
      {rows.map((x) => (
        <div key={x.title} className="flex flex-col gap-[5px]">
          <div className="flex items-start justify-between gap-2 text-[12.5px]">
            <span className="font-bold">{x.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${x.tone.chip}`}>{x.label}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#EFEDF5]">
            <div className={`h-full rounded-full ${x.tone.bar}`} style={{ width: `${x.pct}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}

/** Today (design 6a/6b): one session card first, a narrow right rail for the countdown, this week and a coach link. */
export default function Today() {
  const { profile, authorizedCourses } = useStudent();
  const name = firstName(profile);
  const owned = openCourses.filter((c) => authorizedCourses.includes(c.id));
  const courses = owned.filter((c) => modulesInCourse(c.id).length > 0);
  const sprint = authorizedCourses.includes("advanced-pharmacology");
  const main = courses[0];
  return (
    <div className="mx-auto max-w-[1144px]">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-bold text-ink-muted">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
          <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.035em] sm:text-[32px]">{name ? `Hi, ${name}` : "Today"}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/app/coach" className="hidden h-[38px] items-center gap-2 rounded-full border border-[#D9D2F3] bg-white px-3.5 text-[13px] font-bold text-violet-deep hover:bg-mist sm:flex">
            <NavCoach size={18} />
            Ask a coach
          </Link>
          <Avatar />
        </div>
      </div>

      <Link href="/app/learning-compass" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[19px] border border-[#D6CAF5] bg-[#F3EFFD] px-5 py-4 transition-colors hover:bg-[#ECE5FB]">
        <span className="flex flex-col gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-violet-700">New · Guided study pilot</span>
          <span className="font-display text-[19px] font-bold text-ink">Tell Almanac what you need to do today.</span>
          <span className="text-[12px] leading-5 text-ink-body">One next step, with an explanation and a way to choose another path. No new purchase required.</span>
        </span>
        <span className="inline-flex min-h-10 items-center rounded-full bg-violet px-4 text-[12px] font-bold text-white">Start guided study →</span>
      </Link>

      {!main && !sprint ? (
        <section className="rounded-[20px] border border-hairline bg-white p-6">
          <h2 className="font-display text-[22px] font-bold">Your courses appear here</h2>
          <p className="mt-2 text-[14px] text-ink-body">Once an enrollment is approved, today&apos;s session shows what to read, answer and review.</p>
          <Link href="/app/courses" className="mt-4 inline-flex h-[42px] items-center rounded-full bg-violet px-5 text-[14px] font-bold text-white">
            Your courses →
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5">
          <div className="flex min-w-0 flex-col gap-4">
            {courses.map((c) => (
              <div key={c.id} className="flex flex-col gap-4">
                {courses.length > 1 && <h2 className="font-display text-[18px] font-bold">{c.title}</h2>}
                <TodaySession course={c} />
                <ContinueCard course={c} />
              </div>
            ))}
            {sprint && (
              <Link href="/app/midterm/nur635" className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-[20px] border border-hairline bg-white p-3 hover:shadow-[0_12px_28px_rgba(42,27,120,.08)] sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:gap-4">
                <span className="h-[72px] rounded-[12px] sm:h-[104px]" style={{ background: "#E6E0F8 url(/almanac-art/cover-pharmacology.png) 70% 50%/cover no-repeat" }} />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">CONTINUE · MIDTERM SPRINT</span>
                  <span className="font-display text-[17px] leading-snug font-bold tracking-[-.02em] sm:text-[20px]">NUR-635 Advanced Pharmacology</span>
                  <span className="text-[12.5px] text-ink-muted">Eight topics · lessons, practice, flashcards and simulations</span>
                </span>
                <span className="hidden pr-2 text-[18px] font-bold text-violet-700 sm:block" aria-hidden="true">
                  →
                </span>
              </Link>
            )}
            {main && <SmallTiles course={main} />}
            {main && (
              <div className="lg:hidden">
                <ExamCountdown course={main} compact />
              </div>
            )}
          </div>
          {main && (
            <aside className="flex flex-col gap-3.5">
              <div className="hidden lg:block">
                <ExamCountdown course={main} />
              </div>
              <ThisWeek course={main} />
              <Link href="/app/coach" className="hidden items-center gap-3 rounded-[20px] bg-mint px-[18px] py-4 hover:bg-[#D2F0E1] lg:flex">
                <NavCoach size={28} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14.5px] font-bold text-[#14532D]">Stuck? Ask a coach</span>
                  <span className="text-[12.5px] text-[#14532D]">Send a question about any page or answer.</span>
                </span>
              </Link>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
