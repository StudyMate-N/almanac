import Link from "next/link";
import { Logo } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <Logo />
      <nav aria-label="Main" className="flex items-center gap-5 text-[15px] font-semibold">
        <Link href="/courses" className="hidden sm:inline">
          Courses &amp; Resources
        </Link>
        <Link href="/#how" className="hidden sm:inline">
          How it works
        </Link>
        <Link href="/request" className="hidden sm:inline">Request a course</Link>
        <Link href="/app" className="rounded-full bg-white px-4 py-2">
          Have a code? Sign in
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline px-4 py-8 text-sm text-ink-muted">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 sm:px-2">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Almanac</p>
          <p className="mt-1">One place. A clearer way to learn.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
          <Link href="/courses" className="hover:text-violet">Courses &amp; Resources</Link>
          <Link href="/request" className="hover:text-violet">Request a course or resource</Link>
          <Link href="/app" className="hover:text-violet">Learning workspace</Link>
          <Link href="/help" className="hover:text-violet">Help</Link>
          <Link href="/contact" className="hover:text-violet">Contact</Link>
          <Link href="/privacy" className="hover:text-violet">Privacy</Link>
          <Link href="/terms" className="hover:text-violet">Terms</Link>
        </nav>
        <p className="w-full border-t border-hairline pt-4 text-xs">
          © 2026 Almanac. Learning support, not medical or professional advice.
          Independent; not affiliated with any school or publisher.
        </p>
      </div>
    </footer>
  );
}

export const toneBg = { lilac: "bg-lilac", peach: "bg-peach", mint: "bg-mint", sky: "bg-sky" } as const;
