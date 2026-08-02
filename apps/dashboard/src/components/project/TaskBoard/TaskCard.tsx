"use client";

import { Task } from "@sterenn/api-contracts";
import { useRef } from "react";

import { TaskForm } from "@/components/forms/TaskForm";
import { TagChip } from "@/components/tags/TagChip";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Draggable } from "@/components/ui/Draggable";
import { Text } from "@/components/ui/Text";
import { getDueDateProgressLabel } from "@/lib/utils";

import styles from "./TaskCard.module.css";
import { Avatar } from "@/components/ui/Avatar";
import { Box } from "@/components/ui/Box";

export const TASK_DRAG_DISTANCE_PX = 8;

export type TaskCardProps = {
  projectId: string;
  stateId: string;
  task: Task;
  index: number;
};

export function TaskCard({ projectId, stateId, task, index }: TaskCardProps) {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const dueLabel = getDueDateProgressLabel(task.dueDate);
  const isDueDatePassed = task.dueDate && new Date(task.dueDate) < new Date();

  const onCardPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.currentTarget.click();
    }
  };

  const onCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;

    const moved =
      Math.abs(event.clientX - start.x) > TASK_DRAG_DISTANCE_PX ||
      Math.abs(event.clientY - start.y) > TASK_DRAG_DISTANCE_PX;

    if (moved) {
      event.preventDefault();
    }
  };

  return (
    <TaskForm
      projectId={projectId}
      stateId={stateId}
      task={task}
      className={styles.formRoot}
      trigger={
        <Draggable.Item
          id={task.id}
          index={index}
          className={styles.item}
          role="button"
          tabIndex={0}
          aria-label={`Modifier « ${task.title} »`}
          onPointerDown={onCardPointerDown}
          onClick={onCardClick}
          onKeyDown={onCardKeyDown}
        >
          <Card
            direction="column"
            gap={8}
            padding={12}
            className={styles.taskCard}
          >
            <Text.Body className={styles.title}>{task.title}</Text.Body>
            <Box gap={4}>
              <Avatar
                alt={`${task.owner.firstName} ${task.owner.lastName}`}
                size="xs"
                name={`${task.owner.firstName} ${task.owner.lastName}`}
              />
              {dueLabel || task.tags?.length ? (
                <div className={styles.meta}>
                  {dueLabel ? (
                    <Badge
                      variant={isDueDatePassed ? "warning" : "default"}
                      size="sm"
                      className={styles.dueBadge}
                    >
                      {dueLabel}
                    </Badge>
                  ) : null}
                  {task.tags?.map((tag) => (
                    <TagChip key={tag.id} tag={tag} size="sm" />
                  ))}
                </div>
              ) : null}
            </Box>
          </Card>
        </Draggable.Item>
      }
    />
  );
}
