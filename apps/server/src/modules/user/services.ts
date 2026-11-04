import { getUserById, onboardUser } from "./repository.js";
import { AppError } from "@repo/errors/app-error";
import type { AvatarId } from "@repo/contracts/miscellaneous/user";

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
    throw new AppError("You already have an account", 400);
  }

  const sessionData = {
    userId: updatedUser.userId,
    email: updatedUser.email,
  };

  return sessionData;
};

export const getMeService = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Failed to get user data. Please sign in again", 400);
  }

  return {
    firstName: user.firstName!,
    lastName: user.lastName!,
    username: user.username!,
    email: user.email,
    avatarId: user.avatarId!,
  };
};

// export const checkUsernameAvailabilityService = async (username: string) => {
//   const user = await getUserByUsername(username);

//   if (user) {
//     throw new AppError("Username is not available", 400);
//   }

//   return true;
// };

// export const updateMeService = async (
//   userId: string,
//   username?: string,
//   avatarId?: AvatarId,
//   firstName?: string,
//   lastName?: string,
// ) => {
//   const updatedUser = await updateUser(
//     userId,
//     username,
//     avatarId,
//     firstName,
//     lastName,
//   );

//   if (!updatedUser) {
//     throw new AppError("Failed to update user. Please sign in again", 400);
//   }

//   return;
// };
