import React from 'react';
import { Github, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="h-10 bg-white border-t border-gray-200 flex items-center justify-between px-8 shrink-0">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        &copy; 2026 Portal_adethea CMS System
      </p>
      <div className="flex space-x-8">
        <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:tracking-tighter uppercase transition-all tracking-widest">Help Center</a>
        <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:tracking-tighter uppercase transition-all tracking-widest">Terms of Service</a>
      </div>
    </footer>
  );
}
