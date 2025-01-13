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
  const { data: trainingContent, isLoading, error } = useQuery({
    queryKey: ['training-content'],
    queryFn: async () => {
      console.log('Fetching training content...');
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('status', 'published')
        .eq('requires_quiz', true);
      
      if (error) {
        console.error('Error fetching training content:', error);
        throw error;
      }
      
      console.log('Training content fetched:', data);
      return data;
    }
  });

  if (error) {
    console.error('Error in training content query:', error);
  }

  return (
    <FormField
      control={control}
      name="content_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attach to Training Content</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value?.toString() || undefined}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select training content"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {trainingContent?.map((content) => (
                <SelectItem 
                  key={content.id} 
                  value={content.id.toString()}
                >
                  {content.title || `Content ${content.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}