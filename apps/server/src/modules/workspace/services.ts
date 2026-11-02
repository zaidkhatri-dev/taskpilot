import { AppError } from "@repo/errors/app-error";
import { createWorkspace, getMyWorkspaces } from "./repository.js";

export const getMyWorkspacesService = async (userId: string) => {
  const workspaces = await getMyWorkspaces(userId);
  return workspaces;
};

export const createWorkspaceService = async (userId: string, name: string) => {
  const workspace = await createWorkspace(userId, name);

  if (!workspace) {
    throw new AppError("Failed to create workspace, please try again.", 500);
  }
  return workspace;
};
