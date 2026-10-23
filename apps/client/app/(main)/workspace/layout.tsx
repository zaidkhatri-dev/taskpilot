import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/main/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireOnboarding={true} requireOrganization={true}>
      <SidebarProvider>
        <AppSidebar />
        <main>{children}</main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
