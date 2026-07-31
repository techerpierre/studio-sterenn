import httpClient from "@/config/httpClient";
import { IUserAdapter, User } from "@sterenn/api-contracts";

export class UserAdapter implements IUserAdapter {
  async get(id: string): Promise<User | null> {
    return httpClient.get(`/users/${id}`);
  }
}
