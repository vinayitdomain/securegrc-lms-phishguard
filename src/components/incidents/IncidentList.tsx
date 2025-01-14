import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function IncidentList() {
  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          created_at,
          reported_by,
          assigned_to,
          profiles!reported_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 mt-1 ${
                incident.priority === 'critical' ? 'text-destructive' :
                incident.priority === 'high' ? 'text-warning' :
                'text-muted-foreground'
              }`} />
              <div>
                <h3 className="font-medium">{incident.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
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
              <span>{incident.profiles?.full_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(incident.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">View Details</Button>
            {incident.status === 'open' && (
              <Button variant="outline" size="sm">Assign</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}