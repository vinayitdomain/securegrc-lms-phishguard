import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrganizationsTableProps {
  organizations: any[];
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  return (
    <Card className="border-t-4 border-t-primary shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="text-xl font-semibold text-primary">
          Organizations Directory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow>
              <TableHead className="font-semibold text-primary">Organization Name</TableHead>
              <TableHead className="font-semibold text-primary">License Count</TableHead>
              <TableHead className="font-semibold text-primary">License Start</TableHead>
              <TableHead className="font-semibold text-primary">License End</TableHead>
              <TableHead className="font-semibold text-primary">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id} className="hover:bg-gray-50/80 transition-colors group">
                <TableCell className="font-medium group-hover:text-primary transition-colors">{org.name}</TableCell>
                <TableCell className="group-hover:text-gray-900 transition-colors">{org.license_count}</TableCell>
                <TableCell className="group-hover:text-gray-900 transition-colors">
                  {org.license_start_date 
                    ? new Date(org.license_start_date).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell className="group-hover:text-gray-900 transition-colors">
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