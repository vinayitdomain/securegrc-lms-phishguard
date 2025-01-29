import React, { useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
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

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        navigate("/");
        throw new Error('No session');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
    meta: {
      errorMessage: "Please sign in to access this page",
      onError: () => {
        navigate("/");
      }
    }
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!profile?.organizations) return;

    const organization = profile.organizations;
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
  }, [profile?.organizations]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}