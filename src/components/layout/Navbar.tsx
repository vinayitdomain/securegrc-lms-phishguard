import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BarChart2, BookOpen, Mail, Play, Home, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function Navbar({ organization }: { organization?: { brand_logo_url?: string | null; name: string; } | null }) {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            {organization?.brand_logo_url && (
              <img 
                src={organization.brand_logo_url} 
                alt={organization.name}
                className="h-8 w-auto"
              />
            )}
            <span className="text-xl font-bold text-primary">
              {organization?.name || "SecureGRC"}
            </span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/training/videos" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <Play className="h-4 w-4" />
              Videos
            </Link>
            <Link 
              to="/training" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Training
            </Link>
            <Link 
              to="/campaigns" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              Campaigns
            </Link>
            <Link 
              to="/analytics" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="h-4 w-4" />
              <span>{profile?.full_name || 'Loading...'}</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}