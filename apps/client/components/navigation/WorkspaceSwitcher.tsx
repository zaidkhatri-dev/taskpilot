"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, LayoutDashboard } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateWorkspaceForm } from "@/components/workspace/CreateWorkspaceForm";
import { useWorkspaces } from "@/hooks/queries/useWorkspaces";

interface WorkspaceSwitcherProps {
  workspaceId: string;
}

export function WorkspaceSwitcher({ workspaceId }: WorkspaceSwitcherProps) {
  const router = useRouter();

  const { data: workspaces, isPending, isError, error } = useWorkspaces();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError) {
    throw error;
  }

  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === workspaceId) ?? null;

  if (!activeWorkspace) {
    throw new Error("Active workspace not found.");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            <LayoutDashboard className="size-4" />

            <span className="truncate">{activeWorkspace.name}</span>

            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => router.push(`/workspace/${workspace.id}`)}
              >
                {workspace.name}
              </DropdownMenuItem>
            ))}

            {workspaces.length > 0 && <DropdownMenuSeparator />}

            <div className="px-1.5 py-1">
              <CreateWorkspaceForm />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
