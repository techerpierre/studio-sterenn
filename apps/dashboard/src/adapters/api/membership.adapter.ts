import httpClient from "@/config/httpClient";
import {
  IMembershipAdapter,
  ListMembersParams,
  Member,
  Paginated,
} from "@sterenn/api-contracts";

export class MembershipAdapter implements IMembershipAdapter {
  async list(params: ListMembersParams): Promise<Paginated<Member>> {
    const { workspaceId, ...pagination } = params;

    return httpClient.get(`/workspaces/${workspaceId}/members`, {
      params: pagination,
    });
  }
}
