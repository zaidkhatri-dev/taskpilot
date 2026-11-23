import { initDb } from "@repo/db/client";
import { serverConfig } from "@repo/config/server";
import { boards } from "@repo/db/boards";
import { and, eq } from "drizzle-orm";

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

export const createBoard = async (
  workspaceId: string,
  name: string,
  description?: string,
) => {
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

  if (!result) {
    throw new Error("Board insert returned no row");
  }

  return result;
};

export const getBoard = async (boardId: string, workspaceId: string) => {
  const [board] = await dbClient
    .select({
      id: boards.id,
      workspaceId: boards.workspaceId,
      name: boards.name,
      description: boards.description,
    })
    .from(boards)
    .where(and(eq(boards.id, boardId), eq(boards.workspaceId, workspaceId)));
  return board;
};

export const updateBoard = async (
  boardId: string,
  workspaceId: string,
  values: { name?: string; description?: string },
) => {
  const [board] = await dbClient
    .update(boards)
    .set({ ...values, updatedAt: new Date() })
    .where(and(eq(boards.id, boardId), eq(boards.workspaceId, workspaceId)))
    .returning({
      id: boards.id,
      name: boards.name,
      description: boards.description,
    });
  return board;
};

export const deleteBoard = async (boardId: string, workspaceId: string) => {
  const [board] = await dbClient
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.workspaceId, workspaceId)))
    .returning({ id: boards.id });
  return board;
};
