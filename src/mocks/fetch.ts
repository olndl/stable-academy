import { getResponse } from 'msw';
import { handlers } from './handlers.ts';

export async function mockFetch(request: Request): Promise<Response> {
  if (request.signal?.aborted) {
    throw new DOMException('The request was aborted', 'AbortError');
  }

  const response = await getResponse(handlers, request);

  if (request.signal?.aborted) {
    throw new DOMException('The request was aborted', 'AbortError');
  }
  if (!response) {
    throw new Error(`No mock handler for ${request.method} ${request.url}`);
  }
  return response;
}
