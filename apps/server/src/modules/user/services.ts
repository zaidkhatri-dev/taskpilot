import { getUserById, getUserByUsername, updateUser } from "./repository.js";
import { AppError } from "@repo/errors/app-error";
import { AvatarIds } from "@repo/validation/auth";

export const onboardingService = async (
  userId: string,
  username: string,
  avatarId: AvatarIds,
) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.username || user.avatarId) {
    throw new AppError("User is already signed up", 400);
  }

  const updatedUser = await updateUser(userId, username, avatarId);

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
