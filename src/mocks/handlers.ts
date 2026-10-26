import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../api/config.ts';
import { courses } from './data/courses.ts';
import { trainers } from './data/trainers.ts';

export const handlers = [
  http.get(`${API_BASE_URL}/courses`, () => HttpResponse.json(courses)),
  http.get(`${API_BASE_URL}/courses/:courseId`, ({ params }) => {
    const course = courses.find((item) => item.id === params.courseId);
    return course
      ? HttpResponse.json(course)
      : HttpResponse.json({ message: 'Course not found' }, { status: 404 });
  }),
  http.get(
    `${API_BASE_URL}/courses/:courseId/lessons/:lessonId`,
    ({ params }) => {
      const course = courses.find((item) => item.id === params.courseId);
      if (!course) {
        return HttpResponse.json(
          { message: 'Course not found' },
          { status: 404 },
        );
      }
      const lesson = course.lessons.find((item) => item.id === params.lessonId);
      return lesson
        ? HttpResponse.json(lesson)
        : HttpResponse.json({ message: 'Lesson not found' }, { status: 404 });
    },
  ),
  http.get(`${API_BASE_URL}/trainers`, () => HttpResponse.json(trainers)),
  http.get(`${API_BASE_URL}/trainers/:trainerId`, ({ params }) => {
    const trainer = trainers.find((item) => item.id === params.trainerId);
    return trainer
      ? HttpResponse.json(trainer)
      : HttpResponse.json({ message: 'Trainer not found' }, { status: 404 });
  }),
  http.all(`${API_BASE_URL}/*`, () =>
    HttpResponse.json({ message: 'Endpoint not found' }, { status: 404 }),
  ),
];
