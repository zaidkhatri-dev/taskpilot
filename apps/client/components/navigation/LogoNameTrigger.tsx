import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

interface LogoNameTriggerProps {
  workspaceId: string;
}

export const LogoNameTrigger = ({ workspaceId }: LogoNameTriggerProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-2 overflow-hidden px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
      <Link
        href={`/w/${workspaceId}`}
        className="cursor-default flex min-w-0 items-center gap-2.5 rounded-md hover:opacity-80 transition-opacity group-data-[collapsible=icon]:hidden"
      >
        <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg">
          <Image
            src="/logo.webp"
            alt="Taskpilot Logo"
            width={28}
            height={28}
            className="size-7 object-contain"
          />
        </div>
        <span className="truncate font-semibold tracking-tight text-base leading-none">
          Taskpilot
        </span>
      </Link>

      <SidebarTrigger />
    </div>
  );
};
