import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrganizationAccessCard() {
  return (
    <Card className="w-full max-w-2xl border-0 shadow-none bg-card/50 py-0">
      <CardContent className="px-6 py-2 divide-y divide-border">
        {/* Organization 1 */}
        <div className="flex h-14 items-center justify-between">
          <span className="text-sm font-normal text-foreground">
            Organization1
          </span>
          <Button variant="destructive" size="sm">
            Leave workspace
          </Button>
        </div>

        {/* Organization 2 */}
        <div className="flex h-14 items-center justify-between">
          <span className="text-sm font-normal text-foreground">
            Organization2
          </span>
          <Button variant="destructive" size="sm">
            Leave workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
