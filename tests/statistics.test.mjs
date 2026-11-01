import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTrainingStatistics } from '../src/features/statistics/model.ts';
import { createAppStore } from '../src/store/index.ts';
import { diaryEntrySaved, diaryEntryRemoved } from '../src/store/diarySlice.ts';

function ride(
  id,
  date,
  durationMinutes = 30,
  discipline = 'dressage',
  mood = 'okay',
) {
  return {
    id,
    date,
    durationMinutes,
    discipline,
    mood,
    notes: 'Training notes',
    createdAt: '2026-11-01T12:00:00.000Z',
    updatedAt: '2026-11-01T12:00:00.000Z',
  };
}

test('empty statistics include zero weeks and avoid invalid averages', () => {
  const stats = getTrainingStatistics([], 4, '2026-11-01');
  assert.equal(stats.sessions, 0);
  assert.equal(stats.minutes, 0);
  assert.equal(stats.averageMinutes, 0);
  assert.equal(stats.startDate, '2026-10-05');
  assert.deepEqual(
    stats.weeks.map((week) => week.minutes),
    [0, 0, 0, 0],
  );
  assert.equal(stats.disciplines.length, 4);
  assert.equal(stats.moods.length, 3);
});

test('totals, disciplines and moods use the same sessions without mutating entries', () => {
  const entries = Object.freeze([
    Object.freeze(ride('one', '2026-10-06', 45, 'jumping', 'great')),
    Object.freeze(ride('two', '2026-10-25', 30, 'dressage', 'okay')),
    Object.freeze(ride('three', '2026-11-01', 20, 'groundwork', 'tough')),
  ]);
  const stats = getTrainingStatistics(entries, 4, '2026-11-01');
  assert.equal(stats.sessions, 3);
  assert.equal(stats.minutes, 95);
  assert.equal(stats.averageMinutes, 32);
  for (const groups of [stats.weeks, stats.disciplines, stats.moods]) {
    assert.equal(
      groups.reduce((sum, group) => sum + group.sessions, 0),
      3,
    );
    assert.equal(
      groups.reduce((sum, group) => sum + group.minutes, 0),
      95,
    );
  }
  assert.equal(
    stats.disciplines.find((group) => group.id === 'horse-care').minutes,
    0,
  );
  assert.equal(
    stats.disciplines.find((group) => group.id === 'jumping').minutes,
    45,
  );
  assert.deepEqual(
    getTrainingStatistics([...entries].reverse(), 4, '2026-11-01'),
    stats,
  );
});

test('Monday and Sunday boundaries work across years and exclude future dates', () => {
  const stats = getTrainingStatistics(
    [
      ride('old', '2025-12-07'),
      ride('first', '2025-12-08'),
      ride('last', '2026-01-04'),
      ride('future', '2026-01-05'),
    ],
    4,
    '2026-01-04',
  );
  assert.equal(stats.startDate, '2025-12-08');
  assert.deepEqual(
    stats.weeks.map((week) => week.id),
    ['2025-12-08', '2025-12-15', '2025-12-22', '2025-12-29'],
  );
  assert.deepEqual(
    stats.weeks.map((week) => week.sessions),
    [1, 0, 0, 1],
  );
  assert.equal(stats.sessions, 2);
});

test('calendar weeks are stable across time zones and daylight saving changes', (context) => {
  const original = process.env.TZ;
  context.after(() => {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  });
  const entries = [
    ride('before', '2026-03-22'),
    ride('after', '2026-03-29'),
    ride('next-week', '2026-03-30'),
  ];
  process.env.TZ = 'Europe/Berlin';
  const berlin = getTrainingStatistics(entries, 4, '2026-03-29');
  process.env.TZ = 'America/Los_Angeles';
  assert.deepEqual(getTrainingStatistics(entries, 4, '2026-03-29'), berlin);
  assert.deepEqual(
    berlin.weeks.map((week) => week.sessions),
    [0, 0, 1, 1],
  );
});

test('a longer period includes older sessions and the current partial week', () => {
  const entries = [
    ride('older', '2026-09-01', 40),
    ride('current', '2026-10-28', 20),
    ride('tomorrow', '2026-10-29', 60),
  ];
  assert.equal(getTrainingStatistics(entries, 4, '2026-10-28').sessions, 1);
  const stats = getTrainingStatistics(entries, 12, '2026-10-28');
  assert.equal(stats.weeks.length, 12);
  assert.equal(stats.sessions, 2);
  assert.equal(stats.minutes, 60);
  assert.equal(stats.weeks.at(-1).minutes, 20);
  assert.equal(stats.endDate, '2026-10-28');
});

test('editing and deleting a diary entry change its statistics', () => {
  const store = createAppStore();
  const stats = () =>
    getTrainingStatistics(store.getState().diary.entries, 4, '2026-11-01');
  store.dispatch(diaryEntrySaved(ride('one', '2026-10-31', 30)));
  assert.equal(stats().minutes, 30);
  store.dispatch(
    diaryEntrySaved(ride('one', '2026-10-31', 60, 'jumping', 'great')),
  );
  assert.equal(stats().sessions, 1);
  assert.equal(stats().minutes, 60);
  assert.equal(
    stats().disciplines.find((group) => group.id === 'dressage').sessions,
    0,
  );
  assert.equal(stats().moods.find((group) => group.id === 'great').sessions, 1);
  store.dispatch(diaryEntryRemoved('one'));
  assert.equal(stats().sessions, 0);
  assert.equal(stats().minutes, 0);
});
