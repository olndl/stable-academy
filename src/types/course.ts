export type Discipline = 'dressage' | 'jumping' | 'groundwork' | 'horse-care';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Trainer {
  id: string;
  name: string;
  bio: string;
  disciplines: Discipline[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  videoUrl: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  discipline: Discipline;
  level: CourseLevel;
  imageUrl: string;
  trainer: Trainer;
  lessons: Lesson[];
}
