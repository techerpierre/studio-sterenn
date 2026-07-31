import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { CalendarInterval, CalendarRange } from './types';

export function getMonthMatrix(
  month: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1
) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn });
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
}

export function getWeekdayLabels(
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  formatLabel: (date: Date) => string
) {
  const start = startOfWeek(new Date(), { weekStartsOn });
  return Array.from({ length: 7 }, (_, index) =>
    formatLabel(addDays(start, index))
  );
}

export function isDateSelected(
  date: Date,
  mode: 'single' | 'interval',
  single: Date | null,
  range: CalendarRange
) {
  const day = startOfDay(date);
  if (mode === 'single') {
    return single != null && isSameDay(day, single);
  }
  return (
    (range.from != null && isSameDay(day, range.from)) ||
    (range.to != null && isSameDay(day, range.to))
  );
}

export function isDateInInterval(date: Date, range: CalendarRange) {
  if (!range.from || !range.to) return false;
  const day = startOfDay(date);
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  if (isSameDay(from, to)) return false;
  const start = isBefore(from, to) ? from : to;
  const end = isAfter(from, to) ? from : to;
  return (
    isWithinInterval(day, { start, end }) &&
    !isSameDay(day, start) &&
    !isSameDay(day, end)
  );
}

export function normalizeDisabledIntervals(
  intervals?: CalendarInterval | CalendarInterval[]
): CalendarInterval[] {
  if (!intervals) return [];
  return Array.isArray(intervals) ? intervals : [intervals];
}

export function isDateInDisabledInterval(
  date: Date,
  interval: CalendarInterval
) {
  const day = startOfDay(date);
  const hasFrom = interval.from != null;
  const hasTo = interval.to != null;

  if (!hasFrom && !hasTo) return false;

  if (hasFrom && !hasTo) {
    return !isBefore(day, startOfDay(interval.from!));
  }

  if (!hasFrom && hasTo) {
    return !isAfter(day, startOfDay(interval.to!));
  }

  const from = startOfDay(interval.from!);
  const to = startOfDay(interval.to!);
  const start = isBefore(from, to) ? from : to;
  const end = isAfter(from, to) ? from : to;
  return isWithinInterval(day, { start, end });
}

export function isDateDisabled(
  date: Date,
  intervals?: CalendarInterval | CalendarInterval[]
) {
  return normalizeDisabledIntervals(intervals).some((interval) =>
    isDateInDisabledInterval(date, interval)
  );
}

export function isOutsideMonth(date: Date, month: Date) {
  return !isSameMonth(date, month);
}

export function isDateToday(date: Date) {
  return isToday(date);
}

export function normalizeRange(from: Date, to: Date): CalendarRange {
  if (isAfter(startOfDay(from), startOfDay(to))) {
    return { from: to, to: from };
  }
  return { from, to };
}

export function withPreservedTime(day: Date, timeSource?: Date | null) {
  const next = new Date(day);
  if (timeSource && !Number.isNaN(timeSource.getTime())) {
    next.setHours(
      timeSource.getHours(),
      timeSource.getMinutes(),
      timeSource.getSeconds(),
      timeSource.getMilliseconds()
    );
    return next;
  }
  next.setHours(0, 0, 0, 0);
  return next;
}

export function withPreservedDay(time: Date, daySource: Date) {
  const next = new Date(daySource);
  next.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
  return next;
}
