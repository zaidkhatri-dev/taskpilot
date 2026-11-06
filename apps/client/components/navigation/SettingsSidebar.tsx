import Link from "next/link";
import { User, Users, MailOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LogoNameTrigger } from "./LogoNameTrigger";
import { UserProfileMenu } from "@/components/user/UserProfileMenu";

export const SettingsSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <LogoNameTrigger workspaceId="" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/settings/profile" className="cursor-default" />
                  }
                  tooltip="Profile"
                >
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/settings/memberships"
                      className="cursor-default"
                    />
                  }
                  tooltip="Memberships"
                >
                  <Users />
                  <span>Memberships</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/settings/invitations"
                      className="cursor-default"
                    />
                  }
                  tooltip="Invitations"
                >
                  <MailOpen />
                  <span>Invitations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
