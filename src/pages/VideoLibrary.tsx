import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Upload, Play, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function VideoLibrary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setIsAdmin(profile?.role === 'super_admin' || profile?.role === 'org_admin');
      }
    };
    checkRole();
  }, []);

  const { data: content, isLoading } = useQuery({
    queryKey: ['training-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const contentType = file.type.startsWith('video/') ? 'video' : 'pdf';

      const { error: uploadError } = await supabase.storage
        .from('training_videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('training_content')
        .insert({
          title: file.name.split('.')[0],
          content_type: contentType,
          video_url: contentType === 'video' ? filePath : null,
          pdf_url: contentType === 'pdf' ? filePath : null,
          status: 'active',
          requires_quiz: true,
          is_global: false
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Content uploaded successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload content",
        variant: "destructive",
      });
    }
  };

  const toggleGlobalAccess = async (contentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('training_content')
        .update({ is_global: !currentStatus })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content is now ${!currentStatus ? 'globally accessible' : 'organization-specific'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content access",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Content Library</h1>
          {isAdmin && (
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              <label className="cursor-pointer">
                Upload Content
                <input
                  type="file"
                  className="hidden"
                  accept="video/*,application/pdf"
                  onChange={handleUpload}
                />
              </label>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content?.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      {item.title}
                    </CardTitle>
                    {item.is_global && (
                      <Badge variant="secondary">
                        <Globe className="h-3 w-3 mr-1" />
                        Global
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate(`/learning/video/${item.id}`)}>
                      View Content
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => toggleGlobalAccess(item.id, item.is_global)}
                      >
                        {item.is_global ? 'Make Organization-Specific' : 'Make Global'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}