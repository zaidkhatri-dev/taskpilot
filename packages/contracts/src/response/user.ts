import type { ApiResponse } from "./common.js";
import type { AvatarId } from "../miscellaneous/user.js";

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatarId: AvatarId;
}

export type GetMeResponse = ApiResponse<UserProfile>;
