"use client";

import { useEffect } from "react";

export function UpdateLastWorkspace({ workspaceId }: { workspaceId: string }) {
  useEffect(() => {
    document.cookie = `lastWorkspaceId=${encodeURIComponent(workspaceId)}; path=/; max-age=31536000; samesite=lax`;
  }, [workspaceId]);

  return null;
}
