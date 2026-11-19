import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/components/navigation/SettingsSidebar";
import { CloseSidebarOnNavigate } from "@/components/navigation/CloseSidebarOnNavigate";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      <SettingsSidebar />

      <CloseSidebarOnNavigate />

      <main className="flex min-h-screen w-full flex-1 flex-col">
        <header className="flex h-12 items-center border-b px-4 md:hidden">
          <SidebarTrigger />
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
