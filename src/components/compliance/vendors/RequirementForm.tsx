import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface RequirementFormProps {
  vendorId: string;
  vendorName: string;
}

export function RequirementForm({ vendorId, vendorName }: RequirementFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    requirement: "",
    category: "",
    evidence_required: true,
  });
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('vendor_requirements')
      .insert([{
        vendor_id: vendorId,
        ...formData,
        due_date: dueDate?.toISOString(),
      }]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error creating requirement",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Requirement created successfully",
        description: "The vendor requirement has been added.",
      });
      setOpen(false);
      setFormData({
        requirement: "",
        category: "",
        evidence_required: true,
      });
      setDueDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Add Requirement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Requirement for {vendorName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Requirement</label>
            <Textarea
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Evidence Required</label>
            <Switch
              checked={formData.evidence_required}
              onCheckedChange={(checked) => setFormData({ ...formData, evidence_required: checked })}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Requirement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}