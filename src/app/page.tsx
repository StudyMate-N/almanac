import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { SiteFooter, SiteHeader, toneBg } from "@/components/site/chrome";
import { courses } from "@/content/course";
import { REVIEWER } from "@/lib/config";

const steps = [
  ["Pick your course", "Choose the course you're taking now. Almanac follows the standard textbook order for it."],
  ["Add your dates", "Enter your exam dates. Almanac lays out every week between now and the final."],
  ["Learn, then practice", "A short lesson per topic, questions that explain every option, and flashcards that come back before you forget."],
  ["Rehearse the exam", "Timed practice exams at the real length, then a list of your weak spots."],
];

const included = [
  ["Short video lessons", "One topic per lesson, 10 minutes or less, with a one-page summary."],
  ["Questions that teach", "Every option has a rationale, so a wrong answer still teaches you something."],
  ["Flashcards that schedule themselves", "Five minutes a day keeps earlier modules fresh."],
  ["Practice exams", "Timed, mixed-topic, at the length of the real thing, with answers at the end."],
  ["Study guides", "One printable page per module: the core ideas and what students mix up."],
  ["Tutor and coach", "Ask the tutor any time. If it can't help, a person replies within 3 hours."],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <SiteHeader />
      <main>
        <section aria-labelledby="hero-h" className="mx-auto max-w-[1200px] px-4 pt-8 pb-14 sm:px-6">
          <p className="text-sm font-bold text-violet-700">Almanac · course companions</p>
          <h1 id="hero-h" className="mt-3 max-w-4xl font-display text-[40px] leading-[1.05] font-semibold sm:text-[60px]">
            Hard courses, broken into weekly steps.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-body">
            Almanac runs alongside the course you&apos;re already taking: short lessons, questions that explain every answer, flashcards that return before you forget, and practice exams built around your dates.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#courses" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
              Browse courses <ArrowRightIcon size={16} />
            </a>
            <a href="#how" className="font-bold text-violet-700">
              See how it works
            </a>
          </div>
        </section>

        <section id="courses" aria-labelledby="courses-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="courses-h" className="mb-5 font-display text-[30px] font-semibold">
            Courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className={`flex flex-col gap-2 rounded-tile p-6 hover:brightness-[0.97] ${c.status === "open" ? toneBg[c.tone] : "bg-white"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-ink-muted">{c.category}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.status === "open" ? "bg-violet text-white" : "bg-mist text-ink-muted"}`}>{c.status === "open" ? "Pilot open" : "Coming soon"}</span>
                </div>
                <h3 className="font-display text-[24px] leading-tight font-semibold">{c.title}</h3>
                <p className="text-ink-body">{c.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-violet-700">
                  {c.status === "open" ? "See the course" : "Get told when it opens"} <ArrowRightIcon size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="how" aria-labelledby="how-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="how-h" className="mb-6 font-display text-[30px] font-semibold">
            The same plan, whatever you&apos;re studying.
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="rounded-tile bg-white p-6">
                <p className="font-display text-[32px] font-semibold text-violet">{i + 1}</p>
                <p className="font-display text-lg font-semibold">{t}</p>
                <p className="mt-1 text-sm text-ink-body">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="inc-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="inc-h" className="mb-6 font-display text-[30px] font-semibold">
            In every course
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map(([t, d], i) => (
              <article key={t} className={`rounded-tile p-6 ${["bg-lilac", "bg-peach", "bg-sky", "bg-mint"][i % 4]}`}>
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-ink-body">{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="std-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="rounded-tile bg-white p-6 sm:p-10">
            <h2 id="std-h" className="font-display text-[30px] font-semibold">
              Checked before you see it.
            </h2>
            <p className="mt-2 max-w-3xl text-ink-body">
              Every lesson, question and card is reviewed for accuracy and fairness, then signed off by a subject expert before it goes live. Nursing courses are signed off by {REVIEWER.name}, {REVIEWER.credentials}. If anything changes, it goes back for sign-off.
            </p>
            <p className="mt-4 text-sm text-ink-muted">Almanac is independent and is not affiliated with any school or publisher. Its questions are original practice, not real exam items.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 pb-20 text-center sm:px-6">
          <h2 className="font-display text-[30px] font-semibold">Start your next course with a plan.</h2>
          <a href="#courses" className="mt-4 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
            Browse courses <ArrowRightIcon size={16} />
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
