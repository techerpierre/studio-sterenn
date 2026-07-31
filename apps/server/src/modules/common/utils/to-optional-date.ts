export function toOptionalDate({ value }: { value: unknown }) {
  if (value === null || value === undefined) return value;
  return value instanceof Date ? value : new Date(value as string);
}
