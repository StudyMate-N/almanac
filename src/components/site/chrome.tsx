import Link from "next/link";
import { Logo } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <Logo />
      <nav aria-label="Main" className="flex items-center gap-5 text-[15px] font-semibold">
        <Link href="/#courses" className="hidden sm:inline">
          Courses
        </Link>
        <Link href="/#how" className="hidden sm:inline">
          How it works
        </Link>
        <Link href="/app" className="rounded-full bg-white px-4 py-2">
          Have a code? Sign in
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline px-4 py-8 text-center text-sm text-ink-muted">
      Almanac is study help, not medical or professional advice. Independent; not affiliated with any school or publisher.
    </footer>
  );
}

export const toneBg = { lilac: "bg-lilac", peach: "bg-peach", mint: "bg-mint", sky: "bg-sky" } as const;
