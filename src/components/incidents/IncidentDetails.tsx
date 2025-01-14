import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface IncidentDetailsProps {
  incidentId: string;
}

export function IncidentDetails({ incidentId }: IncidentDetailsProps) {
  const [updateMessage, setUpdateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: incident, isLoading: isLoadingIncident } = useQuery({
    queryKey: ['incident', incidentId],
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
          reporter:reported_by(full_name),
          assignee:assigned_to(full_name)
        `)
        .eq('id', incidentId)
        .eq('organization_id', userProfile?.organization_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: updates = [], isLoading: isLoadingUpdates } = useQuery({
    queryKey: ['incident-updates', incidentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_updates')
        .select(`
          *,
          author:user_id(full_name)
        `)
        .eq('incident_id', incidentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addUpdate = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('incident_updates')
        .insert([{
          incident_id: incidentId,
          message: updateMessage,
          update_type: 'comment',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;

      setUpdateMessage("");
      toast({
        title: "Update Added",
        description: "Your update has been added to the incident.",
      });
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "Error",
        description: "Failed to add update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingIncident) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg" />;
  }

  if (!incident) {
    return <div>Incident not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 mt-1 ${
              incident.priority === 'critical' ? 'text-destructive' :
              incident.priority === 'high' ? 'text-warning' :
              'text-muted-foreground'
            }`} />
            <div>
              <h2 className="text-xl font-semibold">{incident.title}</h2>
              <p className="text-muted-foreground mt-1">
                {incident.description}
              </p>
            </div>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            incident.status === 'open' ? 'bg-destructive/10 text-destructive' :
            incident.status === 'investigating' ? 'bg-warning/10 text-warning' :
            incident.status === 'resolved' ? 'bg-success/10 text-success' :
            'bg-muted text-muted-foreground'
          }`}>
            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Reported by: {incident.reporter?.full_name}</span>
          </div>
          {incident.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Assigned to: {incident.assignee.full_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(incident.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Updates</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Add an update..."
              className="flex-1"
            />
            <Button 
              onClick={addUpdate} 
              disabled={!updateMessage.trim() || isSubmitting}
            >
              Add Update
            </Button>
          </div>

          {isLoadingUpdates ? (
            <div className="space-y-3">
              <div className="h-16 bg-muted animate-pulse rounded-lg" />
              <div className="h-16 bg-muted animate-pulse rounded-lg" />
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => (
                <div key={update.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{update.author?.full_name}</span>
                    <span>•</span>
                    <span>{formatDate(update.created_at)}</span>
                  </div>
                  <p>{update.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}