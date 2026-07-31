import { ToolbarRoot } from './ToolbarRoot';
import { ToolbarItem } from './ToolbarItem';

export const Toolbar = Object.assign(ToolbarRoot, {
  Item: ToolbarItem,
});

export type { ToolbarRootProps as ToolbarProps } from './ToolbarRoot';
export type { ToolbarItemProps } from './ToolbarItem';
export type { ToolbarExpandFrom, ToolbarContextType } from './ToolbarContext';

export { ToolbarContext, useToolbar } from './ToolbarContext';
export { ToolbarRoot } from './ToolbarRoot';
export { ToolbarItem } from './ToolbarItem';
