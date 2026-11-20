import { WorkspaceItem } from "@repo/contracts/response/workspace";

export function getDefaultWorkspace(
  workspaces: WorkspaceItem[],
  lastWorkspaceId?: string | null,
) {
  if (workspaces.length === 0) return null;

  return (
    workspaces.find((workspace) => workspace.id === lastWorkspaceId) ??
    workspaces[0]
  );
}

export function canTransferOwnershipTo(targetRole: string) {
  return targetRole === "admin";
}

export function isRoleChangeValid(currentRole: string, targetRole: string) {
  if (currentRole === "admin" && targetRole === "member") {
    return true;
  }

  if (currentRole === "member" && targetRole === "admin") {
    return true;
  }

  return false;
}


