import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  Plus, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import { UserMenu } from '@/components/auth/UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile menu button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-black"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black" />}
              </button>

              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search clients, deals, contracts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Quick Create */}
              <div className="relative">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Quick Create
                </Button>
              </div>

              {/* Action buttons */}
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Menu */}
              <div className="pl-3 border-l border-gray-200">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}