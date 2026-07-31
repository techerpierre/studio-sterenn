'use client';

import { ReactNode, useState } from 'react';

import { Box } from '@/components/ui/Box';
import { Button, ButtonVariant } from '@/components/ui/Button';
import {
  createModalComponent,
  Modal,
  useModal,
} from '@/components/ui/Modal';
import { Text } from '@/components/ui/Text';

export type ValidateActionDialogProps = {
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
  validateLabel?: string;
  cancelLabel?: string;
  onValidate: () => void | Promise<void>;
  /**
   * Danger mode: validate becomes `danger` and moves to the left;
   * cancel becomes `outline` and moves to the right.
   */
  critical?: boolean;
  criticalVariant?: Extract<ButtonVariant, 'danger' | 'warning'>;
  className?: string;
};

export const ValidateActionDialog = createModalComponent(
  function ValidateActionDialog({
    trigger,
    title,
    description,
    validateLabel = 'Valider',
    cancelLabel = 'Annuler',
    criticalVariant = 'danger',
    onValidate,
    critical = false,
    className,
  }: ValidateActionDialogProps) {
    const { close } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValidate = async () => {
      setIsSubmitting(true);
      try {
        await onValidate();
        close();
      } finally {
        setIsSubmitting(false);
      }
    };

    const cancelButton = (
      <Button
        type="button"
        variant="outline"
        onClick={close}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
    );

    const validateButton = (
      <Button
        type="button"
        variant={critical ? criticalVariant : 'default'}
        onClick={handleValidate}
        loading={isSubmitting}
      >
        {validateLabel}
      </Button>
    );

    return (
      <Modal
        title={title}
        size="sm"
        fill={false}
        className={className}
        trigger={trigger}
        footer={
          critical ? (
            <>
              {validateButton}
              {cancelButton}
            </>
          ) : (
            <>
              {cancelButton}
              {validateButton}
            </>
          )
        }
      >
        <Box direction="column" gap={8}>
          {typeof description === 'string' ? (
            <Text.Body>{description}</Text.Body>
          ) : (
            description
          )}
        </Box>
      </Modal>
    );
  }
);
