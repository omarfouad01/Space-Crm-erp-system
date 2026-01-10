import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import Deals from '@/pages/Deals';
import DealDetail from '@/pages/DealDetail';
import Finance from '@/pages/Finance';
import Tasks from '@/pages/Tasks';
import Tickets from '@/pages/Tickets';
import HR from '@/pages/HR';
import Meetings from '@/pages/Meetings';
import Expos from '@/pages/Expos';
import ExpoDetail from '@/pages/ExpoDetail';
import Booths from '@/pages/Booths';
import BoothDetail from '@/pages/BoothDetail';
import Sponsorships from '@/pages/Sponsorships';
import Payments from '@/pages/Payments';
import Chat from '@/pages/Chat';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import ClientPortal from '@/pages/ClientPortal';
import Contracts from '@/pages/Contracts';
import Analytics from '@/pages/Analytics';
import AdvancedFeatures from '@/pages/AdvancedFeatures';
import Notifications from '@/pages/Notifications';
import Commissions from '@/pages/Commissions';
import Exhibitors from '@/pages/Exhibitors';
import UserTesting from '@/pages/UserTesting';
import DesignSystem from '@/pages/DesignSystem';
import ProposalSystem from '@/pages/ProposalSystem';

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
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/expos" element={<Expos />} />
          <Route path="/expos/:expoId" element={<ExpoDetail />} />
          <Route path="/booths" element={<Booths />} />
          <Route path="/booths/:boothId" element={<BoothDetail />} />
          <Route path="/sponsorships" element={<Sponsorships />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/advanced" element={<AdvancedFeatures />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/exhibitors" element={<Exhibitors />} />
          <Route path="/proposals" element={<ProposalSystem />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-testing" element={<UserTesting />} />
          <Route path="/design" element={<DesignSystem />} />
          <Route path="/client-portal/*" element={<ClientPortal />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;