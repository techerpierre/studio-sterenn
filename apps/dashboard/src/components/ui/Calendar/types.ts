import type { Locale } from 'date-fns';
import { ReactNode } from 'react';

import type { TimeInputFormat } from '@/components/ui/TimeInput';

export type { Locale };

export type CalendarMode = 'single' | 'interval';

export type CalendarRange = {
  from: Date | null;
  to: Date | null;
};

export type CalendarInterval = {
  from?: Date;
  to?: Date;
};

export type CalendarDayState = {
  date: Date;
  day: number;
  selected: boolean;
  outlined: boolean;
  inInterval: boolean;
  disabled: boolean;
  outsideMonth: boolean;
  today: boolean;
  onClick: () => void;
};

export type CalendarRenderDay = (day: CalendarDayState) => ReactNode;

export type CalendarSharedProps = {
  className?: string;
  showSelects?: boolean;
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fromYear?: number;
  toYear?: number;
  renderDay?: CalendarRenderDay;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabledIntervals?: CalendarInterval | CalendarInterval[];
  withTime?: TimeInputFormat;
};

export type CalendarSingleProps = CalendarSharedProps & {
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onDateChange?: (date: Date | null) => void;
};

export type CalendarIntervalProps = CalendarSharedProps & {
  mode: 'interval';
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onDateChange?: (range: CalendarRange) => void;
};

export type CalendarProps = CalendarSingleProps | CalendarIntervalProps;
