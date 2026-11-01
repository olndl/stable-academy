import assert from 'node:assert/strict';
import { test } from 'node:test';
import { courses } from '../src/mocks/data/courses.ts';
import {
  getCourseProgress,
  getResumeLesson,
  formatTime,
} from '../src/features/learning/progress.ts';

test('progress counts existing lessons once and handles an empty course', () => {
  const course = courses[0];
  assert.deepEqual(
    getCourseProgress(course, [
      course.lessons[0].id,
      course.lessons[0].id,
      'missing',
    ]),
    { completed: 1, total: 3, percent: 33 },
  );
  assert.deepEqual(getCourseProgress({ ...course, lessons: [] }), {
    completed: 0,
    total: 0,
    percent: 0,
  });
});

test('resume returns the current unfinished lesson, then the next unfinished one, then nothing', () => {
  const course = courses[0];
  const [first, second] = course.lessons;
  assert.equal(getResumeLesson(course, [], second.id), second);
  assert.equal(getResumeLesson(course, [first.id], first.id), second);
  assert.equal(
    getResumeLesson(
      course,
      course.lessons.map((lesson) => lesson.id),
      first.id,
    ),
    undefined,
  );
});

test('time labels handle seconds, minutes and invalid values', () => {
  assert.equal(formatTime(8.64), '0:09');
  assert.equal(formatTime(75), '1:15');
  assert.equal(formatTime(NaN), '0:00');
  assert.equal(formatTime(-1), '0:00');
});
