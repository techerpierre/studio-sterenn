'use client';

import clsx from '@/lib/clsx';
import {
  FloatingNode,
  FloatingPortal,
  getPopupTriggerAria,
  isEnhanceableTrigger,
  useAnchoredFloating,
  useFloatingNodeId,
} from '@/lib/popup';
import {
  cloneElement,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useId,
} from 'react';

import { useDropdown } from './DropdownContext';
import styles from './DropdownContent.module.css';

export type DropdownAlign = 'start' | 'end' | 'filled';

export type DropdownContentProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: DropdownAlign;
  rounded?: boolean;
  maxHeight?: number | string;
};

function placementForAlign(align: DropdownAlign) {
  if (align === 'end') return 'bottom-end' as const;
  return 'bottom-start' as const;
}

export function DropdownContent({
  trigger,
  children,
  className,
  align = 'start',
  rounded = false,
  maxHeight,
}: DropdownContentProps) {
  const { open, setOpen } = useDropdown();
  const menuId = useId();
  const nodeId = useFloatingNodeId();

  const {
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    floatingClassName,
  } = useAnchoredFloating({
    open,
    onOpenChange: setOpen,
    placement: placementForAlign(align),
    matchReferenceWidth: align === 'filled',
    role: 'menu',
    nodeId,
    trigger: 'click',
  });

  const renderTrigger = () => {
    const stopBubble = (event: ReactMouseEvent<HTMLElement>) => {
      event.stopPropagation();
    };

    const referenceProps = getReferenceProps({
      ...getPopupTriggerAria(open, menuId, 'menu'),
      onClick: stopBubble,
    });

    if (isEnhanceableTrigger(trigger)) {
      const originalOnClick = trigger.props.onClick;
      return cloneElement(trigger, {
        ...referenceProps,
        ref: refs.setReference,
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          stopBubble(event);
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
        className={clsx(
          styles.triggerButton,
          rounded ? styles.triggerButtonRounded : false,
          open ? styles.triggerButtonOpen : false
        )}
        {...referenceProps}
      >
        {trigger}
      </button>
    );
  };

  return (
    <FloatingNode id={nodeId}>
      <div
        className={clsx(
          styles.root,
          align === 'filled' && styles['align-filled'],
          className
        )}
      >
        {renderTrigger()}

        {open ? (
          <FloatingPortal id="popup-root">
            <div
              ref={refs.setFloating}
              id={menuId}
              className={clsx(
                styles.menu,
                floatingClassName,
                maxHeight != null && styles.menuScrollable,
                'scrollbar-minimal'
              )}
              style={{
                ...floatingStyles,
                ...(maxHeight != null ? { maxHeight } : {}),
              }}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingPortal>
        ) : null}
      </div>
    </FloatingNode>
  );
}
