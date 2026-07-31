'use client';

import { ComponentType, ReactNode } from 'react';

export type SkeletonGateProps = {
  children?: ReactNode;
  loading?: boolean;
};

/**
 * Wraps a skeleton template so callers can toggle between the skeleton and
 * real content via `loading`.
 *
 * @example
 * const CardSkeleton = createSkeletonComponent<{ lines?: number }>(
 *   function CardSkeleton({ lines = 3 }) {
 *     return (
 *       <>
 *         {Array.from({ length: lines }, (_, i) => (
 *           <Skeleton key={i} height={14} />
 *         ))}
 *       </>
 *     );
 *   }
 * );
 *
 * <CardSkeleton loading lines={2}>
 *   <RealCard />
 * </CardSkeleton>
 */
export function createSkeletonComponent<P extends object = Record<string, never>>(
  SkeletonComponent: ComponentType<P>
) {
  type Props = P & SkeletonGateProps;

  function CreatedSkeletonComponent({
    children,
    loading = false,
    ...skeletonProps
  }: Props) {
    if (loading) {
      return <SkeletonComponent {...(skeletonProps as P)} />;
    }

    return <>{children}</>;
  }

  const name =
    SkeletonComponent.displayName ?? SkeletonComponent.name ?? 'Component';
  CreatedSkeletonComponent.displayName = `createSkeletonComponent(${name})`;

  return CreatedSkeletonComponent;
}
