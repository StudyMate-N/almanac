import Link from "next/link";
import { Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-5 px-6">
      <Logo />
      <h1 className="font-display text-[40px] leading-tight font-semibold">This page isn&apos;t here.</h1>
      <p className="text-ink-body">The link may be old, or the lesson may not be published yet.</p>
      <Link href="/app" className="inline-flex min-h-[52px] items-center rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
        Go to Today
      </Link>
    </main>
  );
}
