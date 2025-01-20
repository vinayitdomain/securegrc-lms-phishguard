import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  // First check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("Authentication error. Please sign in again.");
        navigate("/");
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: organization } = useQuery({
    queryKey: ['organization', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id,
  });

  useEffect(() => {
    if (organization) {
      // Apply organization branding
      const root = document.documentElement;
      
      root.style.setProperty('--primary', organization.brand_primary_color);
      root.style.setProperty('--secondary', organization.brand_secondary_color);
      root.style.setProperty('--accent', organization.brand_accent_color);
      root.style.setProperty('--text', organization.brand_text_color);
      root.style.setProperty('--background', organization.brand_background_color);
      
      if (organization.dark_mode_enabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (organization.brand_font_family && organization.brand_font_family !== 'Inter') {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${organization.brand_font_family.replace(' ', '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        root.style.setProperty('--font-family', organization.brand_font_family);
      }

      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon && organization.brand_logo_url) {
        favicon.href = organization.brand_logo_url;
      }
    }
  }, [organization]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar organization={organization} />
          <main className="flex-1 bg-[#F8F9FB]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}