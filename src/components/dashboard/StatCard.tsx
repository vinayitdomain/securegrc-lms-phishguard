import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  isLoading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  className = "",
  isLoading = false 
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white/80">
          <CardTitle className="text-sm font-medium text-[#1A1F2C]">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-8 bg-[#F1F0FB] animate-pulse rounded"></div>
          {description && (
            <p className="mt-2 text-sm text-[#8E9196]">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white/80">
        <CardTitle className="text-sm font-medium text-[#1A1F2C]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-[#7E69AB]">{value}</div>
        {description && (
          <p className="mt-2 text-sm text-[#8E9196]">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}