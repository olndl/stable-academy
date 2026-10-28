import type { CourseLevel, Discipline } from '../../types/course.ts';

export const disciplineLabels: Record<Discipline, string> = {
  dressage: 'Dressage',
  jumping: 'Jumping',
  groundwork: 'Groundwork',
  'horse-care': 'Horse care',
};

export const levelLabels: Record<CourseLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
