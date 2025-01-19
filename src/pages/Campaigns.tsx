import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CampaignContainer } from "@/components/campaigns/CampaignContainer";

export default function Campaigns() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <CampaignContainer />
      </div>
    </DashboardLayout>
  );
}