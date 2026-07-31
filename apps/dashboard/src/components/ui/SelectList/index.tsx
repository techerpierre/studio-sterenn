import { SelectListRoot } from './SelectListRoot';
import { SelectListItem } from './SelectListItem';
import { SelectListLoadMore } from './SelectListLoadMore';

export const SelectList = Object.assign(SelectListRoot, {
  Item: SelectListItem,
  LoadMore: SelectListLoadMore,
});

export type { SelectListRootProps as SelectListProps } from './SelectListRoot';
export { SelectListRoot } from './SelectListRoot';
export { SelectListItem, type SelectListItemProps } from './SelectListItem';
export {
  SelectListLoadMore,
  type SelectListLoadMoreProps,
} from './SelectListLoadMore';
export {
  SelectListProvider,
  SelectListContext,
  useSelectList,
  type SelectListContextType,
} from './SelectListContext';
