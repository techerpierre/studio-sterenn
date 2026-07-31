'use client';

import { Board, Project } from '@sterenn/api-contracts';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { BoardProvider } from '@/contexts/BoardContext';

export type ProjectContextType = {
  project: Project;
  setProject: (project: Project) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export type ProjectProviderProps = PropsWithChildren<{
  initialProject: Project;
  initialBoard: Board;
}>;

export function ProjectProvider({
  children,
  initialProject,
  initialBoard,
}: ProjectProviderProps) {
  const [project, setProjectState] = useState(initialProject);

  const setProject = useCallback((next: Project) => {
    setProjectState(next);
  }, []);

  const value = useMemo(
    () => ({
      project,
      setProject,
    }),
    [project, setProject],
  );

  return (
    <ProjectContext.Provider value={value}>
      <BoardProvider initialBoard={initialBoard} projectId={project.id}>
        {children}
      </BoardProvider>
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;
}
