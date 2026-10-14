"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Course } from "@/content/types";

const categories = ["All", "Nursing", "Everyday skills", "Writing"] as const;

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(c => (category === "All" || c.category.toLowerCase().includes(category.toLowerCase()))
      && (!q || [c.title, c.category, c.blurb].join(" ").toLowerCase().includes(q)));
  }, [courses, query, category]);

  const available = shown.filter(c => c.status === "open");
  const requested = shown.filter(c => c.status !== "open");
  return (
    <>
      <label htmlFor="catalog-search" className="mt-7 block text-sm font-semibold">Search courses and subjects</label>
      <input id="catalog-search" type="search" value={query} onChange={e => setQuery(e.target.value)}
        className="mt-2 min-h-14 w-full rounded-2xl border-2 border-hairline bg-white px-5 text-base outline-none focus:border-violet"
        placeholder="Search courses, subjects or resources…" />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter courses">
        {categories.map(c => (
          <button key={c} type="button" aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${category === c ? "bg-violet text-white" : "bg-white text-ink-body hover:bg-lilac"}`}>{c}</button>
        ))}
      </div>

      {available.length > 0 && (
        <section className="mt-10" aria-labelledby="catalog-available">
          <h2 id="catalog-available" className="font-display text-2xl font-semibold">Available to explore</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {available.map(c => (
              <article key={c.id} className="rounded-tile bg-lilac p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{c.category} · Pilot open</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-body">{c.blurb}</p>
                <Link href={`/courses/${c.id}`} className="mt-5 inline-flex min-h-11 items-center font-semibold text-violet-700 hover:underline">
                  View course →
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {requested.length > 0 && (
        <section className="mt-10" aria-labelledby="catalog-requestable">
          <h2 id="catalog-requestable" className="font-display text-2xl font-semibold">Available on request</h2>
          <p className="mt-2 max-w-2xl text-ink-body">
            Choose a course, tell us what you need, and we'll prepare it for you.
            Select your delivery timeline and see the price before submitting your request.
          </p>
          <div className="mt-5 grid gap-3">
            {requested.map(c => (
              <article key={c.id} className="flex flex-wrap items-center gap-4 rounded-card bg-white p-5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-ink-muted">{c.category} · Prepared on request</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-ink-body">{c.blurb}</p>
                </div>
                <Link href={`/request?course=${encodeURIComponent(c.id)}`}
                  className="inline-flex min-h-12 items-center rounded-full bg-violet px-5 font-bold text-white hover:bg-violet-600">
                  Request →
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {shown.length === 0 && <p role="status" className="mt-8 rounded-card bg-white p-5 text-ink-body">
        No matching courses are listed yet. You can request a course or study resource for your subject below.
      </p>}
      <section className="mt-10 rounded-tile bg-lilac p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold">Looking for something else?</h2>
        <p className="mt-2 max-w-2xl text-ink-body">
          Tell us what you would like to learn or prepare for. We'll create a learning package around your needs.
        </p>
        <Link href="/request" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-violet px-5 font-bold text-white hover:bg-violet-600">
          Request a course or resource →
        </Link>
      </section>
    </>
  );
}
