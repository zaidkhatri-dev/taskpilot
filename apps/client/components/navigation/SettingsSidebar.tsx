"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, User, Users, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { UserProfileMenu } from "@/components/user/UserProfileMenu";

export const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/w" className="cursor-default" />}
            className="group-data-[collapsible=icon]:hidden"
          >
            <ArrowLeft data-icon="inline-start" />
            Back to App
          </Button>

          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/settings/profile"}
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
                  isActive={pathname === "/settings/memberships"}
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
                  isActive={pathname === "/settings/invitations"}
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
