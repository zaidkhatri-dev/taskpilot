"use client";

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
import { useWorkspacePermission } from "@/hooks/workspace";

interface AppSidebarProps {
  workspaceId: string;
}

export const AppSidebar = ({ workspaceId }: AppSidebarProps) => {
  const canUpdateWorkspace = useWorkspacePermission(
    workspaceId,
    "workspace:update",
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoNameTrigger workspaceId={workspaceId} />

        <WorkspaceSwitcher workspaceId={workspaceId} />
      </SidebarHeader>

      <SidebarContent>
        <WorkspaceBoards workspaceId={workspaceId} />
      </SidebarContent>

      <SidebarFooter className="gap-3">
        {canUpdateWorkspace && (
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
        )}
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
