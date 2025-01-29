import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatisticCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  className 
}: StatisticCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:scale-105", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{value}</span>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted opacity-75" />
        </div>
      </CardContent>
    </Card>
  );
}