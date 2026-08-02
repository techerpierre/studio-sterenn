import type { EventData } from "../common/outputs.js";
import type { Tag } from "../tag/outputs.js";

export type TaskTag = Tag;

export type TaskOwner = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Task = {
  id: string;
  title: string;
  content: string;
  dueDate: string | null;
  position: number;
  projectId: string;
  ownerId: string;
  stateId: string | null;
  tags: TaskTag[];
  owner: TaskOwner;
};

export type BoardState = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId: string;
  tasks: Task[];
};

export type Board = {
  projectId: string;
  states: BoardState[];
};

export type TaskExportEventData = EventData<{
  ressourceUrl: string | null;
}>;
