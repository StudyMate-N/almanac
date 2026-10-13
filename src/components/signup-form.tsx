"use client";

import { useId, useState } from "react";
import { friendlyError, rpc } from "@/lib/api";

/**
 * Pilot request or "tell me when it opens" sign-up for one course.
 * Saved to Supabase (app.signups); the coach console lists them.
 */
export function SignupForm({ courseId, kind = "pilot", label = "Request pilot access" }: { courseId: string; kind?: "pilot" | "notify"; label?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState("");

  if (state === "done")
    return (
      <p role="status" className="rounded-3xl bg-mint px-5 py-4 font-semibold text-mint-ink">
        {kind === "pilot" ? "Thanks. We'll email you a pilot code if a place opens." : "Thanks. We'll email you when this course opens."}
      </p>
    );

  return (
    <form
      className="flex min-w-0 flex-wrap gap-2.5"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        setErr("");
        try {
          await rpc("signup_add", { p_email: email, p_course_id: courseId, p_kind: kind });
          setState("done");
        } catch (x) {
          setErr(friendlyError(x));
          setState("idle");
        }
      }}
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-h-14 min-w-0 flex-[1_1_220px] rounded-full border-2 border-hairline bg-white px-[22px] text-base text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none"
      />
      <button disabled={state === "busy"} className="min-h-14 rounded-full bg-tangerine px-[26px] text-base font-bold text-ink hover:bg-[#ff8c4a] disabled:opacity-60">
        {state === "busy" ? "Sending…" : label}
      </button>
      <p aria-live="polite" className="w-full text-sm text-incorrect">
        {err}
      </p>
    </form>
  );
}
