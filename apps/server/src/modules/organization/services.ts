import { createOrganization } from "./repository.js";
import { AppError } from "@repo/errors/app-error";

export const createOrganizationService = async (
  userId: string,
  name: string,
  description?: string,
) => {
  const organization = await createOrganization(userId, name, description);

  if (!organization) {
    throw new AppError("Failed to create organization", 500);
  }

  return;
};
