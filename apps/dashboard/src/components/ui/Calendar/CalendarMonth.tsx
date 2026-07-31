'use client';

import { format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

import clsx from '@/lib/clsx';
import {
  TimeInput,
  type TimeInputFormat,
} from '@/components/ui/TimeInput';

import { CalendarDay } from './CalendarDay';
import { CalendarHeader } from './CalendarHeader';
import styles from './CalendarMonth.module.css';
import type { CalendarDayState, CalendarRenderDay, Locale } from './types';
import {
  getMonthMatrix,
  getWeekdayLabels,
  isDateToday,
  isOutsideMonth,
} from './utils';

export type CalendarMonthProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  showSelects?: boolean;
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fromYear?: number;
  toYear?: number;
  renderDay?: CalendarRenderDay;
  getDayState: (
    date: Date
  ) => Omit<CalendarDayState, 'date' | 'day' | 'onClick'>;
  onDayClick: (date: Date) => void;
  className?: string;
  embedded?: boolean;
  withTime?: TimeInputFormat;
  timeValue?: Date | null;
  onTimeChange?: (date: Date) => void;
};

export function CalendarMonth({
  month,
  onMonthChange,
  showSelects = true,
  locale = fr,
  weekStartsOn = 1,
  fromYear,
  toYear,
  renderDay,
  getDayState,
  onDayClick,
  className,
  embedded = false,
  withTime,
  timeValue = null,
  onTimeChange,
}: CalendarMonthProps) {
  const viewMonth = startOfMonth(month);
  const weeks = getMonthMatrix(viewMonth, weekStartsOn);
  const weekdays = getWeekdayLabels(weekStartsOn, (date) =>
    format(date, 'EEEEEE', { locale })
  );

  return (
    <div
      className={clsx(
        styles.root,
        embedded && styles.embedded,
        className
      )}
    >
      <CalendarHeader
        month={viewMonth}
        onMonthChange={onMonthChange}
        showSelects={showSelects}
        locale={locale}
        fromYear={fromYear}
        toYear={toYear}
      />

      <div className={styles.weekdays}>
        {weekdays.map((label, index) => (
          <div key={`${label}-${index}`} className={styles.weekday}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.map((week) => (
          <div key={week[0]?.toISOString()} className={styles.week}>
            {week.map((date) => {
              const outsideMonth = isOutsideMonth(date, viewMonth);
              const state = getDayState(date);
              const dayState: CalendarDayState = {
                date,
                day: date.getDate(),
                outsideMonth,
                today: isDateToday(date),
                disabled: outsideMonth || state.disabled,
                selected: state.selected,
                outlined: state.outlined,
                inInterval: state.inInterval,
                onClick: () => {
                  if (outsideMonth || state.disabled) return;
                  onDayClick(date);
                },
              };

              return (
                <div key={date.toISOString()}>
                  {renderDay ? (
                    renderDay(dayState)
                  ) : (
                    <CalendarDay {...dayState} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {withTime ? (
        <div className={styles.time}>
          <TimeInput
            format={withTime}
            size="sm"
            value={timeValue}
            disabled={!timeValue}
            onChange={onTimeChange}
            aria-label="Heure"
          />
        </div>
      ) : null}
    </div>
  );
}
