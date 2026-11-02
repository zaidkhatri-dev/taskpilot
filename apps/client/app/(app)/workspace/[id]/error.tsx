"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WorkspaceError({ error, reset }: ErrorProps) {
  const errorMessage =
    error instanceof Error && error.message?.trim()
      ? error.message
      : typeof error === "string" && (error as string).trim()
        ? (error as string)
        : "An unexpected error occurred while loading the workspace.";

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-base text-muted-foreground">{errorMessage}</p>
        <div>
          <Button variant="default" size="lg" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
