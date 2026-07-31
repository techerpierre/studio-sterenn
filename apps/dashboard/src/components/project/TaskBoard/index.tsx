"use client";

import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { BoardState, Task } from "@sterenn/api-contracts";
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { updateTask } from "@/actions/task.actions";
import { TaskStateForm } from "@/components/forms/TaskStateForm";
import { Box } from "@/components/ui/Box";
import { Draggable } from "@/components/ui/Draggable";
import { useToast } from "@/components/ui/Toast";
import { useBoard } from "@/contexts/BoardContext";
import { useProject } from "@/contexts/ProjectContext";
import clsx from "@/lib/clsx";

import { type BoardItems } from "../../../utils/boardState";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { TaskBoardColumnInsert } from "./TaskBoardColumnInsert";
import { TaskBoardEmpty } from "./TaskBoardEmpty";
import { TASK_DRAG_DISTANCE_PX } from "./TaskCard";
import styles from "./TaskBoard.module.css";

export { TaskBoardHeader } from "./TaskBoardHeader";
export type { TaskBoardHeaderProps } from "./TaskBoardHeader";

const COLUMN_SCROLL_AMOUNT = 296;

const boardSensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({
        value: TASK_DRAG_DISTANCE_PX,
      }),
    ],
  }),
];

function boardToItems(states: BoardState[]): BoardItems {
  return Object.fromEntries(
    states.map((state) => [state.id, state.tasks.map((task) => task.id)]),
  );
}

function collectTasks(states: BoardState[]): Map<string, Task> {
  const map = new Map<string, Task>();
  for (const state of states) {
    for (const task of state.tasks) {
      map.set(task.id, task);
    }
  }
  return map;
}

export type TaskBoardHandle = {
  scrollColumns: (direction: -1 | 1) => void;
};

export const TaskBoard = forwardRef<TaskBoardHandle>(
  function TaskBoard(_props, ref) {
    const { project } = useProject();
    const { board, applyItemsOrder } = useBoard();
    const { toast } = useToast();
    const boardRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<BoardItems>(() =>
      boardToItems(board.states),
    );
    const itemsRef = useRef(items);
    const previousItems = useRef(items);
    const taskById = useMemo(() => collectTasks(board.states), [board.states]);
    const isEmpty = board.states.length === 0;

    useImperativeHandle(ref, () => ({
      scrollColumns(direction) {
        boardRef.current?.scrollBy({
          left: direction * COLUMN_SCROLL_AMOUNT,
          behavior: "smooth",
        });
      },
    }));

    useEffect(() => {
      const next = boardToItems(board.states);
      setItems(next);
      itemsRef.current = next;
    }, [board]);

    const persistMove = useCallback(
      async (nextItems: BoardItems, taskId: string) => {
        const targetStateId = Object.keys(nextItems).find((stateId) =>
          nextItems[stateId].includes(taskId),
        );

        if (!targetStateId) return;

        const column = nextItems[targetStateId];
        const index = column.indexOf(taskId);
        const beforeId = index > 0 ? column[index - 1] : undefined;
        const afterId =
          index >= 0 && index < column.length - 1
            ? column[index + 1]
            : undefined;

        try {
          await updateTask(taskId, {
            stateId: targetStateId,
            order: {
              ...(beforeId ? { beforeId } : {}),
              ...(afterId ? { afterId } : {}),
            },
          });
          applyItemsOrder(nextItems);
        } catch (error) {
          console.error(error);
          setItems(previousItems.current);
          itemsRef.current = previousItems.current;
          toast({
            title: "Déplacement échoué",
            description: "Impossible de déplacer la tâche.",
            variant: "danger",
          });
        }
      },
      [applyItemsOrder, toast],
    );

    return (
      <Box direction="column" gap={16} className={styles.root}>
        <Draggable
          sensors={boardSensors}
          onDragStart={() => {
            previousItems.current = structuredClone(itemsRef.current);
          }}
          onDragOver={(event) => {
            setItems((current) => {
              const next = move(current, event);
              itemsRef.current = next;
              return next;
            });
          }}
          onDragEnd={(event) => {
            if (event.canceled) {
              setItems(previousItems.current);
              itemsRef.current = previousItems.current;
              return;
            }

            const sourceId = event.operation.source?.id;
            if (typeof sourceId !== "string") return;

            void persistMove(itemsRef.current, sourceId);
          }}
        >
          <div
            ref={boardRef}
            className={clsx(styles.board, "scrollbar-minimal")}
          >
            <Box align="stretch" className={styles.boardRow}>
              <TaskBoardEmpty
                isEmpty={isEmpty}
                action={<TaskStateForm projectId={project.id} />}
              >
                <>
                  <TaskBoardColumnInsert
                    projectId={project.id}
                    afterId={board.states[0]?.id}
                  />
                  {board.states.map((state, index) => (
                    <Fragment key={state.id}>
                      <TaskBoardColumn
                        projectId={project.id}
                        state={state}
                        taskIds={items[state.id] ?? []}
                        taskById={taskById}
                      />
                      <TaskBoardColumnInsert
                        projectId={project.id}
                        beforeId={state.id}
                        afterId={board.states[index + 1]?.id}
                      />
                    </Fragment>
                  ))}
                </>
              </TaskBoardEmpty>
            </Box>
          </div>
        </Draggable>
      </Box>
    );
  },
);
