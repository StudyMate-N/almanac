import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";

export const metadata: Metadata = { title: "About Almanac", description: "A clearer, more organized way to work through what you are learning." };

export default function AboutPage() {
  return <div className="min-h-screen bg-ground text-ink"><SiteHeader/>
    <main className="mx-auto max-w-[940px] px-4 pb-24 pt-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-700">About Almanac</p>
      <h1 className="mt-4 max-w-3xl font-display text-[42px] font-semibold leading-tight sm:text-[54px]">One place. A clearer way to learn.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-body">Almanac brings study materials, learning plans and progress into one organized experience. It is designed for people following a course, preparing for an exam, or learning independently.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Understanding", "Clear explanations and practice to build confidence in what you learn."],
          ["Direction", "A visible next step and a plan around your goals and dates."],
          ["Progress", "A place to revisit material, review answers, and see how learning develops."],
        ].map(([a,b])=><div key={a} className="rounded-tile bg-white p-5"><h2 className="font-display text-xl font-semibold">{a}</h2><p className="mt-2 text-sm text-ink-body">{b}</p></div>)}
      </div>
      <section className="mt-10 rounded-tile bg-lilac p-7">
        <h2 className="font-display text-2xl font-semibold">Learning that fits what you need.</h2>
        <p className="mt-2 text-ink-body">Choose a ready-made course or request a new course, exam-preparation resource, or individual study material. We offer structured starting packages with room to personalize the formats and schedule.</p>
        <Link className="mt-5 inline-flex min-h-12 items-center rounded-full bg-violet px-5 font-bold text-white" href="/courses">Browse courses &amp; resources →</Link>
      </section>
    </main><SiteFooter/></div>;
}
