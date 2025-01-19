import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IncidentHeader } from "@/components/incidents/details/IncidentHeader";
import { IncidentTimeline } from "@/components/incidents/details/IncidentTimeline";
import { IncidentUpdateForm } from "@/components/incidents/details/IncidentUpdateForm";
import type { Incident, IncidentUpdate } from "@/types/incidents";

export default function IncidentDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incident, isLoading: isLoadingIncident } = useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reporter:profiles!incidents_reported_by_fkey(full_name),
          assignee:profiles!incidents_assigned_to_fkey(full_name)
        `)
        .eq('id', id)
        .eq('organization_id', userProfile?.organization_id)
        .single();

      if (error) throw error;
      return data as unknown as Incident;
    },
  });

  const { data: updates = [], isLoading: isLoadingUpdates } = useQuery({
    queryKey: ['incident-updates', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_updates')
        .select(`
          *,
          author:profiles!incident_updates_user_id_fkey(full_name)
        `)
        .eq('incident_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as IncidentUpdate[];
    },
  });

  const addUpdate = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase
        .from('incident_updates')
        .insert([{
          incident_id: id,
          message,
          update_type: 'comment',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-updates', id] });
      toast({
        title: "Update Added",
        description: "Your update has been added to the incident.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add update. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoadingIncident) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg" />;
  }

  if (!incident) {
    return <div>Incident not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <IncidentHeader incident={incident} />
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Updates</h3>
        <IncidentUpdateForm 
          onSubmit={(message) => addUpdate.mutate(message)}
          isSubmitting={addUpdate.isPending}
        />
        <IncidentTimeline 
          updates={updates} 
          isLoading={isLoadingUpdates} 
        />
      </div>
    </div>
  );
}