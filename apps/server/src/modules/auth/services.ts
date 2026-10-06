import { generateRandomToken, hashToken } from "@utils/crypto.js";
import { getHValue, getHValueByToken, setHValue, delKey, updateUser, getUserByEmail, createUser, getUserById } from "./repository.js";
import { emailQueue } from "@repo/email/queue";
import { config } from "@repo/config";
import { getMagicLinkKey } from "@/utils/redis.js";
import { generateMagicLink, getEmailBody } from "@/utils/auth.js";
import { EmailJobData } from "@repo/contracts/other";
import { MagicLinkPayload } from "@/types/redis.js";
import { AppError } from "@repo/errors/app-error";
import { uploadImage } from "@/utils/image-upload.js";

export const generateMagicLinkService = async (email: string) => {
    const rawToken = generateRandomToken()

    const hashedToken = hashToken(rawToken)
    
    const MAGIC_KEY = getMagicLinkKey(email)

    const payload: MagicLinkPayload = {
        token: hashedToken,
        count: 1
    }
    
    const val = await getHValue(MAGIC_KEY)
    
    if (val && Object.keys(val).length > 0) {
        payload.count = Number(val.count) + 1
    }

    await setHValue(MAGIC_KEY, payload, config.AUTH_TOKEN_EXPIRY_TIME)

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

export const verifyMagicLinkService = async (rawToken: string) => {
    const hashedToken = hashToken(rawToken)
    
    const result = await getHValueByToken(hashedToken)
    if (!result) {
        throw new AppError("The link is invalid or has expired", 400)
    }
    
    const { key, value } = result;

    if (hashedToken !== value.token) {
        throw new AppError("The link is invalid or has expired", 400)
    }

    const email = key.split(":")[1]!

    let user = await getUserByEmail(email)

    if (!user){
        user = await createUser(email)
    }

    const sessionData = {
        userId: user.userId,
        email: user.email,
    }

    await delKey(key)

    return sessionData;
}

export const checkIfSignedUpService = async (userId: string) => {
    const user = await getUserById(userId)
    
    if (!user) {
        throw new AppError("User not found", 404)
    }

    return Boolean(user.username && user.profilePictureUrl)
}

export const signupService = async (userId: string, username: string, file: Express.Multer.File) => {
    const user = await getUserById(userId)

    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (user.username || user.profilePictureUrl) {
        throw new AppError("User is already signed up", 400)
    }

    const imageUrl = await uploadImage(file)

    if (!imageUrl){
        throw new AppError("Profile picture upload failed", 500)
    }
    
    const updatedUser = await updateUser(userId, username, imageUrl)
    
    const sessionData = {
        userId: updatedUser.userId,
        email: updatedUser.email
    }
    
    return sessionData
}