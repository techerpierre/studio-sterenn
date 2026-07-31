import { ModalRoot } from './ModalRoot';

export const Modal = ModalRoot;

export type {
  ModalRootProps as ModalProps,
  ModalPlacement,
  ModalSize,
  ModalFooter,
  ModalFooterContext,
} from './ModalRoot';
export type { ModalContentProps } from './ModalContent';

export {
  ModalProvider,
  ModalContext,
  useModal,
  type ModalContextType,
} from './ModalContext';
export { createModalComponent } from './createModalComponent';
export { ModalRoot } from './ModalRoot';
export { ModalContent } from './ModalContent';
