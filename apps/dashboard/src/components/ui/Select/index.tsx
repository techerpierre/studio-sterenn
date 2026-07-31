import { SelectRoot } from './SelectRoot';
import { SelectItem } from './SelectItem';
import { SelectSection } from './SelectSection';

export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
  Section: SelectSection,
});

export type { SelectRootProps as SelectProps } from './SelectRoot';
export type { SelectContentProps } from './SelectContent';

export {
  SelectProvider,
  SelectContext,
  useSelect,
  type SelectContextType,
} from './SelectContext';
export { SelectRoot } from './SelectRoot';
export { SelectContent } from './SelectContent';
export { SelectItem, type SelectItemProps } from './SelectItem';
export {
  SelectSection,
  type SelectSectionProps,
} from './SelectSection';
