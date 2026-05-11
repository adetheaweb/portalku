import React, { useState, useEffect } from 'react';
import HeaderSlider from './components/HeaderSlider';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import InfoKita from './pages/InfoKita';
import ArticleWrite from './pages/ArticleWrite';
import Settings from './pages/Settings';
import { ViewType, PortalSettings } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { subscribeToSettings } from './services/settingsService';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalSettings, setPortalSettings] = useState<PortalSettings>({
    primaryColor: 'indigo',
    headerTitle: 'Portal_adethea'
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    }, (error) => {
      console.error("Auth error:", error);
      setLoading(false);
    });

    const unsubSettings = subscribeToSettings((data) => {
      if (data) {
        setPortalSettings(prev => ({ 
          ...prev, 
          ...data,
          primaryColor: data.primaryColor || 'indigo',
          headerTitle: data.headerTitle || 'Portal_adethea'
        }));
      }
    });

    return () => {
      unsubAuth();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    // Only access document if it's available and we have a color
    if (typeof document !== 'undefined' && portalSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', portalSettings.primaryColor);
    }
  }, [portalSettings.primaryColor]);

  // Handle access control
  useEffect(() => {
    if (!loading && !user && (currentView === 'settings' || currentView === 'admin-write')) {
      setCurrentView('dashboard');
    }
  }, [user, currentView, loading]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      case 'info-kita':
        return <InfoKita />;
      case 'admin-write':
        return <ArticleWrite />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Memuat Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden bg-[#F4F7F6] theme-${portalSettings.primaryColor}`}>
      <HeaderSlider settings={portalSettings} />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="flex w-full overflow-hidden">
          {/* Column 1: Side / Stats Column */}
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
            <Sidebar 
              currentView={currentView} 
              onNavigate={setCurrentView} 
              user={user} 
            />
          </aside>

          {/* Column 2: Main Workspace */}
          <section className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
