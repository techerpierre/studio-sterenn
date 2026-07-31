'use client';

import { createContext, useContext } from 'react';

export type ToolbarExpandFrom = 'start' | 'end';

export type ToolbarContextType = {
  expanded: boolean;
  expandFrom: ToolbarExpandFrom;
  toggleExpanded: () => void;
};

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

export function useToolbar() {
  const context = useContext(ToolbarContext);

  if (!context) {
    throw new Error('useToolbar must be used within a Toolbar');
  }

  return context;
}
