"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CaseRunner } from "@/components/case-runner";
import { useCourse } from "@/lib/use-course";

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases } = useCourse();
  const study = cases.find((c) => c.id === caseId);
  if (!study)
    return (
      <>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EEEBF7] bg-white px-4 sm:h-[60px] sm:px-6">
          <Link href="/app/practice" aria-label="Close case" className="grid h-11 w-11 place-items-center rounded-full border border-hairline hover:bg-mist sm:h-10 sm:w-10">
            ✕
          </Link>
          <span className="font-display text-[15px] font-bold">NGN case study</span>
        </header>
        <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 py-6 sm:py-12">
          <div className="grid h-[150px] place-items-center rounded-[16px] border border-hairline bg-white bg-[url('/almanac-art/state-being-prepared.png')] bg-contain bg-center bg-no-repeat" aria-hidden="true" />
          <p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">IN NURSE REVIEW</p>
          <h1 className="font-display text-[24px] leading-tight font-bold tracking-[-.02em] sm:text-[28px]">This case opens once our nurse reviewer approves it</h1>
          <p className="text-[15px] text-ink-body">We check every item and rationale before release.</p>
          <Link href="/app/practice" className="flex h-12 items-center justify-center rounded-[12px] bg-violet font-bold text-white hover:bg-[#4A2DE6]">
            Practise questions instead
          </Link>
        </main>
      </>
    );
  return <CaseRunner study={study} />;
}
