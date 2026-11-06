import type { ApiResponse } from "./common.js";
import type { AvatarId } from "../miscellaneous/user.js";

export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  avatarId: AvatarId | null;
}

export type GetMeResponse = ApiResponse<UserProfile> | ApiResponse<undefined>;
