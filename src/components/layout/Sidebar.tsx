import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Settings, 
  MessageSquare, 
  BarChart2, 
  Layout,
  FileText,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Layout, label: "Projects", href: "/projects" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: FileText, label: "Files", href: "/files" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#6E59A5] text-white p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          F
        </div>
        <span className="text-lg font-semibold">Fillow</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className="block"
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:text-white hover:bg-white/10",
                "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}