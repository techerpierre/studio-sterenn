import clsx from '@/lib/clsx';
import { ComponentPropsWithoutRef, ElementType } from 'react';

import styles from './styles.module.css';

export type TextType =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'bodyLarge'
  | 'bodyDefault'
  | 'bodySmall'
  | 'caption';

export type TextProps<TAs extends ElementType = 'p'> = {
  as?: TAs;
} & ComponentPropsWithoutRef<TAs>;

function textComponent<TType extends TextType, TDefaultAs extends ElementType>(
  type: TType,
  defaultAs: TDefaultAs
) {
  return function TextComponent<TAs extends ElementType = TDefaultAs>({
    as,
    className,
    ...props
  }: TextProps<TAs>) {
    const Component = (as ?? defaultAs) as ElementType;

    return <Component className={clsx(styles[type], className)} {...props} />;
  };
}

export const Heading = textComponent('heading1', 'h1');
export const SubHeading = textComponent('heading2', 'h2');
export const ThirdHeading = textComponent('heading3', 'h3');
export const FourthHeading = textComponent('heading4', 'h4');
export const BodyLarge = textComponent('bodyLarge', 'p');
export const Body = textComponent('bodyDefault', 'p');
export const BodySmall = textComponent('bodySmall', 'p');
export const Caption = textComponent('caption', 'p');

export const Text = {
  Heading,
  SubHeading,
  ThirdHeading,
  FourthHeading,
  BodyLarge,
  Body,
  BodySmall,
  Caption,
};
