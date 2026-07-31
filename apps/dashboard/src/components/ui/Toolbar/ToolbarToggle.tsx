'use client';

import clsx from '@/lib/clsx';
import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import { useToolbar } from './ToolbarContext';
import styles from './ToolbarToggle.module.css';

export function ToolbarToggle() {
  const { expanded, expandFrom, toggleExpanded } = useToolbar();

  // Matches the design: collapsed ← / expanded → when expandFrom=start (mirrored for end).
  const flipped = expandFrom === 'start' ? expanded : !expanded;

  return (
    <Button
      type="button"
      variant="ghost"
      size="md"
      icon
      rounded
      className={clsx(styles.toggle, flipped && styles.flipped)}
      aria-expanded={expanded}
      aria-label={
        expanded ? 'Réduire la barre d’outils' : 'Étendre la barre d’outils'
      }
      onClick={toggleExpanded}
    >
      <span className={styles.icon}>
        <ChevronLeftIcon size={16} aria-hidden strokeWidth={2} />
      </span>
    </Button>
  );
}
