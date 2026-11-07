import { Suspense } from "react";
import VerifyContent from "@/components/auth/VerifyContent";
import Image from "next/image";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <Image
            src="/logo.webp"
            alt="TaskPilot Logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain animate-pulse"
          />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
