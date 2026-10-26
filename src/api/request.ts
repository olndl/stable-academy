import { mockFetch } from '../mocks/fetch.ts';
import { API_BASE_URL } from './config.ts';

export interface RequestOptions {
  signal?: AbortSignal;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await mockFetch(
    new Request(`${API_BASE_URL}${path}`, { signal: options.signal }),
  );
  if (!response.ok) {
    const body = (await response.json()) as { message: string };
    throw new ApiError(body.message, response.status);
  }
  return response.json() as Promise<T>;
}
