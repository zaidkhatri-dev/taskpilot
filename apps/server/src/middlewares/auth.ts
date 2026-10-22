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

  const isOnboarding = req.url.includes("/onboarding") && req.method === "POST";
  if (req.session.isUserOnboarded && isOnboarding) {
    const response: UserOnboardedResponse = {
      success: false,
      message: "You have already completed onboarding",
      data: {
        isUserOnboarded: true,
        hasOrganization: req.session.hasOrganization!,
      },
    };

    return res.status(403).json(response);
  }

  if (!req.session.isUserOnboarded && !isOnboarding) {
    const response: UserOnboardedResponse = {
      success: false,
      message: "Please complete onboarding before proceeding",
      data: {
        isUserOnboarded: false,
        hasOrganization: req.session.hasOrganization!,
      },
    };
    return res.status(403).json(response);
  }
  const isCreatingOrganization =
    req.url.includes("/organization") && req.method === "POST";
  if (req.session.hasOrganization && isCreatingOrganization) {
    const response: UserOnboardedResponse = {
      success: false,
      message: "You are already a part of an organization",
      data: {
        isUserOnboarded: req.session.isUserOnboarded!,
        hasOrganization: true,
      },
    };

    return res.status(403).json(response);
  }

  if (
    !req.session.hasOrganization &&
    !isCreatingOrganization &&
    !isOnboarding
  ) {
    const response: UserOnboardedResponse = {
      success: false,
      message: "You must be part of an organization to proceed",
      data: {
        isUserOnboarded: req.session.isUserOnboarded!,
        hasOrganization: false,
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
