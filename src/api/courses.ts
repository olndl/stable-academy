import type { Course, Lesson, Trainer } from '../types/course.ts';
import { request } from './request.ts';
import type { RequestOptions } from './request.ts';

export function getCourses(options?: RequestOptions): Promise<Course[]> {
  return request('/courses', options);
}

export function getCourse(
  courseId: string,
  options?: RequestOptions,
): Promise<Course> {
  return request(`/courses/${encodeURIComponent(courseId)}`, options);
}

export function getLesson(
  courseId: string,
  lessonId: string,
  options?: RequestOptions,
): Promise<Lesson> {
  return request(
    `/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`,
    options,
  );
}

export function getTrainers(options?: RequestOptions): Promise<Trainer[]> {
  return request('/trainers', options);
}

export function getTrainer(
  trainerId: string,
  options?: RequestOptions,
): Promise<Trainer> {
  return request(`/trainers/${encodeURIComponent(trainerId)}`, options);
}
