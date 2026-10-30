import { EmptyResponse } from "@repo/contracts/response/common";
import type { NextFunction, Request, Response } from "express";

export const checkIsServerShuttingDown = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.locals.isShuttingDown) {
    const response: EmptyResponse = {
      success: false,
      message: "Server is shutting down",
      data: null,
    };
    return res.status(503).json(response);
  }

  next();
};
