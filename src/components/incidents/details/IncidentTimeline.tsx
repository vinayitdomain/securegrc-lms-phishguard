import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { IncidentUpdate } from "@/types/incidents";

interface IncidentTimelineProps {
  updates: IncidentUpdate[];
  isLoading?: boolean;
}

export function IncidentTimeline({ updates, isLoading }: IncidentTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 bg-muted animate-pulse rounded-lg" />
        <div className="h-16 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
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
  );
}