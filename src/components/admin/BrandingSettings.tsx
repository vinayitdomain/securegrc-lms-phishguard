import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BrandingSettingsProps {
  organizationId: string;
}

export function BrandingSettings({ organizationId }: BrandingSettingsProps) {
  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleBrandingUpdate = async (formData: FormData) => {
    const { error } = await supabase
      .from('organizations')
      .update({
        brand_primary_color: formData.get('primaryColor'),
        brand_secondary_color: formData.get('secondaryColor'),
        brand_accent_color: formData.get('accentColor'),
        brand_font_family: formData.get('fontFamily')
      })
      .eq('id', organizationId);

    if (error) {
      console.error('Error updating branding:', error);
    }
  };

  if (isLoading) {
    return <div>Loading branding settings...</div>;
  }

  return (
    <form action={handleBrandingUpdate}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input
              id="primaryColor"
              name="primaryColor"
              type="color"
              defaultValue={organization?.brand_primary_color}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input
              id="secondaryColor"
              name="secondaryColor"
              type="color"
              defaultValue={organization?.brand_secondary_color}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <Input
              id="accentColor"
              name="accentColor"
              type="color"
              defaultValue={organization?.brand_accent_color}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input
              id="fontFamily"
              name="fontFamily"
              defaultValue={organization?.brand_font_family}
            />
          </div>
        </div>
        <Button type="submit">Save Branding Settings</Button>
      </div>
    </form>
  );
}