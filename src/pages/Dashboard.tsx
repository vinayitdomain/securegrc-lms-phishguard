import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserDashboardV2 } from "@/components/dashboard/UserDashboardV2";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <UserDashboardV2 />
    </DashboardLayout>
  );
}