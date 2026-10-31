import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import { ChoiceGroup, Field } from '../../components/FormFields';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { reviewRemoved, reviewSaved } from '../../store/reviewsSlice';
import { styles } from '../../styles';
import { validateReview } from './model';

const ratings = [1, 2, 3, 4, 5].map((value) => ({
  value,
  label: String(value),
}));

export function CourseReview({ courseId }: { courseId: string }) {
  const dispatch = useAppDispatch();
  const review = useAppSelector((state) => state.reviews.byCourse[courseId]);
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [text, setText] = useState(review?.text ?? '');
  const [editing, setEditing] = useState(!review);
  const [errors, setErrors] = useState<ReturnType<typeof validateReview>>({});

  function save() {
    const nextErrors = validateReview(rating, text);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    dispatch(
      reviewSaved({
        courseId,
        rating,
        text,
        updatedAt: new Date().toISOString(),
      }),
    );
    Keyboard.dismiss();
    setEditing(false);
  }

  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.subtitle}>
        Your rating
      </Text>
      {review && !editing ? (
        <>
          <Text accessibilityLiveRegion="polite" style={styles.text}>
            {review.rating} / 5
          </Text>
          {Boolean(review.text) && (
            <Text style={styles.text}>{review.text}</Text>
          )}
          <ActionButton
            label="Edit review"
            onPress={() => {
              setRating(review.rating);
              setText(review.text);
              setErrors({});
              setEditing(true);
            }}
          />
          <ActionButton
            label="Delete review"
            onPress={() => {
              dispatch(reviewRemoved(courseId));
              setRating(0);
              setText('');
              setErrors({});
              setEditing(true);
            }}
          />
        </>
      ) : (
        <>
          <ChoiceGroup
            label="Rating"
            options={ratings}
            value={rating}
            onChange={(value) => {
              setRating(value);
              setErrors({});
            }}
            error={errors.rating}
          />
          <Field
            label="Short review (optional)"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            placeholder="What was useful?"
            error={errors.text}
          />
          <Text style={styles.text}>{text.length}/500</Text>
          <ActionButton label="Save review" onPress={save} />
          {review && (
            <ActionButton
              label="Cancel review editing"
              onPress={() => {
                setEditing(false);
                Keyboard.dismiss();
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
