import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js";
import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
  onboardingSchema,
} from "@repo/validation/auth";
import {
  generateMagicLinkService,
  verifyMagicLinkService,
  onboardingService,
} from "./services.js";
import { DefaultResponse } from "@repo/contracts/response";
import { regenerateSession, saveSession } from "@/utils/session.js";
import { AppError } from "@repo/errors/app-error";

export const generateMagicLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as GetTypeFromSchema<
      typeof generateMagicLinkSchema
    >;

    await generateMagicLinkService(email);

    const response: DefaultResponse = {
      success: true,
      message:
        "If this email exists then a verification link has been sent on it",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyMagicLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body as GetTypeFromSchema<
      typeof verifyMagicLinkSchema
    >;

    const sessionData = await verifyMagicLinkService(token!);

    await regenerateSession(req);

    req.session.userId = sessionData.userId;
    req.session.email = sessionData.email;
    req.session.isUserOnboarded = sessionData.isUserOnboarded;

    await saveSession(req);

    const response: DefaultResponse = {
      success: true,
      message: "Email verified successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const onboardingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, avatarId } = req.body as GetTypeFromSchema<
      typeof onboardingSchema
    >;

    const userId = req.session.userId!;

    const sessionData = await onboardingService(userId, username, avatarId);

    await regenerateSession(req);

    req.session.userId = sessionData.userId;
    req.session.email = sessionData.email;
    req.session.isUserOnboarded = sessionData.isUserOnboarded;

    await saveSession(req);

    const response: DefaultResponse = {
      success: true,
      message: "Profile updated successfully",
      data: null,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
