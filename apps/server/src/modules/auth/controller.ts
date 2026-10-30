import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "@/types/validation.js";
import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import {
  generateMagicLinkService,
  verifyMagicLinkService,
} from "./services.js";
import type { SessionResponse } from "@repo/contracts/response/auth";
import type { EmptyResponse } from "@repo/contracts/response/common";
import { regenerateSession, saveSession } from "@/utils/session.js";

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

    const response: EmptyResponse = {
      success: true,
      message: "If this email exists then a sign in link has been sent on it",
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

    const sessionData = await verifyMagicLinkService(token);

    await regenerateSession(req);

    req.session.userId = sessionData.userId;
    req.session.email = sessionData.email;
    req.session.isOnboarded = sessionData.isOnboarded;

    await saveSession(req);

    const response: SessionResponse = {
      success: true,
      message: "Securely Signed In!",
      data: {
        isOnboarded: sessionData.isOnboarded,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const sessionController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isOnboarded } = req.session;

    const response: SessionResponse = {
      success: true,
      message: "Session retrieved successfully",
      data: {
        isOnboarded: !!isOnboarded,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
