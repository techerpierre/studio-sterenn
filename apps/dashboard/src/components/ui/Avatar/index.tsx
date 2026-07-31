'use client';

import clsx from '@/lib/clsx';
import { getInitials } from '@/lib/utils';
import { HTMLAttributes, useState } from 'react';
import { UserIcon } from 'lucide-react';

import styles from './styles.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: AvatarSize;
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(src) && !hasError;
  const initials = name ? getInitials(name) : '';
  const label = alt ?? name ?? 'Avatar';

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className={clsx(styles.avatar, styles[size], className)}
      role="img"
      aria-label={label}
      {...props}
    >
      {showImage ? (
        <img
          className={styles.image}
          src={src ?? undefined}
          alt={label}
          onError={handleError}
        />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : (
        <UserIcon size={ICON_SIZE[size]} className={styles.icon} aria-hidden />
      )}
    </div>
  );
}

const ICON_SIZE: Record<AvatarSize, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};
