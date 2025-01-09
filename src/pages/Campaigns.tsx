import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { CampaignDetails } from "@/components/campaigns/CampaignDetails";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface Target {
  id: string;
  email: string;
  status: string;
  clicked: boolean;
  clicked_at: string | null;
}

export default function Campaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Fetch campaigns
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

  // Fetch targets for selected campaign
  const { data: targets } = useQuery({
    queryKey: ["campaign-targets", selectedCampaign?.id],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      const { data, error } = await supabase
        .from("campaign_targets")
        .select("*")
        .eq("campaign_id", selectedCampaign.id);

      if (error) throw error;
      return data as Target[];
    },
    enabled: !!selectedCampaign,
  });

  // Create campaign mutation
  const createCampaign = useMutation({
    mutationFn: async (newCampaign: any) => {
      // First create the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("phishing_campaigns")
        .insert([
          {
            name: newCampaign.name,
            description: newCampaign.description,
            start_date: newCampaign.start_date,
            end_date: newCampaign.end_date,
            status: "draft",
          },
        ])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Then create targets
      const targets = newCampaign.targets
        .split("\n")
        .map(email => email.trim())
        .filter(email => email);

      const { error: targetsError } = await supabase
        .from("campaign_targets")
        .insert(
          targets.map(email => ({
            campaign_id: campaign.id,
            email,
          }))
        );

      if (targetsError) throw targetsError;

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setIsCreateOpen(false);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create campaign: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Launch campaign mutation
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

  // Calculate campaign statistics
  const campaignStats = useMemo(() => {
    if (!targets) return { sent: 0, clicked: 0, pending: 0 };
    
    return {
      sent: targets.filter(t => t.status === "sent").length,
      clicked: targets.filter(t => t.clicked).length,
      pending: targets.filter(t => t.status === "pending").length,
    };
  }, [targets]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("campaign-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaign_targets" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["campaign-targets"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phishing Campaigns</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm onSubmit={createCampaign.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading campaigns...</div>
      ) : (
        <div className="space-y-6">
          <CampaignStats {...campaignStats} />

          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignList
                campaigns={campaigns || []}
                onSelect={setSelectedCampaign}
                onLaunch={launchCampaign.mutate}
              />
            </CardContent>
          </Card>

          {selectedCampaign && targets && (
            <CampaignDetails
              campaign={selectedCampaign}
              targets={targets}
              stats={{
                sent: campaignStats.sent,
                clicked: campaignStats.clicked,
              }}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}