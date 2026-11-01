import { localDate, moodLabels } from '../diary/model.ts';
import type { DiaryEntry } from '../diary/model.ts';
import { disciplineLabels } from '../courses/labels.ts';

export type StatisticsPeriod = 4 | 12;
const DAY = 24 * 60 * 60 * 1000;
const formatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

interface TrainingBucket {
  id: string;
  label: string;
  sessions: number;
  minutes: number;
}

function monday(time: number) {
  return time - ((new Date(time).getUTCDay() + 6) % 7) * DAY;
}

function isoDate(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

export function getTrainingStatistics(
  entries: readonly DiaryEntry[],
  period: StatisticsPeriod = 4,
  today = localDate(),
) {
  const end = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(end)) throw new Error('Invalid statistics date');
  const start = monday(end) - (period - 1) * 7 * DAY;
  const weeks: TrainingBucket[] = Array.from({ length: period }, (_, index) => {
    const first = start + index * 7 * DAY;
    const last = Math.min(first + 6 * DAY, end);
    return {
      id: isoDate(first),
      label: `${formatter.format(first)} – ${formatter.format(last)}`,
      sessions: 0,
      minutes: 0,
    };
  });
  const disciplines: TrainingBucket[] = Object.entries(disciplineLabels).map(
    ([id, label]) => ({ id, label, sessions: 0, minutes: 0 }),
  );
  const moods: TrainingBucket[] = Object.entries(moodLabels).map(
    ([id, label]) => ({ id, label, sessions: 0, minutes: 0 }),
  );
  const byWeek = new Map(weeks.map((bucket) => [bucket.id, bucket]));
  const byDiscipline = new Map(
    disciplines.map((bucket) => [bucket.id, bucket]),
  );
  const byMood = new Map(moods.map((bucket) => [bucket.id, bucket]));
  let sessions = 0;
  let minutes = 0;

  for (const entry of entries) {
    const time = Date.parse(`${entry.date}T00:00:00Z`);
    if (
      !Number.isFinite(time) ||
      time < start ||
      time > end ||
      isoDate(time) !== entry.date ||
      !Number.isFinite(entry.durationMinutes) ||
      entry.durationMinutes <= 0
    )
      continue;
    const week = byWeek.get(isoDate(monday(time)));
    const discipline = byDiscipline.get(entry.discipline);
    const mood = byMood.get(entry.mood);
    if (!week || !discipline || !mood) continue;
    for (const bucket of [week, discipline, mood]) {
      bucket.sessions++;
      bucket.minutes += entry.durationMinutes;
    }
    sessions++;
    minutes += entry.durationMinutes;
  }

  return {
    startDate: isoDate(start),
    endDate: today,
    sessions,
    minutes,
    averageMinutes: sessions ? Math.round(minutes / sessions) : 0,
    weeks,
    disciplines,
    moods,
  };
}
