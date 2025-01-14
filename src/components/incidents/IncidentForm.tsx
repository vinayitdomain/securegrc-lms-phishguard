import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IncidentFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function IncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IncidentFormData>();

  const onSubmit = async (data: IncidentFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('incidents')
        .insert([{
          ...data,
          status: 'open',
          reported_by: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;

      toast({
        title: "Incident Reported",
        description: "The incident has been successfully reported.",
      });
      
      reset();
    } catch (error) {
      console.error('Error reporting incident:', error);
      toast({
        title: "Error",
        description: "Failed to report incident. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Incident Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Describe the incident..."
          {...register("description", { required: "Description is required" })}
          className="min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Select 
          {...register("priority", { required: "Priority is required" })}
          defaultValue="medium"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
        {errors.priority && (
          <p className="text-sm text-destructive mt-1">{errors.priority.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Reporting..." : "Report Incident"}
      </Button>
    </form>
  );
}