'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
  id?: string;
  enabled?: boolean;
};

export function Portal({
  children,
  container,
  id = 'portal-root',
  enabled = true,
}: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | DocumentFragment | null>(
    null
  );

  useEffect(() => {
    if (!enabled) {
      setMountNode(null);
      return;
    }

    if (container) {
      setMountNode(container);
      return;
    }

    let element = document.getElementById(id);
    let created = false;

    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', id);
      document.body.appendChild(element);
      created = true;
    }

    setMountNode(element);

    return () => {
      if (created && element && !element.hasChildNodes()) {
        element.remove();
      }
    };
  }, [container, enabled, id]);

  if (!enabled || !mountNode) return null;

  return createPortal(children, mountNode);
}
