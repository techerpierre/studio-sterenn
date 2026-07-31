/**
 * Splits a string into a fixed-length array of single characters.
 * Missing positions are filled with empty strings.
 *
 * @param value - The source string to split.
 * @param length - The expected number of slots in the result.
 * @returns An array of characters padded to `length`.
 */
export function toDigits(value: string, length: number): string[] {
  return Array.from({ length }, (_, index) => value[index] ?? '');
}
