import { PaginationParams } from '../common/inputs.js';

export interface CreateTagData {
  name: string;
  color: string;
  projectId: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

export interface ListTagsParams extends PaginationParams {
  projectId: string;
  search?: string;
}

export interface AttachTaskTagsData {
  tagId: string;
}
