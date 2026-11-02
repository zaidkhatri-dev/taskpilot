import OnboardingForm from "@/components/auth/OnboardingForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireOnboarding={false}>
      <div className="flex min-h-screen justify-center items-center">
        <OnboardingForm />
      </div>
    </ProtectedRoute>
  );
}
