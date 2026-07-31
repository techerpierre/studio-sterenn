"use client";

import { BoardState, Task } from "@sterenn/api-contracts";
import { PencilIcon, PlusIcon } from "lucide-react";

import { TaskForm } from "@/components/forms/TaskForm";
import { TaskStateForm } from "@/components/forms/TaskStateForm";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Draggable } from "@/components/ui/Draggable";
import { Text } from "@/components/ui/Text";
import clsx from "@/lib/clsx";

import { TaskCard } from "./TaskCard";
import styles from "./TaskBoardColumn.module.css";

export type TaskBoardColumnProps = {
  projectId: string;
  state: BoardState;
  taskIds: string[];
  taskById: Map<string, Task>;
};

export function TaskBoardColumn({
  projectId,
  state,
  taskIds,
  taskById,
}: TaskBoardColumnProps) {
  const lastTaskId = taskIds.at(-1);

  return (
    <Box direction="column" gap={12} className={styles.column}>
      <Box
        align="center"
        justify="between"
        gap={8}
        className={styles.columnTitle}
      >
        <Box align="center" gap={8} className={styles.columnTitleMain}>
          <span
            className={styles.colorDot}
            style={{ background: state.color }}
            aria-hidden
          />
          <TaskStateForm
            projectId={projectId}
            state={state}
            trigger={
              <button type="button" className={styles.columnNameButton}>
                <Text.BodySmall>{state.name}</Text.BodySmall>
                <PencilIcon size={10} aria-hidden className={styles.editIcon} />
              </button>
            }
          />
        </Box>

        <TaskForm
          projectId={projectId}
          stateId={state.id}
          beforeId={lastTaskId}
          trigger={
            <Button
              type="button"
              size="xs"
              icon
              variant="ghost"
              className={styles.addTask}
              aria-label={`Ajouter une tâche dans ${state.name}`}
            >
              <PlusIcon size={14} aria-hidden />
            </Button>
          }
        />
      </Box>

      <Draggable.List
        id={state.id}
        orientation="vertical"
        gap={8}
        className={clsx(styles.list, "scrollbar-floating")}
      >
        {taskIds.map((taskId, index) => {
          const task = taskById.get(taskId);
          if (!task) return null;

          return (
            <TaskCard
              key={taskId}
              projectId={projectId}
              stateId={state.id}
              task={task}
              index={index}
            />
          );
        })}
      </Draggable.List>
    </Box>
  );
}
