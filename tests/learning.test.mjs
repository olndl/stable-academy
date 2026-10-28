import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAppStore } from '../src/store/index.ts';
import { setCourseStatus, removeCourse } from '../src/store/learningSlice.ts';

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
