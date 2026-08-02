'use client';

import { Button } from '@/components/ui/Button';
import { useSelect } from '@/components/ui/Select';

export type CreateTagSelectActionProps = {
  label: string;
  onRequestCreate: () => void;
};

export function CreateTagSelectAction({
  label,
  onRequestCreate,
}: CreateTagSelectActionProps) {
  const { close } = useSelect();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => {
        close();
        onRequestCreate();
      }}
    >
      {label}
    </Button>
  );
}
