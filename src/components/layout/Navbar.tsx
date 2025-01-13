import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BarChart2, BookOpen, Mail, Play, Home } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              SecurityEd
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/video-library" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
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
          <NotificationBell />
        </div>
      </div>
    </nav>
  );
}