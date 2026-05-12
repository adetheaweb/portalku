import React from 'react';
import { 
  LayoutDashboard, 
  Info, 
  Settings as SettingsIcon,
  PenSquare,
  User
} from 'lucide-react';
import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: any;
}

export default function MobileNav({ currentView, onNavigate, user }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'info-kita', label: 'Info', icon: Info },
    ...(user ? [
      { id: 'admin-write', label: 'Write', icon: PenSquare },
      { id: 'settings', label: 'Admin', icon: SettingsIcon }
    ] : [
      { id: 'dashboard', label: 'Login', icon: User } // Reuse dashboard for login prompt visibility
    ])
  ];

  return (
    <div className="lg:hidden fixed bottom-1 left-2 right-2 z-50">
      <nav className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-2 flex justify-around items-center">
        {navItems.map((item, idx) => {
           const isActive = currentView === item.id;
           return (
             <button
               key={idx}
               onClick={() => onNavigate(item.id as ViewType)}
               className={`flex flex-col items-center gap-1 p-2 transition-all rounded-xl relative ${
                 isActive ? 'text-indigo-600' : 'text-gray-400'
               }`}
             >
               {isActive && (
                 <div className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full" />
               )}
               <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           );
        })}
      </nav>
    </div>
  );
}
