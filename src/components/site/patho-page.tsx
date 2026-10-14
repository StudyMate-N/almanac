import Link from "next/link";
import { MastCellArt } from "@/components/brand";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SignupForm } from "@/components/signup-form";
import { comingCourses, modulesInCourse } from "@/content/course";

const COURSE_ID = "advanced-pathophysiology";
import { EXAMS, REVIEWER } from "@/lib/config";

const steps = [
  ["Add your dates", "Enter your midterm and final. Almanac lays out every week between now and then."],
  ["Learn the mechanism", "Short lesson pages built around one idea each, with patient cases, tables and video clips."],
  ["Practice until it sticks", "Questions with a rationale for every option, and flashcards that come back on the day you'd forget them."],
  ["Rehearse the exam", "Timed midterm and final simulations, then a list of your weak spots."],
];

const inside = [
  ["A course player, not a pile of PDFs", "Seven competencies, each in the same pattern: lesson pages, learning checks, a quiz and a section test.", "bg-lilac"],
  ["Questions that teach", "Every option has a rationale, so even a wrong answer teaches you something.", "bg-peach"],
  ["Flashcards that schedule themselves", "Cards return right before you'd forget them. Five minutes a day keeps earlier sections fresh.", "bg-mint"],
  ["Midterm and final simulations", `${EXAMS.midterm.questions} questions for the midterm and ${EXAMS.final.questions} for the final, timed and mixed-topic, with answers at the end.`, "bg-lilac"],
  ["Study guides", "One printable page per section: the key points from every lesson and a self-test from its flashcards.", "bg-peach"],
];

const faq = [
  [
    "Is this for my school's course?",
    "It is built around the seven competencies a pathophysiology course assesses, from homeostasis to each body system, and points you to the matching pages in McCance & Huether. Your plan follows your own dates.",
  ],
  ["Does it replace my textbook?", "No. It follows it, and shows you which parts matter most each week."],
  ["I'm already behind. Can I still start?", "Yes. Enter your exam dates and the plan reorders around what's left."],
  ["Can I use it for graded assignments?", "No. Almanac is for learning. Its questions are original practice, not real exam items, and tutor help won't complete graded work."],
  ["Does it work on my phone?", "Yes, in your phone's browser."],
  ["Who checks the content?", `Reviewers check every item, and ${REVIEWER.name}, ${REVIEWER.credentials}, signs it off before it goes live.`],
];

const btn = "inline-flex min-h-[52px] items-center gap-2 rounded-full px-6 font-bold";

