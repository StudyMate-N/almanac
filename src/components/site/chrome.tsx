import Link from "next/link";
import { Logo } from "@/components/brand";

/** Public website shell only. Learner and coach environments retain their own chrome. */
export function SiteHeader() {
 return <><div role="status" className="border-b border-[#E4DFF5] bg-[#F4F1FE] px-4 py-2 text-center text-[12px] text-[#2A1B78]">New Almanac orders are paused while we rebuild the learning experience. <Link href="/request" className="font-bold underline underline-offset-2">What this means →</Link></div><header className="alm-site-header border-b border-[#EEEBF7] bg-white">
  <div className="mx-auto flex min-h-[61px] w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-2">
   <div className="flex items-center gap-7">
    <Logo size={25} textClass="text-[22px]"/>
    <nav aria-label="Main navigation" className="hidden items-center gap-6 text-[13px] font-medium text-ink-body md:flex">
      <Link href="/courses" className="hover:text-violet-700">Courses</Link>
      <Link href="/how-it-works" className="hover:text-violet-700">How it works</Link>
      <Link href="/request" className="hover:text-violet-700">Product update</Link>
      <Link href="/help" className="hover:text-violet-700">Help</Link>
    </nav>
   </div>
   <div className="flex items-center gap-2">
    <Link href="/app" className="inline-flex min-h-[40px] items-center rounded-full border border-hairline bg-white px-3 text-[12px] font-semibold text-ink hover:bg-mist sm:px-4">Learning workspace</Link>
    <Link href="/request" className="hidden min-h-[40px] items-center rounded-full bg-violet px-4 text-[12px] font-bold text-white hover:bg-violet-600 sm:inline-flex">Request a course</Link>
   </div>
   <nav aria-label="Mobile navigation" className="flex w-full flex-wrap gap-x-5 gap-y-2 border-t border-[#EEEBF7] py-2 text-[12px] font-semibold text-ink-body md:hidden">
     <Link href="/courses">Courses</Link><Link href="/how-it-works">How it works</Link>
     <Link href="/request">Update</Link><Link href="/help">Help</Link>
   </nav>
  </div>
 </header></>;
}

export function SiteFooter() {
 return <footer className="bg-[#2A1B78] text-white">
  <div className="mx-auto max-w-[1100px] px-4 py-10">
    <div className="grid gap-8 border-b border-white/20 pb-8 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
     <div>
      <p className="font-display text-[24px] font-extrabold tracking-[-.045em]">Almanac</p>
      <p className="mt-2 text-[13px] text-white/75">One place. A clearer way to learn.</p>
      <p className="mt-3 max-w-[260px] text-[12px] text-white/60">Learning support for coursework, exam preparation, and independent study.</p>
     </div>
     <nav aria-label="Explore" className="flex flex-col gap-2 text-[12px] text-white/80"><strong className="text-[13px] text-white">Explore</strong><Link href="/courses">Courses &amp; resources</Link><Link href="/request">Request a course</Link><Link href="/how-it-works">How it works</Link></nav>
     <nav aria-label="Account and help" className="flex flex-col gap-2 text-[12px] text-white/80"><strong className="text-[13px] text-white">Your account</strong><Link href="/app">Learning workspace</Link><Link href="/help">Help center</Link><Link href="/contact">Contact support</Link></nav>
     <nav aria-label="Legal" className="flex flex-col gap-2 text-[12px] text-white/80"><strong className="text-[13px] text-white">Information</strong><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of service</Link><a href="mailto:almanacstudy.support@gmail.com">Email support</a></nav>
    </div>
    <div className="flex flex-wrap justify-between gap-3 pt-5 text-[11px] text-white/60"><span>© 2026 Almanac. Learning, organized around you.</span><span>Independent learning support. Not affiliated with any school or publisher.</span></div>
  </div>
 </footer>;
}
export const toneBg = { lilac:"bg-lilac",peach:"bg-peach",mint:"bg-mint",sky:"bg-sky" } as const;
