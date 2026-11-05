import { initDb } from "@repo/db/client";
import { workspaces } from "@repo/db/workspaces";
import { workspaceMemberships } from "@repo/db/memberships";
import { eq, and } from "drizzle-orm";
import { serverConfig } from "@repo/config/server";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export const getMyWorkspaces = async (userId: string) => {
  const result = await dbClient
    .select({
      id: workspaces.id,
      name: workspaces.name,
      role: workspaceMemberships.role,
    })
    .from(workspaces)
    .innerJoin(
      workspaceMemberships,
      eq(workspaceMemberships.workspaceId, workspaces.id),
    )
    .where(
      and(
        eq(workspaceMemberships.userId, userId),
        eq(workspaceMemberships.accepted, true),
      ),
    )
    .orderBy(workspaces.createdAt);

  return result;
};

export const getWorkspaceById = async (workspaceId: string) => {
  const [workspace] = await dbClient
    .select({
      id: workspaces.id,
      name: workspaces.name,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId));

  return workspace;
};

export const createWorkspace = async (userId: string, name: string) => {
  const workspace = await dbClient.transaction(async (tx) => {
    const [workspace] = await tx
      .insert(workspaces)
      .values({ name })
      .returning({ id: workspaces.id, name: workspaces.name });

    if (!workspace) {
      return null;
    }

    await tx.insert(workspaceMemberships).values({
      userId,
      workspaceId: workspace.id,
      role: "admin",
      accepted: true,
    });

    return workspace;
  });

  return workspace;
};

export const updateWorkspace = async (workspaceId: string, name: string) => {
  const [workspace] = await dbClient
    .update(workspaces)
    .set({ name })
    .where(eq(workspaces.id, workspaceId))
    .returning({ id: workspaces.id, name: workspaces.name });

  return workspace;
};
