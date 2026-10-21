// components/settings-sidebar.tsx
import { Sidebar } from "@/components/ui/sidebar";
import { SettingsSidebarHeader } from "./SettingsSidebarHeader";
import { SettingsSidebarContent } from "./SettingsSidebarContent";
import { SettingsSidebarFooter } from "./SettingsSidebarFooter";

export function SettingsSidebar() {
  return (
    <Sidebar>
      <SettingsSidebarHeader />
      <SettingsSidebarContent />
      <SettingsSidebarFooter />
    </Sidebar>
  );
}
