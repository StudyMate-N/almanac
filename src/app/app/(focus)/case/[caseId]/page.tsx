"use client";

import { useParams } from "next/navigation";
import { CaseRunner } from "@/components/case-runner";
import { useCourse } from "@/lib/use-course";

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases } = useCourse();
  const study = cases.find((c) => c.id === caseId);
  if (!study) return <p className="mx-auto max-w-2xl p-8 text-ink-body">This case opens once our nurse reviewer approves it.</p>;
  return <CaseRunner study={study} />;
}
