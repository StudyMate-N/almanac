import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";

export const metadata: Metadata = {
  title: "Almanac's learning experience",
  description: "Understand where Almanac's guided learning experience is heading and what remains available while new orders are paused.",
};

const principles = [
  ["01", "Start with your goal", "A useful study session begins with what you want to understand, remember, or prepare for—not a long list of formats to buy."],
  ["02", "Find your next step", "Our new learning guide is being developed to recommend a suitable action from the content that is approved and available to you."],
  ["03", "Study and check understanding", "A good lesson leads to genuine recall or practice, explanation and feedback, not just finishing a video."],
  ["04", "Return with clarity", "Your course access, existing progress, practice and review should help you pick up where you stopped."],
] as const;

export default function HowItWorksPage() {
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1090px] px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <p className="alm-eyebrow">Almanac · a clearer way to learn</p>
        <h1 className="mt-3 max-w-[860px] font-display text-[37px] font-bold leading-[1.07] sm:text-[52px]">
          A learning experience that helps you know what to do next.
        </h1>
        <p className="mt-5 max-w-[790px] text-[16px] leading-8 text-ink-body">
          We are rebuilding Almanac around the learner's goal. Instead of asking you to navigate disconnected lessons, videos, questions and packages, the new experience is designed to explain the next useful learning action and help you keep going.
        </p>
        <div className="mt-7 rounded-[17px] border border-[#DAD0F6] bg-[#F4F1FE] p-5 sm:p-6" role="status">
          <h2 className="font-display text-[20px] font-bold">A development update</h2>
          <p className="mt-2 text-[14px] leading-7 text-ink-body">
            These are the principles guiding our rebuild, not a claim that every feature is available today.
            <strong> New course orders and checkout are temporarily paused.</strong> Existing learner access, invoice records and support are being maintained.
          </p>
        </div>
        <section className="mt-11" aria-labelledby="journey-heading">
          <h2 id="journey-heading" className="font-display text-[29px] font-bold">The learning journey we're building</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {principles.map(([num,title,body]) => (
              <article key={num} className="alm-card p-5 sm:p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#2A1B78] font-bold text-white">{num}</span>
                <h3 className="mt-4 font-display text-[21px] font-bold">{title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-ink-body">{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-10 rounded-[20px] bg-[#2A1B78] p-6 text-white sm:p-8">
          <h2 className="font-display text-[24px] font-bold">What can you do now?</h2>
          <p className="mt-3 max-w-[780px] text-[14px] leading-7 text-white/85">
            Explore the subject areas already listed. If you have an approved learning account or an existing order, continue using your workspace or contact support using your current private invoice information.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/courses" className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[13px] font-bold text-[#2A1B78]">Explore learning subjects →</Link>
            <Link href="/app" className="inline-flex min-h-11 items-center rounded-full border border-white/60 px-5 text-[13px] font-bold text-white">Existing learner workspace →</Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full border border-white/60 px-5 text-[13px] font-bold text-white">Contact support →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
