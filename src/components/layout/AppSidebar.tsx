import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Handshake,
  DollarSign,
  CheckSquare,
  Headphones,
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  Building2,
  LogOut,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Core Operations',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Clients',
        url: '/clients',
        icon: Users,
      },
      {
        title: 'Deals & Sales',
        url: '/deals',
        icon: Handshake,
      },
      {
        title: 'Finance',
        url: '/finance',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Tasks',
        url: '/tasks',
        icon: CheckSquare,
      },
      {
        title: 'Tickets',
        url: '/tickets',
        icon: Headphones,
      },
      {
        title: 'HR & KPIs',
        url: '/hr',
        icon: BarChart3,
      },
      {
        title: 'Expos',
        url: '/expos',
        icon: Building2,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        title: 'Internal Chat',
        url: '/chat',
        icon: MessageSquare,
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="sidebar-nav border-r border-sidebar-border/20">
      <SidebarHeader className="p-6 border-b border-sidebar-border/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-space-blue to-space-blue/80 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-sidebar-foreground tracking-tight">SPACE CRM</h2>
            <p className="text-sm text-sidebar-foreground/60 font-medium">Expo Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className={groupIndex > 0 ? 'mt-8' : ''}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      isActive={location.pathname === item.url}
                      className="nav-item text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg mx-2 rounded-xl"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/settings')}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}