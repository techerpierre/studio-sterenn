import { type User } from "../user/output.js";
import { type MembershipRole } from "./enums.js";

export type Member = User & {
  role: MembershipRole;
};
