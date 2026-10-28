import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAppStore } from '../src/store/index.ts';
import {
  setCourseStatus,
  removeCourse,
  lessonStarted,
  positionSaved,
  lessonCompletionChanged,
} from '../src/store/learningSlice.ts';

test('moving a course replaces its list without duplicating it', () => {
  const store = createAppStore();
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'watchlist' }),
  );
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'in-progress' }),
  );
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'completed' }),
  );
  assert.deepEqual(store.getState().learning.statuses, {
    'balanced-seat': 'completed',
  });
});

test('removing a course leaves other saved courses alone', () => {
  const store = createAppStore();
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'watchlist' }),
  );
  store.dispatch(
    setCourseStatus({ courseId: 'first-poles', status: 'in-progress' }),
  );
  store.dispatch(removeCourse('balanced-seat'));
  store.dispatch(removeCourse('missing'));
  assert.deepEqual(store.getState().learning.statuses, {
    'first-poles': 'in-progress',
  });
});

test('starting playback moves a saved course to in progress and remembers the lesson', () => {
  const store = createAppStore();
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'watchlist' }),
  );
  store.dispatch(
    lessonStarted({ courseId: 'balanced-seat', lessonId: 'balanced-seat-1' }),
  );
  assert.equal(
    store.getState().learning.statuses['balanced-seat'],
    'in-progress',
  );
  assert.deepEqual(store.getState().learning.lastWatched, {
    courseId: 'balanced-seat',
    lessonId: 'balanced-seat-1',
  });
});

test('completion is unique, finishing every lesson completes the course, undo reopens it', () => {
  const store = createAppStore();
  const lessonIds = ['one', 'two', 'three'];
  const change = (lessonId, completed) =>
    store.dispatch(
      lessonCompletionChanged({
        courseId: 'course',
        lessonId,
        lessonIds,
        completed,
      }),
    );
  change('one', true);
  change('one', true);
  assert.deepEqual(
    store.getState().learning.progress.course.completedLessonIds,
    ['one'],
  );
  assert.equal(store.getState().learning.statuses.course, 'in-progress');
  change('two', true);
  change('three', true);
  assert.equal(store.getState().learning.statuses.course, 'completed');
  change('two', false);
  assert.equal(store.getState().learning.statuses.course, 'in-progress');
  assert.deepEqual(
    store.getState().learning.progress.course.completedLessonIds,
    ['one', 'three'],
  );
});

test('unknown lesson completion is ignored', () => {
  const store = createAppStore();
  store.dispatch(
    lessonCompletionChanged({
      courseId: 'course',
      lessonId: 'missing',
      lessonIds: ['one'],
      completed: true,
    }),
  );
  assert.deepEqual(store.getState().learning.progress, {});
});

test('positions are bounded and invalid playback times cannot enter the store', () => {
  const store = createAppStore();
  store.dispatch(lessonStarted({ courseId: 'course', lessonId: 'one' }));
  const save = (seconds, duration = 10) =>
    store.dispatch(
      positionSaved({ courseId: 'course', lessonId: 'one', seconds, duration }),
    );
  save(3.5);
  assert.equal(store.getState().learning.progress.course.positions.one, 3.5);
  for (const value of [-1, NaN, Infinity]) save(value);
  save(5, NaN);
  assert.equal(store.getState().learning.progress.course.positions.one, 3.5);
  save(99);
  assert.equal(store.getState().learning.progress.course.positions.one, 10);
});

test('manual course completion marks its lessons, rewatching keeps completed progress', () => {
  const store = createAppStore();
  store.dispatch(
    setCourseStatus({
      courseId: 'course',
      status: 'completed',
      lessonIds: ['one', 'two', 'one'],
    }),
  );
  store.dispatch(lessonStarted({ courseId: 'course', lessonId: 'one' }));
  assert.deepEqual(
    store.getState().learning.progress.course.completedLessonIds,
    ['one', 'two'],
  );
  assert.equal(store.getState().learning.statuses.course, 'completed');
});

test('removing a course clears its resume target and ignores late player events', () => {
  const store = createAppStore();
  store.dispatch(lessonStarted({ courseId: 'course', lessonId: 'one' }));
  store.dispatch(removeCourse('course'));
  store.dispatch(
    positionSaved({
      courseId: 'course',
      lessonId: 'one',
      seconds: 5,
      duration: 10,
    }),
  );
  assert.equal(store.getState().learning.lastWatched, null);
  assert.deepEqual(store.getState().learning.progress, {});
});
