import { configureStore } from '@reduxjs/toolkit';
import { learningReducer } from './learningSlice.ts';
import type { LearningState } from './learningSlice.ts';
import { reviewsReducer } from './reviewsSlice.ts';
import type { ReviewsState } from './reviewsSlice.ts';
import { diaryReducer } from './diarySlice.ts';
import type { DiaryState } from './diarySlice.ts';

export interface AppData {
  learning: LearningState;
  reviews: ReviewsState;
  diary: DiaryState;
}

export function createAppStore(preloadedState?: AppData) {
  return configureStore({
    reducer: {
      learning: learningReducer,
      reviews: reviewsReducer,
      diary: diaryReducer,
    },
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
