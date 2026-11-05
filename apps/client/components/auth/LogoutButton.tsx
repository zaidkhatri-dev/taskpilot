"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth";

export const LogoutButton = () => {
  const { mutate: handleLogout, isPending } = useLogout();

  return (
    <Button
      variant="secondary"
      size="lg"
      disabled={isPending}
      onClick={() => handleLogout()}
    >
      <LogOut />
      Log Out
    </Button>
  );
};

export default LogoutButton;
