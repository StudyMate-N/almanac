import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";

const primary = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-violet px-6 py-3 text-center font-bold text-white transition-colors hover:bg-violet-600";
const secondary = "inline-flex min-h-[48px] items-center font-semibold text-violet-700 hover:underline";
const steps = [
  ["01", "Choose what you're learning.", "Browse an existing course or resource, or send us a request for something you can't find."],
  ["02", "Set your goals and your pace.", "Bring in your schedule, learning priorities, and important dates to shape a study plan that works for you."],
  ["03", "Everything in one place.", "Work through lessons, practice what you've learned, return to topics that need review, and keep track of how far you've come."],
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-20" aria-labelledby="hero-h">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Learning, organized around you</p>
            <h1 id="hero-h" className="mt-5 max-w-2xl font-display text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[54px]">Everything you need to make sense of your course &amp; exams.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-body">
              Almanac brings your study materials, learning plan, and progress together in one organized experience.
              Start with a ready-made course or resource, shape it around your goals, or request something built for what you want to learn.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/courses" className={primary}>Browse courses &amp; resources <span aria-hidden="true">→</span></Link>
              <Link href="/request" className={secondary}>Request a course or resource ↗</Link>
            </div>
            <p className="mt-5 text-sm text-ink-muted">For coursework, exam preparation, independent study, and more.</p>
          </div>
          <div className="rounded-[32px] bg-lilac p-4 shadow-[0_20px_50px_-32px_rgba(65,40,140,0.35)] sm:p-6" aria-label="Illustrative view of the Almanac learning space">
            <div className="rounded-card bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <p className="font-display text-lg font-semibold">Your learning space</p>
                <span className="text-xs font-medium text-violet-700">ALMANAC</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-ink-muted">Your course</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">Advanced Pathophysiology</h2>
              <div className="mt-5 rounded-card bg-mist p-5">
                <p className="text-xs font-bold text-violet-700">CONTINUE LEARNING</p>
                <p className="mt-2 font-display text-lg font-semibold">Understand the mechanisms</p>
                <p className="mt-1 text-sm text-ink-body">Your next lesson and learning checks, ready when you are.</p>
                <p className="mt-4 font-semibold text-violet-700">Your next lesson, in view</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-hairline p-4"><p aria-hidden="true" className="text-2xl text-violet">◫</p><p className="mt-2 font-semibold">Practice</p><p className="mt-1 text-xs text-ink-muted">Check your understanding</p></div>
                <div className="rounded-2xl border border-hairline p-4"><p aria-hidden="true" className="text-2xl text-violet">▤</p><p className="mt-2 font-semibold">Flashcards</p><p className="mt-1 text-xs text-ink-muted">Review what matters</p></div>
              </div>
              <div className="mt-4 rounded-2xl border border-hairline p-4">
                <p className="font-semibold">Your study plan</p>
                <p className="mt-1 text-xs text-ink-muted">Keep your next session and progress in view.</p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-muted">Illustrative learning-space composition</p>
          </div>
        </section>

        <section id="courses" className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6" aria-labelledby="discover-h">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Courses &amp; Resources</p>
          <h2 id="discover-h" className="mt-3 max-w-2xl font-display text-[36px] font-semibold leading-tight sm:text-[44px]">Start with what you're learning.</h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-body">Explore what's available, or tell us what you'd like to learn. Whether it's a complete course, exam preparation, or a particular study resource, there's a place to start.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="flex flex-col rounded-tile bg-lilac p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-violet-700"><span>GRADUATE NURSING</span><span className="rounded-full bg-white px-3 py-1.5">PILOT OPEN</span></div>
              <div className="relative mt-5 flex min-h-[160px] items-center justify-center overflow-hidden rounded-card bg-white/60">
                <div className="absolute left-[15%] top-[15%] h-24 w-24 rounded-full border-[14px] border-violet-200 bg-violet-300/30 sm:h-32 sm:w-32" />
                <div className="absolute right-[18%] top-[25%] h-20 w-20 rounded-full border-[12px] border-violet-300 bg-white sm:h-28 sm:w-28" />
                <p className="relative rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-deep shadow-sm">Mechanisms → Understanding → Practice</p>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">Advanced Pathophysiology</h3>
              <p className="mt-3 flex-1 text-ink-body">Understand disease mechanisms through structured lessons, practice questions, flashcards, and exam preparation.</p>
              <Link className={`${secondary} mt-4`} href="/courses/advanced-pathophysiology">View course ↗</Link>
            </article>
            <article className="flex flex-col rounded-tile border border-hairline bg-white p-6 sm:p-8">
              <p className="text-xs font-bold text-ink-muted">CUSTOM LEARNING</p>
              <div className="mt-5 flex min-h-[160px] items-center justify-center rounded-card bg-mist">
                <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-violet">◫</div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-violet">▤</div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-violet">✦</div>
                </div>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">Don't see what you need?</h3>
              <p className="mt-3 flex-1 text-ink-body">Tell us what you're studying and what you'd like us to create. Choose your materials and timeline to get started.</p>
              <Link className={`${secondary} mt-4`} href="/request">Request a course or resource ↗</Link>
            </article>
          </div>
          <p className="mt-5 text-sm text-ink-muted">
            Also available on request: Advanced Pharmacology · Practical AI Skills · Editing &amp; Proofreading
          </p>
          <Link href="/courses" className={`${secondary} mt-3`}>Browse all courses &amp; resources →</Link>
        </section>

        <section id="how" className="bg-white/65 py-20" aria-labelledby="how-h">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">How Almanac works</p>
            <h2 id="how-h" className="mt-3 max-w-2xl font-display text-[36px] font-semibold leading-tight sm:text-[44px]">Start where you are. Know where to go next.</h2>
            <p className="mt-4 max-w-2xl text-lg text-ink-body">Whether you're following a course or preparing for something specific, Almanac helps turn your materials and goals into a learning experience you can follow.</p>
            <ol className="mt-9 max-w-3xl space-y-5">
              {steps.map(([n,t,d]) => <li key={n} className="flex items-start gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lilac font-display text-xl font-semibold text-violet">{n}</span>
                <div className="pt-1"><h3 className="font-display text-xl font-semibold">{t}</h3><p className="mt-1 text-ink-body">{d}</p></div>
              </li>)}
            </ol>
            <Link href="/how-it-works" className={`${secondary} mt-6`}>See how Almanac works →</Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-2" aria-labelledby="workspace-h">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Your learning space</p>
            <h2 id="workspace-h" className="mt-3 font-display text-[36px] font-semibold leading-tight sm:text-[44px]">Pick up where you left off.</h2>
            <p className="mt-4 text-lg text-ink-body">Your lessons, practice, flashcards, and study plan stay together. Find what you need, revisit what you've learned, and see what's next without starting over each time.</p>
          </div>
          <div className="rounded-tile bg-lilac p-5 sm:p-7">
            <div className="rounded-card bg-white p-5">
              <div className="flex items-center justify-between"><span className="font-semibold">Continue learning</span><span className="text-sm text-violet-700">Your course</span></div>
              <p className="mt-4 rounded-xl bg-mist p-4 font-semibold">Lessons &amp; learning checks <span className="float-right text-violet">→</span></p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <p className="rounded-xl border border-hairline p-4">Practice questions</p>
                <p className="rounded-xl border border-hairline p-4">Smart flashcards</p>
                <p className="rounded-xl border border-hairline p-4">Study plan</p>
                <p className="rounded-xl border border-hairline p-4">Progress tracking</p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-muted">Conceptual representation of the existing learning workspace</p>
          </div>
        </section>

        <section className="bg-white/65 py-20" aria-labelledby="request-h">
          <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Custom Learning Requests</p>
              <h2 id="request-h" className="mt-3 font-display text-[36px] font-semibold leading-tight sm:text-[44px]">Your needs don't have to fit our catalog.</h2>
              <p className="mt-4 text-lg text-ink-body">A course we haven't covered. An exam you're preparing for. A complete study module for a particular part of your course. Tell us what you're working toward, and we'll see what we can create for you.</p>
              <Link href="/request" className={`${primary} mt-7`}>Request a course or resource →</Link>
              <p className="mt-4 text-sm text-ink-muted">We'll review your request and explain what's possible and what happens next.</p>
            </div>
            <div className="rounded-tile border border-hairline bg-white p-6 sm:p-8">
              <p className="font-display text-xl font-semibold">Your request, your goals</p>
              <p className="mt-1 text-sm text-ink-muted">A few details help us get started.</p>
              <ol className="mt-5 space-y-5">
                {[
                  ["What are you learning?", "A subject, course, exam, or module"],
                  ["What would help?", "A full course, study guide, practice, or something else"],
                  ["When do you need it?", "Select a delivery timeline and price"],
                ].map(([h,d],i)=>(
                  <li key={h} className="flex gap-4 border-t border-hairline pt-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lilac font-semibold text-violet">{i+1}</span>
                    <div><p className="font-semibold">{h}</p><p className="mt-1 text-sm text-ink-muted">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6" aria-labelledby="final-h">
          <div className="rounded-tile bg-lilac px-5 py-14 sm:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Your next step</p>
            <h2 id="final-h" className="mx-auto mt-4 max-w-2xl font-display text-[36px] font-semibold leading-tight sm:text-[44px]">There's more than one way to begin.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-body">Find something ready to use, or tell us what you'd like to learn. We'll help you take it from there.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <Link href="/courses" className={primary}>Browse courses &amp; resources →</Link>
              <Link href="/request" className={secondary}>Request a course or resource ↗</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
