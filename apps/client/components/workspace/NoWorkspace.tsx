import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export default function NoWorkspace() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
        No Workspace Found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground sm:text-base">
        You are not part of any workspace yet. Check for pending invitations or
        create a new workspace to get started.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/workspace">
          <Button size="lg">
            <Mail data-icon="inline-start" />
            Check Invitations
          </Button>
        </Link>

        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
