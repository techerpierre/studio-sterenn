'use client';

import clsx from '@/lib/clsx';
import {
  enhanceClickableTrigger,
  getPopupTriggerAria,
} from '@/lib/popup';
import { XIcon } from 'lucide-react';
import {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/Button';
import { Portal } from '@/components/ui/Portal';
import { Text } from '@/components/ui/Text';

import { useModal } from './ModalContext';
import styles from './ModalContent.module.css';

export type ModalPlacement = 'center' | 'left' | 'right';
export type ModalSize = 'xs' | 'sm' | 'md';

export type ModalFooterContext = {
  close: () => void;
};

export type ModalFooter =
  | ReactNode
  | ((ctx: ModalFooterContext) => ReactNode);

export type ModalContentProps = {
  trigger: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  footer?: ModalFooter;
  placement?: ModalPlacement;
  size?: ModalSize;
  fill?: boolean;
  className?: string;
  contentClassName?: string;
};

const EXIT_MS = 220;

function resolveFooter(
  footer: ModalFooter | undefined,
  ctx: ModalFooterContext
): ReactNode {
  if (footer === undefined || footer === null) return null;
  return typeof footer === 'function' ? footer(ctx) : footer;
}

export function ModalContent({
  trigger,
  children,
  title,
  footer,
  placement = 'center',
  size = 'md',
  fill = true,
  className,
  contentClassName,
}: ModalContentProps) {
  const { open, toggle, close } = useModal();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const footerContent = resolveFooter(footer, { close });

  useEffect(() => {
    if (open) {
      setVisible(false);
      setMounted(true);
      let enterFrame = 0;
      const mountFrame = requestAnimationFrame(() => {
        enterFrame = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      return () => {
        cancelAnimationFrame(mountFrame);
        cancelAnimationFrame(enterFrame);
      };
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!visible || !panelRef.current) return;
    panelRef.current.focus();
  }, [visible]);

  const handleTriggerClick = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
    toggle();
  };

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  const renderTrigger = () => {
    const enhanced = enhanceClickableTrigger(trigger, {
      open,
      controlsId: dialogId,
      onClick: handleTriggerClick,
      haspopup: 'dialog',
    });

    if (enhanced) return enhanced;

    return (
      <button
        type="button"
        className={styles.triggerButton}
        {...getPopupTriggerAria(open, dialogId, 'dialog')}
        onClick={handleTriggerClick}
      >
        {trigger}
      </button>
    );
  };

  return (
    <div ref={rootRef} className={clsx(styles.root, className)}>
      {renderTrigger()}

      {mounted ? (
        <Portal id="modal-root">
          <div
            className={clsx(
              styles.overlay,
              styles[`overlay-${placement}`],
              fill ? styles.overlayFill : false,
              visible ? styles.overlayVisible : false
            )}
            onMouseDown={handleOverlayClick}
          >
            <div
              ref={panelRef}
              id={dialogId}
              className={clsx(
                styles.panel,
                styles[`panel-${placement}`],
                styles[`size-${size}`],
                fill ? styles.panelFill : false,
                visible ? styles.panelVisible : false,
                contentClassName
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              tabIndex={-1}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <header
                className={clsx(
                  styles.header,
                  !title ? styles.headerNoTitle : false
                )}
              >
                {title ? (
                  <Text.BodyLarge
                    as="h2"
                    id={titleId}
                    className={styles.title}
                  >
                    {title}
                  </Text.BodyLarge>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon
                  rounded
                  className={styles.closeButton}
                  onClick={close}
                  aria-label="Fermer"
                >
                  <XIcon size={16} aria-hidden />
                </Button>
              </header>

              <div className={clsx(styles.body, 'scrollbar-minimal')}>
                {children}
              </div>

              {footerContent ? (
                <footer className={styles.footer}>{footerContent}</footer>
              ) : null}
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}
