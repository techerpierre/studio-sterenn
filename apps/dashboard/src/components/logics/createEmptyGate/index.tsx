import { ComponentType, ReactNode } from 'react';

export type EmptyGateProps = {
  children?: ReactNode;
  isEmpty?: boolean;
};

/**
 * Wraps an empty-state view so callers can toggle between the empty view and
 * real content via `isEmpty`.
 *
 * Mirror of `createSkeletonComponent` (ui) for empty states.
 *
 * @example
 * const ListEmpty = createEmptyGate(function ListEmptyView() {
 *   return <p>Nothing here</p>;
 * });
 *
 * <ListEmpty isEmpty={items.length === 0}>
 *   <List items={items} />
 * </ListEmpty>
 */
export function createEmptyGate<P extends object = object>(
  EmptyView: ComponentType<P>,
) {
  type Props = P & EmptyGateProps;

  function EmptyGate({
    children,
    isEmpty = false,
    ...emptyProps
  }: Props) {
    if (isEmpty) {
      return <EmptyView {...(emptyProps as P)} />;
    }

    return <>{children}</>;
  }

  const name =
    EmptyView.displayName ?? EmptyView.name ?? 'Component';
  EmptyGate.displayName = `createEmptyGate(${name})`;

  return EmptyGate;
}
