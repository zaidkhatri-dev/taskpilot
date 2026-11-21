import { serverConfig } from "@repo/config/server";
import { getLogoUrl } from "./logo.js";

export const getWorkspaceInvitationEmailBody = (
  email: string,
  link: string,
  workspaceName: string,
) => {
  const logoUrl = getLogoUrl(serverConfig.SERVER_URL);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Workspace Invitation - ${serverConfig.APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fbfbfb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717; line-height: 1.6; -webkit-font-smoothing: antialiased;">
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
    You've been invited to join a workspace on ${serverConfig.APP_NAME}.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fbfbfb; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 10px; border: 1px solid #ebebeb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04); overflow: hidden;">
          <tr>
            <td style="padding: 36px 32px; text-align: left;">
              <!-- App Brand Header -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  ${
                    logoUrl
                      ? `<td style="vertical-align: middle; padding-right: 10px;">
                    <img src="${logoUrl}" alt="${serverConfig.APP_NAME}" width="30" height="30" style="display: block; width: 30px; height: 30px; border-radius: 6px; object-fit: contain;" />
                  </td>`
                      : ""
                  }
                  <td style="vertical-align: middle;">
                    <span style="font-size: 17px; font-weight: 700; letter-spacing: -0.02em; color: #171717; line-height: 1;">
                      ${serverConfig.APP_NAME}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Header / Title -->
              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; letter-spacing: -0.015em; color: #171717;">
                Workspace Invitation
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #737373;">
                Hello,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #737373;">
                You have been invited to join a workspace <strong style="color: #171717; font-weight: 600;">${workspaceName.toUpperCase()}</strong> with your email <strong style="color: #171717; font-weight: 600;">${email}</strong>.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #171717;">
                    <a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #fafafa; background-color: #171717; text-decoration: none; border-radius: 10px; border: 1px solid #171717; -webkit-text-size-adjust: none;">
                      Accept Invitation
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
                If you did not expect this invitation, you can safely ignore this email.
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

export const isRoleChangeValid = (currentRole: string, newRole: string) => {
  if (currentRole === "admin" && newRole === "member") {
    return true;
  }

  if (currentRole === "member" && newRole === "admin") {
    return true;
  }

  return false;
};

export const getRoleChangeType = (currentRole: string, newRole: string) => {
  if (currentRole === "admin" && newRole === "member") {
    return "demoted";
  }

  if (currentRole === "member" && newRole === "admin") {
    return "promoted";
  }

  return "changed";
};
