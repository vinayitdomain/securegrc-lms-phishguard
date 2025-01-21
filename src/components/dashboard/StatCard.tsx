import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, trend, description, className }: StatCardProps) {
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