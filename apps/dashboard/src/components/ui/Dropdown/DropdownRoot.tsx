'use client';

import { FloatingTree } from '@/lib/popup';
import { ReactNode } from 'react';

import { DropdownProvider } from './DropdownContext';
import { DropdownContent, type DropdownAlign } from './DropdownContent';

export type DropdownRootProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: DropdownAlign;
  rounded?: boolean;
  maxHeight?: number | string;
};

export function DropdownRoot({
  trigger,
  children,
  className,
  align = 'start',
  rounded = false,
  maxHeight,
}: DropdownRootProps) {
  return (
    <FloatingTree>
      <DropdownProvider>
        <DropdownContent
          trigger={trigger}
          className={className}
          align={align}
          rounded={rounded}
          maxHeight={maxHeight}
        >
          {children}
        </DropdownContent>
      </DropdownProvider>
    </FloatingTree>
  );
}
