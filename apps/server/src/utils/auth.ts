import { serverConfig } from "@repo/config/server";

export const generateMagicLink = (token: string) => {
  return `${serverConfig.EMAIL_VERIFICATION_BASE_URL}?token=${token}`;
};

export const getEmailBody = (email: string, link: string) => {
  const expiryMinutes = Math.floor(serverConfig.AUTH_TOKEN_EXPIRY_TIME / 60);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to ${serverConfig.APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fbfbfb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717; line-height: 1.6; -webkit-font-smoothing: antialiased;">
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
    Sign in securely to your ${serverConfig.APP_NAME} account with one click.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fbfbfb; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 10px; border: 1px solid #ebebeb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04); overflow: hidden;">
          <tr>
            <td style="padding: 36px 32px; text-align: left;">
              <!-- Header / Title -->
              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.015em; color: #171717;">
                Sign in to ${serverConfig.APP_NAME}
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #737373;">
                Hello,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #737373;">
                We received a sign-in request for <strong style="color: #171717; font-weight: 600;">${email}</strong>. Click the button below to authenticate your account. This link expires in <strong style="color: #171717; font-weight: 600;">${expiryMinutes} minutes</strong> and can only be used once.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #171717;">
                    <a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #fafafa; background-color: #171717; text-decoration: none; border-radius: 10px; border: 1px solid #171717; -webkit-text-size-adjust: none;">
                      Sign in to ${serverConfig.APP_NAME}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px 0; font-size: 13px; color: #8c8c8c;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 24px 0; font-size: 13px; word-break: break-all; line-height: 1.5;">
                <a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #171717; text-decoration: underline; text-underline-offset: 3px;">
                  ${link}
                </a>
              </p>

              <hr style="border: none; border-top: 1px solid #ebebeb; margin: 24px 0;" />

              <p style="margin: 0 0 20px 0; font-size: 12px; color: #a1a1a1; line-height: 1.5;">
                If you did not request this email, you can safely ignore it. Your account is completely safe.
              </p>

              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #737373;">
                Best regards,<br />
                <strong style="color: #171717; font-weight: 600;">The ${serverConfig.APP_NAME} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
