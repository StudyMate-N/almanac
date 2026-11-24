import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";
import { FormatGrid, FormatIcon } from "@/components/study-formats-view";
import { cards, lessonById, lessons, modules, questions } from "@/content/course";
import { ALMANAC_SUPPORT_EMAIL } from "@/lib/almanac-contact";
import { formatOptions, publicCourseFormats } from "@/lib/format-data";
import { minutesFor } from "@/lib/minutes";
import { alternativeFormats, topicFormats } from "@/lib/study-formats";

const action = "alm-action";
const secondary = "alm-action alm-action-secondary";
const COURSE = "advanced-pathophysiology";
/* The hero's example answer uses a real topic, with counts from the real catalogue. */
const EXAMPLE_TOPIC = "s1-tp1";

/* One study session, as the studio runs it (Learning Studio brief, issue #33). */
const session = [
  ["01", "Explain", "A reviewed explanation of one idea."],
  ["02", "Practise", "Questions that ask you to use it."],
  ["03", "Feedback", "Why each answer is right or wrong."],
  ["04", "Revisit", "Cards bring it back before you forget."],
] as const;

const audiences = [
  ["Working nurses in graduate programmes", "Short sessions after a shift. Almanac picks the next step, so the time goes on studying, not deciding."],
  ["Students with an exam date", "Your plan follows your own course dates and shows which sections need revisiting before the exam."],
  ["Learners who need another way in", "The same reviewed topic as reading, video or questions, so you can switch format without losing your place."],
] as const;

const made = [
  ["Sources", "Your course's outline and an authoritative textbook, with page references."],
  ["Draft", "A first version drafted with AI tools from those sources only."],
  ["Check", "Every clinical fact is checked against the textbook by a reviewer."],
  ["Publish", "Only the exact version the reviewer approved reaches learners."],
] as const;

