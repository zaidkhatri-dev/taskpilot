import { SettingsSidebar } from "@/components/settings/sidebar/SettingsSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </SidebarProvider>
  );
}
