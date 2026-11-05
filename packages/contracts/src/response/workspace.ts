import type { ApiResponse } from "./common.js";

export interface WorkspaceItem {
  id: string;
  name: string;
}

export type GetMyWorkspacesResponse = ApiResponse<WorkspaceItem[]>;

export type CreateWorkspaceResponse = ApiResponse<WorkspaceItem>;
export type UpdateWorkspaceResponse = ApiResponse<WorkspaceItem>;
