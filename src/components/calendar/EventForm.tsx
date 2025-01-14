import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  trainingPathId?: string;
  contentId?: string;
  quizId?: string;
}

export function EventForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<EventFormData>();

  const { data: profiles } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      if (!data?.length) throw new Error('No profile found');
      return data[0];
    }
  });

  const { data: trainingPaths } = useQuery({
    queryKey: ['training-paths'],
    queryFn: async () => {
      if (!profiles?.organization_id) return [];
      
      const { data } = await supabase
        .from('training_paths')
        .select('id, title')
        .eq('organization_id', profiles.organization_id);

      return data || [];
    },
    enabled: !!profiles?.organization_id
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const { error } = await supabase
        .from('training_events')
        .insert({
          organization_id: profiles?.organization_id,
          title: data.title,
          description: data.description,
          start_time: data.startTime,
          end_time: data.endTime,
          training_path_id: data.trainingPathId,
          content_id: data.contentId,
          quiz_id: data.quizId
        });

      if (error) throw error;

      toast({
        title: "Event created",
        description: "The training event has been scheduled successfully."
      });

      queryClient.invalidateQueries({ queryKey: ['training-events'] });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Schedule Training Event</DialogTitle>
          <DialogDescription>
            Create a new training event or deadline for your organization.
          </DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Event title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Event description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="trainingPathId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Path (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a training path" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainingPaths?.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </Form>
  );
}