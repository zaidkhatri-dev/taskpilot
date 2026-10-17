import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/errors/app-error";
import { UserOnboardedResponse } from "@repo/contracts/response";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session || !req.session.userId || !req.session.email) {
    throw new AppError("Unauthorized access", 401);
  }

  if (req.session.isUserOnboarded && req.url.includes("/onboarding")) {
    const response: UserOnboardedResponse = {
      success: false,
      message: "You have already completed onboarding",
      data: {
        isUserOnboarded: true,
      },
    };

    return res.status(403).json(response);
  }

  if (!req.session.isUserOnboarded && !req.url.includes("/onboarding")) {
    const response: UserOnboardedResponse = {
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

export const requireSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session || !req.session.userId || !req.session.email) {
    throw new AppError("Unauthorized access", 401);
  }
  next();
};

export const requireGuest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session && (req.session.userId || req.session.email)) {
    throw new AppError("Unauthorized access", 401);
  }
  next();
};
