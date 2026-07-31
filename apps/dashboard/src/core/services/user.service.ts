import { IUserAdapter, User } from "@sterenn/api-contracts";

export class UserService {
  constructor(private readonly userAdapter: IUserAdapter) {}

  async get(id: string): Promise<User | null> {
    return this.userAdapter.get(id);
  }
}
