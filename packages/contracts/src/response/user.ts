import type { ApiResponse } from "./common.js";
import type { AvatarId } from "../miscellaneous/user.js";

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatarId: AvatarId;
}

export interface TeamMembership {
  teamName: string;
  joiningStatus: boolean;
}

export interface MePayload {
  user: UserProfile;
  teams: TeamMembership[];
}

/** Response for GET /user/me */
export type GetMeResponse = ApiResponse<MePayload>;
