import { organizations } from "@repo/db/organizations";
import { initDb } from "@repo/db/client";
import { serverConfig } from "@repo/config/server";

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
  const [organization] = await dbClient
    .insert(organizations)
    .values({
      name,
      adminId: userId,
      description,
    })
    .returning({
      id: organizations.id,
      name: organizations.name,
      adminId: organizations.adminId,
      description: organizations.description,
      createdAt: organizations.createdAt,
      updatedAt: organizations.updatedAt,
    });

  return organization;
}
