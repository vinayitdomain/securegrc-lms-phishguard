import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types/campaigns";
import { CampaignStats } from "./CampaignStats";
import { CampaignList } from "./CampaignList";
import { CampaignDetails } from "./CampaignDetails";
import { CreateCampaignDialog } from "./CreateCampaignDialog";

export function CampaignContainer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phishing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });

  const { data: targets } = useQuery({
    queryKey: ["campaign-targets", selectedCampaign?.id],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      const { data, error } = await supabase
        .from("campaign_targets")
        .select("*")
        .eq("campaign_id", selectedCampaign.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCampaign,
  });

  const launchCampaign = useMutation({
    mutationFn: async (campaign: Campaign) => {
      const { data: targets, error: targetsError } = await supabase
        .from("campaign_targets")
        .select("*")
        .eq("campaign_id", campaign.id);

      if (targetsError) throw targetsError;

      await Promise.all(
        targets.map(async (target) => {
          await supabase.functions.invoke("send-campaign-email", {
            body: {
              campaignId: campaign.id,
              targetId: target.id,
              to: target.email,
              subject: "Test Campaign",
              html: "<p>This is a test campaign</p>",
            },
          });
        })
      );

      const { error: updateError } = await supabase
        .from("phishing_campaigns")
        .update({ status: "active" })
        .eq("id", campaign.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Success",
        description: "Campaign launched successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to launch campaign: " + error.message,
        variant: "destructive",
      });
    },
  });

  const campaignStats = targets ? {
    sent: targets.filter(t => t.status === "sent").length,
    clicked: targets.filter(t => t.clicked).length,
    pending: targets.filter(t => t.status === "pending").length,
  } : { sent: 0, clicked: 0, pending: 0 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Phishing Campaigns</h1>
        <CreateCampaignDialog />
      </div>

      {isLoading ? (
        <div>Loading campaigns...</div>
      ) : (
        <div className="space-y-6">
          <CampaignStats {...campaignStats} />
          <CampaignList
            campaigns={campaigns || []}
            onSelect={setSelectedCampaign}
            onLaunch={launchCampaign.mutate}
          />
          {selectedCampaign && targets && (
            <CampaignDetails
              campaign={selectedCampaign}
              targets={targets}
              stats={campaignStats}
            />
          )}
        </div>
      )}
    </div>
  );
}