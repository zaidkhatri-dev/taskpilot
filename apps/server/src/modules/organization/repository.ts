import { organizations } from "@repo/db/organizations";
import { teams } from "@repo/db/teams";
import { initDb } from "@repo/db/client";
import { serverConfig } from "@repo/config/server";
import { teamMemberships } from "@repo/db/memberships";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export async function createOrganization(
  userId: string,
  name: string,
  description?: string,
) {
  const org = await dbClient.transaction(async (tx) => {
    const [org] = await tx
      .insert(organizations)
      .values({
        name,
        ownerId: userId,
        description,
      })
      .returning({
        id: organizations.id,
        adminId: organizations.ownerId,
      });

    if (!org) {
      tx.rollback();
      return;
    }

    const [team] = await tx
      .insert(teams)
      .values({
        name: "Default",
        description:
          "This is the default team for your organization. You can edit this team name and description.",
        organizationId: org.id,
      })
      .returning({
        id: teams.id,
      });

    if (!team) {
      tx.rollback();
      return;
    }

    const [member] = await tx
      .insert(teamMemberships)
      .values({
        teamId: team.id,
        userId: org.adminId,
        role: "admin",
        accepted: true,
      })
      .returning({ id: teamMemberships.id });

    if (!member) {
      tx.rollback();
      return;
    }

    return org;
  });

  return org;
}
