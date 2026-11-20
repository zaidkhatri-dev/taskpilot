import { NextFunction, Request, Response } from "express";
import {
  createWorkspaceService,
  getMyWorkspacesService,
  updateWorkspaceService,
  leaveWorkspaceService,
  getWorkspaceUsersService,
  acceptWorkspaceInvitationService,
  deleteWorkspaceService,
  inviteUserService,
} from "./services.js";
import type {
  GetMyWorkspacesResponse,
  CreateWorkspaceResponse,
  UpdateWorkspaceResponse,
  GetWorkspaceMembersResponse,
} from "@repo/contracts/response/workspace";
import { GetTypeFromSchema } from "@/types/validation.js";
import {
  updateWorkspaceSchema,
  createWorkspaceSchema,
  inviteUserSchema,
  getWorkspaceUsersSchema,
} from "@repo/validation/workspace";
import { idSchema } from "@repo/validation/shared";
import { EmptyResponse } from "@repo/contracts/response/common";

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
    const { name } = req.body as GetTypeFromSchema<
      typeof createWorkspaceSchema
    >;

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
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const { name } = req.body as GetTypeFromSchema<
      typeof updateWorkspaceSchema
    >;
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

export const leaveWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const userId = req.session.userId!;

    await leaveWorkspaceService(userId, workspaceId);

    const response: EmptyResponse = {
      success: true,
      message: "Workspace left successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const { status, page, limit, name } = req.query as unknown as GetTypeFromSchema<
      typeof getWorkspaceUsersSchema
    >;
    const userId = req.session.userId!;

    const data = await getWorkspaceUsersService(userId, workspaceId, {
      status,
      page,
      limit,
      name,
    });

    const response: GetWorkspaceMembersResponse = {
      success: true,
      message: "Workspace users fetched successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const acceptWorkspaceInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const userId = req.session.userId!;

    await acceptWorkspaceInvitationService(userId, workspaceId);

    const response: EmptyResponse = {
      success: true,
      message: "Workspace invitation accepted successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const userId = req.session.userId!;

    await deleteWorkspaceService(userId, workspaceId);

    const response: EmptyResponse = {
      success: true,
      message: "Workspace deleted successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const inviteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: workspaceId } = req.params as GetTypeFromSchema<
      typeof idSchema
    >;
    const userId = req.session.userId!;
    const { email, role } = req.body as GetTypeFromSchema<
      typeof inviteUserSchema
    >;

    await inviteUserService(userId, workspaceId, email, role);

    const response: EmptyResponse = {
      success: true,
      message: "User invited to workspace successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
