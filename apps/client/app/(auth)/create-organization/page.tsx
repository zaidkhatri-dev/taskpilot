import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Join or Create Organization",
  description:
    "Join an existing organization or create your own to get started.",
};

export default function CreateOrganizationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-xl font-semibold">Join an Organization</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          In order to move forward, you need to join an organization. Please
          check your email for an invitation.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Haven&apos;t received one? Create your own organization to get
          started.
        </p>

        <Button type="button" size="lg" className="mt-6 w-full">
          Create an organization
        </Button>
      </div>
    </main>
  );
}
