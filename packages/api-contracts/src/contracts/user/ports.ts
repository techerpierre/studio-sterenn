import { User } from './output.js';

export interface IUserAdapter {
  get(id: string): Promise<User | null>;
}
