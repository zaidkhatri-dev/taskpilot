import { Skeleton } from "@/components/ui/skeleton";

export function BoardCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* aspect-video image placeholder */}
      <Skeleton className="aspect-video w-full rounded-none" />
      {/* CardHeader placeholder */}
      <div className="flex flex-col gap-2 p-6">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
