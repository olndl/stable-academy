import type { Course } from '../../types/course.ts';

export function getCourseProgress(course: Course, completedIds: string[] = []) {
  const ids = new Set(completedIds);
  const total = course.lessons.length;
  const completed = course.lessons.filter((lesson) =>
    ids.has(lesson.id),
  ).length;
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getResumeLesson(
  course: Course,
  completedIds: string[],
  lastLessonId: string,
) {
  const remaining = course.lessons.filter(
    (lesson) => !completedIds.includes(lesson.id),
  );
  return remaining.find((lesson) => lesson.id === lastLessonId) ?? remaining[0];
}

export function formatTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
