"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ADDONS, OFFERS, SPEEDS, calculateQuote, type Addon,
  type DeliveryMethod, type OfferKind, type Speed,
} from "@/lib/learning-offers";

const PACKAGE_KEYS: OfferKind[] = ["resource", "exam", "course"];
const ADDON_KEYS = Object.keys(ADDONS) as Addon[];
const SPEED_KEYS: Speed[] = ["standard", "priority", "express"];
const inputClass = "w-full rounded-2xl border border-hairline bg-white px-4 py-3 text-base outline-none focus:border-violet";
const optionClass = "min-h-12 rounded-2xl border-2 px-4 py-3 text-left transition-colors";
const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

type Submitted = { id: string; quoteUsd: number; turnaroundDays: number; status: string };

export function RequestBuilder({ initialCourseId, initialSubject }: {
  initialCourseId: string | null;
  initialSubject: string;
}) {
  const [kind, setKind] = useState<OfferKind>("course");
  const [subject, setSubject] = useState(initialSubject);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [addons, setAddons] = useState<Addon[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("both");
  const [speed, setSpeed] = useState<Speed>("standard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const quote = useMemo(() => calculateQuote({ kind, speed, addons }), [kind, speed, addons]);
  const offer = OFFERS[kind];
  const expressVideoRestriction = kind === "course" && speed === "express" && addons.includes("video");
  const priceForAddon = (key: Addon) => {
    const addon = ADDONS[key];
    return "flatUsd" in addon ? addon.flatUsd : addon.pricePerUnit * offer.units;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || expressVideoRestriction) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/learning-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind, subject, goal, name, email, website, addons,
          courseId: initialCourseId, deliveryMethod, speed,
        }),
      });
      const result = await response.json() as Submitted & { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setSubmitted(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't save your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) return (
    <section className="mt-10 rounded-tile border border-hairline bg-white p-6 sm:p-10" role="status">
      <p className="text-sm font-bold text-violet-700">REQUEST RECEIVED</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">Your learning request is saved.</h2>
      <p className="mt-3 text-ink-body">We have the details of what you would like us to prepare. Keep this reference for follow-up.</p>
      <dl className="mt-6 grid gap-3 rounded-card bg-mist p-5 text-sm">
        <div className="flex flex-wrap justify-between gap-2"><dt>Reference</dt><dd className="break-all font-semibold">{submitted.id}</dd></div>
        <div className="flex justify-between"><dt>Package total</dt><dd className="font-semibold">{usd(submitted.quoteUsd)}</dd></div>
        <div className="flex justify-between"><dt>Turnaround</dt><dd className="font-semibold">{submitted.turnaroundDays} calendar days</dd></div>
        <div className="flex justify-between"><dt>Request status</dt><dd className="font-semibold">Received · awaiting next steps</dd></div>
      </dl>
      <p className="mt-4 text-sm text-ink-muted">
        No payment has been taken. Your delivery period begins once payment and the required materials are received.
        We will use the email you provided to coordinate the next steps.
      </p>
    </section>
  );

  return (
    <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-scope">
          <h2 id="request-scope" className="font-display text-2xl font-semibold">1. What should we prepare?</h2>
          <p className="mt-2 text-sm text-ink-body">Choose a starting package. We will tailor the materials around your goals.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {PACKAGE_KEYS.map(key => (
              <button key={key} type="button" aria-pressed={kind === key}
                onClick={() => setKind(key)}
                className={`${optionClass} ${kind === key ? "border-violet bg-lilac" : "border-hairline bg-white hover:bg-mist"}`}>
                <span className="block font-semibold">{OFFERS[key].title}</span>
                <span className="mt-1 block text-sm text-ink-muted">From {usd(OFFERS[key].baseUsd)}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-muted">{offer.summary}</p>
          <div className="mt-5 grid gap-4">
            <label className="block text-sm font-semibold">Subject or course
              <input required minLength={3} maxLength={140} className={`${inputClass} mt-2`}
                value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Advanced Pharmacology" />
            </label>
            <label className="block text-sm font-semibold">What would you like to achieve?
              <textarea required minLength={10} maxLength={2000} rows={4}
                className={`${inputClass} mt-2`} value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="Describe your topics, exam preparation needs, syllabus or learning goals." />
            </label>
          </div>
        </section>

        <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-materials">
          <h2 id="request-materials" className="font-display text-2xl font-semibold">2. Make it yours.</h2>
          <p className="mt-2 text-sm text-ink-body">
            Your core package is included. Add only the formats you would like us to prepare.
          </p>
          <div className="mt-5 rounded-card bg-mist p-4">
            <p className="font-semibold">Included in {offer.title}</p>
            <ul className="mt-2 grid gap-2 text-sm text-ink-body sm:grid-cols-2">
              {offer.includes.map(item => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-violet">✓</span>{item}</li>)}
            </ul>
            {kind === "course" && <p className="mt-3 text-xs text-ink-muted">AI tutoring is being verified and is not included in this price yet.</p>}
          </div>
          <fieldset className="mt-5">
            <legend className="font-semibold">Additional formats</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ADDON_KEYS.map(key => (
                <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-sm ${addons.includes(key) ? "border-violet bg-lilac" : "border-hairline"}`}>
                  <input type="checkbox" className="mt-1 accent-violet" checked={addons.includes(key)}
                    onChange={e => setAddons(prev => e.target.checked ? [...prev, key] : prev.filter(a => a !== key))} />
                  <span className="flex-1 font-medium">{ADDONS[key].title}</span>
                  <span className="whitespace-nowrap font-semibold">+{usd(priceForAddon(key))}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-delivery">
          <h2 id="request-delivery" className="font-display text-2xl font-semibold">3. Choose your delivery.</h2>
          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Delivery method</legend>
            {([
              ["both", "Learning workspace + downloadable files", "Study online and keep supported files for reference."],
              ["workspace", "Almanac learning workspace", "Use lessons, practice, plans and progress tools together."],
              ["files", "Downloadable materials", "Receive supported study files without the interactive workspace."],
            ] as const).map(([value, label, description]) => (
              <label key={value} className="flex cursor-pointer gap-3 rounded-2xl border border-hairline p-4">
                <input type="radio" name="deliveryMethod" className="mt-1 accent-violet"
                  checked={deliveryMethod === value} onChange={() => setDeliveryMethod(value)} />
                <span><strong className="block">{label}</strong><span className="mt-1 block text-sm text-ink-muted">{description}</span></span>
              </label>
            ))}
          </fieldset>
          {deliveryMethod === "files" && <p className="mt-3 rounded-2xl bg-mist p-3 text-sm text-ink-body">
            Interactive tutoring, scored simulations and progress tracking require the workspace.
            Choosing files only does not change the package price.
          </p>}
        </section>

        <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-urgency">
          <h2 id="request-urgency" className="font-display text-2xl font-semibold">4. When do you need it?</h2>
          <p className="mt-2 text-sm text-ink-body">Choose a delivery window and see the full price immediately.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {SPEED_KEYS.map(key => (
              <button key={key} type="button" aria-pressed={speed === key}
                onClick={() => setSpeed(key)}
                className={`${optionClass} text-center ${speed === key ? "border-violet bg-lilac" : "border-hairline bg-white hover:bg-mist"}`}>
                <span className="block text-sm font-semibold">{SPEEDS[key].title}</span>
                <span className="mt-1 block font-display text-xl font-semibold">{offer.turnaround[key]} days</span>
                <span className="mt-1 block text-xs text-ink-muted">{SPEEDS[key].factor === 1 ? "Base rate" : `${SPEEDS[key].factor}×`}</span>
              </button>
            ))}
          </div>
          {expressVideoRestriction && <p role="alert" className="mt-3 rounded-2xl bg-peach p-3 text-sm text-peach-ink">
            An eight-unit course with video overviews needs at least Priority delivery (7 days).
            Choose Priority or remove video to continue.
          </p>}
          <p className="mt-3 text-sm text-ink-muted">
            Timelines are in calendar days. The delivery window starts after payment and all required materials have been received.
          </p>
        </section>

        <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-contact">
          <h2 id="request-contact" className="font-display text-2xl font-semibold">5. Your details</h2>
          <p className="mt-2 text-sm text-ink-body">So we can identify your request and arrange delivery.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Name
              <input className={`${inputClass} mt-2`} required minLength={2} maxLength={120}
                autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label className="block text-sm font-semibold">Email
              <input className={`${inputClass} mt-2`} required type="email"
                autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
          </div>
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label>
          </div>
          <p className="mt-4 text-xs text-ink-muted">No payment is taken when you submit this request. We'll use your email for the next steps.</p>
        </section>
      </div>

      <aside className="rounded-tile border border-hairline bg-white p-5 lg:sticky lg:top-5" aria-label="Your request summary">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Your package</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{offer.title}</h2>
        <p className="mt-1 text-sm text-ink-muted">Up to {quote.units} learning {quote.units === 1 ? "unit" : "units"}</p>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-2"><dt>Base package</dt><dd>{usd(quote.baseUsd)}</dd></div>
          <div className="flex justify-between gap-2"><dt>Optional materials</dt><dd>{usd(quote.addonUsd)}</dd></div>
          <div className="flex justify-between gap-2"><dt>{SPEEDS[speed].title} delivery</dt><dd>+{usd(quote.urgencyUsd)}</dd></div>
          <div className="border-t border-hairline pt-3">
            <dt className="text-ink-muted">Total (USD)</dt>
            <dd className="mt-1 font-display text-[38px] font-semibold leading-tight">{usd(quote.totalUsd)}</dd>
          </div>
          <div className="flex justify-between gap-2 rounded-2xl bg-mist p-3"><dt>Turnaround</dt><dd className="font-semibold">{quote.days} calendar days</dd></div>
        </dl>
        {error && <p role="alert" className="mt-4 rounded-xl bg-rose p-3 text-sm text-rose-ink">{error}</p>}
        <button disabled={busy || expressVideoRestriction} type="submit"
          className="mt-5 min-h-14 w-full rounded-full bg-violet px-5 font-bold text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? "Saving your request…" : "Submit my request →"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          We'll record your selected materials, total and turnaround. No payment is collected at this stage.
        </p>
      </aside>
    </form>
  );
}
