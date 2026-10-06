import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomTabBar } from './components/BottomTabBar';
import { Toast } from './components/Toast';

// Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { DiagnosisPage } from './pages/DiagnosisPage';
import { ChatPage } from './pages/ChatPage';
import { NlpDashboardPage } from './pages/NlpDashboardPage';
import { MyPlantsPage } from './pages/MyPlantsPage';
import { PlantProfilePage } from './pages/PlantProfilePage';
import { CalendarPage } from './pages/CalendarPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { SettingsPage } from './pages/SettingsPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const isWelcomeScreen = location.pathname === '/welcome';

  if (isWelcomeScreen) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-50 transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-16 lg:mb-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>

      <BottomTabBar />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/welcome" element={<OnboardingPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/diagnosis/:id" element={<DiagnosisPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/nlp-dashboard" element={<NlpDashboardPage />} />
            <Route path="/my-plants" element={<MyPlantsPage />} />
            <Route path="/plant/:id" element={<PlantProfilePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
