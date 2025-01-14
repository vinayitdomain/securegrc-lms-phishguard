import { Building2 } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Building2 className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold text-gray-900">
        Organizations Overview
      </h1>
    </div>
  );
}