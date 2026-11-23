import { assertWorkspacePermission } from "@/utils/auth.js";
import { AppError } from "@repo/errors/app-error";
import { isUnchanged } from "@/utils/miscellaneous.js";
import {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} from "./repository.js";

export const getBoardsService = async (workspaceId: string, userId: string) => {
  await assertWorkspacePermission(userId, workspaceId, "board:view");

  const boards = await getBoards(workspaceId);
  return boards;
};

export const createBoardService = async (
  workspaceId: string,
  userId: string,
  name: string,
  description?: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "board:create");

  const board = await createBoard(workspaceId, name, description);
  return board;
};

export const updateBoardService = async (
  boardId: string,
  workspaceId: string,
  userId: string,
  values: { name?: string; description?: string },
) => {
  await assertWorkspacePermission(userId, workspaceId, "board:update");

  const existing = await getBoard(boardId, workspaceId);
  if (!existing) throw new AppError("Board not found", 404);

  if (isUnchanged(values, existing)) return existing;

  const board = await updateBoard(boardId, workspaceId, values);

  if (!board)
    throw new AppError("Board you are trying to update does not exist", 404);
  return board;
};

export const deleteBoardService = async (
  boardId: string,
  workspaceId: string,
  userId: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "board:delete");

  const board = await deleteBoard(boardId, workspaceId);
  if (!board)
    throw new AppError("Board you are trying to delete does not exist", 404);
};
