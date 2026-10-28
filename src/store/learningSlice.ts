import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CourseStatus = 'watchlist' | 'in-progress' | 'completed';
export const statusLabels: Record<CourseStatus, string> = {
  watchlist: 'Want to watch',
  'in-progress': 'In progress',
  completed: 'Completed',
};

interface LearningState {
  statuses: Partial<Record<string, CourseStatus>>;
}

const initialState: LearningState = { statuses: {} };
const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setCourseStatus(
      state,
      action: PayloadAction<{ courseId: string; status: CourseStatus }>,
    ) {
      state.statuses[action.payload.courseId] = action.payload.status;
    },
    removeCourse(state, action: PayloadAction<string>) {
      delete state.statuses[action.payload];
    },
  },
});

export const { setCourseStatus, removeCourse } = learningSlice.actions;
export const learningReducer = learningSlice.reducer;
