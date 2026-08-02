'use client';

import {
  createSkeletonComponent,
  Skeleton,
} from '@/components/ui/Skeleton';

import styles from './TagSelectOptionsSkeleton.module.css';

export type TagSelectOptionsSkeletonProps = {
  count?: number;
};

export const TagSelectOptionsSkeleton =
  createSkeletonComponent<TagSelectOptionsSkeletonProps>(
    function TagSelectOptionsSkeletonTemplate({ count = 4 }) {
      return (
        <div
          className={styles.list}
          aria-busy
          aria-label="Chargement des tags"
        >
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className={styles.row}>
              <Skeleton circle width={8} height={8} />
              <Skeleton
                height={14}
                width={OPTION_WIDTHS[index % OPTION_WIDTHS.length]}
                rounded
              />
            </div>
          ))}
        </div>
      );
    },
  );

const OPTION_WIDTHS = ['70%', '55%', '82%', '48%'] as const;
