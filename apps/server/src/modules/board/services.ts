import { assertWorkspacePermission } from "@/utils/auth.js";
import { createBoard, getBoards } from "./repository.js";


export const getBoardsService = async (workspaceId: string, userId: string) => {
  await assertWorkspacePermission(userId, workspaceId, "board:view");
   
  const boards = await getBoards(workspaceId);
  return boards;
};

export const createBoardService = async (workspaceId: string, userId: string, name: string, description?: string) => {
  await assertWorkspacePermission(userId, workspaceId, "board:create");
   
  const board = await createBoard(workspaceId, name, description);
  if (!board) throw new Error("Failed to create board. Please try again later.");
  return board;
};
