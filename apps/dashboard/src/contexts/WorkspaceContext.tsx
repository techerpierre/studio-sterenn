'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WorkspaceWithMembership } from '@sterenn/api-contracts';

import {
  ensureCurrentWorkspace,
  listWorkspaces,
  setCurrentWorkspace as persistCurrentWorkspaceAction,
} from '@/actions/workspace.actions';

export type WorkspaceContextType = {
  workspaces: WorkspaceWithMembership[];
  currentWorkspace: WorkspaceWithMembership | null;
  totalCount: number;
  take: number;
  setCurrentWorkspace: (workspace: WorkspaceWithMembership) => Promise<void>;
  addWorkspace: (workspace: WorkspaceWithMembership) => void;
  loadMore: () => Promise<void>;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(
  null
);

export type WorkspaceProviderProps = PropsWithChildren<{
  initialWorkspaces: WorkspaceWithMembership[];
  initialCurrentWorkspace?: WorkspaceWithMembership | null;
  initialTotalCount?: number;
  shouldPersistCurrent?: boolean;
  take?: number;
}>;

export function WorkspaceProvider({
  children,
  initialWorkspaces,
  initialCurrentWorkspace = null,
  initialTotalCount = 0,
  shouldPersistCurrent = false,
  take = 10,
}: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<WorkspaceWithMembership | null>(
    initialCurrentWorkspace
  );
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const currentPage = useRef(0);

  useEffect(() => {
    if (!shouldPersistCurrent || !initialCurrentWorkspace) {
      return;
    }
    void ensureCurrentWorkspace(initialCurrentWorkspace);
  }, [shouldPersistCurrent, initialCurrentWorkspace]);

  const setCurrentWorkspace = useCallback(async (workspace: WorkspaceWithMembership) => {
    setCurrentWorkspaceState(workspace);
    await persistCurrentWorkspaceAction(workspace);
  }, []);

  const addWorkspace = useCallback((workspace: WorkspaceWithMembership) => {
    setWorkspaces((current) => {
      if (current.some((item) => item.id === workspace.id)) {
        return current;
      }
      return [workspace, ...current];
    });
    setCurrentWorkspaceState(workspace);
    setTotalCount((count) => count + 1);
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = currentPage.current + 1;

    if (nextPage * take >= totalCount) {
      return;
    }

    const next = await listWorkspaces({ page: nextPage, take });

    setWorkspaces((current) => {
      const existingIds = new Set(current.map((workspace) => workspace.id));
      const appended = next.results.filter(
        (workspace) => !existingIds.has(workspace.id)
      );
      return [...current, ...appended];
    });
    currentPage.current = nextPage;
    setTotalCount(next.count);
  }, [take, totalCount]);

  const value = useMemo(
    () => ({
      workspaces,
      currentWorkspace,
      totalCount,
      take,
      setCurrentWorkspace,
      addWorkspace,
      loadMore,
    }),
    [
      workspaces,
      currentWorkspace,
      totalCount,
      take,
      setCurrentWorkspace,
      addWorkspace,
      loadMore,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}
