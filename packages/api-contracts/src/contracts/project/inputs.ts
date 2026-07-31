import { PaginationParams } from '../common/inputs.js';

export interface CreateProjectData {
  name: string;
  slug: string;
  workspaceId: string;
}

export interface UpdateProjectData {
  name?: string;
  slug?: string;
}

export interface ListProjectsParams extends PaginationParams {
  workspaceId: string;
}
