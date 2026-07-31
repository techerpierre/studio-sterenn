'use client';

import { Project } from '@sterenn/api-contracts';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { listProjects } from '@/actions/project.actions';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const PAGE_SIZE = 10;

export function useProjectList() {
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

  const loadMore = async () => {
    if (!workspaceId || loading || !hasMore) return;

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
  };

  const addProject = (project: Project) => {
    setProjects((current) => {
      if (current.some((item) => item.id === project.id)) {
        return current;
      }
      return [project, ...current];
    });
    setTotalCount((count) => count + 1);
  };

  return {
    workspaceId,
    projects,
    totalCount,
    loading,
    hasMore,
    isInitialLoading,
    activeProjectId,
    loadMore,
    addProject,
  };
}
