import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, FileText, Users } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const routes = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Posts",
      href: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Admin Panel
          </h2>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-2">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={location.pathname === route.href ? "secondary" : "ghost"}
                  size="default"
                  className="w-full justify-start text-base py-6"
                  asChild
                >
                  <Link to={route.href}>
                    <route.icon className="mr-3 h-5 w-5" />
                    {route.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
