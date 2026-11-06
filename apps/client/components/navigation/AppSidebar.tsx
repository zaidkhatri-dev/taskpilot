import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { WorkspaceBoards } from "./WorkspaceBoard";
import { UserProfileMenu } from "@/components/user/UserProfileMenu";

interface AppSidebarProps {
  workspaceId: string;
}

export const AppSidebar = ({ workspaceId }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Link
            href={`/w/${workspaceId}`}
            className="cursor-default flex min-w-0 items-center gap-2.5 rounded-md hover:opacity-80 transition-opacity group-data-[collapsible=icon]:hidden"
          >
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg">
              <Image
                src="/logo.webp"
                alt="Taskpilot Logo"
                width={28}
                height={28}
                className="size-7 object-contain"
              />
            </div>
            <span className="truncate font-semibold tracking-tight text-base leading-none">
              Taskpilot
            </span>
          </Link>

          <SidebarTrigger />
        </div>

        <div className="group-data-[collapsible=icon]:hidden">
          <WorkspaceSwitcher workspaceId={workspaceId} />
        </div>
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:hidden">
        <WorkspaceBoards workspaceId={workspaceId} />
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
};
