'use client';

import clsx from '@/lib/clsx';
import { Box, type BoxProps } from '@/components/ui/Box';
import { type ElementType } from 'react';

import styles from './styles.module.css';

type CardOwnProps = {
  shadow?: boolean;
};

export type CardProps<TAs extends ElementType = 'div'> = CardOwnProps &
  BoxProps<TAs>;

export function Card<TAs extends ElementType = 'div'>({
  shadow = false,
  className,
  ...props
}: CardProps<TAs>) {
  return (
    <Box
      className={clsx(styles.card, shadow && styles.shadow, className)}
      {...props}
    />
  );
}
