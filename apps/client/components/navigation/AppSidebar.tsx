import Link from "next/link";
import { Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { WorkspaceBoards } from "./WorkspaceBoard";
import { UserProfileMenu } from "@/components/user/UserProfileMenu";
import { LogoNameTrigger } from "./LogoNameTrigger";

interface AppSidebarProps {
  workspaceId: string;
}

export const AppSidebar = ({ workspaceId }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoNameTrigger workspaceId={workspaceId} />

        <div className="group-data-[collapsible=icon]:hidden">
          <WorkspaceSwitcher workspaceId={workspaceId} />
        </div>
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:hidden">
        <WorkspaceBoards workspaceId={workspaceId} />
      </SidebarContent>

      <SidebarFooter className="gap-3 group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link
                  href={`/w/${workspaceId}/settings`}
                  className="cursor-default"
                />
              }
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
