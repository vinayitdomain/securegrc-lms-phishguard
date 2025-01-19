import { AlertTriangle, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Incident } from "@/types/incidents";

interface IncidentHeaderProps {
  incident: Incident;
}

export function IncidentHeader({ incident }: IncidentHeaderProps) {
  return (
    <Card className="p-6">
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
          incident.status === 'in_progress' ? 'bg-warning/10 text-warning' :
          incident.status === 'resolved' ? 'bg-success/10 text-success' :
          'bg-muted text-muted-foreground'
        }`}>
          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
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
    </Card>
  );
}