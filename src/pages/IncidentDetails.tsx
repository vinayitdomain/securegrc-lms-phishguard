import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IncidentHeader } from "@/components/incidents/details/IncidentHeader";
import { IncidentTimeline } from "@/components/incidents/details/IncidentTimeline";
import { IncidentAssignments } from "@/components/incidents/details/IncidentAssignments";
import { IncidentUpdateForm } from "@/components/incidents/details/IncidentUpdateForm";

export default function IncidentDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incident, isLoading: isLoadingIncident } = useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: updates } = useQuery({
    queryKey: ['incident-updates', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_updates')
        .select('*')
        .eq('incident_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ['incident-assignments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_assignments')
        .select('*')
        .eq('incident_id', id);

      if (error) throw error;
      return data;
    },
  });

  const addUpdate = useMutation({
    mutationFn: async (message: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('incident_updates')
        .insert([
          {
            incident_id: id,
            user_id: user.id,
            message,
            update_type: 'comment',
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-updates', id] });
      toast({
        title: "Success",
        description: "Update added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingIncident) {
    return <div>Loading...</div>;
  }

  if (!incident) {
    return <div>Incident not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <IncidentHeader incident={incident} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <IncidentTimeline updates={updates || []} />
          <IncidentUpdateForm
            onSubmit={(message) => addUpdate.mutate(message)}
            isSubmitting={addUpdate.isPending}
          />
        </div>
        
        <IncidentAssignments assignments={assignments || []} />
      </div>
    </div>
  );
}