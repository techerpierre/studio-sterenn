'use client';

import clsx from '@/lib/clsx';
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ToolbarContext,
  type ToolbarExpandFrom,
} from './ToolbarContext';
import { ToolbarItem, type ToolbarItemProps } from './ToolbarItem';
import styles from './ToolbarRoot.module.css';
import { ToolbarToggle } from './ToolbarToggle';

export type ToolbarRootProps = {
  children: ReactNode;
  className?: string;
  /** How many items stay visible when collapsed. @default 2 */
  visibleCount?: number;
  /**
   * Chevron side and expansion direction.
   * - `start`: chevron left, tools expand to the right (design mock)
   * - `end`: chevron right, tools expand to the left (e.g. editor bottom-right)
   * @default 'start'
   */
  expandFrom?: ToolbarExpandFrom;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

function isToolbarItem(
  child: ReactNode
): child is ReactElement<ToolbarItemProps> {
  if (!isValidElement(child)) return false;
  if (child.type === ToolbarItem) return true;
  const type = child.type as { displayName?: string };
  return type.displayName === ToolbarItem.displayName;
}

/** Duck-type for conditional wrappers like `When` (condition + children). */
function isConditionalWrapper(
  child: ReactNode
): child is ReactElement<{
  condition: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
}> {
  if (!isValidElement(child) || isToolbarItem(child)) return false;
  const props = child.props;
  return (
    typeof props === 'object' &&
    props !== null &&
    'condition' in props &&
    typeof (props as { condition: unknown }).condition === 'boolean'
  );
}

/**
 * Flatten toolbar items, including those nested in conditional wrappers.
 * Re-key uniquely — nested `Children.toArray` would otherwise reuse `.0`, `.1`…
 */
function collectToolbarItems(
  children: ReactNode,
  keyPrefix = ''
): ReactElement<ToolbarItemProps>[] {
  return Children.toArray(children).flatMap((child, index) => {
    const key = `${keyPrefix}${index}`;
    if (isToolbarItem(child)) {
      return [cloneElement(child, { key })];
    }
    if (isConditionalWrapper(child)) {
      const { condition, children: nested, fallback = null } = child.props;
      return collectToolbarItems(
        condition ? nested : fallback,
        `${key}.`,
      );
    }
    return [];
  });
}

export function ToolbarRoot({
  children,
  className,
  visibleCount = 2,
  expandFrom = 'start',
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
}: ToolbarRootProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : uncontrolledExpanded;

  const setExpanded = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledExpanded(next);
      }
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange]
  );

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  const items = useMemo(
    () => collectToolbarItems(children),
    [children]
  );

  const primaryItems = items.slice(0, Math.max(0, visibleCount));
  const extraItems = items.slice(Math.max(0, visibleCount));
  const canExpand = extraItems.length > 0;

  const contextValue = useMemo(
    () => ({
      expanded,
      expandFrom,
      toggleExpanded,
    }),
    [expanded, expandFrom, toggleExpanded]
  );

  return (
    <ToolbarContext.Provider value={contextValue}>
      <div
        role="toolbar"
        className={clsx(
          styles.root,
          expandFrom === 'end' ? styles.fromEnd : styles.fromStart,
          className
        )}
      >
        {canExpand ? <ToolbarToggle /> : null}

        <div
          className={clsx(
            styles.cluster,
            expandFrom === 'end' && styles.clusterEnd
          )}
        >
          {primaryItems}

          {canExpand ? (
            <div
              className={clsx(styles.extra, expanded && styles.extraOpen)}
              aria-hidden={!expanded}
            >
              <div className={styles.extraInner}>{extraItems}</div>
            </div>
          ) : null}
        </div>
      </div>
    </ToolbarContext.Provider>
  );
}
