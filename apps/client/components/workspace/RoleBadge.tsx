// components/workspace/RoleBadge.tsx
import { Badge } from "@/components/ui/badge";
import { WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

const ROLE_STYLES: Record<string, string> = {
  owner:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
  admin: "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400",
  member:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

interface RoleBadgeProps {
  role?: WorkspaceMembershipRoles;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  if (!role) return null;

  return (
    <Badge
      variant="outline"
      className={`
        capitalize
        ${ROLE_STYLES[role.toLowerCase()]} ?? "text-muted-foreground"
      `}
    >
      {role}
    </Badge>
  );
};
