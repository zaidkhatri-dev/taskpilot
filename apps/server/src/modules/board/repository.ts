import { initDb } from "@repo/db/client";
import { serverConfig } from "@repo/config/server";
import { boards } from "@repo/db/boards";
import { eq } from "drizzle-orm";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export const getBoards = async (workspaceId: string) => {
  const result = await dbClient
    .select({
      id: boards.id,
      name: boards.name,
      description: boards.description,
    })
    .from(boards)
    .where(eq(boards.workspaceId, workspaceId))
    .orderBy(boards.createdAt);

  return result;
};

export const createBoard = async (workspaceId: string, name: string, description?: string) => {
  const [result] = await dbClient
    .insert(boards)
    .values({
      workspaceId,
      name,
      description,
    })
    .returning({
      id: boards.id,
      name: boards.name,
      description: boards.description,
    });

  return result;
};



