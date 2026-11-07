import { AppError } from "@repo/errors/app-error";
import {
  createWorkspace,
  getMyWorkspaces,
  updateWorkspace,
  getWorkspaceById,
} from "./repository.js";
import { assertWorkspacePermission } from "@/utils/auth.js";
import {
  removeUserFromWorkspace,
  getWorkspaceMembers,
  acceptWorkspaceInvitation,
} from "../membership/repository.js";

export const getMyWorkspacesService = async (userId: string) => {
  const workspaces = await getMyWorkspaces(userId);
  return workspaces;
};

export const getWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:read");

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return workspace;
};

export const createWorkspaceService = async (userId: string, name: string) => {
  const workspace = await createWorkspace(userId, name);
  return workspace;
};

export const updateWorkspaceService = async (
  userId: string,
  workspaceId: string,
  name: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:update");

  const updatedWorkspace = await updateWorkspace(workspaceId, name);

  if (!updatedWorkspace) {
    throw new AppError(
      "Workspace you are trying to update does not exist",
      404,
    );
  }
  return updatedWorkspace;
};

export const leaveWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:leave");

  await removeUserFromWorkspace(workspaceId, userId);
};

export const getWorkspaceMembersService = async (
  userId: string,
  workspaceId: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "members:view");

  const members = await getWorkspaceMembers(workspaceId);

  return members;
};

export const acceptWorkspaceInvitationService = async (
  userId: string,
  workspaceId: string,
) => {
  const invitation = await acceptWorkspaceInvitation(workspaceId, userId);

  if (!invitation) {
    throw new AppError("Workspace invitation not found", 404);
  }

  return invitation;
};
