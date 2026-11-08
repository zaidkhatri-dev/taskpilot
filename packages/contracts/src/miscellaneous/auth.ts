export interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const PERMISSIONS: Readonly<Record<string, WorkspaceMembershipRoles[]>> =
  {
    "board:create": ["admin", "owner"],
    "board:view": ["admin", "member", "owner"],
    "board:delete": ["admin", "owner"],
    "workspace:update": ["admin", "owner"],
    "workspace:leave": ["member", "admin"],
    "members:view": ["admin", "member", "owner"],
  };

export type Permission = keyof typeof PERMISSIONS;
export type WorkspaceMembershipRoles = "admin" | "member" | "owner";
