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

  const field = "min-h-12 w-full rounded-2xl border-2 border-hairline bg-white px-4 text-base outline-none focus:border-violet";
  return (
    <main className="alm-signin mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-5 py-10">
      <Logo />
      <div>
        <h1 className="font-display text-[34px] leading-tight font-semibold">Sign in to Almanac</h1>
        <p className="mt-2 text-ink-body">Enter the access code sent by Almanac after your paid enrollment is approved. This includes enrollments paid directly or outside Almanac. Your progress follows you across devices.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3.5 rounded-[20px] border border-hairline bg-white p-6 shadow-[0_18px_40px_rgba(42,27,120,.08)]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Access code
          <input className={`${field} font-mono tracking-wider uppercase`} value={code} onChange={(e) => setCode(e.target.value)} placeholder="ALM-XXXX-XXXX-XXXX" required autoComplete="one-time-code" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Your name <span className="font-normal text-ink-muted">(first sign-in only)</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Email <span className="font-normal text-ink-muted">(so a coach can reach you)</span>
          <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        {error && (
          <p role="alert" className="rounded-xl bg-rose px-3 py-2 text-sm font-semibold text-rose-ink">
            {error}
          </p>
        )}
        <button disabled={busy} className="mt-1 min-h-[52px] rounded-full bg-violet font-bold text-white hover:bg-violet-600 disabled:bg-violet-300">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-ink-muted">No code yet? You will receive one after your paid enrollment is approved. Already paid outside Almanac? Contact support@unemployedproff.com for your invitation.</p>
    </main>
  );
}
