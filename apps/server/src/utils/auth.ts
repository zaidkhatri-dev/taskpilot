import { serverConfig } from "@repo/config/server";

export const generateMagicLink = (token: string) => {
  return `${serverConfig.EMAIL_VERIFICATION_BASE_URL}?token=${token}`;
};

export const getEmailBody = (email: string, link: string) => {
  return `
        <div>
            <p>Dear ${email},</p>
            <p>To move forward, please click on the link below</p>
            <a href="${link}">${link}</a>
            <p>This link will expire in ${serverConfig.AUTH_TOKEN_EXPIRY_TIME / 60} minutes</p>
            <p>If you did not initiate this request, please ignore this email.</p>
        </div>
    `;
};
