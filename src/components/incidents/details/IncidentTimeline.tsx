import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentUpdate } from "@/types/incidents";
import { formatDistanceToNow } from "date-fns";

interface IncidentTimelineProps {
  updates: IncidentUpdate[];
}

export function IncidentTimeline({ updates }: IncidentTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {updates.map((update) => (
            <div key={update.id} className="mb-4 border-l-2 border-primary pl-4">
              <p className="font-medium">{update.message}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}