import { config } from "@repo/config";

export const generateMagicLink = (token: string) => {
    return `${config.EMAIL_VERIFICATION_BASE_URL}?token=${token}`
}

export const getEmailBody = (email: string, link: string) => {
    return `
        <div>
            <h1>Welcome to ${config.APP_NAME}</h1>
            <p>To move forward, verify your email: <b>${email}</b></p>
            <a href="${link}">Verify Email</a>
            <p>This link will expire in ${config.AUTH_TOKEN_EXPIRY_TIME / 60} minutes</p>
        </div>
    `
}