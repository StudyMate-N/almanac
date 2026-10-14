import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";
import { CourseCatalog } from "@/components/site/course-catalog";
import { courses } from "@/content/course";

export const metadata: Metadata = {
  title: "Courses & Resources",
  description: "Explore Almanac learning courses and request study resources prepared around your goals.",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-8 sm:px-6">
        <p className="text-sm font-semibold text-violet-700">EXPLORE ALMANAC</p>
        <h1 className="mt-3 max-w-3xl font-display text-[40px] font-semibold leading-tight sm:text-[52px]">
          What would you like to learn?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-body">
          Find a course, prepare for an exam, or explore resources for something you're working on.
        </p>
        <CourseCatalog courses={courses} />
      </main>
      <SiteFooter />
    </div>
  );
}
