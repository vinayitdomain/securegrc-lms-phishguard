import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface AuditListProps {
  audits: any[] | null;
  isLoading: boolean;
}

export function AuditList({ audits, isLoading }: AuditListProps) {
  if (isLoading) {
    return <div>Loading audits...</div>;
  }

  if (!audits?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No audits found. Create your first audit to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell>
                <Link 
                  to={`/audits/${audit.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {audit.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={audit.status === 'draft' ? 'secondary' : 'default'}>
                  {audit.status}
                </Badge>
              </TableCell>
              <TableCell>{audit.created_by?.full_name}</TableCell>
              <TableCell>{audit.start_date ? formatDate(audit.start_date) : 'Not set'}</TableCell>
              <TableCell>{audit.end_date ? formatDate(audit.end_date) : 'Not set'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}