import { serverConfig } from "@repo/config/server";

export const generateMagicLink = (token: string) => {
    return `${serverConfig.EMAIL_VERIFICATION_BASE_URL}?token=${token}`
}

export const getEmailBody = (email: string, link: string) => {
    return `
        <div>
            <h1>Welcome to ${serverConfig.APP_NAME}</h1>
            <p>To move forward, verify your email: <b>${email}</b></p>
            <a href="${link}">Verify Email</a>
            <p>This link will expire in ${serverConfig.AUTH_TOKEN_EXPIRY_TIME / 60} minutes</p>
        </div>
    `
}