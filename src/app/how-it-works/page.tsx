import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";
import { OFFERS } from "@/lib/learning-offers";

export const metadata: Metadata = {
  title: "How Almanac Works",
  description: "Choose a course, personalize your learning materials, and follow a study experience built around your goals.",
};

const steps = [
  ["Choose what you're learning", "Explore an existing course or tell us which course, exam or study resource you would like prepared."],
  ["Make it yours", "Set your goals and select the learning formats, delivery method and timeline that work for you. See the price as you choose."],
  ["Learn and make progress", "When your materials are ready, use them in your Almanac workspace or as downloadable files, depending on your selection."],
] as const;

export default function HowItWorksPage() {
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1080px] px-4 pb-24 pt-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-700">How Almanac works</p>
        <h1 className="mt-4 max-w-3xl font-display text-[42px] font-semibold leading-tight sm:text-[54px]">Start where you are. Know where to go next.</h1>
        <p className="mt-5 max-w-3xl text-lg text-ink-body">Whether you're following a course or preparing for something specific, Almanac helps turn your materials and goals into a learning experience you can follow.</p>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(([heading,body],i)=><li key={heading} className="rounded-tile bg-white p-6">
            <span className="font-display text-3xl font-semibold text-violet">{String(i+1).padStart(2,"0")}</span>
            <h2 className="mt-4 font-display text-xl font-semibold">{heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-body">{body}</p>
          </li>)}
        </ol>
        <section className="mt-14 rounded-tile bg-lilac p-6 sm:p-10">
          <h2 className="font-display text-3xl font-semibold">Choose what's ready. Or ask us to prepare it.</h2>
          <p className="mt-3 max-w-2xl text-ink-body">Existing courses can be explored immediately when access is open. Courses or resources prepared on request follow your selected package and production timeline.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/courses" className="inline-flex min-h-12 items-center rounded-full bg-violet px-5 font-bold text-white hover:bg-violet-600">Browse courses &amp; resources →</Link>
            <Link href="/request" className="inline-flex min-h-12 items-center font-semibold text-violet-700 hover:underline">Request a course or resource ↗</Link>
          </div>
        </section>
        <section className="mt-14">
          <h2 className="font-display text-3xl font-semibold">Delivery times that are clear from the start.</h2>
          <p className="mt-3 max-w-2xl text-ink-body">Select Standard, Priority or Express delivery when you configure your package. The displayed turnaround begins after payment and all required materials have been received.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-hairline bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-mist"><tr><th className="px-5 py-4">Package</th><th className="px-3 py-4">Standard</th><th className="px-3 py-4">Priority</th><th className="px-3 py-4">Express</th></tr></thead>
              <tbody>
                {(["resource","exam","course"] as const).map(k=><tr key={k} className="border-t border-hairline">
                  <th className="px-5 py-4 font-semibold">{OFFERS[k].title}</th>
                  <td className="px-3 py-4">{OFFERS[k].turnaround.standard} days</td>
                  <td className="px-3 py-4">{OFFERS[k].turnaround.priority} days</td>
                  <td className="px-3 py-4">{OFFERS[k].turnaround.express} days</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-muted">Some enhancement quantities and delivery speeds have production limits and cannot be selected together. A confirmed delivery date follows payment and receipt of the necessary materials.</p>
        </section>
        <section className="mt-14">
          <h2 className="font-display text-3xl font-semibold">Your materials, your way.</h2>
          <p className="mt-3 max-w-3xl text-ink-body">Keep your lessons, practice, plans and progress in your workspace, request supported downloadable files, or choose both. Interactive practice, AI-supported tools where available, and progress tracking require workspace access.</p>
          <p className="mt-3 text-sm text-ink-muted">Almanac materials are learning support. They do not replace required course texts, professional advice or assessments.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
