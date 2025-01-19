import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CampaignForm } from "./CampaignForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CreateCampaignDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCampaign = useMutation({
    mutationFn: async (newCampaign: any) => {
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
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
}