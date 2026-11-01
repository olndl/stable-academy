import { expect, test } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import DiaryScreen from '../../src/app/(tabs)/diary';
import { CourseProgress } from '../../src/features/learning/CourseProgress';
import { CourseStatusControls } from '../../src/features/learning/CourseStatusControls';
import { courses } from '../../src/mocks/data/courses';
import { createAppStore } from '../../src/store';

test('a rider fixes validation errors, saves a training and edits it without a duplicate', async () => {
  const user = userEvent.setup();
  await render(
    <Provider store={createAppStore()}>
      <DiaryScreen />
    </Provider>,
  );

  await user.press(screen.getByRole('button', { name: 'Save training' }));
  expect(
    screen.getByText('Enter a whole number from 1 to 600 minutes.'),
  ).toBeOnTheScreen();
  expect(
    screen.getByText('Add a few notes about your training.'),
  ).toBeOnTheScreen();

  const date = screen.getByLabelText('Date (YYYY-MM-DD)');
  await user.clear(date);
  await user.type(date, '2020-01-01');
  await user.type(screen.getByLabelText('Duration (minutes)'), '45');
  await user.type(
    screen.getByLabelText('Training notes'),
    'Worked on transitions.',
  );
  await user.press(screen.getByRole('button', { name: 'Save training' }));
  expect(screen.getByText('Worked on transitions.')).toBeOnTheScreen();
  expect(screen.getByText('1 entry')).toBeOnTheScreen();

  await user.press(screen.getByRole('button', { name: 'Edit entry' }));
  const duration = screen.getByLabelText('Duration (minutes)');
  await user.clear(duration);
  await user.type(duration, '50');
  const notes = screen.getByLabelText('Training notes');
  await user.clear(notes);
  await user.type(notes, 'Transitions felt smoother by the end.');
  await user.press(screen.getByRole('button', { name: 'Save changes' }));

  expect(screen.getByText('50 min · Okay')).toBeOnTheScreen();
  expect(
    screen.getByText('Transitions felt smoother by the end.'),
  ).toBeOnTheScreen();
  expect(screen.getByText('1 entry')).toBeOnTheScreen();
  expect(screen.queryByText('Worked on transitions.')).not.toBeOnTheScreen();
});

test('completing a course updates visible progress and removing it resets progress', async () => {
  const course = courses[0];
  const user = userEvent.setup();
  await render(
    <Provider store={createAppStore()}>
      <CourseStatusControls
        courseId={course.id}
        lessonIds={course.lessons.map((lesson) => lesson.id)}
      />
      <CourseProgress course={course} />
    </Provider>,
  );

  await user.press(screen.getByRole('button', { name: 'Completed' }));
  expect(screen.getByText('3 of 3 lessons completed (100%)')).toBeOnTheScreen();

  await user.press(
    screen.getByRole('button', { name: 'Remove from my learning' }),
  );
  expect(screen.getByText('0 of 3 lessons completed (0%)')).toBeOnTheScreen();
  expect(
    screen.queryByRole('button', { name: 'Remove from my learning' }),
  ).not.toBeOnTheScreen();
});
