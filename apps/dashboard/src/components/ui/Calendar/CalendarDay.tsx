'use client';

import clsx from '@/lib/clsx';
import { Button, type ButtonVariant } from '@/components/ui/Button';

import styles from './CalendarDay.module.css';
import type { CalendarDayState } from './types';

export type CalendarDayProps = CalendarDayState & {
  className?: string;
};

export function CalendarDay({
  day,
  selected,
  outlined,
  inInterval,
  disabled,
  outsideMonth,
  today,
  onClick,
  className,
}: CalendarDayProps) {
  const variant = getVariant({ selected, outlined, inInterval, today });

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      icon
      disabled={disabled}
      onClick={onClick}
      className={clsx(styles.day, className)}
      aria-pressed={selected}
      aria-current={today ? 'date' : undefined}
      data-outside-month={outsideMonth || undefined}
    >
      {day}
    </Button>
  );
}

function getVariant({
  selected,
  outlined,
  inInterval,
  today,
}: {
  selected: boolean;
  outlined: boolean;
  inInterval: boolean;
  today: boolean;
}): ButtonVariant {
  if (selected) return 'default';
  if (outlined) return 'outline';
  if (inInterval) return 'muted';
  if (today) return 'secondary';
  return 'ghost';
}
