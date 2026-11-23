import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";

export const metadata: Metadata = {
  title: "Almanac is evolving — new orders paused",
  description: "New custom learning orders are paused while Almanac rebuilds its guided learning experience. Existing learner workspaces and private invoices remain available.",
  robots: { index: false, follow: true },
};

export default function RequestPage() {
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[900px] px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
        <section className="alm-card overflow-hidden">
          <div className="bg-[#F4F1FE] px-6 py-8 sm:px-10 sm:py-11">
            <p className="alm-eyebrow">Almanac · product development</p>
            <h1 className="mt-3 max-w-[730px] font-display text-[36px] font-bold leading-[1.08] sm:text-[48px]">
              We&apos;re rebuilding the learning experience.
            </h1>
            <p className="mt-4 max-w-[690px] text-[16px] leading-7 text-ink-body">
              New learning-package orders and checkout are temporarily paused. We&apos;re working on a clearer, more guided Almanac where you can understand what to study, how to begin, and what comes next.
            </p>
          </div>
          <div className="space-y-6 px-6 py-8 sm:px-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[17px] border border-hairline p-5">
                <h2 className="font-display text-[20px] font-bold">Exploring Almanac?</h2>
                <p className="mt-2 text-[13.5px] leading-6 text-ink-body">
                  You can still see our course subjects and learn what the platform is developing. New purchases cannot be submitted during this pause.
                </p>
                <Link href="/courses" className="mt-4 inline-flex min-h-11 items-center font-bold text-violet-700">
                  Explore learning subjects →
                </Link>
              </article>
              <article className="rounded-[17px] border border-hairline p-5">
                <h2 className="font-display text-[20px] font-bold">Already a learner?</h2>
                <p className="mt-2 text-[13.5px] leading-6 text-ink-body">
                  Existing learning access and saved private invoice links are not being removed. Use your existing link or contact support if you need help.
                </p>
                <Link href="/app" className="mt-4 inline-flex min-h-11 items-center font-bold text-violet-700">
                  Return to your workspace →
                </Link>
              </article>
            </div>
            <p className="text-[13px] leading-6 text-ink-body">
              Have an existing order or invoice question? <Link href="/contact" className="font-bold text-violet-700 underline underline-offset-2">Contact Almanac support</Link>. Please don&apos;t initiate a new transfer based on an old quote without confirming its status with support.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
