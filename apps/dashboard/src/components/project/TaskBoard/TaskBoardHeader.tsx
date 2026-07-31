'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { PageHeader } from '@/app/dashboard/workspaces/settings/layouts/PageHeader';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';

export type TaskBoardHeaderProps = {
  onScrollColumns: (direction: -1 | 1) => void;
};

export function TaskBoardHeader({ onScrollColumns }: TaskBoardHeaderProps) {
  return (
    <PageHeader
      title="Table des taches"
      right={
        <Box align="center" gap={4}>
          <Button
            type="button"
            icon
            variant="ghost"
            aria-label="Faire défiler les colonnes vers la gauche"
            onClick={() => onScrollColumns(-1)}
          >
            <ChevronLeftIcon size={16} aria-hidden />
          </Button>
          <Button
            type="button"
            icon
            variant="ghost"
            aria-label="Faire défiler les colonnes vers la droite"
            onClick={() => onScrollColumns(1)}
          >
            <ChevronRightIcon size={16} aria-hidden />
          </Button>
        </Box>
      }
    />
  );
}
