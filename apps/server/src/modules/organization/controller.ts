import { createOrganizationSchema } from "@repo/validation/organization";
import { NextFunction, Request, Response } from "express";
import { GetTypeFromSchema } from "@/types/validation.js";
import { createOrganizationService } from "./services.js";
import { DefaultResponse } from "@repo/contracts/response";
import { regenerateSession, saveSession } from "@/utils/session.js";

export const createOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session.userId!;
    const email = req.session.email!;
    const isUserOnboarded = req.session.isUserOnboarded!;
    const { name, description } = req.body as GetTypeFromSchema<
      typeof createOrganizationSchema
    >;

    await createOrganizationService(userId, name, description);

    await regenerateSession(req);

    req.session.userId = userId;
    req.session.email = email;
    req.session.isUserOnboarded = isUserOnboarded;
    req.session.hasOrganization = true;
    req.session.isOrganizationOwner = true;

    await saveSession(req);

    const response: DefaultResponse = {
      success: true,
      message: "Organization created successfully",
      data: null,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
