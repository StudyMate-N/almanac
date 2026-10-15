import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";
import { OFFERS } from "@/lib/learning-offers";

export const metadata: Metadata = {
  title: "How Almanac Works",
  description: "Choose a course, personalize your learning materials, and follow a study experience built around your goals.",
};

const steps = [
 ["01","Choose what you're learning","Browse the catalog or tell us what course, exam or learning module you need.","Choose a complete package."],
 ["02","Review your invoice","See the package, quantities and CAD amount before making a bank transfer.","Payment is verified by staff."],
 ["03","Agree on your learning plan","Share your syllabus if you have one. Confirm your topics, objectives and milestones.","Your delivery window starts after required materials are received."],
 ["04","Learn and make progress","Use your workspace as completed modules and approved files are released to you.","Return to practice, flashcards and your plan anytime."]
] as const;

export default function HowItWorksPage() {
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1080px] px-4 pb-24 pt-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-700">How Almanac works</p>
        <h1 className="mt-4 max-w-3xl font-display text-[42px] font-semibold leading-tight sm:text-[54px]">Start where you are. Know where to go next.</h1>
        <p className="mt-5 max-w-3xl text-lg text-ink-body">Whether you're following a course or preparing for something specific, Almanac helps turn your materials and goals into a learning experience you can follow.</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number,heading,body,when],i)=><li key={heading} className="alm-card overflow-hidden">
            <div className="grid h-28 place-items-center bg-[#F4F1FE] bg-contain bg-center bg-no-repeat" style={{backgroundImage:`url("/almanac-art/${["step-1-choose","step-invoice","step-2-plan","step-3-workspace"][i]}.png")`}} aria-hidden="true"></div>
            <div className="p-5">
            <span className="text-[11px] font-extrabold text-violet-700">{number}</span>
            <h2 className="mt-2 text-[19px] font-bold">{heading}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-body">{body}</p><p className="mt-4 border-t border-hairline pt-3 text-[12px] font-medium text-violet-700">{when}</p></div>
          </li>)}
        </ol>
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="alm-card p-5"><p className="alm-eyebrow">Workspace access</p><h2 className="mt-2 text-[22px] font-bold">Sign in after payment verification.</h2>
          <p className="mt-2 text-[13px] text-ink-body">When the receiving bank confirms your payment, staff issue your access code. You can then see your order, reviewed plan, and preparation progress.</p></div>
          <div className="alm-card p-5"><p className="alm-eyebrow">Finished materials</p><h2 className="mt-2 text-[22px] font-bold">Delivered module by module.</h2>
          <p className="mt-2 text-[13px] text-ink-body">Each resource becomes available once it has been checked and released, within your confirmed production window.</p></div>
        </section>
        <section className="mt-10 rounded-[19px] bg-[#ECE7FF] p-6 sm:p-8">
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
                  <td className="px-3 py-4">{k==="course"?"Not offered":OFFERS[k].turnaround.express+" days"}</td>
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
