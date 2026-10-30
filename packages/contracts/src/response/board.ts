import type { ApiResponse } from "./common.js";

export interface BoardItem {
  id: string;
  name: string;
  team: {
    id: string;
    name: string;
  };
}

/** Response for GET /boards */
export type GetBoardsResponse = ApiResponse<BoardItem[]>;
