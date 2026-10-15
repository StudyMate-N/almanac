import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
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
  const cover = c.id.includes("pharm") ? "cover-pharmacology.png" : c.id.includes("editing") ? "cover-editing-proofreading.png" : c.id.includes("ai") ? "cover-practical-ai-skills.png" : "cover-on-request.png";

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
        <section className="alm-gradient-lilac mt-4 overflow-hidden rounded-[20px] border border-hairline">
          <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(290px,.9fr)] lg:items-center">
            <div>
              <span className="alm-pill">Prepared on request</span>
              <h1 className="mt-4 text-[35px] leading-[1.05] sm:text-[46px]">{c.title}</h1>
              <p className="mt-4 max-w-[530px] text-[15px] leading-relaxed text-ink-body">{c.blurb}</p>
              <p className="mt-4 max-w-[530px] text-[14px] text-ink-body">Choose the material formats, delivery method and timeline that work for you. See the price before placing your request.</p>
              <Link href={`/request?course=${encodeURIComponent(c.id)}`} className="alm-action mt-6">Request this course →</Link>
              <p className="mt-4 text-[12px] text-ink-muted">Access is issued after approval of a verified payment. Courses are prepared around the learner's request.</p>
            </div>
            <div className="alm-course-media relative aspect-[16/10] border border-hairline">
              <img src={`/almanac-art/${cover}`} alt={`${c.title} course artwork`} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
