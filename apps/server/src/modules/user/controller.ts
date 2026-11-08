import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "@/types/validation.js";
import { onboardingSchema, updateMeSchema } from "@repo/validation/user";
import {
  getMeService,
  getWorkspaceInvitationsService,
  onboardingService,
  updateMeService,
} from "./services.js";
import type { EmptyResponse } from "@repo/contracts/response/common";
import type {
  GetMeResponse,
  GetWorkspaceInvitationsResponse,
  UpdateMeResponse,
} from "@repo/contracts/response/user";
import { regenerateSession, saveSession } from "@/utils/session.js";
import { AppError } from "@repo/errors/app-error";

export const onboardingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, avatarId, firstName, lastName } =
      req.body as GetTypeFromSchema<typeof onboardingSchema>;

    const userId = req.session.userId!;

    if (req.session.isOnboarded) {
      throw new AppError("You already have an account", 409);
    }

    const sessionData = await onboardingService(
      userId,
      username,
      avatarId,
      firstName,
      lastName,
    );

    await regenerateSession(req);

    req.session.userId = sessionData.userId;
    req.session.email = sessionData.email;
    req.session.isOnboarded = true;

    await saveSession(req);

    const response: EmptyResponse = {
      success: true,
      message: "Your account has been created successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;

    const data = await getMeService(userId);

    const response: GetMeResponse = {
      success: true,
      message: "User fetched successfully",
      data: data ?? null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// export const checkUsernameAvailabilityController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { username } = req.body as GetTypeFromSchema<
//       typeof checkUsernameAvailabilitySchema
//     >;

//     await checkUsernameAvailabilityService(username);

//     const response: EmptyResponse = {
//       success: true,
//       message: "Username is available",
//       data: null,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

export const updateMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;
    const { username, avatarId, firstName, lastName } =
      req.body as GetTypeFromSchema<typeof updateMeSchema>;

    const updatedUser = await updateMeService(
      userId,
      username,
      avatarId,
      firstName,
      lastName,
    );

    const response: UpdateMeResponse = {
      success: true,
      message: "Your profile has been updated successfully",
      data: updatedUser,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;

    const data = await getWorkspaceInvitationsService(userId);

    const response: GetWorkspaceInvitationsResponse = {
      success: true,
      message: "Workspace invitations fetched successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
