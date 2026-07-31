'use client';

import { hasElementProp } from '@/lib/utils';
import {
  cloneElement,
  isValidElement,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';

export type PopupHasPopup = 'menu' | 'listbox' | 'dialog';

type TriggerProps = {
  onClick?: MouseEventHandler<HTMLElement>;
};

export type PopupTriggerAria = {
  'aria-haspopup': PopupHasPopup;
  'aria-expanded': boolean;
  'aria-controls': string;
};

/**
 * Builds ARIA attributes shared by popup triggers.
 */
export function getPopupTriggerAria(
  open: boolean,
  controlsId: string,
  haspopup: PopupHasPopup = 'menu'
): PopupTriggerAria {
  return {
    'aria-haspopup': haspopup,
    'aria-expanded': open,
    'aria-controls': controlsId,
  };
}

function getElementTypeName(type: ReactElement['type']): string | undefined {
  if (typeof type === 'string') return type;

  if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
    const named = type as { displayName?: string; name?: string };
    return named.displayName ?? named.name;
  }

  return undefined;
}

/**
 * Triggers that already render a `<button>` (or accept `onClick`) should be
 * enhanced in place — never wrapped, to avoid nested buttons.
 */
export function isEnhanceableTrigger(
  trigger: ReactNode
): trigger is ReactElement<TriggerProps> {
  if (!isValidElement<TriggerProps>(trigger)) return false;
  if (hasElementProp(trigger, 'onClick')) return true;
  if (trigger.type === 'button') return true;

  const typeName = getElementTypeName(trigger.type);
  return typeName === 'Button';
}

/**
 * If `trigger` is already clickable / a button, merges toggle behavior and ARIA props.
 * Returns `null` when the caller should wrap `trigger` in its own button.
 */
export function enhanceClickableTrigger(
  trigger: ReactNode,
  {
    open,
    controlsId,
    onClick,
    haspopup = 'menu',
  }: {
    open: boolean;
    controlsId: string;
    onClick: (event: ReactMouseEvent<HTMLElement>) => void;
    haspopup?: PopupHasPopup;
  }
): ReactElement | null {
  if (!isEnhanceableTrigger(trigger)) {
    return null;
  }

  const originalOnClick = trigger.props.onClick;
  const aria = getPopupTriggerAria(open, controlsId, haspopup);

  return cloneElement(trigger, {
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      originalOnClick?.(event);
      if (!event.defaultPrevented) {
        onClick(event);
      }
    },
    ...aria,
  } as Partial<TriggerProps> & Record<string, unknown>);
}
