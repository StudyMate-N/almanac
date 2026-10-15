"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { courseById, groupsInModule, openCourses } from "@/content/course";
import { moduleWeeks, orderedSections, planFor, toIsoDate, weekOfDate, weekToday, type Plan } from "@/lib/plan";
import { useStudent } from "@/lib/store";

export default function SetupPage() {
  return (
    <Suspense>
      <Setup />
    </Suspense>
  );
}

const STEPS = ["Dates", "Section order", "Review"] as const;
const longDate = (iso: string) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Not set");

/**
 * Plan setup (design 10a/10b): a short focus-mode wizard with a live plan preview.
 * It saves the same plan as before (weeks, current week, midterm, final, section order).
 */
function Setup() {
  const { state, update, authorizedCourses } = useStudent();
  const router = useRouter();
  const course = courseById(useSearchParams().get("course") ?? "") ?? openCourses[0];
  const p = planFor(state, course.id);
  const [step, setStep] = useState(0);
  const [courseWeeks, setCourseWeeks] = useState(p?.courseWeeks ?? 8);
  const [currentWeek, setCurrentWeek] = useState(p ? weekToday(p) : 1);
  const [midterm, setMidterm] = useState(p?.midterm ?? "");
  const [final, setFinal] = useState(p?.final ?? "");
  const [order, setOrder] = useState(() => orderedSections(p, course.id).map((m) => m.id));
  const sections = orderedSections({ order }, course.id);
  const weeks = moduleWeeks({ courseWeeks, order }, course.id);
  const draft: Plan = { courseWeeks, currentWeek: Math.min(currentWeek, courseWeeks), setOn: toIsoDate(new Date()), midterm: midterm || undefined, final: final || undefined, order };
  const midWeek = weekOfDate(draft, draft.midterm);
  const finalWeek = weekOfDate(draft, draft.final);
  const move = (i: number, by: -1 | 1) => {
    const next = order.slice();
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setOrder(next);
  };
  const save = () => {
    update("plans", { ...state.plans, [course.id]: draft });
    router.push("/app");
  };
  const field = "h-12 w-full rounded-[12px] border border-[#D9D2F3] bg-white px-4 text-[15px] outline-none focus:border-violet focus:ring-2 focus:ring-violet/15";
  const label = "flex flex-col gap-1.5 text-[13.5px] font-bold";
  const pages = (id: string) => groupsInModule(id).flatMap((g) => g.pages).length;
  const most = Math.max(1, ...sections.map((m) => pages(m.id)));

  if (!authorizedCourses.includes(course.id))
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <section className="rounded-[16px] border border-hairline bg-white p-6">
          <p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700 uppercase">Approved learning</p>
          <h1 className="mt-2 font-display text-[24px] font-bold">Choose an enrolled course first.</h1>
          <p className="mt-2 text-sm text-ink-body">Study planning is available for courses included in your approved enrollment.</p>
          <Link href="/app/courses" className="mt-4 inline-block text-sm font-bold text-violet-700">See your courses →</Link>
        </section>
      </main>
    );

  const preview = (compact: boolean) => (
    <div className={`flex flex-col rounded-[20px] border border-hairline bg-white ${compact ? "gap-1.5 p-4" : "h-full gap-0 p-[22px] shadow-[0_18px_40px_rgba(42,27,120,.06)]"}`}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">{compact ? "PLAN PREVIEW" : "YOUR PLAN PREVIEW"}</span>
        <span className="text-[13px] font-bold">{courseWeeks} weeks{draft.final ? ` · final ${longDate(draft.final).replace(/ \d{4}$/, "")}` : ""}</span>
      </div>
      {(compact ? sections.slice(0, 3) : sections).map((m) => {
        const wk = weeks[m.id];
        const now = wk === draft.currentWeek;
        return (
          <div key={m.id} className={`grid grid-cols-[52px_minmax(0,1fr)] items-center gap-3 ${compact ? "" : "border-b border-[#EEEBF7] py-3"}`}>
            <span className={`text-[12.5px] font-extrabold ${now ? "text-violet" : "text-ink-muted"}`}>WK {wk}</span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="truncate text-[13.5px] font-semibold">S{m.number} {m.title}</span>
              {!compact && <span className="h-[3px] rounded-full bg-[#EFEDF5]"><span className="block h-full rounded-full bg-violet" style={{ width: `${Math.round((pages(m.id) / most) * 100)}%` }} /></span>}
            </span>
          </div>
        );
      })}
      {!compact && (
        <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-3 border-b border-[#EEEBF7] py-3">
          <span className="text-[12.5px] font-extrabold text-ink-muted">WK {finalWeek ?? courseWeeks}</span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[13.5px] font-semibold">Final review and exam simulation</span>
            <span className="h-[3px] rounded-full bg-[#F2711C]" />
          </span>
        </div>
      )}
      {!compact && midWeek && <p className="mt-3 text-[12.5px] text-ink-body">Midterm in week {midWeek} ({longDate(midterm)}).</p>}
      {!compact && <p className="mt-auto pt-5 text-[12px] text-ink-muted">You can change your dates and section order any time from your course page.</p>}
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EEEBF7] bg-white px-4 sm:h-[60px] sm:gap-3.5 sm:px-6" style={{ viewTransitionName: "focus-bar" }}>
        <Link href={`/app/courses/${course.id}`} aria-label="Close plan setup" className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline text-[15px] hover:bg-mist sm:h-10 sm:w-10">
          ✕
        </Link>
        <div className="hidden min-w-0 flex-1 flex-col sm:flex">
          <span className="truncate text-[11.5px] font-bold text-violet-700">{course.title}</span>
          <span className="truncate font-display text-[15px] font-bold">Set up your plan</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:hidden">
          <span className="text-[13px] font-bold">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </span>
          <span className="h-[5px] rounded-full bg-[#EFEDF5]">
            <span className="block h-full rounded-full bg-violet transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </span>
        </div>
        <ol className="hidden items-center gap-1.5 sm:flex" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={`flex h-9 items-center gap-2 rounded-full pr-3.5 pl-1.5 text-[13.5px] ${i === step ? "bg-lilac font-bold text-violet-deep" : "font-medium text-ink-body hover:bg-mist"}`}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11.5px] font-bold ${i === step ? "bg-violet text-white" : i < step ? "bg-correct text-white" : "border-[1.5px] border-[#D9D2F3]"}`}>{i < step ? "✓" : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </header>

      <form
        className="mx-auto grid w-full max-w-[1312px] flex-1 gap-8 px-4 pt-6 pb-28 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,620px)_minmax(0,460px)] lg:justify-between lg:pb-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) setStep(step + 1);
          else save();
        }}
      >
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700 uppercase">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
            <h1 className="font-display text-[26px] leading-[1.08] font-bold tracking-[-.035em] sm:text-[36px]">
              {step === 0 ? "When is your final exam?" : step === 1 ? "Match your school's order" : "Check your plan"}
            </h1>
            <p className="text-[14px] text-ink-body sm:text-[15px]">
              {step === 0
                ? "Tell us your course length and where you are now. Your sections are spread across the weeks."
                : step === 1
                  ? "Move sections to match the order your school teaches them. Sections with more topics get more time."
                  : "Save it and Today will show what to study each day. You can change it any time."}
            </p>
          </div>

          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                How many weeks is your course?
                <select className={field} value={courseWeeks} onChange={(e) => setCourseWeeks(Number(e.target.value))}>
                  {[6, 8, 10, 11, 12, 15, 16].map((w) => (
                    <option key={w} value={w}>
                      {w} weeks
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                Which week are you in now?
                <input className={field} type="number" min={1} max={courseWeeks} value={currentWeek} onChange={(e) => setCurrentWeek(Number(e.target.value))} />
              </label>
              <label className={label}>
                <span>
                  Midterm date <span className="font-normal text-ink-muted">(leave blank if none)</span>
                </span>
                <input className={field} type="date" value={midterm} onChange={(e) => setMidterm(e.target.value)} />
              </label>
              <label className={label}>
                Final exam
                <input className={field} type="date" value={final} onChange={(e) => setFinal(e.target.value)} />
              </label>
              <p className="flex items-center gap-2.5 rounded-[12px] bg-[#FFF4EC] px-3.5 py-3 text-[13.5px] text-[#7A2E06] sm:col-span-2">
                <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full bg-[#F2711C]" />
                {finalWeek ? `Your final falls in week ${finalWeek} of ${courseWeeks}. The last stretch is kept for review.` : `${courseWeeks} weeks, starting from week ${Math.min(currentWeek, courseWeeks)}. Add your final date to anchor the review week.`}
              </p>
            </div>
          )}

          {step === 1 && (
            <ol className="flex flex-col gap-2">
              {sections.map((m, i) => (
                <li key={m.id} className="flex min-h-14 items-center gap-3 rounded-[14px] border border-hairline bg-white py-2 pr-2 pl-4">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] border-[1.5px] border-[#D9D2F3] font-display text-[14px] font-bold">{m.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold">{m.title}</span>
                    <span className="block text-[12.5px] text-ink-muted">Week {weeks[m.id]}</span>
                  </span>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${m.title} earlier`} className="grid h-11 w-11 place-items-center rounded-full border border-hairline font-bold text-violet-700 hover:bg-mist disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} aria-label={`Move ${m.title} later`} className="grid h-11 w-11 place-items-center rounded-full border border-hairline font-bold text-violet-700 hover:bg-mist disabled:opacity-30">
                    ↓
                  </button>
                </li>
              ))}
            </ol>
          )}

          {step === 2 && (
            <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 rounded-[16px] border border-hairline bg-white p-5 text-[14px]">
              <dt className="text-ink-muted">Course length</dt>
              <dd className="font-bold">{courseWeeks} weeks</dd>
              <dt className="text-ink-muted">You are in</dt>
              <dd className="font-bold">Week {Math.min(currentWeek, courseWeeks)}</dd>
              <dt className="text-ink-muted">Midterm</dt>
              <dd className="font-bold">{longDate(midterm)}</dd>
              <dt className="text-ink-muted">Final exam</dt>
              <dd className="font-bold">{longDate(final)}</dd>
              <dt className="text-ink-muted">First section</dt>
              <dd className="text-right font-bold">S{sections[0]?.number} {sections[0]?.title}</dd>
            </dl>
          )}

          <div className="lg:hidden">{preview(true)}</div>

          <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-[#EEEBF7] bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:static lg:mt-auto lg:justify-between lg:border-0 lg:bg-transparent lg:p-0">
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-12 flex-1 rounded-[12px] border-[1.5px] border-[#D9D2F3] bg-white px-5 font-bold text-violet-deep hover:bg-mist disabled:opacity-40 lg:flex-none">
              ← Back
            </button>
            <button type="submit" className="h-12 flex-[2] rounded-[12px] bg-violet px-6 font-bold text-white hover:bg-[#4A2DE6] lg:flex-none">
              {step < STEPS.length - 1 ? "Continue →" : "Save my plan"}
            </button>
          </div>
        </div>
        <aside className="hidden lg:block">{preview(false)}</aside>
      </form>
    </div>
  );
}
