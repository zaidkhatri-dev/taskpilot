import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import NoWorkspace from "@/components/workspace/NoWorkspace";
import { getDefaultWorkspace } from "@/lib/utils/workspace";
import { getMyWorkspacesServer } from "@/lib/actions/workspace";

export default async function WorkspacePage() {
  const response = await getMyWorkspacesServer();

  if (!response.success) {
    throw new Error(response.message);
  }

  const workspaces = response.data;

  if (!workspaces || workspaces.length === 0) {
    return <NoWorkspace />;
  }

  const cookieStore = await cookies();
  const lastWorkspaceId = cookieStore.get("lastWorkspaceId")?.value;

  const workspace = getDefaultWorkspace(workspaces, lastWorkspaceId);

  if (!workspace) {
    return <NoWorkspace />;
  }

  redirect(`/workspace/${workspace.id}`);
}
