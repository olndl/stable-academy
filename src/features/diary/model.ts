import type { Discipline } from '../../types/course.ts';
import { disciplineLabels } from '../courses/labels.ts';
import { isId, isRecord, isTimestamp } from '../../utils/validation.ts';

export const moodLabels = { great: 'Great', okay: 'Okay', tough: 'Tough' };
export type Mood = keyof typeof moodLabels;
export interface DiaryInput {
  date: string;
  durationMinutes: string;
  discipline: string;
  mood: string;
  notes: string;
}
export interface DiaryValues {
  date: string;
  durationMinutes: number;
  discipline: Discipline;
  mood: Mood;
  notes: string;
}
export interface DiaryEntry extends DiaryValues {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export type DiaryErrors = Partial<Record<keyof DiaryInput, string>>;

export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function defaultDiaryInput(): DiaryInput {
  return {
    date: localDate(),
    durationMinutes: '',
    discipline: 'dressage',
    mood: 'okay',
    notes: '',
  };
}

export function parseDiaryInput(
  input: DiaryInput,
  today = localDate(),
): { ok: true; value: DiaryValues } | { ok: false; errors: DiaryErrors } {
  const errors: DiaryErrors = {};
  const date = input.date.trim();
  const time = Date.parse(`${date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== date
  )
    errors.date = 'Enter a valid date as YYYY-MM-DD.';
  else if (date > today) errors.date = 'Training date cannot be in the future.';
  const duration = input.durationMinutes.trim();
  const minutes = Number(duration);
  if (!/^\d+$/.test(duration) || minutes < 1 || minutes > 600)
    errors.durationMinutes = 'Enter a whole number from 1 to 600 minutes.';
  if (!Object.hasOwn(disciplineLabels, input.discipline))
    errors.discipline = 'Choose a discipline.';
  if (!Object.hasOwn(moodLabels, input.mood))
    errors.mood = 'Choose how the session felt.';
  const notes = input.notes.trim();
  if (!notes) errors.notes = 'Add a few notes about your training.';
  else if (notes.length > 1000)
    errors.notes = 'Keep your notes under 1001 characters.';
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      date,
      durationMinutes: minutes,
      discipline: input.discipline as Discipline,
      mood: input.mood as Mood,
      notes,
    },
  };
}

export function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isTimestamp(value.createdAt) ||
    !isTimestamp(value.updatedAt) ||
    typeof value.date !== 'string' ||
    typeof value.durationMinutes !== 'number' ||
    typeof value.discipline !== 'string' ||
    typeof value.mood !== 'string' ||
    typeof value.notes !== 'string'
  )
    return false;
  return parseDiaryInput(
    {
      date: value.date,
      durationMinutes: String(value.durationMinutes),
      discipline: value.discipline,
      mood: value.mood,
      notes: value.notes,
    },
    '9999-12-31',
  ).ok;
}
