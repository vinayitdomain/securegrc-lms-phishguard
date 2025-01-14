import { AlertTriangle } from "lucide-react";

interface IncidentBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  title: string;
  date: string;
}

export function IncidentBadge({ priority, status, title, date }: IncidentBadgeProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className={`h-5 w-5 ${
          priority === 'critical' ? 'text-destructive' :
          priority === 'high' ? 'text-warning' :
          'text-muted-foreground'
        }`} />
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span className={`text-sm px-2 py-1 rounded-full ${
        status === 'open' ? 'bg-destructive/10 text-destructive' :
        status === 'investigating' ? 'bg-warning/10 text-warning' :
        status === 'resolved' ? 'bg-success/10 text-success' :
        'bg-muted text-muted-foreground'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}