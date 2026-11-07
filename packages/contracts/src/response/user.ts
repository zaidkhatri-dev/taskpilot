import type { ApiResponse, EmptyResponse } from "./common.js";
import type { AvatarId } from "../miscellaneous/user.js";

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  avatarId: AvatarId | null;
}

export interface WorkspaceInvitation {
  id: string;
  name: string;
}

export type GetMeResponse = ApiResponse<UserProfile> | EmptyResponse;

export type UpdateMeResponse = ApiResponse<UserProfile> | EmptyResponse;

export type GetWorkspaceInvitationsResponse = ApiResponse<
  WorkspaceInvitation[]
>;
