import {
  getUserAndOrganization,
  getUserById,
  getUserByUsername,
  updateUser,
  onboardUser,
  getUserRole,
} from "./repository.js";
import { AppError } from "@repo/errors/app-error";
import type { AvatarIds } from "@repo/contracts/response";

export const onboardingService = async (
  userId: string,
  username: string,
  avatarId: AvatarIds,
  firstName: string,
  lastName: string,
) => {
  const updatedUser = await onboardUser(
    userId,
    username,
    avatarId,
    firstName,
    lastName,
  );

  if (!updatedUser) {
    throw new AppError("You are already onboarded", 400);
  }

  const sessionData = {
    userId: updatedUser.userId,
    email: updatedUser.email,
    isUserOnboarded: true,
  };

  return sessionData;
};

export const checkUsernameAvailabilityService = async (username: string) => {
  const user = await getUserByUsername(username);

  if (user) {
    throw new AppError("Username is not available", 400);
  }

  return true;
};

export const getMeService = async (userId: string) => {
  const data = await getUserAndOrganization(userId);

  if (data.length === 0) {
    throw new AppError("Failed to get user data. Please sign in again", 400);
  }

  const first = data[0]!;

  return {
    user: {
      firstName: first.firstname!,
      lastName: first.lastname!,
      username: first.username!,
      email: first.email,
      avatarId: first.avatarId!,
    },
    organization: data.map((row) => ({
      organizationName: row.organizationName,
      joiningStatus: row.joiningStatus,
    })),
  };
};

export const updateMeService = async (
  userId: string,
  username?: string,
  avatarId?: AvatarIds,
  firstName?: string,
  lastName?: string,
) => {
  const updatedUser = await updateUser(
    userId,
    username,
    avatarId,
    firstName,
    lastName,
  );

  if (!updatedUser) {
    throw new AppError("Failed to update user. Please sign in again", 400);
  }

  const sessionData = {
    userId: updatedUser.userId,
    email: updatedUser.email,
  };

  return sessionData;
};
