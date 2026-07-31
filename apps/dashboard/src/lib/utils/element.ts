import { ReactElement } from 'react';

/**
 * Checks whether a React element's props object owns a given prop key.
 *
 * @param element - The React element to inspect.
 * @param propName - The prop name to look for on the element props.
 * @returns `true` if `propName` is an own property of the element props.
 */
export function hasElementProp(
  element: ReactElement,
  propName: PropertyKey
): boolean {
  return Object.prototype.hasOwnProperty.call(element.props ?? {}, propName);
}
