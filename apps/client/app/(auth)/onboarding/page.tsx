"use client";

import OnboardingForm from "@/components/auth/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <OnboardingForm
        formAction={() => {}}
        isPending={false}
        errorPath={null}
        errorMsg=""
        values={{}}
      />
    </div>
  );
}
