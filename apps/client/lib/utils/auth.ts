import {
  Permission,
  PERMISSIONS,
  WorkspaceMembershipRoles,
} from "@repo/contracts/miscellaneous/auth";

export const checkPermission = (
  permission: Permission,
  userRole?: WorkspaceMembershipRoles | null,
) => {
  if (!userRole) return false;
  return PERMISSIONS[permission]?.includes(userRole) ?? false;
};
