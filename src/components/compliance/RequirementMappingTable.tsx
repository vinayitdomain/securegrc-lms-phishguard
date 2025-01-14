import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RequirementMappingTableProps {
  frameworkId: string;
}

export function RequirementMappingTable({ frameworkId }: RequirementMappingTableProps) {
  const { data: mappings, isLoading } = useQuery({
    queryKey: ['requirement-mappings', frameworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_requirement_mappings')
        .select(`
          *,
          compliance_policies (
            title,
            description
          )
        `)
        .eq('framework_id', frameworkId);

      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'non_compliant':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Mapped Policy</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings?.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell>{mapping.requirement_key}</TableCell>
              <TableCell>
                {mapping.compliance_policies?.title || 'No policy mapped'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(mapping.status)}
                  <Badge variant={
                    mapping.status === 'compliant' ? 'secondary' :
                    mapping.status === 'non_compliant' ? 'destructive' :
                    'default'
                  }>
                    {mapping.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {mapping.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}