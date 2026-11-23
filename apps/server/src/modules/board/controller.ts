import { NextFunction, Request, Response } from "express";
import {
  GetBoardsResponse,
  CreateBoardResponse,
  UpdateBoardResponse,
} from "@repo/contracts/response/board";
import { EmptyResponse } from "@repo/contracts/response/common";
import {
  createBoardSchema,
  updateBoardSchema,
  boardParamsSchema,
} from "@repo/validation/board";
import {
  getBoardsService,
  createBoardService,
  updateBoardService,
  deleteBoardService,
} from "./services.js";
import { GetTypeFromSchema } from "@/types/validation.js";

export const getBoardsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = req.params as GetTypeFromSchema<
      typeof boardParamsSchema
    >;
    const userId = req.session.userId!;

    const data = await getBoardsService(workspaceId, userId);

    const response: GetBoardsResponse = {
      success: true,
      message: "Boards fetched successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBoardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, boardId } = req.params as GetTypeFromSchema<
      typeof boardParamsSchema
    >;
    const { name, description } = req.body as GetTypeFromSchema<
      typeof updateBoardSchema
    >;

    const data = await updateBoardService(
      boardId,
      workspaceId,
      req.session.userId!,
      {
        name,
        description,
      },
    );

    const response: UpdateBoardResponse = {
      success: true,
      message: "Board updated successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteBoardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId, workspaceId } = req.params as GetTypeFromSchema<
      typeof boardParamsSchema
    >;

    await deleteBoardService(boardId, workspaceId, req.session.userId!);

    const response: EmptyResponse = {
      success: true,
      message: "Board deleted successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createBoardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body as GetTypeFromSchema<
      typeof createBoardSchema
    >;
    const { workspaceId } = req.params as GetTypeFromSchema<
      typeof boardParamsSchema
    >;
    const userId = req.session.userId!;

    const data = await createBoardService(
      workspaceId,
      userId,
      name,
      description,
    );

    const response: CreateBoardResponse = {
      success: true,
      message: "Board created successfully",
      data,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
