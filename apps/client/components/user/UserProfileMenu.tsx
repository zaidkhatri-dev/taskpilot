"use client";

import Link from "next/link";
import { EllipsisIcon, LogOut, User } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/user";
import { useLogout } from "@/hooks/auth";
import { formatName } from "@/lib/utils/formatting";

export const UserProfileMenu = () => {
  const { data: user, isPending, isError, error } = useMe();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            disabled
            className="h-auto py-1.5 border border-sidebar-border bg-sidebar"
          >
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="grid flex-1 gap-1.5 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError && !user) {
    throw error;
  }

  const avatarSrc = user?.avatarId
    ? `/avatars/${user.avatarId}.svg`
    : "/avatars/avatar_01.svg";

  const fullName = formatName(
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={fullName}
                className="h-auto py-1.5 border border-sidebar-border bg-sidebar hover:bg-sidebar data-open:hover:bg-sidebar active:bg-sidebar"
              />
            }
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage
                src={avatarSrc}
                alt={fullName}
                width={32}
                height={32}
              />
              <AvatarFallback>
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-medium">{fullName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <EllipsisIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-60 bg-sidebar p-1.5 border border-sidebar-border shadow-lg"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-2"
                render={
                  <Link href="/settings/profile" className="cursor-default" />
                }
              >
                <User />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className="gap-2"
                disabled={isLoggingOut}
                onClick={() => handleLogout()}
              >
                <LogOut />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
