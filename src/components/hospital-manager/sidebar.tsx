import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Users, Network, Wallet, CalendarCheck2, HeartHandshake, Hospital } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function HospitalManagerSidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const routes = [
    {
      title: "Tổng quan",
      href: "/hospital",
      icon: BarChart3,
    },
    {
      title: "Thông tin bệnh viện",
      href: "/hospital/information",
      icon: Hospital,
    },
    {
      title: "Khoa",
      href: "/hospital/faculties",
      icon: Network,
    },
    {
      title: "Bác sĩ",
      href: "/hospital/doctors",
      icon: Users,
    },
    {
      title: "Dịch vụ",
      href: "/hospital/services",
      icon: HeartHandshake,
    },
    {
      title: "Lịch hẹn",
      href: "/hospital/appointments",
      icon: CalendarCheck2,
    },
    {
      title: "Doanh thu",
      href: "/hospital/revenue",
      icon: Wallet,
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Quản lý bệnh viện
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
                  <Link to={route.href} className="text-foreground">
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
