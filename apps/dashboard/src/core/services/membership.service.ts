import {
  IMembershipAdapter,
  ListMembersParams,
  Member,
  Paginated,
} from "@sterenn/api-contracts";

export class MembershipService {
  constructor(private readonly membershipAdapter: IMembershipAdapter) {}

  async list(params: ListMembersParams): Promise<Paginated<Member>> {
    return this.membershipAdapter.list(params);
  }
}
