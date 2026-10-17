import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js";
import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import {
  generateMagicLinkService,
  verifyMagicLinkService,
} from "./services.js";
import {
  DefaultResponse,
  UserOnboardedResponse,
} from "@repo/contracts/response";
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

    const response: UserOnboardedResponse = {
      success: true,
      message: "Securely Signed In!",
      data: {
        isUserOnboarded: sessionData.isUserOnboarded,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
