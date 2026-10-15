import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { RequestBuilder } from "@/components/site/request-builder";
import { courses } from "@/content/course";

export const metadata: Metadata = {
  title: "Request a Course or Study Resource",
  description: "Choose your materials, delivery method and timeline. See the price before submitting your Almanac learning request.",
};

export default async function RequestPage({ searchParams }: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: requested } = await searchParams;
  const course = courses.find(c => c.id === requested);
  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1040px] px-4 pb-24 pt-8 sm:px-6">
        <p className="alm-eyebrow">Custom learning</p>
        <h1 className="mt-3 max-w-3xl font-display text-[36px] font-bold leading-[1.06] sm:text-[46px]">
          Tell us what you need. We will prepare it for you.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-body">
          Choose your materials, shape your learning experience, and select when you need it.
          Your package and price stay clear from the start.
        </p>
        <RequestBuilder initialCourseId={course?.id ?? null} initialSubject={course?.title ?? ""} />
      </main>
      <SiteFooter />
    </div>
  );
}
