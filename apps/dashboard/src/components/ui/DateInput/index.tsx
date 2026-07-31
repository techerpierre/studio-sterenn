'use client';

import clsx from '@/lib/clsx';
import {
  ChangeEvent,
  FocusEvent,
  Ref,
  useId,
  useRef,
  useState,
} from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, isValid, parse, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  FloatingPortal,
  getPopupTriggerAria,
  useAnchoredFloating,
} from '@/lib/popup';
import {
  Calendar,
  type CalendarMode,
  type CalendarRange,
  type CalendarSharedProps,
} from '@/components/ui/Calendar';
import {
  type TextInputSize,
  type TextInputVariant,
} from '@/components/ui/TextInput';
import inputStyles from '@/components/ui/TextInput/styles.module.css';
import type { TimeInputFormat } from '@/components/ui/TimeInput';

import styles from './styles.module.css';

export type DateInputSize = TextInputSize;
export type DateInputVariant = TextInputVariant;

export type DateInputCalendarOptions = Omit<CalendarSharedProps, 'className'> & {
  mode?: CalendarMode;
};

export type DateInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: DateInputSize;
  variant?: DateInputVariant;
  rounded?: boolean;
  className?: string;
  calendarOptions?: DateInputCalendarOptions;
  ref?: Ref<HTMLInputElement>;
};

export function DateInput({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  name,
  id,
  placeholder = 'Sélectionner une date',
  disabled = false,
  size = 'md',
  variant = 'default',
  rounded = false,
  className,
  calendarOptions,
  ref,
}: DateInputProps) {
  const { mode = 'single', withTime, ...calendarRest } = calendarOptions ?? {};
  const isControlled = value !== undefined;
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const overlayId = `${fieldId}-calendar`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isoValue = isControlled ? (value ?? '') : internalValue;
  const selectedDate = mode === 'single' ? parseValue(isoValue) : null;
  const selectedRange =
    mode === 'interval' ? parseRangeValue(isoValue) : EMPTY_RANGE;

  const {
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    floatingClassName,
  } = useAnchoredFloating({
    open,
    onOpenChange: (next) => {
      if (disabled) return;
      setOpen(next);
    },
    placement: 'bottom-start',
    role: 'dialog',
    trigger: 'click',
  });

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    assignRef(ref, node);
  };

  const emit = (nextValue: string, closeOverlay: boolean) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    const input = inputRef.current;
    if (input) {
      onChange?.(createChangeEvent(input, nextValue));
    } else {
      onChange?.({
        currentTarget: { value: nextValue, name: name ?? '' },
        target: { value: nextValue, name: name ?? '' },
      } as ChangeEvent<HTMLInputElement>);
    }

    if (closeOverlay) {
      setOpen(false);
    }
  };

  const commitSingle = (date: Date | null) => {
    emit(date ? toIsoValue(date, withTime) : '', !withTime);
  };

  const commitRange = (range: CalendarRange) => {
    const complete = Boolean(range.from && range.to);
    emit(toRangeIsoValue(range, withTime), complete && !withTime);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  };

  const display =
    mode === 'interval'
      ? formatRangeDisplay(selectedRange, withTime)
      : formatDisplay(selectedDate, withTime);

  return (
    <div className={clsx(styles.root, className)}>
      <input
        ref={setInputRef}
        id={fieldId}
        name={name}
        type="text"
        className={styles.hiddenInput}
        value={isoValue}
        tabIndex={-1}
        readOnly
        disabled={disabled}
        aria-hidden
        onChange={onChange}
        onBlur={handleBlur}
      />

      <button
        type="button"
        ref={refs.setReference}
        disabled={disabled}
        className={clsx(
          inputStyles.root,
          inputStyles[size],
          inputStyles[variant],
          inputStyles.typographyFromSize,
          rounded ? inputStyles.rounded : false,
          disabled ? inputStyles.disabled : false,
          styles.trigger
        )}
        {...getReferenceProps({
          ...getPopupTriggerAria(open, overlayId, 'dialog'),
        })}
      >
        <span
          className={clsx(
            styles.triggerLabel,
            !display && styles.placeholder
          )}
        >
          {display || placeholder}
        </span>
        <span className={inputStyles.item}>
          <CalendarIcon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>
      </button>

      {open ? (
        <FloatingPortal id="popup-root">
          <div
            ref={refs.setFloating}
            id={overlayId}
            className={clsx(styles.overlay, floatingClassName)}
            style={floatingStyles}
            {...getFloatingProps({
              'aria-label': 'Sélection de date',
            })}
          >
            {mode === 'interval' ? (
              <Calendar
                {...calendarRest}
                mode="interval"
                value={selectedRange}
                onDateChange={commitRange}
                withTime={withTime}
              />
            ) : (
              <Calendar
                {...calendarRest}
                mode="single"
                value={selectedDate}
                onDateChange={commitSingle}
                withTime={withTime}
              />
            )}
          </div>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

const EMPTY_RANGE: CalendarRange = { from: null, to: null };

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}

function parseValue(value: string | undefined): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(date) ? date : null;
  }
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

function parseRangeValue(value: string | undefined): CalendarRange {
  if (!value) return EMPTY_RANGE;
  const [fromRaw = '', toRaw = ''] = value.split('/');
  return {
    from: parseValue(fromRaw),
    to: parseValue(toRaw),
  };
}

function toIsoValue(date: Date, withTime?: TimeInputFormat) {
  if (withTime) {
    return date.toISOString();
  }
  return format(date, 'yyyy-MM-dd');
}

function toRangeIsoValue(range: CalendarRange, withTime?: TimeInputFormat) {
  const from = range.from ? toIsoValue(range.from, withTime) : '';
  const to = range.to ? toIsoValue(range.to, withTime) : '';
  if (!from && !to) return '';
  return `${from}/${to}`;
}

function formatDisplay(date: Date | null, withTime?: TimeInputFormat) {
  if (!date) return '';
  if (withTime === 'hh:mm:ss') {
    return format(date, 'd MMM yyyy HH:mm:ss', { locale: fr });
  }
  if (withTime === 'hh:mm' || withTime === 'mm:ss') {
    return format(date, 'd MMM yyyy HH:mm', { locale: fr });
  }
  return format(date, 'd MMMM yyyy', { locale: fr });
}

function formatRangeDisplay(range: CalendarRange, withTime?: TimeInputFormat) {
  if (!range.from && !range.to) return '';
  const from = range.from ? formatDisplay(range.from, withTime) : '…';
  const to = range.to ? formatDisplay(range.to, withTime) : '…';
  return `${from} → ${to}`;
}

function createChangeEvent(
  input: HTMLInputElement,
  value: string
): ChangeEvent<HTMLInputElement> {
  const prototype = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  );
  prototype?.set?.call(input, value);

  const nativeEvent = new Event('change', { bubbles: true });
  return {
    nativeEvent,
    currentTarget: input,
    target: input,
    bubbles: true,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 3,
    isTrusted: false,
    preventDefault: () => undefined,
    isDefaultPrevented: () => false,
    stopPropagation: () => undefined,
    isPropagationStopped: () => false,
    persist: () => undefined,
    timeStamp: nativeEvent.timeStamp,
    type: 'change',
  };
}
