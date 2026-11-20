import {
  Permission,
  PERMISSIONS,
  WorkspaceMembershipRoles,
  TargetedAction,
  TARGET_PERMISSIONS,
} from "@repo/contracts/miscellaneous/auth";

export const checkPermission = (
  permission: Permission,
  userRole?: WorkspaceMembershipRoles | null,
) => {
  if (!userRole) return false;
  return PERMISSIONS[permission]?.includes(userRole) ?? false;
};

export const checkTargetPermission = (
  action: TargetedAction,
  userRole: WorkspaceMembershipRoles,
  targetRole: WorkspaceMembershipRoles,
) => {
  return TARGET_PERMISSIONS[action]?.[userRole]?.includes(targetRole) ?? false;
};
