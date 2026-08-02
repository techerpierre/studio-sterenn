"use client";

import { Tag } from "@sterenn/api-contracts";
import { XIcon } from "lucide-react";
import { CSSProperties } from "react";

import { Badge } from "@/components/ui/Badge";

import styles from "./styles.module.css";

export type TagChipProps = {
  tag: Tag;
  disabled?: boolean;
  busy?: boolean;
  size?: "sm" | "md";
  onRemove?: (tagId: string) => void;
};

export function TagChip({
  tag,
  disabled,
  busy,
  size = "md",
  onRemove,
}: TagChipProps) {
  const bgColor = `color-mix(in srgb, ${tag.color} 16%, white)`;

  return (
    <Badge
      size={size}
      className={styles.badge}
      style={
        {
          "--badge-fg": tag.color,
          "--badge-bg": bgColor,
        } as CSSProperties
      }
    >
      {tag.name}
      {onRemove ? (
        <button
          type="button"
          className={styles.remove}
          style={{ backgroundColor: bgColor }}
          aria-label={`Retirer le tag ${tag.name}`}
          disabled={disabled || busy}
          onClick={() => onRemove(tag.id)}
        >
          <XIcon size={12} aria-hidden />
        </button>
      ) : null}
    </Badge>
  );
}
