import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { UpdateLastWorkspace } from "@/components/workspace/UpdateLastWorkspace";
import { validateParams } from "@/lib/utils/params";
import { redirect } from "next/navigation";

export default async function WorkspaceIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!validateParams(id)) {
    redirect("/w");
  }

  return (
    <SidebarProvider>
      <UpdateLastWorkspace workspaceId={id} />

      <AppSidebar workspaceId={id} />

      <main className="flex min-h-screen w-full flex-1 flex-col">
        {children}
      </main>
    </SidebarProvider>
  );
}
