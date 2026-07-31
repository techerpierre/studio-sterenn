import { User } from "../user/output.js";

export interface Session {
    token: string;
    refreshToken: string;
}

export interface SessionWithoutRefresh extends Omit<Session, 'refreshToken'> {}

export interface Profile extends User {}