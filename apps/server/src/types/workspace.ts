import { WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

export interface GetWorkspaceUsersOptions {
  workspaceId: string;
  allowedRoles: readonly WorkspaceMembershipRoles[];
  status: "accepted" | "pending";
  page: number;
  limit: number;
  name?: string;
}