import { AppError } from "@repo/errors/app-error";
import { createWorkspace, getMyWorkspaces, updateWorkspace, getWorkspaceById } from "./repository.js";
import { assertWorkspacePermission } from "@/utils/auth.js";

export const getMyWorkspacesService = async (userId: string) => {
  const workspaces = await getMyWorkspaces(userId);
  return workspaces;
};

export const createWorkspaceService = async (userId: string, name: string) => {
  const workspace = await createWorkspace(userId, name);
  return workspace;
};

export const updateWorkspaceService = async (userId: string, workspaceId: string, name: string) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:update");

  const updatedWorkspace = await updateWorkspace(workspaceId, name);

  if (!updatedWorkspace) {
    throw new AppError("Workspace you are trying to update does not exist", 404);
  }
  return updatedWorkspace;
};
