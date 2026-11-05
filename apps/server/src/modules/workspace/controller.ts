import { NextFunction, Request, Response } from "express";
import { createWorkspaceService, getMyWorkspacesService, updateWorkspaceService } from "./services.js";
import type {
  GetMyWorkspacesResponse,
  CreateWorkspaceResponse,
  UpdateWorkspaceResponse,
} from "@repo/contracts/response/workspace";
import { GetTypeFromSchema } from "@/types/validation.js";
import { updateWorkspaceSchema, createWorkspaceSchema } from "@repo/validation/workspace";
import { idSchema } from "@repo/validation/shared";

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
    const { name } = req.body as GetTypeFromSchema<typeof createWorkspaceSchema>;

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

export const updateWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<typeof idSchema>;
    const { name } = req.body as GetTypeFromSchema<typeof updateWorkspaceSchema>;
    const userId = req.session.userId!;

    const data = await updateWorkspaceService(userId, workspaceId, name);

    const response: UpdateWorkspaceResponse = {
      success: true,
      message: "Workspace updated successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

