import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { history } from "lucide-react";

interface SignatureHistoryProps {
  type: "document_signoff" | "policy_acknowledgment" | "audit_approval";
  itemId: string;
}

export function SignatureHistory({ type, itemId }: SignatureHistoryProps) {
  const { data: signatures, isLoading } = useQuery({
    queryKey: ['signatures', type, itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signatures')
        .select(`
          *,
          signer:profiles(full_name),
          logs:signature_logs(*)
        `)
        .eq(
          type === 'document_signoff' ? 'document_id' : 
          type === 'policy_acknowledgment' ? 'policy_id' : 'audit_id',
          itemId
        )
        .order('signed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading signature history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <history className="h-5 w-5" />
          Signature History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Signer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signatures?.map((signature) => (
              <TableRow key={signature.id}>
                <TableCell>{signature.signer?.full_name}</TableCell>
                <TableCell>{format(new Date(signature.signed_at), 'PPp')}</TableCell>
                <TableCell>{signature.ip_address}</TableCell>
                <TableCell>
                  {signature.logs?.[0]?.action === 'signature_created' ? 'Signed' : 'Modified'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}