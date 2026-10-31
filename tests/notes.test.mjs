import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAppStore } from '../src/store/index.ts';
import { reviewSaved, reviewRemoved } from '../src/store/reviewsSlice.ts';
import { diaryEntrySaved, diaryEntryRemoved } from '../src/store/diarySlice.ts';
import { validateReview } from '../src/features/reviews/model.ts';
import { localDate, parseDiaryInput } from '../src/features/diary/model.ts';

const now = '2026-10-31T10:00:00.000Z';
const input = {
  date: '2026-10-31',
  durationMinutes: '45',
  discipline: 'dressage',
  mood: 'okay',
  notes: 'Steadier transitions today.',
};
const entry = {
  id: 'ride-1',
  date: input.date,
  durationMinutes: 45,
  discipline: 'dressage',
  mood: 'okay',
  notes: input.notes,
  createdAt: now,
  updatedAt: now,
};

test('ratings require a whole number from one to five and accept a rating without text', () => {
  for (const rating of [0, 6, -1, 1.5, NaN])
    assert.ok(validateReview(rating, '').rating);
  assert.deepEqual(validateReview(1, ''), {});
  assert.deepEqual(validateReview(5, 'Useful exercises.'), {});
  assert.ok(validateReview(4, 'a'.repeat(501)).text);
});

test('editing a review replaces one review, deletion leaves other courses alone', () => {
  const store = createAppStore();
  store.dispatch(
    reviewSaved({
      courseId: 'balanced-seat',
      rating: 4,
      text: '  Helpful  ',
      updatedAt: now,
    }),
  );
  store.dispatch(
    reviewSaved({
      courseId: 'first-poles',
      rating: 3,
      text: '',
      updatedAt: now,
    }),
  );
  store.dispatch(
    reviewSaved({
      courseId: 'balanced-seat',
      rating: 5,
      text: 'Clear examples',
      updatedAt: now,
    }),
  );
  store.dispatch(
    reviewSaved({
      courseId: 'balanced-seat',
      rating: 99,
      text: 'Bad payload',
      updatedAt: now,
    }),
  );
  assert.equal(store.getState().reviews.byCourse['balanced-seat'].rating, 5);
  assert.equal(Object.keys(store.getState().reviews.byCourse).length, 2);
  store.dispatch(reviewRemoved('balanced-seat'));
  assert.deepEqual(Object.keys(store.getState().reviews.byCourse), [
    'first-poles',
  ]);
});

test('diary values are normalised and dates use local calendar components', () => {
  const result = parseDiaryInput(
    { ...input, durationMinutes: ' 45 ', notes: '  Better balance.  ' },
    '2026-10-31',
  );
  assert.equal(result.ok, true);
  assert.equal(result.value.durationMinutes, 45);
  assert.equal(result.value.notes, 'Better balance.');
  assert.equal(localDate(new Date(2026, 9, 31, 23, 30)), '2026-10-31');
});

test('diary rejects impossible dates and future sessions, but accepts leap days', () => {
  for (const date of [
    '2026-02-29',
    '2026-04-31',
    '2026-13-01',
    '31/10/2026',
    '2026-11-01',
  ]) {
    const result = parseDiaryInput({ ...input, date }, '2026-10-31');
    assert.equal(result.ok, false);
    assert.ok(result.errors.date);
  }
  assert.equal(
    parseDiaryInput({ ...input, date: '2024-02-29' }, '2026-10-31').ok,
    true,
  );
});

test('diary validates duration, notes and choices together', () => {
  for (const durationMinutes of ['', '0', '-1', '1.5', '601', '1e2']) {
    const result = parseDiaryInput({ ...input, durationMinutes }, '2026-10-31');
    assert.equal(result.ok, false);
    assert.ok(result.errors.durationMinutes);
  }
  const result = parseDiaryInput(
    { ...input, notes: ' ', discipline: 'constructor', mood: 'missing' },
    '2026-10-31',
  );
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors).sort(), [
    'discipline',
    'mood',
    'notes',
  ]);
  assert.equal(
    parseDiaryInput({ ...input, notes: 'a'.repeat(1001) }, '2026-10-31').ok,
    false,
  );
  assert.equal(
    parseDiaryInput(
      { ...input, durationMinutes: '600', notes: 'a'.repeat(1000) },
      '2026-10-31',
    ).ok,
    true,
  );
});

test('diary edits preserve creation time and do not create duplicate entries', () => {
  const store = createAppStore();
  store.dispatch(diaryEntrySaved(entry));
  store.dispatch(diaryEntrySaved({ ...entry, id: 'ride-2' }));
  store.dispatch(
    diaryEntrySaved({
      ...entry,
      notes: 'Updated notes',
      durationMinutes: 60,
      createdAt: '2026-10-31T12:00:00.000Z',
      updatedAt: '2026-10-31T12:00:00.000Z',
    }),
  );
  assert.equal(store.getState().diary.entries.length, 2);
  assert.equal(store.getState().diary.entries[0].createdAt, now);
  assert.equal(store.getState().diary.entries[0].durationMinutes, 60);
  store.dispatch(diaryEntrySaved({ ...entry, durationMinutes: -1 }));
  assert.equal(store.getState().diary.entries[0].durationMinutes, 60);
  store.dispatch(diaryEntryRemoved('ride-1'));
  assert.deepEqual(
    store.getState().diary.entries.map((ride) => ride.id),
    ['ride-2'],
  );
});
