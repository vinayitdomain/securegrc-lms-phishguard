import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ title, value, trend, description, isLoading, className }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("transition-all duration-200", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            {description && <Skeleton className="h-4 w-32" />}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-all duration-200 hover:scale-105", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span className="text-xs text-green-500">
                {trend}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}