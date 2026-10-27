import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isCancelledError } from '@tanstack/react-query';
import { createQueryClient } from '../src/queries/client.ts';
import { coursesQueryOptions } from '../src/queries/courses.ts';

test('catalog loads through the API and reuses fresh cached data', async (context) => {
  const client = createQueryClient();
  context.after(() => client.clear());
  let calls = 0;
  const options = {
    ...coursesQueryOptions,
    queryFn: (query) => {
      calls++;
      return coursesQueryOptions.queryFn(query);
    },
  };
  const courses = await client.fetchQuery(options);
  assert.equal(courses.length, 6);
  assert.equal(await client.fetchQuery(options), courses);
  assert.equal(calls, 1);
  await client.invalidateQueries({ queryKey: ['courses'] });
  await client.fetchQuery(options);
  assert.equal(calls, 2);
});

test('failed catalog request can recover on retry', async (context) => {
  const client = createQueryClient();
  context.after(() => client.clear());
  await assert.rejects(
    client.fetchQuery({
      ...coursesQueryOptions,
      retry: false,
      queryFn: () => Promise.reject(new Error('Course service unavailable')),
    }),
    /Course service unavailable/,
  );
  assert.equal(client.getQueryState(['courses']).status, 'error');
  assert.equal((await client.fetchQuery(coursesQueryOptions)).length, 6);
  assert.equal(client.getQueryState(['courses']).status, 'success');
});

test('cancelling a catalog query aborts its request', async (context) => {
  const client = createQueryClient();
  context.after(() => client.clear());
  let signal;
  const pending = client.fetchQuery({
    ...coursesQueryOptions,
    queryFn: (query) => {
      signal = query.signal;
      return coursesQueryOptions.queryFn(query);
    },
  });
  const rejected = assert.rejects(pending, isCancelledError);
  await client.cancelQueries({ queryKey: ['courses'] });
  await rejected;
  assert.equal(signal.aborted, true);
  assert.equal(client.getQueryData(['courses']), undefined);
});
