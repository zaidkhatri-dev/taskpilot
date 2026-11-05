import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { WorkspaceBoards } from "./WorkspaceBoard";
import LogoutButton from "../auth/LogoutButton";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ workspaceId }: { workspaceId: string }) {
  
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher workspaceId={workspaceId} />
      </SidebarHeader>

      <SidebarContent>
        <WorkspaceBoards workspaceId={workspaceId} />
      </SidebarContent>

      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
