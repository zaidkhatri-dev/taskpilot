import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/errors/app-error";
import { UserNotOnboardedResponse } from "@repo/contracts/response";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session || !req.session.userId || !req.session.email) {
    throw new AppError("Unauthorized access", 401);
  }

  if (!req.session.isUserOnboarded) {
    const response: UserNotOnboardedResponse = {
      success: false,
      message: "Please complete onboarding before proceeding",
      data: {
        isUserOnboarded: false,
      },
    };

    return res.status(403).json(response);
  }

  next();
};
