import { NextFunction, Request, Response } from "express";
import { GetWorkspaceBoardsResponse } from "@repo/contracts/response/board";
import { getWorkspaceBoardsSchema } from "@repo/validation/board";
import { getWorkspaceBoardsService } from "./services.js";
import { GetTypeFromSchema } from "@/types/validation.js";

export const getWorkspaceBoardsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.body as GetTypeFromSchema<
      typeof getWorkspaceBoardsSchema
    >;

    const data = await getWorkspaceBoardsService(workspaceId);

    const response: GetWorkspaceBoardsResponse = {
      success: true,
      message: "Boards fetched successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