export function PathoPage() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <SiteHeader />

      <main>
        <section aria-labelledby="hero-h" className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 px-4 pt-8 pb-16 sm:px-6">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
            <p className="text-sm font-bold text-violet-700">
              <Link href="/" className="hover:underline">
                Almanac courses
              </Link>{" "}
              · Advanced Pathophysiology, for graduate nursing students
            </p>
            <h1 id="hero-h" className="font-display text-[40px] leading-[1.05] font-semibold sm:text-[56px]">
              Patho has a reputation. Walk in with a plan.
            </h1>
            <p className="max-w-xl text-lg text-ink-body">
              Almanac breaks your course into weekly steps: a short lesson, questions that explain every option, and flashcards that come back right before you&apos;d forget. Then a practice midterm and final, so exam
              day feels familiar.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#access" className={`${btn} bg-violet text-white hover:bg-violet-600`}>
                Request pilot access <ArrowRightIcon size={16} />
              </a>
              <a href="#how" className="font-bold text-violet-700">
                See how it works
              </a>
            </div>
          </div>
          <div className="flex flex-[1_1_320px] justify-center">
            <div className="relative w-full max-w-sm rounded-tile bg-lilac p-6">
              <MastCellArt width={96} className="absolute -top-8 right-4" />
              <p className="text-xs font-bold text-violet-700">Today · week 3 of 8</p>
              <p className="mt-1 font-display text-xl font-semibold">Heart failure: two sides, two sets of signs</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {["Read: Lesson 6.3, 12 min", "Answer: 5 quiz questions", "Review: 12 cards due"].map((t, i) => (
                  <li key={t} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5">
                    <span className={`grid h-6 w-6 place-items-center rounded-full ${i === 0 ? "bg-correct text-white" : "bg-mist"}`}>{i === 0 && <CheckIcon size={12} />}</span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl bg-sky px-3 py-2.5 text-sm font-bold text-sky-ink">Midterm in 12 days</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="prob-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="rounded-tile bg-peach p-6 sm:p-10">
            <h2 id="prob-h" className="font-display text-[30px] font-semibold">
              Patho moves fast.
            </h2>
            <ul className="mt-4 grid gap-3 text-[#5C3218] sm:grid-cols-3">
              <li>A new body system every week, and each one builds on the last.</li>
              <li>A dense textbook chapter, and still no clear idea of what will be tested.</li>
              <li>Exams that ask you to apply a mechanism, not repeat a definition.</li>
            </ul>
            <p className="mt-4 font-bold">Fall behind once and the rest of the term is catch-up.</p>
          </div>
        </section>

        <section id="how" aria-labelledby="how-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="how-h" className="mb-6 font-display text-[30px] font-semibold">
            One plan, from week one to the final.
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

        <section aria-labelledby="in-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="in-h" className="mb-6 font-display text-[30px] font-semibold">
            What&apos;s inside
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inside.map(([t, d, bg]) => (
              <article key={t} className={`rounded-tile p-6 ${bg}`}>
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-ink-body">{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Tutor help, readiness and standards" className="mx-auto grid max-w-[1200px] gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-3">
          <article className="rounded-tile bg-white p-6">
            <h2 className="font-display text-[22px] font-semibold">Stuck at 11 p.m.? Ask.</h2>
            <p className="mt-2 text-ink-body">
              Tutor help answers from Almanac&apos;s own lessons and points you to the clip that explains it. If it can&apos;t help, tap &ldquo;Ask a coach&rdquo; and a person replies within 3 hours, day or night. It
              helps you understand. It won&apos;t do graded work for you.
            </p>
          </article>
          <article className="rounded-tile bg-white p-6">
            <h2 className="font-display text-[22px] font-semibold">Know where you stand.</h2>
            <p className="mt-2 text-ink-body">Readiness by section, your weakest topics and the questions you missed, all on one screen. When a section turns green, move on.</p>
          </article>
          <article className="rounded-tile bg-mint p-6 text-mint-ink">
            <h2 className="font-display text-[22px] font-semibold">Checked before you see it.</h2>
            <p className="mt-2">
              Every lesson, question and card is written from the course textbook, checked by reviewers for accuracy and fairness, and signed off by {REVIEWER.name}, {REVIEWER.credentials}, before it goes live.
            </p>
          </article>
        </section>

        <section aria-labelledby="fit-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="rounded-tile bg-white p-6 sm:p-10">
            <h2 id="fit-h" className="font-display text-[30px] font-semibold">
              Works alongside your course.
            </h2>
            <p className="mt-2 max-w-3xl text-ink-body">
              Almanac is organized around the seven competencies a pathophysiology course assesses, and every page points to the matching reading in McCance &amp; Huether. Keep your school&apos;s readings. Almanac shows
              you what to focus on and checks that it stuck.
            </p>
            <ol className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              {modulesInCourse(COURSE_ID)
                .filter((m) => m.kind === "section")
                .map((m) => (
                  <li key={m.id} className="rounded-full bg-mist px-3 py-1.5">
                    {m.number}. {m.title}
                  </li>
                ))}
            </ol>
            <p className="mt-4 text-sm text-ink-muted">Almanac is independent and is not affiliated with any school or publisher.</p>
          </div>
        </section>

        <section id="access" aria-labelledby="cta-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="flex flex-wrap gap-8 rounded-tile bg-violet p-6 text-white sm:p-10">
            <div className="flex-[1_1_320px]">
              <h2 id="cta-h" className="font-display text-[32px] font-semibold">
                Join the pilot.
              </h2>
              <p className="mt-2 text-violet-on">We&apos;re opening Advanced Pathophysiology to 50 students first. Pilot students get full access free in return for honest feedback.</p>
              <Link href="/app" className="mt-4 inline-block font-bold text-white underline">
                Already have a code? Sign in
              </Link>
            </div>
            <div className="flex-[1_1_320px] rounded-tile bg-white p-5 text-ink">
              <SignupForm courseId={COURSE_ID} />
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="faq-h" className="mb-5 font-display text-[30px] font-semibold">
            Questions
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {faq.map(([q, a]) => (
              <details key={q} className="rounded-tile bg-white p-5">
                <summary className="cursor-pointer font-bold">{q}</summary>
                <p className="mt-2 text-ink-body">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="next-h" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <h2 id="next-h" className="mb-4 font-display text-[22px] font-semibold">
            More courses on Almanac
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
            {comingCourses.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="rounded-tile bg-white p-5 hover:bg-mist">
                <p className="text-xs font-bold text-ink-muted">{c.category} · coming soon</p>
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 pb-20 text-center sm:px-6">
          <h2 className="font-display text-[30px] font-semibold">Start week one with a plan.</h2>
          <a href="#access" className={`${btn} mt-4 bg-violet text-white hover:bg-violet-600`}>
            Request pilot access <ArrowRightIcon size={16} />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
