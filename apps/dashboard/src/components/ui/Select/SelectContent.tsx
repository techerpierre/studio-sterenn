'use client';

import clsx from '@/lib/clsx';
import {
  FloatingPortal,
  getPopupTriggerAria,
  isEnhanceableTrigger,
  useAnchoredFloating,
} from '@/lib/popup';
import { ChevronDownIcon } from 'lucide-react';
import {
  ChangeEvent,
  cloneElement,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  UIEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { Button, type ButtonProps } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';

import { useSelect } from './SelectContext';
import styles from './SelectContent.module.css';

export type SelectContentProps = {
  children: ReactNode;
  placeholder: string;
  emptyPlaceholder?: ReactNode;
  className?: string;
  align?: 'start' | 'end';
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  rounded?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  footer?: ReactNode;
  onBottom?: () => void;
  matchTriggerWidth?: boolean;
  trigger?: ReactNode;
};

export function SelectContent({
  children,
  placeholder,
  emptyPlaceholder,
  className,
  align = 'start',
  variant = 'outline',
  size = 'md',
  rounded = false,
  disabled = false,
  searchPlaceholder = 'Rechercher',
  footer,
  onBottom,
  matchTriggerWidth = true,
  trigger,
}: SelectContentProps) {
  const {
    open,
    setOpen,
    value,
    getLabel,
    searchable,
    searchQuery,
    setSearchQuery,
  } = useSelect();
  const listRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(false);
  const listboxId = useId();
  const selectedLabel = getLabel(value);
  const triggerLabel = selectedLabel ?? placeholder;
  const [isListEmpty, setIsListEmpty] = useState(false);

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
    placement: align === 'end' ? 'bottom-end' : 'bottom-start',
    matchReferenceWidth: matchTriggerWidth,
    role: 'listbox',
    trigger: 'click',
  });

  useEffect(() => {
    if (!open) {
      wasAtBottomRef.current = false;
      setIsListEmpty(false);
      if (listRef.current) listRef.current.scrollTop = 0;
      return;
    }

    const list = listRef.current;
    if (!list) return;
    setIsListEmpty(list.querySelectorAll('[role="option"]').length === 0);
  }, [open, children, searchQuery]);

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!onBottom) return;

    const list = event.currentTarget;
    const remaining = list.scrollHeight - list.scrollTop - list.clientHeight;
    const atBottom = remaining <= 1;

    if (atBottom && !wasAtBottomRef.current) {
      onBottom();
    }
    wasAtBottomRef.current = atBottom;
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const renderTrigger = () => {
    const referenceProps = getReferenceProps({
      ...getPopupTriggerAria(open, listboxId, 'listbox'),
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        event.stopPropagation();
      },
    });

    if (trigger) {
      if (isEnhanceableTrigger(trigger)) {
        const originalOnClick = trigger.props.onClick;
        return cloneElement(trigger, {
          ...referenceProps,
          ref: refs.setReference,
          disabled: disabled || (trigger.props as { disabled?: boolean }).disabled,
          onClick: (event: ReactMouseEvent<HTMLElement>) => {
            event.stopPropagation();
            originalOnClick?.(event);
            if (!event.defaultPrevented) {
              (
                referenceProps as {
                  onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
                }
              ).onClick?.(event);
            }
          },
        } as Record<string, unknown>);
      }

      return (
        <button
          type="button"
          ref={refs.setReference}
          disabled={disabled}
          className={styles.customTrigger}
          {...referenceProps}
        >
          {trigger}
        </button>
      );
    }

    return (
      <Button
        type="button"
        ref={refs.setReference}
        variant={variant}
        size={size}
        rounded={rounded}
        disabled={disabled}
        className={clsx(
          styles.trigger,
          styles[`variant-${variant}`],
          open ? styles.triggerOpen : false
        )}
        {...referenceProps}
      >
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <ChevronDownIcon
          size={16}
          className={clsx(styles.chevron, open ? styles.chevronOpen : false)}
          aria-hidden
        />
      </Button>
    );
  };

  return (
    <div className={clsx(styles.root, className)}>
      {renderTrigger()}

      {/* Keep items mounted when closed so option labels stay registered for the trigger. */}
      {!open ? (
        <div className={styles.optionsRegistrar} hidden aria-hidden>
          {children}
        </div>
      ) : null}

      {open ? (
        <FloatingPortal id="popup-root">
          <div
            ref={refs.setFloating}
            className={clsx(
              styles.menu,
              floatingClassName,
              !matchTriggerWidth && styles.menuAutoWidth
            )}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {searchable ? (
              <div
                className={styles.search}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <SearchBar
                  size="sm"
                  variant="secondary"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </div>
            ) : null}

            <div
              ref={listRef}
              id={listboxId}
              className={clsx(styles.list, 'scrollbar-minimal')}
              role="listbox"
              onScroll={handleListScroll}
            >
              {children}
              {isListEmpty && emptyPlaceholder ? (
                <div className={styles.emptyPlaceholder}>{emptyPlaceholder}</div>
              ) : null}
            </div>

            {footer ? (
              <div
                className={styles.footer}
                onMouseDown={(event) => event.stopPropagation()}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </FloatingPortal>
      ) : null}
    </div>
  );
}
