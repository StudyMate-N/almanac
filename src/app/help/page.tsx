import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Help & Support", description: "Help with Almanac courses, study resources, learning requests and workspace access." };

const questions = [
  ["How do I request a course or study resource?", "Choose a listed course or open the custom request page. Select your package, formats, delivery method, and timeline before submitting."],
  ["When does the preparation timeline begin?", "The selected turnaround starts after payment and all required materials have been received. No payment is collected by the initial request form."],
  ["Can I use Almanac for exam preparation?", "Yes. Choose the Exam Preparation Pack or select custom study materials, including practice and exam simulations when available."],
  ["Can I download my materials?", "Supported files can be included in your order. Interactive features such as scored practice and progress tracking require the learning workspace."],
  ["I already have a learning access code. Where do I sign in?", "Use the Learning Workspace link and enter your existing code to access your assigned course."],
  ["What if a course isn't listed?", "You can request a course for a subject, exam, or specific study need even when it is not shown in the catalog."],
] as const;
export default function HelpPage() {
  return <div className="min-h-screen bg-ground text-ink"><SiteHeader/>
    <main className="mx-auto max-w-[980px] px-4 pb-24 pt-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-700">Almanac Help</p>
      <h1 className="mt-3 font-display text-[42px] font-semibold">Answers and next steps.</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-body">Find quick answers about learning materials, orders and account access.</p>
      <div className="mt-9 space-y-3">
        {questions.map(([q,a])=><details key={q} className="rounded-card bg-white p-5 open:bg-lilac">
          <summary className="cursor-pointer font-semibold">{q}</summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-body">{a}</p>
        </details>)}
      </div>
      <section className="mt-10 rounded-tile bg-lilac p-6">
        <h2 className="font-display text-2xl font-semibold">Need help with something else?</h2>
        <p className="mt-2 text-ink-body">Reach Almanac support or return to your learning workspace.</p>
        <div className="mt-5 flex flex-wrap gap-5">
          <Link className="font-semibold text-violet-700 underline" href="/contact">Contact support →</Link>
          <Link className="font-semibold text-violet-700 underline" href="/app">Learning workspace →</Link>
        </div>
      </section>
    </main><SiteFooter/></div>;
}
