"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { UpdateWorkspaceForm } from "@/components/workspace/UpdateWorkspaceForm";
import { InvitationDialog } from "@/components/workspace/InvitationDialog";
import { UsersList } from "@/components/workspace/UsersList";
import { useDeleteWorkspace, useWorkspacePermission, useWorkspaces } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function RoutePage({ params }: SettingsPageProps) {
  const { id } = use(params);
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((item) => item.id === id);
  const { mutate, isPending } = useDeleteWorkspace();
  const canDeleteWorkspace = useWorkspacePermission(id, "workspace:delete");
  const router = useRouter();
  const name = workspace ? formatName(workspace.name) : null;

  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-8 pb-10">
      {name && (
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight text-foreground">
              {name}
            </h1>
            <div className="flex items-center gap-0.5 shrink-0">
              <UpdateWorkspaceForm workspaceId={id} />
              {canDeleteWorkspace && (
                <ConfirmationDialog
                  title="Delete workspace"
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete workspace"
                      disabled={isPending}
                    >
                      <Trash className="size-4" />
                    </Button>
                  }
                  confirmLabel="Delete Workspace"
                  confirmingLabel="Deleting..."
                  confirmVariant="destructive"
                  isPending={isPending}
                  onConfirm={(close) =>
                    mutate(id, {
                      onSuccess: () => {
                        close();
                        router.replace("/w");
                      },
                    })
                  }
                >
                  Are you sure you want to delete{" "}
                  {name && (
                    <span className="font-semibold text-foreground">{name}</span>
                  )}
                  ? This action cannot be undone and will permanently remove all
                  associated boards, tasks, and data.
                </ConfirmationDialog>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Users</h2>
              <InvitationDialog workspaceId={id} />
            </div>
            <UsersList workspaceId={id} />
          </div>
        </div>
      )}
    </div>
  );
}
