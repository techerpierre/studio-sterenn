/**
 * Join classnames into one strong separated with a space
 * @param classNames Classes to merge
 */
export default function clsx(
  ...classNames: (string | null | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(' ');
}
