"use client";

import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
import {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import { TaskStateForm } from "@/components/forms/TaskStateForm";
import { Box } from "@/components/ui/Box";
import { Draggable } from "@/components/ui/Draggable";
import { useBoard } from "@/contexts/BoardContext";
import { useProject } from "@/contexts/ProjectContext";
import { useBoardDragPersist } from "@/hooks/useBoardDragPersist";
import clsx from "@/lib/clsx";

import { TaskBoardColumn } from "./TaskBoardColumn";
import { TaskBoardColumnInsert } from "./TaskBoardColumnInsert";
import { TaskBoardEmpty } from "./TaskBoardEmpty";
import { TASK_DRAG_DISTANCE_PX } from "./TaskCard";
import styles from "./TaskBoard.module.css";

export { TaskBoardHeader } from "./TaskBoardHeader";
export type { TaskBoardHeaderProps } from "./TaskBoardHeader";
export { TaskBoardFiltersModal } from "./TaskBoardFiltersModal";
export type { TaskBoardFiltersModalProps } from "./TaskBoardFiltersModal";

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

export type TaskBoardHandle = {
  scrollColumns: (direction: -1 | 1) => void;
};

export const TaskBoard = forwardRef<TaskBoardHandle>(
  function TaskBoard(_props, ref) {
    const { project } = useProject();
    const { board, applyItemsOrder } = useBoard();
    const boardRef = useRef<HTMLDivElement>(null);
    const { items, taskById, onDragStart, onDragOver, onDragEnd } =
      useBoardDragPersist({ board, applyItemsOrder });
    const isEmpty = board.states.length === 0;

    useImperativeHandle(ref, () => ({
      scrollColumns(direction) {
        boardRef.current?.scrollBy({
          left: direction * COLUMN_SCROLL_AMOUNT,
          behavior: "smooth",
        });
      },
    }));

    return (
      <Box direction="column" gap={16} className={styles.root}>
        <Draggable
          sensors={boardSensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
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
