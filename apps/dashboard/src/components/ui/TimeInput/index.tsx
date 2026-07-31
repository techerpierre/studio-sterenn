'use client';

import clsx from '@/lib/clsx';
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Loader } from '@/components/ui/Loader';
import {
  type TextInputSize,
  type TextInputVariant,
} from '@/components/ui/TextInput';
import inputStyles from '@/components/ui/TextInput/styles.module.css';

import styles from './styles.module.css';

export type TimeInputFormat = 'hh:mm:ss' | 'hh:mm' | 'mm:ss';
export type TimeInputSize = TextInputSize;
export type TimeInputVariant = TextInputVariant;

type TimeParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type TimeInputProps = {
  format?: TimeInputFormat;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  size?: TimeInputSize;
  variant?: TimeInputVariant;
  rounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
};

const FORMAT_FIELDS: Record<
  TimeInputFormat,
  Array<'hours' | 'minutes' | 'seconds'>
> = {
  'hh:mm:ss': ['hours', 'minutes', 'seconds'],
  'hh:mm': ['hours', 'minutes'],
  'mm:ss': ['minutes', 'seconds'],
};

const FIELD_MAX: Record<'hours' | 'minutes' | 'seconds', number> = {
  hours: 23,
  minutes: 59,
  seconds: 59,
};

const FIELD_LABEL: Record<'hours' | 'minutes' | 'seconds', string> = {
  hours: 'Heures',
  minutes: 'Minutes',
  seconds: 'Secondes',
};

function getParts(date: Date | null | undefined): TimeParts {
  if (!date || Number.isNaN(date.getTime())) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

function clamp(value: number, max: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), max);
}

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function buildDate(base: Date | null | undefined, parts: TimeParts): Date {
  const next =
    base && !Number.isNaN(base.getTime()) ? new Date(base) : new Date();
  next.setHours(parts.hours, parts.minutes, parts.seconds, 0);
  return next;
}

function parseSegment(raw: string, max: number) {
  if (raw.trim() === '') return 0;
  return clamp(Number.parseInt(raw, 10), max);
}

export function TimeInput({
  format = 'hh:mm',
  value,
  defaultValue = null,
  onChange,
  size = 'md',
  variant = 'default',
  rounded = false,
  disabled = false,
  loading = false,
  className,
  id,
  name,
  'aria-label': ariaLabel = 'Heure',
}: TimeInputProps) {
  const isControlled = value !== undefined;
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const isDisabled = Boolean(disabled || loading);
  const fields = FORMAT_FIELDS[format];
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const skipBlurCommitRef = useRef<'hours' | 'minutes' | 'seconds' | null>(
    null
  );

  const [baseDate, setBaseDate] = useState<Date>(() =>
    buildDate(defaultValue, getParts(defaultValue))
  );
  const [parts, setParts] = useState<TimeParts>(() => getParts(defaultValue));
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial = getParts(defaultValue);
    return {
      hours: pad2(initial.hours),
      minutes: pad2(initial.minutes),
      seconds: pad2(initial.seconds),
    };
  });
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  useEffect(() => {
    if (!isControlled) return;
    const nextParts = getParts(value);
    setParts(nextParts);
    const nextDrafts = {
      hours: pad2(nextParts.hours),
      minutes: pad2(nextParts.minutes),
      seconds: pad2(nextParts.seconds),
    };
    draftsRef.current = nextDrafts;
    setDrafts(nextDrafts);
    if (value) {
      setBaseDate(new Date(value));
    }
  }, [isControlled, value]);

  const emitChange = (nextParts: TimeParts) => {
    const nextDate = buildDate(isControlled ? value : baseDate, nextParts);
    if (!isControlled) {
      setBaseDate(nextDate);
      setParts(nextParts);
    }
    onChange?.(nextDate);
  };

  const commitField = (
    field: 'hours' | 'minutes' | 'seconds',
    raw: string,
    currentParts: TimeParts = parts
  ) => {
    const nextValue = parseSegment(raw, FIELD_MAX[field]);
    const nextParts = { ...currentParts, [field]: nextValue };
    const padded = pad2(nextValue);
    draftsRef.current = { ...draftsRef.current, [field]: padded };
    setDrafts((current) => ({ ...current, [field]: padded }));
    emitChange(nextParts);
  };

  const handleChange =
    (field: 'hours' | 'minutes' | 'seconds', index: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return;
      const digits = event.target.value.replace(/\D/g, '').slice(0, 2);
      draftsRef.current = { ...draftsRef.current, [field]: digits };
      setDrafts((current) => ({ ...current, [field]: digits }));

      if (digits.length === 2) {
        commitField(field, digits);
        const next = inputRefs.current[index + 1];
        if (next) {
          // Avoid blur recommitting the previous draft ("1" → "01") when
          // auto-advancing after the second digit.
          skipBlurCommitRef.current = field;
          next.focus();
          next.select();
        }
      }
    };

  const handleBlur = (field: 'hours' | 'minutes' | 'seconds') => () => {
    if (isDisabled) return;
    if (skipBlurCommitRef.current === field) {
      skipBlurCommitRef.current = null;
      return;
    }
    commitField(field, draftsRef.current[field] ?? '');
  };

  const handleKeyDown =
    (field: 'hours' | 'minutes' | 'seconds', index: number) =>
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && (drafts[field] ?? '') === '') {
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
        return;
      }

      if (
        event.key === 'ArrowRight' &&
        event.currentTarget.selectionStart ===
          event.currentTarget.value.length
      ) {
        event.preventDefault();
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.select();
        return;
      }

      if (
        event.key === 'ArrowLeft' &&
        event.currentTarget.selectionStart === 0
      ) {
        event.preventDefault();
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
      }
    };

  return (
    <div
      className={clsx(
        inputStyles.root,
        inputStyles[size],
        inputStyles[variant],
        styles.root,
        rounded ? inputStyles.rounded : false,
        isDisabled ? inputStyles.disabled : false,
        isDisabled ? styles.disabled : false,
        className
      )}
      role="group"
      aria-label={ariaLabel}
      id={fieldId}
    >
      {name ? (
        <input
          type="hidden"
          name={name}
          value={`${pad2(parts.hours)}:${pad2(parts.minutes)}:${pad2(parts.seconds)}`}
          disabled={isDisabled}
        />
      ) : null}

      <div className={styles.segments}>
        {fields.map((field, index) => (
          <Fragment key={field}>
            {index > 0 ? <span className={styles.separator}>:</span> : null}
            <input
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              maxLength={2}
              className={clsx(styles.segment, inputStyles.typographyFromSize)}
              value={drafts[field] ?? ''}
              placeholder="00"
              disabled={isDisabled}
              aria-label={FIELD_LABEL[field]}
              onChange={handleChange(field, index)}
              onBlur={handleBlur(field)}
              onKeyDown={handleKeyDown(field, index)}
              onFocus={(event) => event.currentTarget.select()}
            />
          </Fragment>
        ))}
      </div>

      {loading ? (
        <span className={inputStyles.item}>
          <Loader size="sm" className={inputStyles.loader} />
        </span>
      ) : null}
    </div>
  );
}
