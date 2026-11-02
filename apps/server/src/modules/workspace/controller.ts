import { NextFunction, Request, Response } from "express";
import { createWorkspaceService, getMyWorkspacesService } from "./services.js";
import type {
  GetMyWorkspacesResponse,
  CreateWorkspaceResponse,
} from "@repo/contracts/response/workspace";

export const getMyWorkspacesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;

    const data = await getMyWorkspacesService(userId);

    const response: GetMyWorkspacesResponse = {
      success: true,
      message: "Workspaces fetched successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;
    const { name } = req.body;

    const data = await createWorkspaceService(userId, name);

    const response: CreateWorkspaceResponse = {
      success: true,
      message: "Workspace created successfully",
      data,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