function NextStepShot() {
  const topic = lessonById(EXAMPLE_TOPIC);
  if (!topic) return null;
  const mod = modules.find((m) => m.id === topic.moduleId);
  const formats = topicFormats(topic, { lessons, questions, cards, modules }, formatOptions);
  const others = alternativeFormats(formats, { href: `/app/learn/${topic.id}`, format: "read" });
  const minutes = minutesFor(topic);
  return (
    <figure className="w-full">
      <div className="rounded-section border border-border bg-canvas p-5 shadow-[0_24px_48px_rgba(27,21,48,.10)] sm:p-6" aria-label="Illustrative example of the learner home">
        <p className="text-[12px] font-semibold text-text-muted">Advanced Pathophysiology · Section {mod?.number} · Week 3 of 11</p>
        <p className="mt-3 text-[11px] font-extrabold tracking-[.12em] text-primary-hover uppercase">Your next step</p>
        <p className="mt-1 font-display text-[23px] leading-[1.15] font-bold tracking-[-.025em] text-text sm:text-[26px]">{topic.title}</p>
        <p className="mt-1.5 text-[13.5px] text-text-body">It&apos;s next in this week&apos;s plan, about {minutes} min. Then 5 questions and the cards due today.</p>
        <span aria-hidden="true" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-bold text-white">
          <FormatIcon icon="page" size={17} /> Start reading →
        </span>
        {others.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <span className="text-[12px] text-text-muted">Or study it another way:</span>
            {others.map((f) => (
              <span key={f.format.id} className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-border bg-studio px-3 text-[12px] font-semibold text-text-body">
                <FormatIcon icon={f.format.icon} size={14} /> {f.chip}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4 border-t border-border pt-3 text-[12.5px] text-text-muted">0 of 3 done today · Midterm in 12 days</p>
      </div>
      <figcaption className="mt-3 text-center text-[11.5px] text-text-muted">Illustrative: the learner home answering that question. Example learner; real course topic.</figcaption>
    </figure>
  );
}

function CourseVisual({ variant }: { variant: "patho" | "request" }) {
  return (
    <div className="alm-course-media relative grid h-[165px] place-items-center">
      <div className={`pointer-events-none absolute inset-0 bg-cover bg-center ${variant === "patho" ? "bg-[url('/almanac-art/cover-pathophysiology.png')]" : "bg-[url('/almanac-art/cover-on-request.png')]"}`} />
    </div>
  );
}

export default function Home() {
  const formats = publicCourseFormats(COURSE);
  const mail = `mailto:${ALMANAC_SUPPORT_EMAIL}`;
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero: plain headline, a learner's own question, and the product answering it. */}
        <section className="alm-gradient-hero">
          <div className="alm-wrap grid items-center gap-10 pt-12 pb-12 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pt-16 lg:pb-16">
            <div>
              <p className="alm-eyebrow">Study support for health-science courses</p>
              <h1 className="mt-4 max-w-[560px] text-[38px] leading-[1.04] sm:text-[48px] lg:text-[56px]">Know what to study next.</h1>
              <blockquote className="mt-5 max-w-[500px] border-l-[3px] border-primary pl-4">
                <p className="font-display text-[19px] leading-[1.35] font-semibold tracking-[-.01em] text-text sm:text-[21px]">&ldquo;My midterm is in 12 days. What should I study tonight?&rdquo;</p>
              </blockquote>
              <p className="mt-4 max-w-[500px] text-[15.5px] leading-[1.65] text-text-body">Almanac answers with one reviewed next step, and a reason. Then a few questions, then the cards that are due.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/courses" className={action}>
                  Browse courses <span aria-hidden="true">→</span>
                </Link>
                <Link href={`/courses/${COURSE}`} className={secondary}>
                  See what&apos;s in a course
                </Link>
              </div>
              <nav aria-label="More about Almanac" className="mt-3 flex flex-wrap items-center gap-x-5 text-[13px] text-text-muted">
                <a href="#how-made" className="inline-flex min-h-[44px] items-center font-semibold text-text-body underline decoration-border-strong underline-offset-4 hover:decoration-primary">How lessons are made</a>
                <Link href="/request" className="inline-flex min-h-[44px] items-center font-semibold text-text-body underline decoration-border-strong underline-offset-4 hover:decoration-primary">Product update</Link>
                <a href={mail} className="inline-flex min-h-[44px] items-center font-semibold text-text-body underline decoration-border-strong underline-offset-4 hover:decoration-primary">Email a person</a>
              </nav>
            </div>
            <NextStepShot />
          </div>
        </section>

        {/* What does it do? One plain paragraph before any feature. */}
        <section className="alm-section" aria-labelledby="what">
          <div className="alm-wrap grid gap-6 md:grid-cols-[.8fr_1.2fr] md:gap-14">
            <h2 id="what" className="alm-section-title">What does it do?</h2>
            <p className="text-[16px] leading-[1.75] text-text-body">
              Almanac turns a course into short, reviewed lessons and tells you which one to study next. Each topic comes with questions that explain every answer, flashcards that come back before you forget, and a timed simulation before the exam. Your plan follows your own course dates, and your progress shows what you have practised, not just what you opened.
            </p>
          </div>
        </section>

        {/* One topic, every way to study: formats with honest status from the real catalogue. */}
        <section className="alm-section border-y border-[#EEEBF7] bg-studio" aria-labelledby="formats">
          <div className="alm-wrap">
            <p className="alm-eyebrow">Ways to study</p>
            <h2 id="formats" className="alm-section-title mt-2">One topic, every way to study.</h2>
            <p className="mt-3 max-w-[640px] text-[15px] text-text-body">Each reviewed topic can be read, watched or practised. Status below is for Advanced Pathophysiology, worked out from what exists today.</p>
            <div className="mt-7">
              <FormatGrid states={formats} link={{ href: `/courses/${COURSE}#formats`, label: "See it in the course" }} />
            </div>
          </div>
        </section>

        {/* Who is it for? */}
        <section className="alm-section" aria-labelledby="who">
          <div className="alm-wrap">
            <p className="alm-eyebrow">Who is it for?</p>
            <h2 id="who" className="alm-section-title mt-2">Built for short, tired sessions.</h2>
            <dl className="mt-7 divide-y divide-border border-y border-border">
              {audiences.map(([who, what]) => (
                <div key={who} className="grid gap-1 py-5 md:grid-cols-[.8fr_1.2fr] md:gap-14">
                  <dt className="text-[16px] font-bold text-text">{who}</dt>
                  <dd className="text-[15px] text-text-body">{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How a study session works, compact. */}
        <section className="alm-section border-y border-[#EEEBF7] bg-studio" aria-labelledby="how-session">
          <div className="alm-wrap">
            <p className="alm-eyebrow">How a study session works</p>
            <h2 id="how-session" className="alm-section-title mt-2">One idea at a time.</h2>
            <ol className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
              {session.map(([n, title, body]) => (
                <li key={n} className="border-t-2 border-border-strong pt-4 pb-2">
                  <span className="font-display text-[14px] font-bold text-violet-700" aria-hidden="true">{n}</span>
                  <h3 className="mt-1 text-[17px] font-bold text-text">{title}</h3>
                  <p className="mt-1 text-[14px] text-text-body">{body}</p>
                </li>
              ))}
            </ol>
            <Link href="/how-it-works" className={`${secondary} mt-6`}>
              Understand each step →
            </Link>
          </div>
        </section>

        {/* How lessons are made: the production pipeline, stated plainly. */}
        <section id="how-made" className="alm-section scroll-mt-6" aria-labelledby="how-made-title">
          <div className="alm-wrap">
            <p className="alm-eyebrow">How lessons are made</p>
            <h2 id="how-made-title" className="alm-section-title mt-2">Nothing reaches you before a reviewer approves it.</h2>
            <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {made.map(([title, body], i) => (
                <li key={title} className="flex flex-col gap-2 rounded-section border border-border bg-canvas p-5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-tint text-[13px] font-extrabold text-primary-deep" aria-hidden="true">{i + 1}</span>
                  <h3 className="text-[17px] font-bold text-text">{title}</h3>
                  <p className="text-[14px] text-text-body">{body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-[700px] text-[13px] text-text-muted">If a reviewer edits a lesson, it goes back for approval before anyone sees the change. Almanac is independent study support, not affiliated with any school or publisher.</p>
          </div>
        </section>

        {/* Course discovery. */}
        <section id="courses" className="alm-section border-y border-[#EEEBF7] bg-studio" aria-labelledby="courses-title">
          <div className="alm-wrap">
            <p className="alm-eyebrow">Courses &amp; resources</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <h2 id="courses-title" className="alm-section-title">Start with what you&apos;re learning.</h2>
              <Link href="/courses" className={secondary}>
                Browse the catalog →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="alm-card alm-card-hover overflow-hidden">
                <div className="relative bg-[#E6E0F8] p-4">
                  <CourseVisual variant="patho" />
                  <span className="alm-pill alm-pill-mint absolute top-6 right-6">● Pilot open</span>
                </div>
                <div className="p-5">
                  <p className="alm-eyebrow">Graduate nursing</p>
                  <h3 className="mt-2 text-[23px] font-bold">Advanced Pathophysiology</h3>
                  <p className="mt-2 text-[14px] text-text-body">Disease mechanisms through reviewed lessons, explained questions, flashcards and exam simulations.</p>
                  <Link href={`/courses/${COURSE}`} className="mt-3 inline-flex min-h-[44px] items-center text-[13.5px] font-bold text-violet-700">
                    Explore the course →
                  </Link>
                </div>
              </article>
              <article className="alm-card alm-card-hover overflow-hidden">
                <div className="bg-[#F6F4FB] p-4">
                  <CourseVisual variant="request" />
                </div>
                <div className="p-5">
                  <p className="alm-eyebrow">Custom learning</p>
                  <h3 className="mt-2 text-[23px] font-bold">Don&apos;t see your course?</h3>
                  <p className="mt-2 text-[14px] text-text-body">Tell us what you&apos;re studying. New custom orders are paused while we redesign the experience.</p>
                  <Link href="/request" className="mt-3 inline-flex min-h-[44px] items-center text-[13.5px] font-bold text-violet-700">
                    Read the product update →
                  </Link>
                </div>
              </article>
            </div>
            <p className="mt-4 text-[12px] text-text-muted">Other topics being developed: Advanced Pharmacology · Practical AI Skills · Editing &amp; Proofreading</p>
          </div>
        </section>

        {/* Questions? From self-serve to a person. */}
        <section className="alm-section" aria-labelledby="questions">
          <div className="alm-wrap">
            <p className="alm-eyebrow">Questions?</p>
            <h2 id="questions" className="alm-section-title mt-2">Three ways to get an answer.</h2>
            <ol className="mt-7 grid gap-3 md:grid-cols-3">
              {[
                ["Help centre", "Answers about access, studying and your workspace.", "/help", "Open the help centre"],
                ["Product update", "What is changing while Almanac is rebuilt, and what stays the same.", "/request", "Read the update"],
                ["Email a person", `Write to ${ALMANAC_SUPPORT_EMAIL}. A person replies.`, mail, "Email support"],
              ].map(([title, body, href, cta], i) => (
                <li key={title} className="flex flex-col gap-2 rounded-section border border-border bg-canvas p-5">
                  <span className="font-display text-[14px] font-bold text-violet-700" aria-hidden="true">{i + 1}</span>
                  <h3 className="text-[17px] font-bold text-text">{title}</h3>
                  <p className="text-[14px] break-words text-text-body">{body}</p>
                  {href.startsWith("mailto:") ? (
                    <a href={href} className="mt-auto inline-flex min-h-[44px] items-center text-[13.5px] font-bold text-violet-700 hover:underline">{cta} →</a>
                  ) : (
                    <Link href={href} className="mt-auto inline-flex min-h-[44px] items-center text-[13.5px] font-bold text-violet-700 hover:underline">{cta} →</Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing next step. */}
        <section className="alm-section pt-0">
          <div className="alm-wrap rounded-section bg-primary-tint px-6 py-10 text-center sm:px-10">
            <h2 className="alm-section-title">Ready when you are.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/courses" className={action}>
                Browse courses →
              </Link>
            </div>
            <p className="mx-auto mt-4 max-w-[520px] text-[13px] text-text-body">New orders are paused while we rebuild. Existing learners keep full access.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
