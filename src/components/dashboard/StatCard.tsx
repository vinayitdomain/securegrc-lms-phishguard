import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatCard({ title, value, className = "" }: StatCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-accent/20">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-primary dark:text-white">{value}</div>
      </CardContent>
    </Card>
  );
}