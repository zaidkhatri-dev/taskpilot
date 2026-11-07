"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WorkspaceIdError({ error, reset }: ErrorProps) {
  const errorMessage =
    error.message?.trim() ||
    "An unexpected error occurred while loading this page.";

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
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
