import { AppError } from "@repo/errors/app-error";
import {
  createWorkspace,
  getMyWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getUserByEmail,
} from "./repository.js";
import { assertWorkspacePermission, checkTargetPermission } from "@/utils/auth.js";
import {
  removeUserFromWorkspace,
  getWorkspaceUsers,
  processWorkspaceInvitation,
  inviteUser,
  getUserWorkspaceMembershipFromIds,
  changeUserRole,
  transferOwnership,
} from "@/modules/membership/repository.js";
import { getRoleChangeType, getWorkspaceInvitationEmailBody, isRoleChangeValid } from "@/utils/workspace.js";
import { EmailJobData, TARGET_PERMISSIONS } from "@repo/contracts/miscellaneous/auth";
import { serverConfig } from "@repo/config/server";
import { getEmailQueue } from "@repo/email/queue";

export const getMyWorkspacesService = async (userId: string) => {
  const workspaces = await getMyWorkspaces(userId);
  return workspaces;
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

export const removeUserFromWorkspaceService = async (
  userId: string,
  workspaceId: string,
  targetUserId: string,
) => {
  const { role } = await assertWorkspacePermission(userId, workspaceId, "user:remove");
  
  const targetMembership = await getUserWorkspaceMembershipFromIds(workspaceId, targetUserId);
  if (!targetMembership) {
    throw new AppError("User not found in workspace", 404);
  }

  if (!checkTargetPermission("user:remove", role, targetMembership.role)) {
    throw new AppError("You do not have permission to perform this action", 403);
  }

  await removeUserFromWorkspace(workspaceId, targetUserId);
};

export interface GetWorkspaceUsersServiceOptions {
  status: "accepted" | "pending";
  page: number;
  limit: number;
  name?: string;
}

export const getWorkspaceUsersService = async (
  userId: string,
  workspaceId: string,
  options: GetWorkspaceUsersServiceOptions,
) => {
  const { role } = await assertWorkspacePermission(userId, workspaceId, "user:view");

  const allowedRoles = TARGET_PERMISSIONS["user:view"][role]!;

  const users = await getWorkspaceUsers({
    workspaceId,
    allowedRoles,
    ...options,
  });

  return users;
};

export const workspaceInvitationService = async (
  userId: string,
  workspaceId: string,
  accepted: boolean,
) => {
  const invitation = await processWorkspaceInvitation(workspaceId, userId, accepted);

  if (!invitation) {
    throw new AppError("Workspace invitation not found", 404);
  }

  return invitation;
};

export const deleteWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  await assertWorkspacePermission(userId, workspaceId, "workspace:delete");

  await deleteWorkspace(workspaceId);
};

export const inviteUserService = async (
  userId: string,
  workspaceId: string,
  email: string,
  role: "admin" | "member",
) => {
  const { role: userRole } = await assertWorkspacePermission(
    userId,
    workspaceId,
    "user:invite",
  );

  if (!checkTargetPermission("user:invite", userRole, role)) {
    throw new AppError("You don't have permission to perform this action", 403);
  }

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const invitationLink = `${serverConfig.CORS_ORIGIN}/settings/invitations`;
  const emailBody = getWorkspaceInvitationEmailBody(
    email,
    invitationLink,
    workspace.name,
  );
  const invitation = await inviteUser(workspaceId, user.id, role);

  const jobData: EmailJobData = {
    from: serverConfig.SENDER_EMAIL,
    to: email,
    subject: `Your invitation to join ${workspace.name}`,
    html: emailBody,
  };

  const emailQueue = getEmailQueue({
    redisUrl: serverConfig.REDIS_URL,
    maxRetries: serverConfig.EMAIL_WORKER_MAX_RETRY,
    attemptDelay: serverConfig.EMAIL_WORKER_ATTEMPT_DELAY,
  });
  await emailQueue.add("send-email", jobData);

  return invitation;
};

export const changeUserRoleService = async (
  userId: string,
  workspaceId: string,
  targetUserId: string,
  role: "admin" | "member",
) => {
  await assertWorkspacePermission(
    userId,
    workspaceId,
    "user:change-role",
  );

  const targetMembership = await getUserWorkspaceMembershipFromIds(workspaceId, targetUserId);
  if (!targetMembership) {
    throw new AppError("User not found in workspace", 404);
  }

  if (!isRoleChangeValid(targetMembership.role, role)) {
    throw new AppError("Invalid role change", 400);
  }

  await changeUserRole(workspaceId, targetUserId, role);
  return {
    roleChangeType: getRoleChangeType(targetMembership.role, role),
  };
};

export const transferOwnershipService = async (
  userId: string,
  workspaceId: string,
  targetUserId: string,
) => {
  await assertWorkspacePermission(
    userId,
    workspaceId,
    "workspace:transfer",
  );

  const targetMembership = await getUserWorkspaceMembershipFromIds(workspaceId, targetUserId
  );
  if (!targetMembership) {
    throw new AppError("User not found in workspace", 404);
  }

  if (targetMembership.role !== "admin") {
    throw new AppError("Only admins can be transferred ownership", 400);
  }

  await transferOwnership(workspaceId, userId, targetUserId);
};

