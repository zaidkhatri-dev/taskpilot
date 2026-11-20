import { initDb } from "@repo/db/client";
import { workspaceMemberships } from "@repo/db/memberships";
import { serverConfig } from "@repo/config/server";
import { and, desc, eq, inArray, ilike, or, count } from "drizzle-orm";
import { users } from "@repo/db/users";
import { workspaces } from "@repo/db/workspaces";
import type { GetWorkspaceUsersOptions } from "@/types/workspace.js";

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

export const getWorkspaceUsers = async ({
  workspaceId,
  allowedRoles,
  status,
  page,
  limit,
  name,
}: GetWorkspaceUsersOptions) => {
  if (allowedRoles.length === 0) {
    return { users: [], page, totalPages: 1 };
  }

  const isAccepted = status === "accepted";
  const conditions = [
    eq(workspaceMemberships.workspaceId, workspaceId),
    eq(workspaceMemberships.accepted, isAccepted),
    inArray(workspaceMemberships.role, [...allowedRoles]),
  ];

  if (name) {
    const tokens = name.trim().split(/\s+/).filter(Boolean);
    const tokenConditions = tokens.map((token) => {
      const pattern = `%${token}%`;
      return or(
        ilike(users.firstName, pattern),
        ilike(users.lastName, pattern),
      );
    });

    if (tokenConditions.length > 0) {
      conditions.push(and(...tokenConditions)!);
    }
  }

  const whereClause = and(...conditions);

  const [totalCountResult] = await dbClient
    .select({ total: count() })
    .from(workspaceMemberships)
    .innerJoin(users, eq(workspaceMemberships.userId, users.id))
    .where(whereClause);

  const total = totalCountResult?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;

  const orderColumn = isAccepted
    ? workspaceMemberships.updatedAt
    : workspaceMemberships.createdAt;

  const rows = await dbClient
    .select({
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarId: users.avatarId,
      role: workspaceMemberships.role,
      updatedAt: workspaceMemberships.updatedAt,
      createdAt: workspaceMemberships.createdAt,
    })
    .from(workspaceMemberships)
    .innerJoin(users, eq(workspaceMemberships.userId, users.id))
    .where(whereClause)
    .orderBy(desc(orderColumn), desc(workspaceMemberships.id)) // tiebreaker, use your unique column
    .limit(limit)
    .offset(offset);

  return {
    users: rows.map((row) => ({
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      avatarId: row.avatarId,
      role: row.role,
      ...(isAccepted
        ? { joinedOn: row.updatedAt }
        : { invitedOn: row.createdAt }),
    })),
    page,
    totalPages,
  };
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
      ),
    )
    .orderBy(desc(workspaceMemberships.createdAt));
  return invitations;
};

export const processWorkspaceInvitation = async (
  workspaceId: string,
  userId: string,
  accepted: boolean,
) => {
  if (!accepted) {
    await dbClient
      .delete(workspaceMemberships)
      .where(
        and(
          eq(workspaceMemberships.id, workspaceId),
          eq(workspaceMemberships.userId, userId),
        ),
      );
    return;
  }
  
  const [result] = await dbClient
    .update(workspaceMemberships)
    .set({
      accepted: accepted,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(workspaceMemberships.id, workspaceId),
        eq(workspaceMemberships.userId, userId),
      ),
    )
    .returning({
      id: workspaceMemberships.id,
    });
  return result;
};

export const inviteUser = async (
  workspaceId: string,
  userId: string,
  role: "admin" | "member",
) => {
  const [result] = await dbClient
    .insert(workspaceMemberships)
    .values({
      workspaceId,
      userId,
      role,
      accepted: false,
    })
    .returning({
      id: workspaceMemberships.id,
    });

  if (!result) {
    throw new Error("Workspace membership insert returned no row");
  }
  return result;
};

export const getMembershipByUserIdAndWorkspaceId = async (
  userId: string,
  workspaceId: string,
) => {
  const [result] = await dbClient
    .select({
      id: workspaceMemberships.id,
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

export const changeUserRole = async (
  workspaceId: string,
  userId: string,
  role: "admin" | "member",
) => {
  const [result] = await dbClient
    .update(workspaceMemberships)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(workspaceMemberships.workspaceId, workspaceId),
        eq(workspaceMemberships.userId, userId),
      ),
    )
    .returning({
      id: workspaceMemberships.id,
    });
  return result;
};
