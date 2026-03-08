import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Inspections } from './pages/Inspections';
import { SafetyReports } from './pages/SafetyReports';
import { Settings } from './pages/Settings';
import { InspectionDetail } from './pages/InspectionDetail';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Security } from './pages/Security';
import LandingPage from './pages/LandingPage';
import { AppProvider } from './context/AppContext';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-heading">
      <Navbar />
      <main className="flex-1 w-full m-0 p-0">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/inspections/:id" element={<InspectionDetail />} />
            <Route path="/reports" element={<SafetyReports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
