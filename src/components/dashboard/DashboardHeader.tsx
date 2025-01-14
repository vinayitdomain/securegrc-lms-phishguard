import { Building2 } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Building2 className="h-8 w-8 text-primary animate-pulse" />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
        Organizations Overview
      </h1>
    </div>
  );
}