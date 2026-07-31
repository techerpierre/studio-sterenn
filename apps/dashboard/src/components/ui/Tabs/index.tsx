import { TabsRoot } from './TabsRoot';
import { TabsItem } from './TabsItem';

export const Tabs = Object.assign(TabsRoot, {
  Item: TabsItem,
});

export type { TabsRootProps as TabsProps } from './TabsRoot';
export type { TabsItemProps } from './TabsItem';
export type { TabsSize, TabsVariant } from './TabsContext';

export {
  TabsProvider,
  TabsContext,
  useTabs,
  type TabsContextType,
} from './TabsContext';
export { TabsRoot } from './TabsRoot';
export { TabsItem } from './TabsItem';
