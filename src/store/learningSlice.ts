import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CourseStatus = 'watchlist' | 'in-progress' | 'completed';
export const statusLabels: Record<CourseStatus, string> = {
  watchlist: 'Want to watch',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export interface CourseProgressState {
  completedLessonIds: string[];
  positions: Record<string, number>;
}

interface LessonRef {
  courseId: string;
  lessonId: string;
}
interface LearningState {
  statuses: Partial<Record<string, CourseStatus>>;
  progress: Partial<Record<string, CourseProgressState>>;
  lastWatched: LessonRef | null;
}

const initialState: LearningState = {
  statuses: {},
  progress: {},
  lastWatched: null,
};

function courseProgress(state: LearningState, courseId: string) {
  state.progress[courseId] ??= { completedLessonIds: [], positions: {} };
  return state.progress[courseId]!;
}

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setCourseStatus(
      state,
      action: PayloadAction<{
        courseId: string;
        status: CourseStatus;
        lessonIds?: string[];
      }>,
    ) {
      const { courseId, status, lessonIds } = action.payload;
      state.statuses[courseId] = status;
      if (status === 'completed' && lessonIds) {
        courseProgress(state, courseId).completedLessonIds = [
          ...new Set(lessonIds),
        ];
      }
    },
    removeCourse(state, action: PayloadAction<string>) {
      delete state.statuses[action.payload];
      delete state.progress[action.payload];
      if (state.lastWatched?.courseId === action.payload)
        state.lastWatched = null;
    },
    lessonStarted(state, action: PayloadAction<LessonRef>) {
      const { courseId } = action.payload;
      courseProgress(state, courseId);
      if (state.statuses[courseId] !== 'completed')
        state.statuses[courseId] = 'in-progress';
      state.lastWatched = action.payload;
    },
    positionSaved(
      state,
      action: PayloadAction<LessonRef & { seconds: number; duration: number }>,
    ) {
      const { courseId, lessonId, seconds, duration } = action.payload;
      if (!state.statuses[courseId]) return;
      if (
        !Number.isFinite(seconds) ||
        seconds < 0 ||
        !Number.isFinite(duration) ||
        duration <= 0
      )
        return;
      courseProgress(state, courseId).positions[lessonId] = Math.min(
        seconds,
        duration,
      );
    },
    lessonCompletionChanged(
      state,
      action: PayloadAction<
        LessonRef & { lessonIds: string[]; completed: boolean }
      >,
    ) {
      const { courseId, lessonId, lessonIds, completed } = action.payload;
      if (!lessonIds.includes(lessonId)) return;
      const progress = courseProgress(state, courseId);
      const ids = new Set(
        progress.completedLessonIds.filter((id) => lessonIds.includes(id)),
      );
      if (completed) ids.add(lessonId);
      else ids.delete(lessonId);
      progress.completedLessonIds = [...ids];
      state.statuses[courseId] =
        lessonIds.length > 0 && lessonIds.every((id) => ids.has(id))
          ? 'completed'
          : 'in-progress';
    },
  },
});

export const {
  setCourseStatus,
  removeCourse,
  lessonStarted,
  positionSaved,
  lessonCompletionChanged,
} = learningSlice.actions;
export const learningReducer = learningSlice.reducer;
