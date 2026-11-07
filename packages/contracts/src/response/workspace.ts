import type { ApiResponse } from "./common.js";
import type { WorkspaceMembershipRoles } from "../miscellaneous/auth.js";

export interface WorkspaceItem {
  id: string;
  name: string;
  role?: WorkspaceMembershipRoles;
}

export type GetMyWorkspacesResponse = ApiResponse<WorkspaceItem[]>;

export type CreateWorkspaceResponse = ApiResponse<WorkspaceItem>;
export type UpdateWorkspaceResponse = ApiResponse<WorkspaceItem>;
