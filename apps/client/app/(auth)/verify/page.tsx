import { Suspense } from "react";
import VerifyContent from "@/components/auth/VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm font-medium">Loading...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
