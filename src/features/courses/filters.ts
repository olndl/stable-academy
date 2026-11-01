import type { Course, CourseLevel, Discipline } from '../../types/course.ts';
import { disciplineLabels, levelLabels } from './labels.ts';

type RouteValue = string | string[] | undefined;

export interface CourseFilterParams {
  q?: RouteValue;
  discipline?: RouteValue;
  level?: RouteValue;
}

export interface CourseFilters {
  q: string;
  discipline: Discipline | '';
  level: CourseLevel | '';
}

function first(value: RouteValue): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export function readCourseFilters(params: CourseFilterParams): CourseFilters {
  const discipline = first(params.discipline);
  const level = first(params.level);
  return {
    q: first(params.q),
    discipline: Object.hasOwn(disciplineLabels, discipline)
      ? (discipline as Discipline)
      : '',
    level: Object.hasOwn(levelLabels, level) ? (level as CourseLevel) : '',
  };
}

export function courseFilterParams(filters: CourseFilters) {
  return {
    q: filters.q || undefined,
    discipline: filters.discipline || undefined,
    level: filters.level || undefined,
  };
}

export function filterCourses(
  courses: Course[],
  filters: CourseFilters,
): Course[] {
  const search = filters.q.trim().toLowerCase();
  return courses.filter((course) => {
    if (filters.discipline && course.discipline !== filters.discipline)
      return false;
    if (filters.level && course.level !== filters.level) return false;
    const text = `${course.title} ${course.description} ${course.trainer.name}`;
    return text.toLowerCase().includes(search);
  });
}
