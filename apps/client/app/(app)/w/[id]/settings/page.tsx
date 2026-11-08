import { UpdateWorkspaceForm } from "@/components/workspace/UpdateWorkspaceForm";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoutePage({ params }: SettingsPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="w-full max-w-2xl">
        <UpdateWorkspaceForm workspaceId={id} />
      </div>
    </div>
  );
}
