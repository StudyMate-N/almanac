"use client";

import { useMemo } from "react";
import { cards, cases, courseById, lessons, modules, questions } from "@/content/course";
import { latestByQuestion } from "@/lib/progress";
import { useStudent } from "@/lib/store";

/**
 * Content this student may see (approved, or everything in preview).
 * Pass a course id to scope to one course; omit it for every course.
 */
export function useCourse(courseId?: string) {
  const { isVisible, isApproved, answers, preview } = useStudent();
  return useMemo(() => {
    const mods = courseId ? modules.filter((m) => m.courseId === courseId) : modules;
    const inScope = (moduleId: string) => !courseId || mods.some((m) => m.id === moduleId);
    const vLessons = lessons.filter((l) => inScope(l.moduleId) && (!l.summary || isVisible(l.id, l)));
    const vQuestions = questions.filter((q) => inScope(q.moduleId) && isVisible(q.id, q));
    const vCards = cards.filter((c) => inScope(c.moduleId) && isVisible(c.id, c));
    const vCases = cases.filter((c) => inScope(c.moduleId) && isVisible(c.id, c));
    const latest = latestByQuestion(answers);
    const lessonOpen = (id: string) => {
      const l = lessons.find((x) => x.id === id);
      return Boolean(l && l.summary && isVisible(l.id, l));
    };
    return { course: courseId ? courseById(courseId) : undefined, modules: mods, lessons: vLessons, questions: vQuestions, cards: vCards, cases: vCases, latest, lessonOpen, isApproved, preview };
  }, [courseId, isVisible, isApproved, answers, preview]);
}
