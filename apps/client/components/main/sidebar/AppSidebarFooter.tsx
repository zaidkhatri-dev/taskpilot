import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export function AppSidebarFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarMenuButton render={<div />}>
                <Avatar>
                  <AvatarImage
                    width={28}
                    height={28}
                    src="/avatars/avatar_01.svg"
                    alt="User avatar"
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <span>Zaid</span>
                <ChevronUp />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                render={<Link href="/settings/account/profile" />}
              >
                <Settings />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
