import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BookOpen, Video, Award, Calendar, ChartBar } from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Training",
      icon: BookOpen,
      path: "/training",
    },
    {
      title: "Videos",
      icon: Video,
      path: "/training/videos",
    },
    {
      title: "Achievements",
      icon: Award,
      path: "/training/achievements",
    },
    {
      title: "Calendar",
      icon: Calendar,
      path: "/calendar",
    },
    {
      title: "Analytics",
      icon: ChartBar,
      path: "/analytics",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-bold text-[#1A1F2C]">SecureGRC</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                className="w-full flex items-center gap-3 px-3 py-2 text-[#8E9196] hover:text-[#1A1F2C] hover:bg-[#F1F0FB] transition-colors"
                tooltip={item.title}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}