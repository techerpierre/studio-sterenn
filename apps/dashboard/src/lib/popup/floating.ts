'use client';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  safePolygon,
  type Placement,
  type UseFloatingReturn,
} from '@floating-ui/react';
import { useMemo } from 'react';

import floatingStyles from './floating.module.css';

export type AnchoredFloatingRole = 'menu' | 'listbox' | 'dialog';

export type UseAnchoredFloatingOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
  /** Gap between reference and floating element. @default 6 */
  offset?: number;
  matchReferenceWidth?: boolean;
  role?: AnchoredFloatingRole;
  /** Node id when nested inside a `FloatingTree`. */
  nodeId?: string;
  /** @default 'click' */
  trigger?: 'click' | 'hover';
};

export type UseAnchoredFloatingReturn = {
  refs: UseFloatingReturn['refs'];
  floatingStyles: UseFloatingReturn['floatingStyles'];
  context: UseFloatingReturn['context'];
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  floatingClassName: string;
};

/**
 * Shared floating-ui setup for anchored popups (portal + fixed + dismiss).
 */
export function useAnchoredFloating({
  open,
  onOpenChange,
  placement = 'bottom-start',
  offset: offsetValue = 6,
  matchReferenceWidth = false,
  role = 'menu',
  nodeId,
  trigger = 'click',
}: UseAnchoredFloatingOptions): UseAnchoredFloatingReturn {
  const middleware = useMemo(() => {
    const edgePadding = 8;

    const list = [
      offset(offsetValue),
      // Keep top/bottom axis; don't jump to left/right when height is tight —
      // `shift` will slide the overlay over the trigger so it fits in the viewport.
      flip({
        padding: edgePadding,
        crossAxis: false,
        fallbackStrategy: 'bestFit',
      }),
      shift({
        padding: edgePadding,
        mainAxis: true,
        crossAxis: true,
      }),
    ];

    if (matchReferenceWidth) {
      list.push(
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          },
        })
      );
    }

    return list;
  }, [matchReferenceWidth, offsetValue]);

  const { refs, floatingStyles: positionStyles, context } = useFloating({
    nodeId,
    open,
    onOpenChange,
    placement,
    strategy: 'fixed',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, {
    enabled: trigger === 'click',
  });
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    handleClose: safePolygon(),
  });
  const dismiss = useDismiss(context, {
    bubbles: { escapeKey: false, outsidePress: true },
    capture: { escapeKey: true, outsidePress: true },
  });
  const roleInteraction = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    dismiss,
    roleInteraction,
  ]);

  return {
    refs,
    floatingStyles: positionStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    floatingClassName: floatingStyles.floatingPopup,
  };
}

export {
  FloatingPortal,
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  useFloatingTree,
} from '@floating-ui/react';
