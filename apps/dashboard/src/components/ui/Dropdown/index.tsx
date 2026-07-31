import { DropdownRoot } from './DropdownRoot';
import { DropdownItem } from './DropdownItem';
import { DropdownSection } from './DropdownSection';
import { DropdownSubsection } from './DropdownSubsection';

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  Section: DropdownSection,
  Subsection: DropdownSubsection,
});

export type { DropdownRootProps as DropdownProps } from './DropdownRoot';
export type { DropdownContentProps, DropdownAlign } from './DropdownContent';

export {
  DropdownProvider,
  DropdownContext,
  useDropdown,
  type DropdownContextType,
} from './DropdownContext';
export { DropdownRoot } from './DropdownRoot';
export { DropdownContent } from './DropdownContent';
export { DropdownItem, type DropdownItemProps } from './DropdownItem';
export {
  DropdownSection,
  type DropdownSectionProps,
} from './DropdownSection';
export {
  DropdownSubsection,
  type DropdownSubsectionProps,
} from './DropdownSubsection';
