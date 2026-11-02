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
