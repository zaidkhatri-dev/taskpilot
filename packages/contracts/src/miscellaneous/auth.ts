export interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const PERMISSIONS: Readonly<Record<string, WorkspaceMembershipRoles[]>> =
  {
    "board:view": ["admin", "member", "owner"],
    "board:create": ["admin", "owner"],
    "board:update": ["admin", "owner"],
    "board:delete": ["admin", "owner"],
    "workspace:update": ["owner"],
    "workspace:leave": ["member", "admin"],
    "workspace:delete": ["owner"],
    "workspace:transfer": ["owner"],
    "user:view": ["admin", "owner"],
    "user:invite": ["admin", "owner"],
    "user:remove": ["admin", "owner"],
    "user:change-role": ["owner"],
  };

export type TargetedAction = "user:view" | "user:invite" | "user:remove";
export const TARGET_PERMISSIONS: Readonly<
  Record<TargetedAction, Partial<Record<WorkspaceMembershipRoles, readonly WorkspaceMembershipRoles[]>>>
> = {
  "user:view": { owner: ["admin", "member"], admin: ["member"] },
  "user:remove": { owner: ["admin", "member"], admin: ["member"] },
  // for invite, the "target" is the role being assigned to the invitee
  "user:invite": { owner: ["admin", "member"], admin: ["member"] },
};

export type Permission = keyof typeof PERMISSIONS;
export type WorkspaceMembershipRoles = "admin" | "member" | "owner";
