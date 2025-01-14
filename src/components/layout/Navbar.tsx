import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BarChart2, BookOpen, Mail, Play, Home, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavbarProps {
  organization?: {
    brand_logo_url?: string | null;
    name: string;
  } | null;
}

export function Navbar({ organization }: NavbarProps) {
  const navigate = useNavigate();

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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            {organization?.brand_logo_url && (
              <img 
                src={organization.brand_logo_url} 
                alt={organization.name}
                className="h-8 w-auto"
              />
            )}
            <span className="hidden font-bold sm:inline-block">
              {organization?.name || "SecureGRC"}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/training/videos" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <Play className="h-4 w-4" />
              Videos
            </Link>
            <Link to="/training" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Training
            </Link>
            <Link to="/campaigns" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Campaigns
            </Link>
            <Link to="/analytics" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="text-foreground/80 hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}