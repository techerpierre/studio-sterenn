'use client';

import clsx from '@/lib/clsx';
import {
  FloatingNode,
  FloatingPortal,
  useAnchoredFloating,
  useFloatingNodeId,
} from '@/lib/popup';
import { ChevronRightIcon } from 'lucide-react';
import { ReactNode, useId, useState } from 'react';

import styles from './DropdownSubsection.module.css';

export type DropdownSubsectionProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DropdownSubsection({
  label,
  children,
  className,
}: DropdownSubsectionProps) {
  const [open, setOpen] = useState(false);
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
    placement: 'right-start',
    offset: 0,
    role: 'menu',
    nodeId,
    trigger: 'hover',
  });

  return (
    <FloatingNode id={nodeId}>
      <div className={clsx(styles.subsection, className)}>
        <div className={styles.itemWrap}>
          <button
            type="button"
            ref={refs.setReference}
            className={styles.trigger}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            {...getReferenceProps({
              onClick: () => setOpen((current) => !current),
            })}
          >
            <span className={styles.label}>{label}</span>
            <ChevronRightIcon size={16} className={styles.chevron} aria-hidden />
          </button>
        </div>

        {open ? (
          <FloatingPortal id="popup-root">
            <div
              ref={refs.setFloating}
              id={menuId}
              className={clsx(styles.menu, floatingClassName)}
              style={floatingStyles}
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
