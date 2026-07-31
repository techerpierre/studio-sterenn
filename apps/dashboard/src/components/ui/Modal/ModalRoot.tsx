'use client';

import { ReactNode, useContext } from 'react';

import { ModalContext, ModalProvider } from './ModalContext';
import {
  ModalContent,
  type ModalContentProps,
  type ModalFooter,
  type ModalFooterContext,
  type ModalPlacement,
  type ModalSize,
} from './ModalContent';

export type ModalRootProps = {
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

export type { ModalPlacement, ModalSize, ModalFooter, ModalFooterContext };

export function ModalRoot({
  trigger,
  children,
  title,
  footer,
  placement = 'center',
  size = 'md',
  fill = true,
  className,
  contentClassName,
}: ModalRootProps) {
  const existingContext = useContext(ModalContext);

  const content = (
    <ModalContent
      trigger={trigger}
      title={title}
      footer={footer}
      placement={placement}
      size={size}
      fill={fill}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </ModalContent>
  );

  if (existingContext) {
    return content;
  }

  return <ModalProvider>{content}</ModalProvider>;
}

export type { ModalContentProps };
