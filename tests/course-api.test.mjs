import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getCourse,
  getCourses,
  getLesson,
  getTrainer,
  getTrainers,
} from '../src/api/courses.ts';
import { ApiError, request } from '../src/api/request.ts';

function isNotFound(message) {
  return (error) =>
    error instanceof ApiError &&
    error.status === 404 &&
    error.message === message;
}

test('catalog has unique course and lesson ids, all levels and disciplines', async () => {
  const courses = await getCourses();
  assert.equal(courses.length, 6);
  assert.equal(
    new Set(courses.map((course) => course.id)).size,
    courses.length,
  );
  assert.deepEqual(
    new Set(courses.map((course) => course.level)),
    new Set(['beginner', 'intermediate', 'advanced']),
  );
  assert.deepEqual(
    new Set(courses.map((course) => course.discipline)),
    new Set(['dressage', 'jumping', 'groundwork', 'horse-care']),
  );
  const lessons = courses.flatMap((course) => course.lessons);
  assert.equal(lessons.length, 18);
  assert.equal(
    new Set(lessons.map((lesson) => lesson.id)).size,
    lessons.length,
  );
  for (const course of courses) {
    assert.ok(course.trainer.disciplines.includes(course.discipline));
    assert.ok(course.lessons.every((lesson) => lesson.durationSeconds > 0));
  }
});

test('course details and individual lessons agree with the catalog', async () => {
  const [first] = await getCourses();
  assert.deepEqual(await getCourse(first.id), first);
  assert.deepEqual(
    await getLesson(first.id, first.lessons[0].id),
    first.lessons[0],
  );
});

test('all course trainers exist in the trainers API', async () => {
  const trainers = await getTrainers();
  assert.equal(trainers.length, 4);
  for (const course of await getCourses()) {
    assert.deepEqual(await getTrainer(course.trainer.id), course.trainer);
  }
});

test('unknown course returns a typed 404 error', async () => {
  await assert.rejects(getCourse('missing'), isNotFound('Course not found'));
});

test('unknown trainer returns a typed 404 error', async () => {
  await assert.rejects(getTrainer('missing'), isNotFound('Trainer not found'));
});

test('lesson lookup distinguishes missing course from missing lesson', async () => {
  await assert.rejects(
    getLesson('missing', 'missing'),
    isNotFound('Course not found'),
  );
  await assert.rejects(
    getLesson('balanced-seat', 'missing'),
    isNotFound('Lesson not found'),
  );
  await assert.rejects(
    getLesson('first-poles', 'balanced-seat-1'),
    isNotFound('Lesson not found'),
  );
});

test('unknown API path returns 404 instead of reaching the network', async () => {
  await assert.rejects(request('/missing'), isNotFound('Endpoint not found'));
});

test('ids are encoded and cannot add a query or another route', async () => {
  await assert.rejects(
    getCourse('balanced-seat?ignored=true'),
    isNotFound('Course not found'),
  );
  await assert.rejects(
    getCourse('../trainers'),
    isNotFound('Course not found'),
  );
});

test('response changes do not mutate the seed data', async () => {
  const courses = await getCourses();
  const title = courses[0].title;
  courses[0].title = 'Changed by the caller';
  courses[0].lessons.length = 0;
  const fresh = await getCourse(courses[0].id);
  assert.equal(fresh.title, title);
  assert.equal(fresh.lessons.length, 3);
});

test('cancelled queries reject with AbortError', async () => {
  const before = new AbortController();
  before.abort();
  await assert.rejects(getCourses({ signal: before.signal }), {
    name: 'AbortError',
  });
  const during = new AbortController();
  const pending = getCourses({ signal: during.signal });
  during.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('the demo API works without network access', async (context) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error('Network is unavailable');
  };
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  assert.equal((await getCourses()).length, 6);
  assert.equal((await getTrainers()).length, 4);
});
