// components/settings-sidebar-content.tsx
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User, BuildingComplex } from "lucide-react";

export function SettingsSidebarContent() {
  return (
    <SidebarContent>
      {/* Personal Group */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm">Personal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* Marked isActive as true based on the highlight in image.png */}
              <SidebarMenuButton size="sm" isActive>
                <User />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Administration Group */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm">
          Administration
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <BuildingComplex />
                <span>Organization</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Add more Administration items here as needed */}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
