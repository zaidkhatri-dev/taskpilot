import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function SettingsSidebarHeader() {
  return (
    <SidebarHeader className="p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={
              <Link
                href="/workspace"
                className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
              />
            }
          >
            <ChevronLeft className="h-4 w-4 shrink-0 -ml-0.5" />
            <span>Back to app</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
