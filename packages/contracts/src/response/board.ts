import type { ApiResponse } from "./common.js";

export interface BoardItem {
  id: string;
  name: string;
  description: string | null;
}

export type GetBoardsResponse = ApiResponse<BoardItem[]>;
export type CreateBoardResponse = ApiResponse<BoardItem>;
