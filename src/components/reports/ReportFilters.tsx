import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportFiltersProps {
  organizationId: string | null;
  setOrganizationId: (id: string | null) => void;
  dateRange: { from: Date; to: Date } | null;
  setDateRange: (range: { from: Date; to: Date } | null) => void;
}

export function ReportFilters({
  organizationId,
  setOrganizationId,
  dateRange,
  setDateRange
}: ReportFiltersProps) {
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
      return data || [];
    }
  });

  return (
    <div className="flex gap-4 items-center">
      <Select value={organizationId || ''} onValueChange={setOrganizationId}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations?.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
}