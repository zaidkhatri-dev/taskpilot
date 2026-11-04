export interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const PERMISSIONS: Readonly<Record<string, WorkspaceMembershipRoles[]>> = {
  'board:create': ['admin'],
  'board:view':   ['admin', 'member'],
  'board:delete': ['admin'],
}

export type Permission = keyof typeof PERMISSIONS;
export type WorkspaceMembershipRoles = "admin" | "member";

