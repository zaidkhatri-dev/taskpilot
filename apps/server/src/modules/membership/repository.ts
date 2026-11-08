import { initDb } from "@repo/db/client";
import { workspaceMemberships } from "@repo/db/memberships";
import { serverConfig } from "@repo/config/server";
import { and, desc, eq } from "drizzle-orm";
import { users } from "@repo/db/users";
import { workspaces } from "@repo/db/workspaces";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export const getUserWorkspaceMembershipFromIds = async (
  workspaceId: string,
  userId: string,
) => {
  const [result] = await dbClient
    .select({
      userId: workspaceMemberships.userId,
      workspaceId: workspaceMemberships.workspaceId,
      role: workspaceMemberships.role,
    })
    .from(workspaceMemberships)
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.workspaceId, workspaceId),
        eq(workspaceMemberships.accepted, true),
      ),
    )
    .limit(1);

  return result;
};

export const removeUserFromWorkspace = async (
  workspaceId: string,
  userId: string,
) => {
  await dbClient
    .delete(workspaceMemberships)
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.workspaceId, workspaceId),
        eq(workspaceMemberships.accepted, true),
      ),
    );
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const members = await dbClient
    .select({
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarId: users.avatarId,
      role: workspaceMemberships.role,
    })
    .from(workspaceMemberships)
    .innerJoin(users, eq(workspaceMemberships.userId, users.id))
    .where(
      and(
        eq(workspaceMemberships.workspaceId, workspaceId),
        eq(workspaceMemberships.accepted, true),
      ),
    )
    .orderBy(users.createdAt);
  return members;
};

export const getWorkspaceInvitations = async (userId: string) => {
  const invitations = await dbClient
    .select({
      id: workspaceMemberships.id,
      name: workspaces.name,
    })
    .from(workspaceMemberships)
    .innerJoin(workspaces, eq(workspaceMemberships.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.accepted, false),
        eq(workspaceMemberships.role, "member"),
      ),
    )
    .orderBy(desc(workspaceMemberships.createdAt));
  return invitations;
};

export const acceptWorkspaceInvitation = async (
  workspaceId: string,
  userId: string,
) => {
  const [result] = await dbClient
    .update(workspaceMemberships)
    .set({
      accepted: true,
    })
    .where(
      and(
        eq(workspaceMemberships.id, workspaceId),
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.role, "member"),
      ),
    )
    .returning({
      id: workspaceMemberships.id,
    });
  return result;
};
