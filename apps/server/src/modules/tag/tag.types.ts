import { Paginated, SessionUserParam } from '../common/common.types';

export type Tag = {
  id: string;
  name: string;
  color: string;
  projectId: string;
};

export type CreateTagData = {
  name: string;
  color: string;
  projectId: string;
};

export type UpdateTagData = {
  name?: string;
  color?: string;
};

export type ListTagsParams = {
  projectId: string;
  page: number;
  take: number;
  search?: string;
  userId?: string;
};

export type CreateTagParams = SessionUserParam;
export type UpdateTagParams = SessionUserParam;
