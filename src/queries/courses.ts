import { queryOptions } from '@tanstack/react-query';
import { getCourses } from '../api/courses.ts';

export const coursesQueryOptions = queryOptions({
  queryKey: ['courses'],
  queryFn: ({ signal }) => getCourses({ signal }),
  networkMode: 'always',
});
