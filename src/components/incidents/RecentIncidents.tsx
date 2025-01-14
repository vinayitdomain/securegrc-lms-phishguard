import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";
import { IncidentBadge } from "./IncidentBadge";

export function RecentIncidents() {
  const { data: recentIncidents = [], isLoading: isLoadingIncidents } = useQuery({
    queryKey: ['recentIncidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          title,
          priority,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Incidents</h2>
      <div className="space-y-4">
        {isLoadingIncidents ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        ) : recentIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold">No Recent Incidents</h3>
            <p className="text-sm text-muted-foreground">
              All systems are operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <IncidentBadge
                key={incident.id}
                priority={incident.priority}
                status={incident.status}
                title={incident.title}
                date={incident.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}