import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile({ user }: { user: any }) {
  if (!user) return (
    <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100">
      <p className="text-gray-400">Silakan login untuk melihat profil.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <img 
               src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} 
               className="w-40 h-40 rounded-full border-8 border-indigo-50 shadow-xl object-cover"
               alt="Avatar"
            />
            <div className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full shadow-lg border-4 border-white">
               <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{user.displayName}</h2>
              <p className="text-indigo-600 font-bold text-lg mt-1">Penulis Konten Digital</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
              <ProfileItem icon={<Shield className="w-5 h-5" />} label="Peran" value="Administrator" />
              <ProfileItem icon={<Calendar className="w-5 h-5" />} label="Bergabung Pada" value={new Date(user.metadata.creationTime).toLocaleDateString()} />
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-12 border-t border-gray-100 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Tentang Saya</h3>
          <p className="text-gray-500 leading-relaxed bg-gray-50 p-6 rounded-3xl italic">
            "Saya adalah pengguna Portal Adethea yang senang mengeksplorasi teknologi AI untuk menciptakan konten yang bermanfaat bagi masyarakat digital di Indonesia."
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
