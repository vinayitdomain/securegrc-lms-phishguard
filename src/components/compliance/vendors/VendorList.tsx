import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VendorForm } from "./VendorForm";
import { VendorDetails } from "./VendorDetails";

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: string;
  risk_level: string;
  created_at: string;
  organization_id: string;
}

export function VendorList() {
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching vendors",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Vendor[];
    },
  });

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading vendors...</div>;
  }

  if (!profile?.organization_id) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Third-Party Vendors</h2>
        <VendorForm organizationId={profile.organization_id} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors?.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{vendor.name}</CardTitle>
              {getRiskLevelIcon(vendor.risk_level)}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                {vendor.description}
              </div>
              {vendor.contact_name && (
                <div className="text-sm">
                  <strong>Contact:</strong> {vendor.contact_name}
                </div>
              )}
              {vendor.contact_email && (
                <div className="text-sm">
                  <strong>Email:</strong> {vendor.contact_email}
                </div>
              )}
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {vendor.status}
                </span>
                <VendorDetails vendorId={vendor.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}