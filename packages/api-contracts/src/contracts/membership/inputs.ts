import { PaginationParams } from '../common/inputs.js';

export interface ListMembersParams extends PaginationParams {
  workspaceId: string;
}
