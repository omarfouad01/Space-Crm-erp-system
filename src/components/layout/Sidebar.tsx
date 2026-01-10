import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase,
  CreditCard,
  DollarSign,
  Percent,
  FileText,
  SquareCheckBig,
  Ticket,
  MessageSquare,
  ChartColumn,
  Brain,
  Bell,
  Settings,
  TestTube,
  Gauge,
  Palette,
  LogOut,
  User,
  Users,
  ChevronRight
} from 'lucide-react';

const menuSections = [
  {
    title: 'Core Operations',
    items: [
      { name: 'Dashboard', path: '/', icon: ChartColumn, description: 'Executive overview' },
      { name: 'Clients', path: '/clients', icon: User, description: 'Client management' },
      { name: 'Deals', path: '/deals', icon: Briefcase, description: 'Sales pipeline' },
      { name: 'Expos', path: '/expos', icon: Briefcase, description: 'Event management' },
    ]
  },
  {
    title: 'Exhibition',
    items: [
      { name: 'Booths', path: '/booths', icon: Briefcase, description: 'Booth management' },
      { name: 'Sponsorships', path: '/sponsorships', icon: Briefcase, description: 'Sponsorship packages' },
      { name: 'Exhibitors', path: '/exhibitors', icon: Briefcase, description: 'Exhibitor relations' },
    ]
  },
  {
    title: 'Financial',
    items: [
      { name: 'Payments', path: '/payments', icon: CreditCard, description: 'Transaction tracking' },
      { name: 'Finance', path: '/finance', icon: DollarSign, description: 'Financial dashboard' },
      { name: 'Commissions', path: '/commissions', icon: Percent, description: 'Sales compensation' },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'HR & Team', path: '/hr', icon: Users, description: 'Human resources' },
      { name: 'Contracts', path: '/contracts', icon: FileText, description: 'Legal documents' },
      { name: 'Tasks', path: '/tasks', icon: SquareCheckBig, description: 'Operations tasks' },
      { name: 'Chat', path: '/chat', icon: MessageSquare, description: 'Team communication' },
      { name: 'Support', path: '/tickets', icon: Ticket, description: 'Client support' },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { name: 'Analytics', path: '/analytics', icon: ChartColumn, description: 'Business intelligence' },
      { name: 'Advanced Features', path: '/advanced', icon: Brain, description: 'AI-powered CRM features' },
      { name: 'Notifications', path: '/notifications', icon: Bell, description: 'Smart alerts' },
      { name: 'System', path: '/settings', icon: Settings, description: 'Configuration' },
    ]
  },
  {
    title: 'Quality Assurance',
    items: [
      { name: 'User Testing', path: '/user-testing', icon: TestTube, description: 'API & System diagnostics' },
      { name: 'Performance', path: '/performance', icon: Gauge, description: 'System optimization' },
      { name: 'Design System', path: '/design', icon: Palette, description: 'UI/UX color palette' },
    ]
  }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-white">SPACE</div>
            <div className="text-xs font-bold text-white">CRM & ERP</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-4 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider transition-opacity duration-300">
                {section.title}
              </h3>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-300 group relative transform hover:scale-105 hover:translate-x-1 sidebar-item-glow rounded-lg ${
                      active 
                        ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-md' 
                        : 'text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white hover:shadow-md'
                    }`}
                  >
                    <Icon className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 sidebar-icon-pulse text-white w-4 h-4" />
                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <div className="font-bold text-sm transition-all duration-300">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold transition-all duration-300">
                        {item.description}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <div className="space-y-3">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">admin</div>
              <div className="text-xs font-semibold text-white">User • General</div>
            </div>
          </div>

          {/* Sign Out */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 group">
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}