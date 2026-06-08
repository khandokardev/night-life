import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Tags, Building2, Utensils,
  Map, ShoppingBag, Calendar, BookOpen, Star,
  Bell, Megaphone, Settings, MessageSquare, LogOut, CreditCard,
  Users, Shield, UserCog
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navGroups = [
    {
      label: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Content",
      items: [
        { href: "/categories", label: "Categories", icon: Tags },
        { href: "/clubs", label: "Clubs", icon: Building2 },
        { href: "/restaurants", label: "Restaurants", icon: Utensils },
        { href: "/tours", label: "Tours", icon: Map },
        { href: "/products", label: "Products", icon: ShoppingBag },
        { href: "/events", label: "Events", icon: Calendar },
      ],
    },
    {
      label: "Operations",
      items: [
        { href: "/bookings", label: "Bookings", icon: BookOpen },
        { href: "/reviews", label: "Reviews", icon: Star },
        { href: "/payments", label: "Payments", icon: CreditCard },
        { href: "/chat", label: "Support Chat", icon: MessageSquare },
      ],
    },
    {
      label: "Marketing",
      items: [
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/promotions", label: "Promotions", icon: Megaphone },
      ],
    },
    {
      label: "System Management",
      items: [
        { href: "/users", label: "User Management", icon: Users },
        { href: "/admin-roles", label: "Admin Roles", icon: Shield },
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background dark text-foreground">
        <Sidebar className="border-r border-border bg-card">
          <SidebarHeader className="p-4 border-b border-border">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-primary">SA PLUG</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">Admin Portal</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {navGroups.map(group => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-semibold">{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={location === item.href || location.startsWith(item.href + "/")} tooltip={item.label}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} tooltip="Logout" className="text-muted-foreground hover:text-foreground">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
