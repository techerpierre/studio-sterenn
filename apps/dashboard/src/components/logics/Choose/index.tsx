import { ReactNode } from 'react';

export type ChooseProps = {
  when: boolean;
  then: ReactNode;
  otherwise: ReactNode;
};

export function Choose({ when, then, otherwise }: ChooseProps) {
  return <>{when ? then : otherwise}</>;
}
