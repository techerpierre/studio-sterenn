'use client';

import { Project } from '@sterenn/api-contracts';
import { usePathname } from 'next/navigation';
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

import { listProjects } from '@/actions/project.actions';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const PAGE_SIZE = 10;

export type ProjectListContextType = {
  workspaceId: string | undefined;
  projects: Project[];
  totalCount: number;
  loading: boolean;
  hasMore: boolean;
  isInitialLoading: boolean;
  activeProjectId: string | undefined;
  loadMore: () => Promise<void>;
  addProject: (project: Project) => void;
  patchProject: (project: Project) => void;
};

export const ProjectListContext =
  createContext<ProjectListContextType | null>(null);

export function ProjectListProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id;

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(workspaceId));
  const pageRef = useRef(0);
  const requestIdRef = useRef(0);

  const activeProjectId = pathname.match(
    /^\/dashboard\/projects\/([^/]+)/,
  )?.[1];
  const hasMore = projects.length < totalCount;
  const isInitialLoading = loading && projects.length === 0;

  useEffect(() => {
    if (!workspaceId) {
      setProjects([]);
      setTotalCount(0);
      pageRef.current = 0;
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setProjects([]);
    setTotalCount(0);
    pageRef.current = 0;
    setLoading(true);

    void listProjects({
      workspaceId,
      page: 0,
      take: PAGE_SIZE,
    })
      .then((paginated) => {
        if (requestId !== requestIdRef.current) return;
        setProjects(paginated.results);
        setTotalCount(paginated.count);
        pageRef.current = 0;
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setProjects([]);
        setTotalCount(0);
        pageRef.current = 0;
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [workspaceId]);

  const loadMore = useCallback(async () => {
    if (!workspaceId || loading || projects.length >= totalCount) return;

    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const paginated = await listProjects({
        workspaceId,
        page: nextPage,
        take: PAGE_SIZE,
      });
      setProjects((current) => [...current, ...paginated.results]);
      setTotalCount(paginated.count);
      pageRef.current = nextPage;
    } finally {
      setLoading(false);
    }
  }, [workspaceId, loading, projects.length, totalCount]);

  const addProject = useCallback((project: Project) => {
    setProjects((current) => {
      if (current.some((item) => item.id === project.id)) {
        return current;
      }
      return [project, ...current];
    });
    setTotalCount((count) => count + 1);
  }, []);

  const patchProject = useCallback((project: Project) => {
    setProjects((current) => {
      const index = current.findIndex((item) => item.id === project.id);
      if (index === -1) return current;

      const next = [...current];
      next[index] = project;
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      workspaceId,
      projects,
      totalCount,
      loading,
      hasMore,
      isInitialLoading,
      activeProjectId,
      loadMore,
      addProject,
      patchProject,
    }),
    [
      workspaceId,
      projects,
      totalCount,
      loading,
      hasMore,
      isInitialLoading,
      activeProjectId,
      loadMore,
      addProject,
      patchProject,
    ],
  );

  return (
    <ProjectListContext.Provider value={value}>
      {children}
    </ProjectListContext.Provider>
  );
}

export function useProjectList() {
  const context = useContext(ProjectListContext);

  if (!context) {
    throw new Error('useProjectList must be used within a ProjectListProvider');
  }

  return context;
}
