import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js";
import {
  checkUsernameAvailabilitySchema,
  onboardingSchema,
  updateMeSchema,
} from "@repo/validation/user";
import {
  onboardingService,
  checkUsernameAvailabilityService,
  getMeService,
  updateMeService,
} from "./services.js";
import { DefaultResponse, GetMeResponse } from "@repo/contracts/response";
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

    if (req.session.isUserOnboarded) {
      throw new AppError("User is already onboarded", 409);
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
    req.session.isUserOnboarded = sessionData.isUserOnboarded;

    await saveSession(req);

    const response: DefaultResponse = {
      success: true,
      message: "Onboarding completed successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const checkUsernameAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body as GetTypeFromSchema<
      typeof checkUsernameAvailabilitySchema
    >;

    await checkUsernameAvailabilityService(username);

    const response: DefaultResponse = {
      success: true,
      message: "Username is available",
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
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;
    const { username, avatarId, firstName, lastName } =
      req.body as GetTypeFromSchema<typeof updateMeSchema>;

    await updateMeService(userId, username, avatarId, firstName, lastName);

    const response: DefaultResponse = {
      success: true,
      message: "User updated successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
