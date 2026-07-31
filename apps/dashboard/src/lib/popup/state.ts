'use client';

import { useCallback, useMemo, useState } from 'react';

export type PopupState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
};

/**
 * Shared open/close state for overlay menus (Dropdown, Select, …).
 */
export function usePopupState(): PopupState {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      close,
    }),
    [open, toggle, close]
  );
}
