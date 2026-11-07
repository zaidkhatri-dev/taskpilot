"use client";

import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const errorMessage =
    error.message?.trim() ||
    "An unexpected error occurred. Please try again.";

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-bold tracking-tight">
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
      </body>
    </html>
  );
}

