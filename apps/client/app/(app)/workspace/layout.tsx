import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireOnboarding={true}>{children}</ProtectedRoute>;
}
