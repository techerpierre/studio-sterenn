import { CalendarRoot } from './CalendarRoot';
import { CalendarDay } from './CalendarDay';
import { CalendarHeader } from './CalendarHeader';
import { CalendarMonth } from './CalendarMonth';

export const Calendar = Object.assign(CalendarRoot, {
  Day: CalendarDay,
  Header: CalendarHeader,
  Month: CalendarMonth,
});

export type {
  CalendarProps,
  CalendarRange,
  CalendarInterval,
  CalendarDayState,
  CalendarRenderDay,
  CalendarMode,
  CalendarSharedProps,
} from './types';
export type { CalendarDayProps } from './CalendarDay';
export type { CalendarHeaderProps } from './CalendarHeader';
export type { CalendarMonthProps } from './CalendarMonth';

export { CalendarRoot } from './CalendarRoot';
export { CalendarDay } from './CalendarDay';
export { CalendarHeader } from './CalendarHeader';
export { CalendarMonth } from './CalendarMonth';
