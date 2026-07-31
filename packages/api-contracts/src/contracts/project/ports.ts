import { Paginated } from '../common/outputs.js';
import {
  CreateProjectData,
  ListProjectsParams,
  UpdateProjectData,
} from './inputs.js';
import { Project } from './outputs.js';

export interface IProjectAdapter {
  create(data: CreateProjectData): Promise<Project>;
  get(id: string): Promise<Project | null>;
  update(id: string, data: UpdateProjectData): Promise<Project | null>;
  list(params: ListProjectsParams): Promise<Paginated<Project>>;
  delete(id: string): Promise<void>;
}
