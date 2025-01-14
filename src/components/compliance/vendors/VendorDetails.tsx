import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AssessmentForm } from "./AssessmentForm";
import { RequirementForm } from "./RequirementForm";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface VendorDetailsProps {
  vendorId: string;
}

export function VendorDetails({ vendorId }: VendorDetailsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: vendor } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: requirements } = useQuery({
    queryKey: ['vendor-requirements', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_requirements')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{vendor.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {vendor.contact_name}</p>
                  <p><strong>Email:</strong> {vendor.contact_email}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendor Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {vendor.status}</p>
                  <p><strong>Risk Level:</strong> {vendor.risk_level}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Requirements</CardTitle>
              <RequirementForm vendorId={vendorId} vendorName={vendor.name} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements?.map((req) => (
                  <div key={req.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{req.requirement}</h4>
                        <p className="text-sm text-muted-foreground">Category: {req.category}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        req.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    {req.due_date && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Due: {format(new Date(req.due_date), "PPP")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Assessments</CardTitle>
              <AssessmentForm vendorId={vendorId} vendorName={vendor.name} />
            </CardHeader>
            <CardContent>
              {/* Assessment history will be added here */}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}