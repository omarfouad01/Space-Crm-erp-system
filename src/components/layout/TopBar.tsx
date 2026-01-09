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
    <header className="h-16 bg-white border-b border-border-neutral flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-text-primary" />
        
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
          <Input
            placeholder="Search clients, deals, or documents..."
            className="pl-10 bg-white border-border-neutral focus:border-space-blue focus:ring-space-blue"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-status-error"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
              <div className="w-8 h-8 bg-space-blue rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary" />
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