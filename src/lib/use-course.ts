"use client";

import { useMemo } from "react";
import { cards, cases, courseById, lessons, modules, questions } from "@/content/course";
import { latestByQuestion, scoredAnswers } from "@/lib/progress";
import { useStudent } from "@/lib/store";

const lessonOfQuestion = new Map(questions.map((q) => [q.id, q.lessonId]));

/**
 * Content this student may see (approved, or everything in preview).
 * Pass a course id to scope to one course; omit it for every course.
 * `latest` is every last answer; `scored` is what readiness counts.
 */
export function useCourse(courseId?: string) {
  const { isVisible, isApproved, answers, preview, state, authorizedCourses } = useStudent();
  return useMemo(() => {
    const mods = modules.filter((m) => authorizedCourses.includes(m.courseId) && (!courseId || m.courseId === courseId));
    const inScope = (moduleId: string) => mods.some((m) => m.id === moduleId);
    const vLessons = lessons.filter((l) => inScope(l.moduleId) && isVisible(l.id, l));
    const vQuestions = questions.filter((q) => inScope(q.moduleId) && isVisible(q.id, q));
    const vCards = cards.filter((c) => inScope(c.moduleId) && isVisible(c.id, c));
    const vCases = cases.filter((c) => inScope(c.moduleId) && isVisible(c.id, c));
    const latest = latestByQuestion(answers);
    /** Latest answers that count toward readiness (see scoredAnswers). Use for readiness only. */
    const scored = latestByQuestion(scoredAnswers(answers, state.lessons, (id) => lessonOfQuestion.get(id)));
    const lessonOpen = (id: string) => {
      const l = lessons.find((x) => x.id === id);
      return Boolean(l && inScope(l.moduleId) && isVisible(l.id, l));
    };
    return { course: courseId ? courseById(courseId) : undefined, modules: mods, lessons: vLessons, questions: vQuestions, cards: vCards, cases: vCases, latest, scored, lessonOpen, isApproved, preview };
  }, [courseId, authorizedCourses, isVisible, isApproved, answers, preview, state.lessons]);
}
