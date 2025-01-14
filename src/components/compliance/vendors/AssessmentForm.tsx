import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface AssessmentFormProps {
  vendorId: string;
  vendorName: string;
}

export function AssessmentForm({ vendorId, vendorName }: AssessmentFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assessmentDate, setAssessmentDate] = useState<Date>();
  const [nextAssessmentDate, setNextAssessmentDate] = useState<Date>();
  const [score, setScore] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('vendor_assessments')
      .insert([{
        vendor_id: vendorId,
        assessment_date: assessmentDate?.toISOString(),
        next_assessment_date: nextAssessmentDate?.toISOString(),
        overall_score: parseInt(score),
        status: 'completed'
      }]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error creating assessment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assessment created successfully",
        description: "The vendor assessment has been recorded.",
      });
      setOpen(false);
      setAssessmentDate(undefined);
      setNextAssessmentDate(undefined);
      setScore("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Add Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Assessment for {vendorName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Assessment Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {assessmentDate ? format(assessmentDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={assessmentDate}
                  onSelect={setAssessmentDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium">Next Assessment Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextAssessmentDate ? format(nextAssessmentDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={nextAssessmentDate}
                  onSelect={setNextAssessmentDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium">Overall Score (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Assessment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}