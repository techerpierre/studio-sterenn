/**
 * Converts a number or string to a CSS size value.
 * @param value - The value to convert to CSS size.
 * @returns The CSS size value.
 */
export function toCssSize(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Converts a number or string to a CSS template value.
 * @param value - The value to convert to CSS template.
 * @returns The CSS template value.
 */
export function toTemplate(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
    return value;
}