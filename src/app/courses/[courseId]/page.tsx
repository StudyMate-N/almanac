import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader, toneBg } from "@/components/site/chrome";
import { PathoPage } from "@/components/site/patho-page";
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
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-20 sm:px-6">
        <p className="text-sm font-bold text-violet-700">
          <Link href="/#courses" className="hover:underline">
            Almanac courses
          </Link>{" "}
          · {c.category}
        </p>
        <div className={`mt-4 rounded-tile p-6 sm:p-10 ${toneBg[c.tone]}`}>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-muted">Prepared on request</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] font-semibold sm:text-[52px]">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-body">{c.blurb}</p>
          <p className="mt-4 max-w-2xl text-ink-body">
            Choose your course materials, delivery method and timeline. We'll prepare a learning package shaped around your goals.
          </p>
          <Link href={`/request?course=${encodeURIComponent(c.id)}`}
            className="mt-6 inline-flex min-h-[52px] items-center rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
            Request this course →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
