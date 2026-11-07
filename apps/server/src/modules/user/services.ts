import { getUserById, onboardUser, updateUser } from "./repository.js";
import { AppError } from "@repo/errors/app-error";
import type { AvatarId } from "@repo/contracts/miscellaneous/user";
import { isUnchanged } from "@/utils/miscellaneous.js";
import { getWorkspaceInvitations } from "../membership/repository.js";

export const onboardingService = async (
  userId: string,
  username: string,
  avatarId: AvatarId,
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
    throw new AppError("Failed to create your account", 400);
  }

  const sessionData = {
    userId: updatedUser.userId,
    email: updatedUser.email,
  };

  return sessionData;
};

export const getMeService = async (userId: string) => {
  const user = await getUserById(userId);

  return user;
};

// export const checkUsernameAvailabilityService = async (username: string) => {
//   const user = await getUserByUsername(username);

//   if (user) {
//     throw new AppError("Username is not available", 400);
//   }

//   return true;
// };

export const updateMeService = async (
  userId: string,
  username?: string,
  avatarId?: AvatarId,
  firstName?: string,
  lastName?: string,
) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Your account was not found", 404);
  }

  const input = {
    username,
    avatarId,
    firstName,
    lastName,
  };

  if (isUnchanged(input, user)) {
    return user;
  }

  const updatedUser = await updateUser(
    user.id,
    username,
    avatarId,
    firstName,
    lastName,
  );

  if (!updatedUser) {
    throw new AppError("Failed to update your account", 400);
  }

  return updatedUser;
};

export const getWorkspaceInvitationsService = async (userId: string) => {
  const invitations = await getWorkspaceInvitations(userId);
  return invitations;
};
