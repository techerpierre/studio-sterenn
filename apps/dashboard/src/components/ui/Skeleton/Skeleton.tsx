'use client';

import clsx from '@/lib/clsx';
import { CSSProperties, HTMLAttributes } from 'react';

import { toCssSize } from '@/lib/utils';

import styles from './styles.module.css';

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  rounded?: boolean;
  circle?: boolean;
};

export function Skeleton({
  width,
  height,
  radius,
  rounded = false,
  circle = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  const resolvedStyle: CSSProperties = {
    ...style,
    width: toCssSize(width) ?? style?.width,
    height: toCssSize(height) ?? style?.height,
    borderRadius: circle
      ? '9999px'
      : toCssSize(radius) ?? style?.borderRadius,
  };

  return (
    <div
      className={clsx(
        styles.skeleton,
        rounded && styles.rounded,
        circle && styles.circle,
        className
      )}
      style={resolvedStyle}
      aria-hidden
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';
