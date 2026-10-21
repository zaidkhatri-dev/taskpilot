interface BaseResponse {
  success: boolean;
  message: string;
}

export interface DefaultResponse extends BaseResponse {
  data: null;
}

export interface UserOnboardedResponse extends BaseResponse {
  data: {
    isUserOnboarded: boolean;
  };
}

const avatarIds = [
  "avatar_01",
  "avatar_02",
  "avatar_03",
  "avatar_04",
  "avatar_05",
  "avatar_06",
  "avatar_07",
  "avatar_08",
  "avatar_09",
  "avatar_10",
  "avatar_11",
  "avatar_12",
  "avatar_13",
  "avatar_14",
  "avatar_15",
  "avatar_16",
  "avatar_17",
  "avatar_18",
  "avatar_19",
  "avatar_20",
  "avatar_21",
  "avatar_22",
  "avatar_23",
  "avatar_24",
] as const;

export type AvatarIds = (typeof avatarIds)[number];
export interface GetMeResponse extends BaseResponse {
  data: {
    user: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      avatarId: AvatarIds;
    };
    organization: Array<{
      organizationName: string;
      joiningStatus: boolean;
    }>;
  };
}

export interface FormActionResponse {
  success: boolean;
  message: string;
  path: string | null;
  values: Record<string, unknown> | null;
  data: Record<string, unknown> | null;
}
