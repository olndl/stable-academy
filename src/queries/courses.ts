import { queryOptions } from '@tanstack/react-query';
import { ApiError } from '../api/request.ts';
import { getCourse, getCourses } from '../api/courses.ts';

export const coursesQueryOptions = queryOptions({
  queryKey: ['courses'],
  queryFn: ({ signal }) => getCourses({ signal }),
  networkMode: 'always',
});

export function courseQueryOptions(courseId: string) {
  return queryOptions({
    queryKey: ['courses', courseId],
    queryFn: ({ signal }) => getCourse(courseId, { signal }),
    networkMode: 'always',
    retry: (count, error) =>
      !(error instanceof ApiError && error.status === 404) && count < 1,
  });
}
