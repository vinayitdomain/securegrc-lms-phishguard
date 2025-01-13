import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";

interface QuizBasicInfoProps {
  control: Control<any>;
}

export function QuizBasicInfo({ control }: QuizBasicInfoProps) {
  const { data: trainingContent } = useQuery({
    queryKey: ['training-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quiz Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

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

      <FormField
        control={control}
        name="passing_score"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passing Score (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}