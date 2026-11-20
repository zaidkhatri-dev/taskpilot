import type { ApiResponse } from "./common.js";
import type { WorkspaceMembershipRoles } from "../miscellaneous/auth.js";

export interface WorkspaceItem {
  id: string;
  name: string;
}

export interface WorkspaceItemWithRole extends WorkspaceItem {
  role: WorkspaceMembershipRoles;
}

export interface WorkspaceMember {
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarId: string | null;
  role: WorkspaceMembershipRoles;
  joinedOn?: Date;
  invitedOn?: Date;
  page: number;
  totalPages: number;
}

export type GetMyWorkspacesResponse = ApiResponse<WorkspaceItemWithRole[]>;

export type CreateWorkspaceResponse = ApiResponse<WorkspaceItem>;
export type UpdateWorkspaceResponse = ApiResponse<WorkspaceItem>;
export type GetWorkspaceMembersResponse = ApiResponse<WorkspaceMember[]>;
