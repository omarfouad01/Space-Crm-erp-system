import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function TopBar() {
  // Mock data - in real app this would come from context/state
  const user = {
    name: 'John Smith',
    role: 'Sales Manager',
    avatar: null,
  };

  const notificationCount = 3;

  return (
    <header className="h-18 bg-white/95 backdrop-blur-md border-b border-border-neutral flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-text-primary hover:bg-gray-100 p-2 rounded-lg transition-colors" />
        
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <Input
            placeholder="Search clients, deals, or documents..."
            className="pl-12 pr-4 py-3 bg-gray-50/50 border-0 rounded-xl focus:bg-white focus:border-space-blue focus:ring-2 focus:ring-space-blue/20 transition-all duration-200 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Enhanced Notifications */}
        <Button variant="ghost" size="sm" className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-semibold text-white">{notificationCount}</span>
            </div>
          )}
        </Button>

        {/* Enhanced User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-space-blue to-space-blue/80 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dropdown-content">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Activity Log</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-error">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}