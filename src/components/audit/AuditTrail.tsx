import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AuditTrail() {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profile:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const getActionColor = (actionType: string) => {
    if (actionType.includes('created')) return 'bg-green-500';
    if (actionType.includes('updated')) return 'bg-blue-500';
    if (actionType.includes('deleted')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge className={getActionColor(log.action_type)}>
                    {log.action_type.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{log.profile?.full_name || 'System'}</TableCell>
                <TableCell className="capitalize">
                  {log.entity_type}
                </TableCell>
                <TableCell>
                  {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}