import { generateRandomToken, hashToken } from "@utils/crypto.js";
import { getValue, setValue } from "./repository.js";
import { emailQueue } from "@repo/email/queue";
import { config } from "@repo/config";
import { getMagicLinkKey } from "@/utils/redis.js";
import { generateMagicLink, getEmailBody } from "@/utils/auth.js";
import { EmailJobData } from "@repo/contracts/other";

export const generateLinkService = async (email: string) => {

    const rawToken = generateRandomToken()

    const hashedToken = hashToken(rawToken)
    
    const MAGIC_KEY = getMagicLinkKey(hashedToken)
    await setValue(MAGIC_KEY, email, config.AUTH_TOKEN_EXPIRY_TIME)

    const link = generateMagicLink(rawToken)
    const emailBody = getEmailBody(email, link)
    
    const jobData: EmailJobData = {
        from: config.SENDER_EMAIL,
        to: email,
        subject: "Please verify your email",
        html: emailBody
    }

    await emailQueue.add("send-email", jobData)

}