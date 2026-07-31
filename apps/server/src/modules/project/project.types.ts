import { PaginationParams, SessionUserParam } from '../common/common.types';

export type Project = {
  id: string;
  name: string;
  slug: string;
  workspaceId: string;
};

export type CreateProjectData = {
  name: string;
  slug: string;
  workspaceId: string;
};

export type UpdateProjectData = {
  name?: string;
  slug?: string;
};

export type CreateProjectParams = SessionUserParam;

export type UpdateProjectParams = SessionUserParam;

export type GetProjectParams = SessionUserParam;

export type DeleteProjectParams = SessionUserParam;

export type ListProjectsParams = PaginationParams & {
  workspaceId: string;
  userId?: string;
};
