export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[a-zA-Z0-9_-]{1,128}$/.test(value) &&
    !['__proto__', 'prototype', 'constructor'].includes(value)
  );
}

export function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}
