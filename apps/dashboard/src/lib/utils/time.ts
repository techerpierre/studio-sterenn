import {
  differenceInCalendarDays,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';

/**
 * Relative due-date label for UI tags (French).
 * Returns `null` when there is no usable date.
 */
export function getDueDateProgressLabel(
  dueDate: string | Date | null | undefined,
  referenceDate: Date = new Date()
): string | null {
  if (dueDate == null || dueDate === '') return null;

  const date =
    typeof dueDate === 'string' ? parseISO(dueDate) : new Date(dueDate);
  if (!isValid(date)) return null;

  const days = differenceInCalendarDays(
    startOfDay(date),
    startOfDay(referenceDate)
  );

  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  if (days === -1) return 'Hier';
  if (days > 1) return `Dans ${days} jours`;
  return `Il y a ${Math.abs(days)} jours`;
}
