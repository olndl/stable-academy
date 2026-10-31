import type { AppData } from './index.ts';
import { isId, isRecord } from '../utils/validation.ts';
import { isCourseReview } from '../features/reviews/model.ts';
import { isDiaryEntry } from '../features/diary/model.ts';

export const STORAGE_KEY = 'stable-academy:user-data';
export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

function assert(condition: unknown): asserts condition {
  if (!condition) throw new Error('Saved data could not be read.');
}

export function encodeAppData(state: AppData) {
  return JSON.stringify({
    version: 1,
    state: {
      learning: state.learning,
      reviews: state.reviews,
      diary: state.diary,
    },
  });
}

export function decodeAppData(raw: string): AppData {
  const envelope: unknown = JSON.parse(raw);
  assert(
    isRecord(envelope) && envelope.version === 1 && isRecord(envelope.state),
  );
  const state = envelope.state;
  const learning = state.learning;
  assert(
    isRecord(learning) &&
      isRecord(learning.statuses) &&
      isRecord(learning.progress),
  );
  for (const [id, status] of Object.entries(learning.statuses)) {
    assert(
      isId(id) &&
        typeof status === 'string' &&
        ['watchlist', 'in-progress', 'completed'].includes(status),
    );
  }
  for (const [id, progress] of Object.entries(learning.progress)) {
    assert(
      isId(id) && Object.hasOwn(learning.statuses, id) && isRecord(progress),
    );
    assert(
      Array.isArray(progress.completedLessonIds) &&
        progress.completedLessonIds.every(isId),
    );
    assert(
      new Set(progress.completedLessonIds).size ===
        progress.completedLessonIds.length && isRecord(progress.positions),
    );
    for (const [lessonId, position] of Object.entries(progress.positions))
      assert(
        isId(lessonId) &&
          typeof position === 'number' &&
          Number.isFinite(position) &&
          position >= 0,
      );
  }
  const last = learning.lastWatched;
  assert(
    last === null ||
      (isRecord(last) &&
        isId(last.courseId) &&
        isId(last.lessonId) &&
        Object.hasOwn(learning.statuses, last.courseId)),
  );
  assert(isRecord(state.reviews) && isRecord(state.reviews.byCourse));
  for (const [id, review] of Object.entries(state.reviews.byCourse))
    assert(isId(id) && isCourseReview(review));
  assert(
    isRecord(state.diary) &&
      Array.isArray(state.diary.entries) &&
      state.diary.entries.every(isDiaryEntry),
  );
  assert(
    new Set(state.diary.entries.map((entry) => entry.id)).size ===
      state.diary.entries.length,
  );
  return {
    learning,
    reviews: state.reviews,
    diary: state.diary,
  } as unknown as AppData;
}

export async function loadAppData(storage: StorageDriver) {
  const raw = await storage.getItem(STORAGE_KEY);
  return raw === null ? undefined : decodeAppData(raw);
}

interface PersistedStore {
  getState(): AppData;
  subscribe(listener: () => void): () => void;
}

export function startPersistence(
  store: PersistedStore,
  storage: StorageDriver,
  onError: (failed: boolean) => void = () => {},
) {
  let previous = store.getState();
  let pending: string | null = encodeAppData(previous);
  let task: Promise<void> | null = null;
  let active = true;

  function flush(): Promise<void> {
    if (task) return task;
    if (pending === null) return Promise.resolve();
    let failed = false;
    task = (async () => {
      while (pending !== null) {
        const snapshot = pending;
        pending = null;
        try {
          await storage.setItem(STORAGE_KEY, snapshot);
          if (active) onError(false);
        } catch {
          failed = true;
          pending ??= snapshot;
          if (active) onError(true);
          break;
        }
      }
    })().finally(() => {
      task = null;
      if (pending !== null && !failed) return flush();
    });
    return task;
  }

  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if (state === previous) return;
    previous = state;
    pending = encodeAppData(state);
    void flush();
  });
  void flush();
  return {
    flush,
    stop() {
      active = false;
      unsubscribe();
    },
  };
}
