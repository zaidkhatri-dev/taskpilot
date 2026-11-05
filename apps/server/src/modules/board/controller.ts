import { NextFunction, Request, Response } from "express";
import {
  GetBoardsResponse,
  CreateBoardResponse,
} from "@repo/contracts/response/board";
import { createBoardSchema } from "@repo/validation/board";
import { getBoardsService, createBoardService } from "./services.js";
import { GetTypeFromSchema } from "@/types/validation.js";
import { idSchema } from "@repo/validation/shared";

export const getBoardsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as GetTypeFromSchema<typeof idSchema>;
    const userId = req.session.userId!;

    const data = await getBoardsService(id, userId);

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

export const createBoardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body as GetTypeFromSchema<
      typeof createBoardSchema
    >;
    const { id } = req.params as GetTypeFromSchema<typeof idSchema>;
    const userId = req.session.userId!;

    const data = await createBoardService(
      id,
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
