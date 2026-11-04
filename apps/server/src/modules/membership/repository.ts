import { initDb } from "@repo/db/client";
import { workspaceMemberships } from "@repo/db/memberships";
import { serverConfig } from "@repo/config/server";
import { and, eq } from "drizzle-orm";

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
      ),
    )
    .limit(1);

  return result;
};