import type { ApiResponse } from "./common.js";

export interface BoardItem {
  id: string;
  name: string;
  description: string | null;
}

export type GetWorkspaceBoardsResponse = ApiResponse<BoardItem[]>;
