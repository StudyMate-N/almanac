"use client";

import { useState } from "react";
import { Logo } from "@/components/brand";
import { friendlyError } from "@/lib/api";
import { useStudent } from "@/lib/store";

/** Shows the sign-in screen until an approved paid learner is signed in. */
export function Gate({ children }: { children: React.ReactNode }) {
  const { status } = useStudent();
  // First visit on this device only (return visits render from the cached copy).
  // The placeholder has the app's shape and fades in late, so a fast load shows no flash at all.
  if (status === "loading")
    return (
      <div className="min-h-dvh bg-ground px-4 pt-5 sm:px-6 lg:p-6" aria-busy="true" aria-label="Loading your plan">
        <div className="mx-auto flex max-w-[1360px] gap-6 opacity-0 motion-safe:animate-[fade-in_300ms_ease-out_200ms_forwards] motion-reduce:opacity-100">
          <div className="hidden h-[calc(100dvh-48px)] w-[240px] flex-none rounded-tile bg-surface lg:block" />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="h-9 w-48 rounded-full bg-track" />
            <div className="h-[200px] rounded-tile bg-violet-200/60" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-[140px] rounded-tile bg-surface" />
              <div className="h-[140px] rounded-tile bg-surface" />
            </div>
          </div>
        </div>
      </div>
    );
  if (status === "signed-out") return <SignIn />;
  return <>{children}</>;
}

function SignIn() {
  const { signIn } = useStudent();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(code, name || undefined, email || undefined);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  const field = "h-12 w-full rounded-[12px] border border-[#D9D2F3] bg-white px-4 text-base outline-none focus:border-violet focus:ring-2 focus:ring-violet/15";
  const points = ["Your course, plan and practice in one place", "Questions reviewed by registered nurses", "A coach who answers your questions"];
  return (
    <main className="alm-signin grid min-h-dvh bg-white lg:grid-cols-2">
      {/* Design 13a: art panel on the left (desktop only), the form on the right. */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[#F7F6FB] p-14 lg:flex" aria-hidden="true">
        <Logo />
        <div className="absolute inset-0 m-auto h-[62%] w-[78%] rounded-full bg-[radial-gradient(closest-side,#ECE7FF,rgba(236,231,255,0))]" />
        <div className="relative mx-auto aspect-square w-full max-w-[460px] bg-[url('/almanac-art/hero-still-life.png')] bg-contain bg-center bg-no-repeat" />
        <ul className="relative flex flex-col gap-3 text-[15px] text-ink-body">
          {points.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-mint text-[11px] font-extrabold text-correct">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:bg-white">
        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">
          <span className="lg:hidden">
            <Logo />
          </span>
          <div>
            <h1 className="font-display text-[32px] leading-[1.05] font-bold tracking-[-.04em] sm:text-[40px]">Welcome back</h1>
            <p className="mt-2 text-[15px] text-ink-body">Enter the access code sent by Almanac after your paid enrollment is approved. This includes enrollments paid directly or outside Almanac. Your progress follows you across devices.</p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13.5px] font-bold">
              Access code
              <input className={`${field} font-mono tracking-wider uppercase`} value={code} onChange={(e) => setCode(e.target.value)} placeholder="ALM-XXXX-XXXX-XXXX" required autoComplete="one-time-code" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13.5px] font-bold">
              <span>
                Your name <span className="font-normal text-ink-muted">(first sign-in only)</span>
              </span>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13.5px] font-bold">
              <span>
                Email <span className="font-normal text-ink-muted">(so a coach can reach you)</span>
              </span>
              <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
            </label>
            {error && (
              <p role="alert" className="rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] px-3.5 py-2.5 text-sm font-semibold text-[#A8430A]">
                {error}
              </p>
            )}
            <button disabled={busy} className="mt-1 h-[50px] rounded-[12px] bg-violet font-bold text-white hover:bg-[#4A2DE6] disabled:bg-[#A99BF0]">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <details className="group border-t border-[#EEEBF7] pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[14.5px] font-bold text-violet-700 [&::-webkit-details-marker]:hidden">
              Can&apos;t sign in?<span className="text-[18px] leading-none group-open:hidden">+</span><span className="hidden text-[18px] leading-none group-open:inline">–</span>
            </summary>
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="rounded-[12px] bg-mist px-3.5 py-3">
                <p className="text-[14px] font-bold">No code yet</p>
                <p className="text-[13px] text-ink-body">You receive one after your paid enrollment is approved.</p>
              </div>
              <div className="rounded-[12px] bg-mist px-3.5 py-3">
                <p className="text-[14px] font-bold">Paid outside Almanac, or lost your code</p>
                <p className="text-[13px] text-ink-body">Contact support@unemployedproff.com for your invitation. Include your invoice reference if you have one.</p>
              </div>
            </div>
          </details>
          <p className="text-[13.5px] text-ink-muted">
            New to Almanac?{" "}
            <a href="/courses" className="font-bold text-violet-700">
              Browse courses
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
