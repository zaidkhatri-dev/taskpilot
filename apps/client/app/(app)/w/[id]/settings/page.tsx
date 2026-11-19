import { UpdateWorkspaceForm } from "@/components/workspace/UpdateWorkspaceForm";
import { InvitationDialog } from "@/components/workspace/InvitationDialog";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoutePage({ params }: SettingsPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <UpdateWorkspaceForm workspaceId={id} />
        <div className="flex justify-end">
          <InvitationDialog workspaceId={id} />
        </div>
      </div>
    </div>
  );
}
