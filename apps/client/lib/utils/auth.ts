import { Permission, PERMISSIONS, WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

export const checkPermission = (permission: Permission, userRole: WorkspaceMembershipRoles) => {
  return PERMISSIONS[permission]?.includes(userRole) ?? false;
}