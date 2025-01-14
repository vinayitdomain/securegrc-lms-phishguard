import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

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
                  <p className="text-primary">Training Path: {event.training_paths.title}</p>
                )}
                {event.training_content && (
                  <p className="text-primary">Content: {event.training_content.title}</p>
                )}
                {event.quizzes && (
                  <p className="text-primary">Quiz: {event.quizzes.title}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}