import { UpdateWorkspaceForm } from "@/components/workspace/UpdateWorkspaceForm";
import { InvitationDialog } from "@/components/workspace/InvitationDialog";
import { MembersList } from "@/components/workspace/MembersList";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoutePage({ params }: SettingsPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <UpdateWorkspaceForm workspaceId={id} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Members</h2>
            <InvitationDialog workspaceId={id} />
          </div>
          <MembersList workspaceId={id} />
        </div>
      </div>
    </div>
  );
}
