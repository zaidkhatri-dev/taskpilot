import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireOnboarding={true}>{children}</ProtectedRoute>;
}
