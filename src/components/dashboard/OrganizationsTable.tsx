import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrganizationsTableProps {
  organizations: any[];
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  return (
    <Card className="border-t-4 border-t-primary shadow-lg">
      <CardHeader className="bg-gray-50/80">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Organizations Directory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">Organization Name</TableHead>
              <TableHead className="font-semibold text-gray-700">License Count</TableHead>
              <TableHead className="font-semibold text-gray-700">License Start</TableHead>
              <TableHead className="font-semibold text-gray-700">License End</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id} className="hover:bg-gray-50/80 transition-colors group">
                <TableCell className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {org.name}
                </TableCell>
                <TableCell className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {org.license_count}
                </TableCell>
                <TableCell className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {org.license_start_date 
                    ? new Date(org.license_start_date).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {org.license_end_date 
                    ? new Date(org.license_end_date).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    org.status === 'active' 
                      ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 group-hover:bg-red-200'
                  } transition-colors`}>
                    {org.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}