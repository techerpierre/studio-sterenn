import clsx from '@/lib/clsx';
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
} from 'react';
import { toCssSize } from '@/lib/utils';

import styles from './styles.module.css';

export type BoxDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type BoxAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type BoxJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';
export type BoxWrap = boolean | 'wrap' | 'nowrap' | 'wrap-reverse';

type BoxOwnProps = {
  direction?: BoxDirection;
  align?: BoxAlign;
  justify?: BoxJustify;
  wrap?: BoxWrap;
  gap?: number | string;
  padding?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
  inline?: boolean;
};

export type BoxProps<TAs extends ElementType = 'div'> = BoxOwnProps & {
  as?: TAs;
} & Omit<ComponentPropsWithoutRef<TAs>, keyof BoxOwnProps | 'as'>;

export function Box<TAs extends ElementType = 'div'>({
  as,
  direction = 'row',
  align,
  justify,
  wrap,
  gap,
  padding,
  paddingX,
  paddingY,
  inline = false,
  className,
  style,
  ...props
}: BoxProps<TAs>) {
  const Component = (as ?? 'div') as ElementType;
  const boxStyle: CSSProperties = {
    ...(gap !== undefined ? { gap: toCssSize(gap) } : null),
    ...(padding !== undefined ? { padding: toCssSize(padding) } : null),
    ...(paddingX !== undefined
      ? {
          paddingLeft: toCssSize(paddingX),
          paddingRight: toCssSize(paddingX),
        }
      : null),
    ...(paddingY !== undefined
      ? {
          paddingTop: toCssSize(paddingY),
          paddingBottom: toCssSize(paddingY),
        }
      : null),
    ...(style as CSSProperties | undefined),
  };

  return (
    <Component
      className={clsx(
        styles.box,
        inline ? styles.inline : false,
        styles[`direction-${direction}`],
        align ? styles[`align-${align}`] : false,
        justify ? styles[`justify-${justify}`] : false,
        resolveWrap(wrap),
        className
      )}
      style={boxStyle}
      {...props}
    />
  );
}

function resolveWrap(wrap: BoxWrap | undefined): string | false {
  if (wrap === undefined) return false;
  if (wrap === true) return styles.wrap;
  if (wrap === false) return styles.nowrap;
  return styles[wrap];
}
