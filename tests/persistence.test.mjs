import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAppStore } from '../src/store/index.ts';
import {
  lessonStarted,
  positionSaved,
  lessonCompletionChanged,
  setCourseStatus,
} from '../src/store/learningSlice.ts';
import { reviewSaved } from '../src/store/reviewsSlice.ts';
import { diaryEntrySaved } from '../src/store/diarySlice.ts';
import {
  STORAGE_KEY,
  encodeAppData,
  decodeAppData,
  loadAppData,
  startPersistence,
} from '../src/store/persistence.ts';

function filledStore() {
  const store = createAppStore();
  store.dispatch(
    lessonStarted({ courseId: 'balanced-seat', lessonId: 'balanced-seat-1' }),
  );
  store.dispatch(
    positionSaved({
      courseId: 'balanced-seat',
      lessonId: 'balanced-seat-1',
      seconds: 4.2,
      duration: 9,
    }),
  );
  store.dispatch(
    lessonCompletionChanged({
      courseId: 'balanced-seat',
      lessonId: 'balanced-seat-1',
      lessonIds: ['balanced-seat-1', 'balanced-seat-2'],
      completed: true,
    }),
  );
  store.dispatch(
    reviewSaved({
      courseId: 'balanced-seat',
      rating: 4,
      text: 'Helpful',
      updatedAt: '2026-10-31T10:00:00.000Z',
    }),
  );
  store.dispatch(
    diaryEntrySaved({
      id: 'ride-1',
      date: '2026-10-31',
      durationMinutes: 45,
      discipline: 'dressage',
      mood: 'great',
      notes: 'Better rhythm',
      createdAt: '2026-10-31T10:00:00.000Z',
      updatedAt: '2026-10-31T10:00:00.000Z',
    }),
  );
  return store;
}

test('lists, playback, ratings and diary survive a fresh store', () => {
  const before = filledStore().getState();
  const saved = encodeAppData({ ...before, courseCache: ['server data'] });
  assert.equal(saved.includes('server data'), false);
  assert.deepEqual(createAppStore(decodeAppData(saved)).getState(), before);
});

test('corrupt and unsupported snapshots fail without replacing the saved value', async () => {
  const good = JSON.parse(encodeAppData(filledStore().getState()));
  const badStatus = structuredClone(good);
  badStatus.state.learning.statuses['balanced-seat'] = ['in-progress'];
  const badPosition = structuredClone(good);
  badPosition.state.learning.progress['balanced-seat'].positions[
    'balanced-seat-1'
  ] = -2;
  const badDiary = structuredClone(good);
  badDiary.state.diary.entries.push({ ...badDiary.state.diary.entries[0] });
  const badRating = structuredClone(good);
  badRating.state.reviews.byCourse['balanced-seat'].rating = 6;
  for (const raw of [
    'not json',
    '{}',
    JSON.stringify({ ...good, version: 99 }),
    JSON.stringify(badStatus),
    JSON.stringify(badPosition),
    JSON.stringify(badDiary),
    JSON.stringify(badRating),
  ]) {
    let writes = 0;
    const storage = {
      getItem: async () => raw,
      setItem: async () => {
        writes++;
      },
    };
    await assert.rejects(loadAppData(storage));
    assert.equal(writes, 0);
  }
});

test('storage loading finishes before a restored snapshot is written', async (context) => {
  const original = filledStore().getState();
  let finishRead;
  const writes = [];
  const storage = {
    getItem: () =>
      new Promise((resolve) => {
        finishRead = resolve;
      }),
    setItem: async (key, value) => {
      assert.equal(key, STORAGE_KEY);
      writes.push(decodeAppData(value));
    },
  };
  const loading = loadAppData(storage);
  assert.equal(writes.length, 0);
  finishRead(encodeAppData(original));
  const store = createAppStore(await loading);
  const persistence = startPersistence(store, storage);
  context.after(() => persistence.stop());
  await persistence.flush();
  assert.deepEqual(writes[0], original);
});

test('writes are serial and rapid changes keep the newest snapshot', async (context) => {
  const store = createAppStore();
  const writes = [];
  let releaseFirst;
  let active = 0;
  let maximum = 0;
  const storage = {
    getItem: async () => null,
    setItem: async (key, value) => {
      active++;
      maximum = Math.max(maximum, active);
      writes.push(decodeAppData(value));
      if (writes.length === 1)
        await new Promise((resolve) => {
          releaseFirst = resolve;
        });
      active--;
    },
  };
  const persistence = startPersistence(store, storage);
  context.after(() => persistence.stop());
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'watchlist' }),
  );
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'completed' }),
  );
  const flushed = persistence.flush();
  releaseFirst();
  await flushed;
  assert.equal(maximum, 1);
  assert.equal(writes.length, 2);
  assert.equal(writes.at(-1).learning.statuses['balanced-seat'], 'completed');
  persistence.stop();
  store.dispatch(
    setCourseStatus({ courseId: 'balanced-seat', status: 'watchlist' }),
  );
  assert.equal(writes.length, 2);
});

test('a failed save is visible and retry writes the latest state', async (context) => {
  const store = filledStore();
  let fail = true;
  let latest;
  const failures = [];
  const storage = {
    getItem: async () => null,
    setItem: async (key, value) => {
      if (fail) throw new Error('Storage unavailable');
      latest = decodeAppData(value);
    },
  };
  const persistence = startPersistence(store, storage, (failed) =>
    failures.push(failed),
  );
  context.after(() => persistence.stop());
  await persistence.flush();
  assert.equal(failures.at(-1), true);
  store.dispatch(
    setCourseStatus({ courseId: 'first-poles', status: 'watchlist' }),
  );
  await persistence.flush();
  fail = false;
  await persistence.flush();
  assert.equal(failures.at(-1), false);
  assert.deepEqual(latest, store.getState());
});

test('missing storage starts fresh and read failures remain errors', async () => {
  assert.equal(await loadAppData({ getItem: async () => null }), undefined);
  await assert.rejects(
    loadAppData({
      getItem: async () => {
        throw new Error('Read failed');
      },
    }),
    /Read failed/,
  );
});
