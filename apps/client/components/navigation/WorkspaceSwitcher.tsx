"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, EllipsisIcon, Plus } from "lucide-react";
import { useState } from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateWorkspaceForm } from "@/components/workspace/CreateWorkspaceForm";
import { useWorkspaces } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import { WorkspaceAvatar } from "@/components/workspace/WorkspaceAvatar";

interface WorkspaceSwitcherProps {
  workspaceId: string;
}

export function WorkspaceSwitcher({ workspaceId }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

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

  const activeName = formatName(activeWorkspace.name);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="h-11 py-1.5 border border-sidebar-border bg-sidebar hover:bg-sidebar data-open:hover:bg-sidebar active:bg-sidebar" />}>
              <WorkspaceAvatar name={activeName} />

              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
                {activeName}
              </span>
              <EllipsisIcon />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-(--anchor-width) min-w-60 bg-sidebar p-1.5 border border-sidebar-border shadow-lg"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Workspaces
                </DropdownMenuLabel>

                {workspaces.map((workspace) => {
                  const name = formatName(workspace.name);
                  const isActive = workspace.id === workspaceId;

                  return (
                    <DropdownMenuItem
                      key={workspace.id}
                      className="gap-2"
                      onClick={() => router.push(`/w/${workspace.id}`)}
                    >
                      <WorkspaceAvatar name={name} />

                      <span
                        className={`min-w-0 flex-1 truncate ${
                          isActive ? "font-medium" : ""
                        }`}
                        title={name}
                      >
                        {name}
                      </span>

                      {isActive && <Check className="size-4 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>

              {workspaces.length > 0 && <DropdownMenuSeparator />}

              <DropdownMenuItem
                className="gap-2"
                onClick={() => setCreateOpen(true)}
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed">
                  <Plus className="size-4" />
                </div>
                <span className="text-muted-foreground">Create workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Rendered outside the dropdown so it isn't unmounted when the dropdown closes */}
      <CreateWorkspaceForm open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
