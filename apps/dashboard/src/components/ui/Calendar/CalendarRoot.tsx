'use client';

import { useState } from 'react';
import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import clsx from '@/lib/clsx';

import { CalendarMonth } from './CalendarMonth';
import styles from './CalendarRoot.module.css';
import type {
  CalendarInterval,
  CalendarIntervalProps,
  CalendarProps,
  CalendarRange,
  CalendarSingleProps,
} from './types';
import {
  isDateDisabled,
  isDateInInterval,
  normalizeDisabledIntervals,
  withPreservedDay,
  withPreservedTime,
} from './utils';

const EMPTY_RANGE: CalendarRange = { from: null, to: null };

function isIntervalProps(props: CalendarProps): props is CalendarIntervalProps {
  return props.mode === 'interval';
}

function mergeDisabledIntervals(
  base?: CalendarInterval | CalendarInterval[],
  extra: CalendarInterval[] = []
) {
  return [...normalizeDisabledIntervals(base), ...extra];
}

export function CalendarRoot(props: CalendarProps) {
  if (isIntervalProps(props)) {
    return <CalendarIntervalView {...props} />;
  }
  return <CalendarSingle {...props} />;
}

function CalendarSingle({
  value,
  defaultValue = null,
  onDateChange,
  className,
  showSelects = true,
  locale = fr,
  weekStartsOn = 1,
  fromYear,
  toYear,
  renderDay,
  month,
  defaultMonth,
  onMonthChange,
  disabledIntervals,
  withTime,
}: CalendarSingleProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(defaultMonth ?? defaultValue ?? new Date())
  );

  const selected = value !== undefined ? value : internalValue;
  const viewMonth = month ?? internalMonth;

  const setViewMonth = (next: Date) => {
    if (month === undefined) {
      setInternalMonth(startOfMonth(next));
    }
    onMonthChange?.(startOfMonth(next));
  };

  const commit = (next: Date | null) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onDateChange?.(next);
  };

  const selectDate = (date: Date) => {
    if (withTime) {
      commit(withPreservedTime(date, selected ?? new Date()));
      return;
    }
    commit(startOfDay(date));
  };

  const selectTime = (date: Date) => {
    if (!selected) return;
    commit(withPreservedDay(date, selected));
  };

  return (
    <CalendarMonth
      className={className}
      month={viewMonth}
      onMonthChange={setViewMonth}
      showSelects={showSelects}
      locale={locale}
      weekStartsOn={weekStartsOn}
      fromYear={fromYear}
      toYear={toYear}
      renderDay={renderDay}
      withTime={withTime}
      timeValue={selected}
      onTimeChange={selectTime}
      getDayState={(date) => ({
        selected: selected != null && isSameDay(date, selected),
        outlined: false,
        inInterval: false,
        disabled: isDateDisabled(date, disabledIntervals),
        outsideMonth: false,
        today: false,
      })}
      onDayClick={selectDate}
    />
  );
}

function CalendarIntervalView({
  value,
  defaultValue = EMPTY_RANGE,
  onDateChange,
  className,
  showSelects = true,
  locale = fr,
  weekStartsOn = 1,
  fromYear,
  toYear,
  renderDay,
  month,
  defaultMonth,
  onMonthChange,
  disabledIntervals,
  withTime,
}: CalendarIntervalProps) {
  const [internalValue, setInternalValue] =
    useState<CalendarRange>(defaultValue);
  const [leftMonth, setLeftMonthState] = useState(() =>
    startOfMonth(defaultMonth ?? defaultValue.from ?? new Date())
  );
  const [rightMonth, setRightMonth] = useState(() =>
    startOfMonth(
      defaultValue.to ??
        addMonths(defaultValue.from ?? defaultMonth ?? new Date(), 1)
    )
  );

  const range = value !== undefined ? value : internalValue;
  const fromMonth = month ?? leftMonth;

  const setLeftMonth = (next: Date) => {
    const normalized = startOfMonth(next);
    if (month === undefined) {
      setLeftMonthState(normalized);
    }
    onMonthChange?.(normalized);
  };

  const updateRange = (next: CalendarRange) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onDateChange?.(next);
  };

  const selectFrom = (date: Date) => {
    const day = withTime
      ? withPreservedTime(date, range.from ?? new Date())
      : startOfDay(date);
    const to =
      range.to && isAfter(startOfDay(day), startOfDay(range.to))
        ? null
        : range.to;
    updateRange({ from: day, to });
  };

  const selectTo = (date: Date) => {
    const day = withTime
      ? withPreservedTime(date, range.to ?? new Date())
      : startOfDay(date);
    const from =
      range.from && isBefore(startOfDay(day), startOfDay(range.from))
        ? null
        : range.from;
    updateRange({ from, to: day });
  };

  const selectFromTime = (date: Date) => {
    if (!range.from) return;
    updateRange({ from: withPreservedDay(date, range.from), to: range.to });
  };

  const selectToTime = (date: Date) => {
    if (!range.to) return;
    updateRange({ from: range.from, to: withPreservedDay(date, range.to) });
  };

  const inInterval = (date: Date) => isDateInInterval(date, range);

  const leftDisabledIntervals = mergeDisabledIntervals(
    disabledIntervals,
    range.to ? [{ from: addDays(startOfDay(range.to), 1) }] : []
  );

  const rightDisabledIntervals = mergeDisabledIntervals(
    disabledIntervals,
    range.from ? [{ to: addDays(startOfDay(range.from), -1) }] : []
  );

  return (
    <div className={clsx(styles.intervalRoot, className)}>
      <div className={styles.intervalPanel}>
        <CalendarMonth
          className={styles.intervalMonth}
          embedded
          month={fromMonth}
          onMonthChange={setLeftMonth}
          showSelects={showSelects}
          locale={locale}
          weekStartsOn={weekStartsOn}
          fromYear={fromYear}
          toYear={toYear}
          renderDay={renderDay}
          withTime={withTime}
          timeValue={range.from}
          onTimeChange={selectFromTime}
          getDayState={(date) => ({
            selected: range.from != null && isSameDay(date, range.from),
            outlined: range.to != null && isSameDay(date, range.to),
            inInterval: inInterval(date),
            disabled: isDateDisabled(date, leftDisabledIntervals),
            outsideMonth: false,
            today: false,
          })}
          onDayClick={selectFrom}
        />
      </div>
      <div className={styles.intervalPanel}>
        <CalendarMonth
          className={styles.intervalMonth}
          embedded
          month={rightMonth}
          onMonthChange={(next) => setRightMonth(startOfMonth(next))}
          showSelects={showSelects}
          locale={locale}
          weekStartsOn={weekStartsOn}
          fromYear={fromYear}
          toYear={toYear}
          renderDay={renderDay}
          withTime={withTime}
          timeValue={range.to}
          onTimeChange={selectToTime}
          getDayState={(date) => ({
            selected: range.to != null && isSameDay(date, range.to),
            outlined: range.from != null && isSameDay(date, range.from),
            inInterval: inInterval(date),
            disabled: isDateDisabled(date, rightDisabledIntervals),
            outsideMonth: false,
            today: false,
          })}
          onDayClick={selectTo}
        />
      </div>
    </div>
  );
}
