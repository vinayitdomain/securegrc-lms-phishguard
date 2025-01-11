import { StatCard } from "./StatCard";

interface OrganizationStatsProps {
  organizations: any[];
  isLoading: boolean;
}

export function OrganizationStats({ organizations, isLoading }: OrganizationStatsProps) {
  if (isLoading) return null;

  const totalOrgs = organizations.length;
  const totalLicenses = organizations.reduce((acc, org) => acc + (org.license_count || 0), 0);
  const activeOrgs = organizations.filter(org => org.status === 'active').length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Organizations"
        value={totalOrgs}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      <StatCard
        title="Active Licenses"
        value={totalLicenses}
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      <StatCard
        title="Active Organizations"
        value={activeOrgs}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
    </div>
  );
}