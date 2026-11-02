import SignInForm from "@/components/auth/SignInForm";
import GuestRoute from "@/components/auth/GuestRoute";
import Image from "next/image";

export default function Signin() {
  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-xs flex-col items-center">
          <Image
            src="/logo.webp"
            alt="TaskPilot Logo"
            width={48}
            height={48}
            className="mb-6 h-12 w-12 object-contain"
          />
          <SignInForm />
        </div>
      </div>
    </GuestRoute>
  );
}
