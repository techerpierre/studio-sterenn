'use client';

import { Box } from '@/components/ui/Box';
import {
  createSkeletonComponent,
  Skeleton,
} from '@/components/ui/Skeleton';

import styles from './styles.module.css';

export type ProjectListSkeletonProps = {
  count?: number;
};

export const ProjectListSkeleton = createSkeletonComponent<ProjectListSkeletonProps>(
  function ProjectListSkeletonTemplate({ count = 5 }) {
    return (
      <Box
        direction="column"
        gap={4}
        className={styles.skeletonList}
        aria-busy
        aria-label="Chargement des projets"
      >
        {Array.from({ length: count }, (_, index) => (
          <Skeleton
            key={index}
            height={32}
            rounded
            width={SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]}
            className={styles.skeletonItem}
          />
        ))}
      </Box>
    );
  },
);

const SKELETON_WIDTHS = ['72%', '58%', '84%', '64%', '76%'] as const;
