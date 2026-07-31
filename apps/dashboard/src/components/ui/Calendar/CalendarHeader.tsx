'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  addMonths,
  format,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

import styles from './CalendarHeader.module.css';
import type { Locale } from './types';

export type CalendarHeaderProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  showSelects?: boolean;
  locale?: Locale;
  fromYear?: number;
  toYear?: number;
};

export function CalendarHeader({
  month,
  onMonthChange,
  showSelects = true,
  locale = fr,
  fromYear = getYear(new Date()) - 50,
  toYear = getYear(new Date()) + 50,
}: CalendarHeaderProps) {
  const currentMonth = getMonth(month);
  const currentYear = getYear(month);

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, index) => fromYear + index
  );

  return (
    <div className={styles.header}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon
        aria-label="Mois précédent"
        onClick={() => onMonthChange(addMonths(month, -1))}
      >
        <ChevronLeftIcon size={16} aria-hidden />
      </Button>

      {showSelects ? (
        <div className={styles.selects}>
          <Select
            size="xs"
            variant="ghost"
            className={styles.select}
            matchTriggerWidth={false}
            value={String(currentMonth)}
            onValueChange={(value) =>
              onMonthChange(setMonth(month, Number(value)))
            }
          >
            {Array.from({ length: 12 }, (_, index) => (
              <Select.Item key={index} value={String(index)}>
                {format(setMonth(new Date(currentYear, 0, 1), index), 'MMMM', {
                  locale,
                })}
              </Select.Item>
            ))}
          </Select>
          <Select
            size="xs"
            variant="ghost"
            className={styles.select}
            matchTriggerWidth={false}
            value={String(currentYear)}
            onValueChange={(value) =>
              onMonthChange(setYear(month, Number(value)))
            }
          >
            {years.map((year) => (
              <Select.Item key={year} value={String(year)}>
                {String(year)}
              </Select.Item>
            ))}
          </Select>
        </div>
      ) : (
        <span className={styles.monthLabel}>
          {format(month, 'MMMM yyyy', { locale })}
        </span>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon
        aria-label="Mois suivant"
        onClick={() => onMonthChange(addMonths(month, 1))}
      >
        <ChevronRightIcon size={16} aria-hidden />
      </Button>
    </div>
  );
}
