import { getWorkspaceBoards } from "./repository.js";

export const getWorkspaceBoardsService = async (workspaceId: string) => {
  const boards = await getWorkspaceBoards(workspaceId);
  return boards;
};
