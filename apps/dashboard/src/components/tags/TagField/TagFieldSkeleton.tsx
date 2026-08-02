'use client';

import {
  createSkeletonComponent,
  Skeleton,
} from '@/components/ui/Skeleton';

import styles from './TagFieldSkeleton.module.css';

export type TagFieldSkeletonProps = {
  count?: number;
};

export const TagFieldSkeleton = createSkeletonComponent<TagFieldSkeletonProps>(
  function TagFieldSkeletonTemplate({ count = 3 }) {
    return (
      <div
        className={styles.list}
        aria-busy
        aria-label="Chargement des tags"
      >
        {Array.from({ length: count }, (_, index) => (
          <Skeleton
            key={index}
            className={styles.chip}
            height={22}
            width={CHIP_WIDTHS[index % CHIP_WIDTHS.length]}
            rounded
          />
        ))}
      </div>
    );
  },
);

const CHIP_WIDTHS = [64, 80, 56] as const;
