import { generateRandomToken, hashToken } from "@utils/crypto.js";
import {
  getHValue,
  getHValueByToken,
  setHValue,
  delKey,
  getUserByEmail,
  createUser,
  getUserOrganizationStatus,
  getUserOrganizationOwnershipStatus,
} from "./repository.js";
import { getEmailQueue } from "@repo/email/queue";
import { serverConfig } from "@repo/config/server";
import { getMagicLinkKey } from "@/utils/redis.js";
import { generateMagicLink, getEmailBody } from "@/utils/auth.js";
import { EmailJobData } from "@repo/contracts/other";
import { MagicLinkPayload } from "@/types/redis.js";
import { AppError } from "@repo/errors/app-error";

export const generateMagicLinkService = async (email: string) => {
  const rawToken = generateRandomToken();

  const hashedToken = hashToken(rawToken);

  const MAGIC_KEY = getMagicLinkKey(email);

  const payload: MagicLinkPayload = {
    token: hashedToken,
    count: 1,
  };

  const val = await getHValue(MAGIC_KEY);

  if (val && Object.keys(val).length > 0) {
    payload.count = Number(val.count) + 1;
  }

  await setHValue(MAGIC_KEY, payload, serverConfig.AUTH_TOKEN_EXPIRY_TIME);

  const link = generateMagicLink(rawToken);
  const emailBody = getEmailBody(email, link);

  const jobData: EmailJobData = {
    from: serverConfig.SENDER_EMAIL,
    to: email,

    subject: `Your sign-in link for ${serverConfig.APP_NAME}`,
    html: emailBody,
  };

  const emailQueue = getEmailQueue({
    redisUrl: serverConfig.REDIS_URL,
    maxRetries: serverConfig.EMAIL_WORKER_MAX_RETRY,
    attemptDelay: serverConfig.EMAIL_WORKER_ATTEMPT_DELAY,
  });
  await emailQueue.add("send-email", jobData);
};

export const verifyMagicLinkService = async (rawToken: string) => {
  const hashedToken = hashToken(rawToken);

  const result = await getHValueByToken(hashedToken);
  if (!result) {
    throw new AppError("The link is invalid or has expired", 400);
  }

  const { key, value } = result;

  if (hashedToken !== value.token) {
    throw new AppError("The link is invalid or has expired", 400);
  }

  const email = key.split(":")[1]!;

  let sessionData = null;

  let fetchedUser = await getUserByEmail(email);

  if (!fetchedUser) {
    let user = await createUser(email);
    sessionData = {
      userId: user.userId,
      email: user.email,
      isUserOnboarded: false,
      hasOrganization: false,
      isOrganizationOwner: false,
    };
  } else if (
    !fetchedUser.avatarId &&
    !fetchedUser.username &&
    !fetchedUser.firstName &&
    !fetchedUser.lastName
  ) {
    sessionData = {
      userId: fetchedUser.userId,
      email: fetchedUser.email,
      isUserOnboarded: false,
      hasOrganization: false,
      isOrganizationOwner: false,
    };
  } else {
    const [orgStatus, orgAdminStatus] = await Promise.all([
      getUserOrganizationStatus(fetchedUser.userId),
      getUserOrganizationOwnershipStatus(fetchedUser.userId),
    ]);
    sessionData = {
      userId: fetchedUser.userId,
      email: fetchedUser.email,
      isUserOnboarded: true,
      hasOrganization: orgStatus.hasOrganization,
      isOrganizationOwner: orgAdminStatus.isOrganizationOwner,
    };
  }

  await delKey(key);

  return sessionData;
};
