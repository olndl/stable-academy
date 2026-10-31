import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isCourseReview } from '../features/reviews/model.ts';
import type { CourseReview } from '../features/reviews/model.ts';
import { isId } from '../utils/validation.ts';

export interface ReviewsState {
  byCourse: Record<string, CourseReview>;
}
const initialState: ReviewsState = { byCourse: {} };
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    reviewSaved(
      state,
      action: PayloadAction<CourseReview & { courseId: string }>,
    ) {
      const { courseId, rating, text, updatedAt } = action.payload;
      if (!isId(courseId) || !isCourseReview({ rating, text, updatedAt }))
        return;
      state.byCourse[courseId] = { rating, text: text.trim(), updatedAt };
    },
    reviewRemoved(state, action: PayloadAction<string>) {
      delete state.byCourse[action.payload];
    },
  },
});
export const { reviewSaved, reviewRemoved } = reviewsSlice.actions;
export const reviewsReducer = reviewsSlice.reducer;
