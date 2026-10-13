import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader, toneBg } from "@/components/site/chrome";
import { PathoPage } from "@/components/site/patho-page";
import { SignupForm } from "@/components/signup-form";
import { courseById, courses } from "@/content/course";

export const dynamicParams = false;
export const generateStaticParams = () => courses.map((c) => ({ courseId: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const c = courseById((await params).courseId);
  return c ? { title: c.title, description: c.blurb } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const c = courseById((await params).courseId);
  if (!c) notFound();
  if (c.id === "advanced-pathophysiology") return <PathoPage />;

  return (
    <div className="min-h-screen bg-ground text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-20 sm:px-6">
        <p className="text-sm font-bold text-violet-700">
          <Link href="/#courses" className="hover:underline">
            Almanac courses
          </Link>{" "}
          · {c.category}
        </p>
        <div className={`mt-4 rounded-tile p-6 sm:p-10 ${toneBg[c.tone]}`}>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-muted">Coming soon</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] font-semibold sm:text-[52px]">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-body">{c.blurb}</p>
          <div className="mt-6 max-w-xl">
            <p className="mb-2 font-bold">Get an email when it opens.</p>
            <SignupForm courseId={c.id} kind="notify" label="Tell me" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
