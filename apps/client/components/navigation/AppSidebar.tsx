import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { WorkspaceBoards } from "./WorkspaceBoard";

export function AppSidebar({ workspaceId }: { workspaceId: string }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher workspaceId={workspaceId} />
      </SidebarHeader>

      <SidebarContent>
        <WorkspaceBoards workspaceId={workspaceId} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
