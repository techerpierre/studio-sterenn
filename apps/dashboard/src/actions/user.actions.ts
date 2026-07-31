"use server";

import core from "@/config/core";
import { getSession } from "@/lib/session-persistence";
import { User } from "@sterenn/api-contracts";

export async function getUser(id: string): Promise<User | null> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return core.user.get(id);
}
