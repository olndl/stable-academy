import assert from 'node:assert/strict';
import { test } from 'node:test';
import { courses } from '../src/mocks/data/courses.ts';
import {
  courseFilterParams,
  filterCourses,
  readCourseFilters,
} from '../src/features/courses/filters.ts';

test('missing and unknown route filters use the full catalog', () => {
  const empty = { q: '', discipline: '', level: '' };
  assert.deepEqual(readCourseFilters({}), empty);
  for (const value of ['missing', '__proto__', 'constructor']) {
    assert.deepEqual(
      readCourseFilters({ discipline: value, level: value }),
      empty,
    );
  }
  assert.deepEqual(filterCourses(courses, empty), courses);
});

test('route arrays use the first value and preserve spaces in the search input', () => {
  assert.deepEqual(
    readCourseFilters({
      q: ['Anna ', 'Tom'],
      discipline: ['dressage', 'jumping'],
      level: ['beginner', 'advanced'],
    }),
    {
      q: 'Anna ',
      discipline: 'dressage',
      level: 'beginner',
    },
  );
  assert.equal(readCourseFilters({ q: [] }).q, '');
});

test('active filters round trip and empty values remove route parameters', () => {
  const filters = {
    q: 'pole exercises',
    discipline: 'jumping',
    level: 'beginner',
  };
  assert.deepEqual(readCourseFilters(courseFilterParams(filters)), filters);
  assert.deepEqual(courseFilterParams({ q: '', discipline: '', level: '' }), {
    q: undefined,
    discipline: undefined,
    level: undefined,
  });
});

test('search ignores case and surrounding spaces, and includes trainer and description', () => {
  assert.deepEqual(
    filterCourses(courses, readCourseFilters({ q: '  ANNA WEBER  ' })).map(
      (course) => course.id,
    ),
    ['balanced-seat', 'clear-transitions'],
  );
  assert.deepEqual(
    filterCourses(courses, readCourseFilters({ q: 'pole exercises' })).map(
      (course) => course.id,
    ),
    ['first-poles'],
  );
  assert.deepEqual(
    filterCourses(courses, readCourseFilters({ q: 'grooming' })).map(
      (course) => course.id,
    ),
    ['stable-routine'],
  );
  assert.equal(
    filterCourses(courses, readCourseFilters({ q: '   ' })).length,
    6,
  );
});

test('discipline, level and text filters combine without changing cached courses', () => {
  const before = JSON.stringify(courses);
  const result = filterCourses(
    courses,
    readCourseFilters({ q: 'Tom', discipline: 'jumping', level: 'advanced' }),
  );
  assert.deepEqual(
    result.map((course) => course.id),
    ['jumping-lines'],
  );
  assert.equal(result[0], courses[3]);
  assert.equal(JSON.stringify(courses), before);
});

test('an unmatched combination returns an empty list', () => {
  assert.deepEqual(
    filterCourses(
      courses,
      readCourseFilters({ discipline: 'horse-care', level: 'advanced' }),
    ),
    [],
  );
  assert.deepEqual(
    filterCourses(courses, readCourseFilters({ q: 'not a course' })),
    [],
  );
});
