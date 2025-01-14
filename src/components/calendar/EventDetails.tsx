import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface EventDetailsProps {
  date?: Date;
  events?: Array<{
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    training_paths?: { title: string } | null;
    training_content?: { title: string } | null;
    quizzes?: { title: string } | null;
  }>;
}

export function EventDetails({ date, events = [] }: EventDetailsProps) {
  if (!date) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a date to view events</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events for {format(date, 'PPP')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events scheduled for this date</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-l-4 border-primary pl-4 space-y-2">
              <h3 className="font-semibold">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
              <div className="text-sm">
                <p>
                  {format(new Date(event.start_time), 'p')} - {format(new Date(event.end_time), 'p')}
                </p>
                {event.training_paths && (
                  <Badge variant="outline" className="mt-2">
                    Training Path: {event.training_paths.title}
                  </Badge>
                )}
                {event.training_content && (
                  <Badge variant="outline" className="mt-2 ml-2">
                    Content: {event.training_content.title}
                  </Badge>
                )}
                {event.quizzes && (
                  <Badge variant="outline" className="mt-2 ml-2">
                    Quiz: {event.quizzes.title}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}