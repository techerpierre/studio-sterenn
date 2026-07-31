'use client';

import clsx from '@/lib/clsx';
import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { TabsProvider, useTabs, type TabsSize, type TabsVariant } from './TabsContext';
import styles from './TabsRoot.module.css';

export type TabsRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabsSize;
  variant?: TabsVariant;
  fullWidth?: boolean;
  centered?: boolean;
};

export function TabsRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  centered = false,
  className,
  ...props
}: TabsRootProps) {
  return (
    <TabsProvider
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
    >
      <TabsList centered={centered} className={className} {...props}>
        {children}
      </TabsList>
    </TabsProvider>
  );
}

type TabsListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  centered?: boolean;
};

function TabsList({ children, className, centered = false, ...props }: TabsListProps) {
  const { value, getItem, fullWidth, variant } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const hasMeasuredRef = useRef(false);
  const [indicator, setIndicator] = useState({
    x: 0,
    width: 0,
    visible: false,
    animate: false,
  });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const active = value ? getItem(value) : undefined;
      if (!active) {
        setIndicator((current) =>
          current.visible
            ? { ...current, visible: false, width: 0 }
            : current
        );
        return;
      }

      const next = {
        x: active.offsetLeft,
        width: active.offsetWidth,
        visible: true,
        animate: hasMeasuredRef.current,
      };
      hasMeasuredRef.current = true;
      setIndicator(next);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(list);

    const active = value ? getItem(value) : undefined;
    if (active) observer.observe(active);

    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [value, getItem, children]);

  const indicatorStyle = {
    '--tabs-indicator-x': `${indicator.x}px`,
    '--tabs-indicator-width': `${indicator.width}px`,
  } as CSSProperties;

  return (
    <div
      ref={listRef}
      role="tablist"
      className={clsx(
        styles.list,
        styles[variant],
        fullWidth && styles.fullWidth,
        centered && styles.centered,
        className
      )}
      {...props}
    >
      {children}
      <span
        className={clsx(
          styles.indicator,
          indicator.visible && styles.indicatorVisible,
          indicator.animate && styles.indicatorAnimate
        )}
        style={indicatorStyle}
        aria-hidden
      />
    </div>
  );
}
