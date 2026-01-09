import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';

// Pages
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import Deals from '@/pages/Deals';
import DealDetail from '@/pages/DealDetail';
import Finance from '@/pages/Finance';
import Tasks from '@/pages/Tasks';
import Tickets from '@/pages/Tickets';
import HR from '@/pages/HR';
import Expos from '@/pages/Expos';
import Chat from '@/pages/Chat';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import ClientPortal from '@/pages/ClientPortal';

function App() {
  // Mock authentication state - in real app this would come from context/state management
  const isAuthenticated = true;
  const userRole = 'sales_manager'; // Mock role

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/client-portal/*" element={<ClientPortal />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </Router>
    );
  }

  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen bg-app-background font-inter">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/deals/:id" element={<DealDetail />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/hr" element={<HR />} />
                  <Route path="/expos" element={<Expos />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/client-portal/*" element={<ClientPortal />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
}

export default App;