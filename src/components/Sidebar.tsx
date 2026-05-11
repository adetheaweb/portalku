import React from 'react';
import { 
  LayoutDashboard, 
  Info, 
  User, 
  PenSquare, 
  LogOut,
  LogIn,
  Settings as SettingsIcon
} from 'lucide-react';
import { ViewType } from '../types';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: any;
}

export default function Sidebar({ currentView, onNavigate, user }: SidebarProps) {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid ghost logins
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login detail error:", error);
      alert(`Login Gagal: ${error.message || 'Cek koneksi atau pengaturan Firebase.'}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'info-kita', label: 'Info Kita', icon: Info },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
  ];

  return (
    <div className="w-full bg-white flex flex-col h-full">
      <div className="p-8 flex-1 space-y-8">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-100 shadow-sm overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <text x="5" y="82" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="85" fill="black">A</text>
              <path d="M5 75 Q 35 35 95 30" stroke="#ef4444" strokeWidth="12" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">Portal</h2>
            <p className="text-[10px] text-gray-400 font-medium">Adethea</p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Navigation</h3>
          <nav className="space-y-1">
            {navItems.filter(item => item.id !== 'settings' || user).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 border-l-2 ${
                  currentView === item.id 
                    ? 'border-current bg-current-light text-indigo-700 font-bold' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {user && (
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Management</h3>
            <button
              onClick={() => onNavigate('admin-write')}
              className={`w-full flex items-center gap-3 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${
                currentView === 'admin-write' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              <PenSquare className="w-4 h-4" />
              Write Article
            </button>
          </div>
        )}
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-indigo-100 border border-indigo-200 overflow-hidden">
                <img 
                  src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} 
                  alt="Avatar"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tight">{user.displayName}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-red-600 border border-gray-200 rounded-sm transition-colors uppercase tracking-widest"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-800 text-xs font-bold uppercase tracking-widest rounded-sm hover:border-gray-900 transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            Login Google
          </button>
        )}
      </div>
    </div>
  );
}
