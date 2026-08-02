import { ReactNode } from 'react';

export type WhenProps = {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export function When({ condition, children, fallback = null }: WhenProps) {
  return <>{condition ? children : fallback}</>;
}
