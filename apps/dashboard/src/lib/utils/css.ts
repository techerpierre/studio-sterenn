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

export function getContrastedColor(color: string): string {
    const rgb = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)?.slice(1).map(c => parseInt(c, 16)) ?? [0, 0, 0];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}