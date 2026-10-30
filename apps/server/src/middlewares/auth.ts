import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/errors/app-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session || !req.session.userId || !req.session.email) {
    throw new AppError("Unauthorized access", 401);
  }

  next();
};

export const requireOnboarding = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.isOnboarded) {
    throw new AppError("Please complete onboarding before proceeding", 403);
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
