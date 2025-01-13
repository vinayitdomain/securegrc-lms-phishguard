import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuizFormContentProps {
  control: Control<QuizFormData>;
}

export function QuizFormContent({ control }: QuizFormContentProps) {
  const { data: trainingContent } = useQuery({
    queryKey: ['training-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('status', 'published')
        .eq('requires_quiz', true);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <FormField
      control={control}
      name="content_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attach to Training Content</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || undefined}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select training content" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {trainingContent?.map((content) => (
                <SelectItem key={content.id} value={content.id}>
                  {content.title || 'Untitled Content'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}