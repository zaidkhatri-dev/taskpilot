import { generateRandomToken, hashToken } from "@utils/crypto.js";
import { setTokenToRedis } from "./repository.js";

export const generateLinkService = async (email: string) => {
    const rawToken = generateRandomToken()

    const hashedToken = hashToken(rawToken)

    await setTokenToRedis(hashedToken, email)

    // Send Email
}