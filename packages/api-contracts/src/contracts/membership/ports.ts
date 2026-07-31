import { Paginated } from '../common/outputs.js';
import { ListMembersParams } from './inputs.js';
import { Member } from './outputs.js';

export interface IMembershipAdapter {
  list(params: ListMembersParams): Promise<Paginated<Member>>;
}
