"use server";

import core from "@/config/core";
import { getSession } from "@/lib/session-persistence";
import {
  ListMembersParams,
  Member,
  Paginated,
} from "@sterenn/api-contracts";

export async function listMembers(
  params: ListMembersParams,
): Promise<Paginated<Member>> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!params.workspaceId) {
    throw new Error("workspaceId is required");
  }

  return core.membership.list({
    workspaceId: params.workspaceId,
    page: params.page ?? 0,
    take: params.take ?? 20,
  });
}
