import clsx from '@/lib/clsx';
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
} from 'react';
import { toCssSize, toTemplate } from '@/lib/utils';

import styles from './styles.module.css';

export type GridAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';
export type GridContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';
export type GridAutoFlow =
  | 'row'
  | 'column'
  | 'dense'
  | 'row-dense'
  | 'column-dense';

type GridOwnProps = {
  columns?: number | string;
  rows?: number | string;
  align?: GridAlign;
  justify?: GridJustify;
  alignContent?: GridContent;
  justifyContent?: GridContent;
  autoFlow?: GridAutoFlow;
  gap?: number | string;
  gapX?: number | string;
  gapY?: number | string;
  padding?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
  inline?: boolean;
};

export type GridProps<TAs extends ElementType = 'div'> = GridOwnProps & {
  as?: TAs;
} & Omit<ComponentPropsWithoutRef<TAs>, keyof GridOwnProps | 'as'>;

export function Grid<TAs extends ElementType = 'div'>({
  as,
  columns,
  rows,
  align,
  justify,
  alignContent,
  justifyContent,
  autoFlow,
  gap,
  gapX,
  gapY,
  padding,
  paddingX,
  paddingY,
  inline = false,
  className,
  style,
  ...props
}: GridProps<TAs>) {
  const Component = (as ?? 'div') as ElementType;
  const gridStyle: CSSProperties = {
    ...(columns !== undefined
      ? { gridTemplateColumns: toTemplate(columns) }
      : null),
    ...(rows !== undefined ? { gridTemplateRows: toTemplate(rows) } : null),
    ...(gap !== undefined ? { gap: toCssSize(gap) } : null),
    ...(gapX !== undefined ? { columnGap: toCssSize(gapX) } : null),
    ...(gapY !== undefined ? { rowGap: toCssSize(gapY) } : null),
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
        styles.grid,
        inline ? styles.inline : false,
        align ? styles[`align-${align}`] : false,
        justify ? styles[`justify-${justify}`] : false,
        alignContent ? styles[`align-content-${alignContent}`] : false,
        justifyContent ? styles[`justify-content-${justifyContent}`] : false,
        autoFlow ? styles[`auto-flow-${autoFlow}`] : false,
        className
      )}
      style={gridStyle}
      {...props}
    />
  );
}
