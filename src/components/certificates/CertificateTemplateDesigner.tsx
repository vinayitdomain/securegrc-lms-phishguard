import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function CertificateTemplateDesigner() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (!profile?.organization_id) {
        throw new Error('No organization found');
      }

      const { error } = await supabase
        .from('certificate_templates')
        .insert({
          name,
          description,
          organization_id: profile.organization_id,
          template_data: {
            title: name,
            layout: "default",
            showLogo: true,
            showDate: true,
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certificate template created successfully",
      });

      setName("");
      setDescription("");
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create certificate template",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Certificate Template</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Template"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}