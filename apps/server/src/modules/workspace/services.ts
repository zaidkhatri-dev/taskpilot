import { AppError } from "@repo/errors/app-error";
import { createWorkspace, getMyWorkspaces, updateWorkspace, getWorkspaceById } from "./repository.js";
import { assertWorkspacePermission } from "@/utils/auth.js";

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

export const updateWorkspaceService = async (userId: string, workspaceId: string, name?: string) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:update");

  const workspace = await getWorkspaceById(workspaceId);
  
  if (!workspace) {
    throw new AppError("Workspace you are trying to update does not exist", 404);
  }

  if (!name || workspace.name === name) {
    return workspace;
  }
  
  const updatedWorkspace = await updateWorkspace(workspaceId, name);


  if (!updatedWorkspace) {
    throw new AppError("Failed to update workspace, please try again.", 500);
  }
  return updatedWorkspace;
};
