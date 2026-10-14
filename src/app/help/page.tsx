import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Help & Support", description: "Help with Almanac courses, study resources, learning requests and workspace access." };

const questions = [
 ["How do I request a course or study module?", "Choose a package and describe your course or exam. Your core lessons, videos, visuals and practice are included. Add only clearly priced extra resources if you need them."],
 ["Can I upload a syllabus or course materials?", "Yes. Course files are optional and help staff personalize your modules. Upload them while ordering or later via the private invoice link; do not share school passwords, private patient records, or confidential third-party materials."],
 ["How are bank transfers made?", "Your invoice shows the exact fixed CAD amount, bank details and an invoice reference. Transfer to the beneficiary shown, then report your bank reference or upload a receipt in the secure form. Staff verify actual bank receipt independently."],
 ["When does the delivery timeline begin?", "Payment verification alone does not start production. Staff confirm all required course materials have arrived, start preparation, and show a target delivery date in your learning orders."],
 ["How do I get my learning access code?", "After staff verify the bank transfer, they issue a code to the email attached to your invoice. Sign in under Learning Workspace, then open My orders & delivered files. Your resources appear as staff approve and release them."],
 ["Can I link another purchase to my existing account?", "Yes. After payment verification, use the 'Already have an account? Link this order' option on that invoice while signed in with the same email address."],
 ["I lost my private invoice link or access code. What do I do?", "Contact support@unemployedproff.com with your invoice reference. After confirming your identity and email, an authorized owner can reissue your link or reset your code. An old link or code stops working after replacement."],
 ["Can I download course materials?", "Yes, for supported resources released to your paid order. Interactive practice and automatic progress tracking require the applicable workspace tools."],
 ["What if I need changes or more than the stated modules?", "Review the learning plan shared by staff. You can ask for corrections within the agreed scope; adding new modules or more extensive resources requires a separately priced enhancement."],
 ["What if I sent payment but it hasn't appeared?", "Use the invoice's payment-report form, or contact support with your invoice reference. Do not transfer twice without checking; international bank settlement can take time."],
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
