import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { EventDetails } from "./EventDetails";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "./EventForm";
import { Plus } from "lucide-react";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ['training-events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all profiles for the user and select the first one
      const { data: profiles } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id);

      if (!profiles?.length) throw new Error('No organization found');
      const profile = profiles[0];

      const { data, error } = await supabase
        .from('training_events')
        .select(`
          *,
          training_paths (title),
          training_content (title),
          quizzes (title)
        `)
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Compliance Calendar</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <EventForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
          />
        </Card>
        <EventDetails 
          date={selectedDate} 
          events={events?.filter(event => {
            if (!selectedDate) return false;
            const eventDate = new Date(event.start_time);
            return (
              eventDate.getDate() === selectedDate.getDate() &&
              eventDate.getMonth() === selectedDate.getMonth() &&
              eventDate.getFullYear() === selectedDate.getFullYear()
            );
          })} 
        />
      </div>
    </div>
  );
}