/**
 * Sanitizes a string by removing invalid characters and truncating it.
 * When `numeric` is true, only digits are kept; otherwise whitespace is removed.
 *
 * @param value - The raw string to sanitize.
 * @param length - Maximum number of characters to keep.
 * @param numeric - Whether to keep digits only.
 * @returns The sanitized and truncated string.
 */
export function sanitizeValue(
  value: string,
  length: number,
  numeric: boolean
): string {
  const cleaned = numeric ? value.replace(/\D/g, '') : value.replace(/\s/g, '');
  return cleaned.slice(0, length);
}

/**
 * Builds up to two initials from a display name.
 *
 * @param name - The display name to extract initials from.
 * @returns Up to two uppercase initials, or an empty string if `name` has no words.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param value - The raw string to transform.
 * @returns A lowercase slug with hyphens instead of spaces/special characters.
 */
export function sluggify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
