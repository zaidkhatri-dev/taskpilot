import { ApiResponse } from "./common.js";

export type SessionResponse = ApiResponse<{
  isOnboarded: boolean;
}>;
