import { isRecord, isTimestamp } from '../../utils/validation.ts';

export interface CourseReview {
  rating: number;
  text: string;
  updatedAt: string;
}

export function validateReview(rating: number, text: string) {
  const errors: { rating?: string; text?: string } = {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    errors.rating = 'Choose a rating from 1 to 5.';
  if (text.trim().length > 500)
    errors.text = 'Keep your review under 501 characters.';
  return errors;
}

export function isCourseReview(value: unknown): value is CourseReview {
  return (
    isRecord(value) &&
    typeof value.rating === 'number' &&
    typeof value.text === 'string' &&
    Object.keys(validateReview(value.rating, value.text)).length === 0 &&
    isTimestamp(value.updatedAt)
  );
}
