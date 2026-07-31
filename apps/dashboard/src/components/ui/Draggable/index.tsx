import { DraggableRoot } from './DraggableRoot';
import { DraggableList } from './DraggableList';
import { DraggableItem } from './DraggableItem';

export const Draggable = Object.assign(DraggableRoot, {
  List: DraggableList,
  Item: DraggableItem,
});

export type { DraggableRootProps as DraggableProps } from './DraggableRoot';
export type { DraggableListProps } from './DraggableList';
export type { DraggableItemProps } from './DraggableItem';
export type { DraggableOrientation } from './DraggableContext';

export { DraggableRoot } from './DraggableRoot';
export { DraggableList } from './DraggableList';
export { DraggableItem } from './DraggableItem';
export {
  DraggableListProvider,
  useDraggableList,
  type DraggableListContextType,
} from './DraggableContext';
