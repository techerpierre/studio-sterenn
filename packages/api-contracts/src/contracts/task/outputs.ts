export type Task = {
  id: string;
  title: string;
  content: string;
  dueDate: string | null;
  position: number;
  projectId: string;
  ownerId: string;
  stateId: string | null;
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
