import React, { useEffect, useState } from 'react';
import { getMyArticles } from '../services/articleService';
import { Article } from '../types';
import { LayoutDashboard, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard({ user, onNavigate }: { user: any, onNavigate: (v: any) => void }) {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [recent, setRecent] = useState<Article[]>([]);

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const myArticles = await getMyArticles();
        if (myArticles) {
          setStats({
            total: myArticles.length,
            published: myArticles.filter(a => a.status === 'published').length,
            draft: myArticles.filter(a => a.status === 'draft').length
          });
          setRecent(myArticles.slice(0, 3));
        }
      };
      fetch();
    }
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center gap-4">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
        <LayoutDashboard className="w-8 h-8 text-gray-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Selamat datang di Portal Adethea</h2>
        <p className="text-gray-500">Silakan masuk untuk mengelola artikel dan profil Anda.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="pb-8 border-b border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Overview</h2>
        <p className="text-gray-500 mt-2 text-lg">Selamat datang kembali, <span className="text-indigo-600 font-bold">{user.displayName}</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total Artikel" value={stats.total} color="" light />
        <StatCard label="Dipublikasikan" value={stats.published} color="" />
        <StatCard label="Dalam Draf" value={stats.draft} color="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Aktivitas Terakhir</h3>
            <button onClick={() => onNavigate('admin-write')} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><ArrowRight className="w-4 h-4 text-current" /></button>
          </div>
          <div className="space-y-6">
            {recent.length > 0 ? recent.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{article.title}</p>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {article.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Updated: {article.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recent'}
                </p>
              </div>
            )) : (
              <p className="text-center py-12 text-gray-300 text-xs uppercase font-bold tracking-widest">No Recent Activity</p>
            )}
          </div>
        </div>

        <div className="bg-current-light border-current border p-8 rounded-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 border-[10px] border-black/5 rotate-45 pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mulai Menulis Cerdas</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs">
              Gunakan engine AI kami untuk mengekstrak draf artikel secara instan berdasarkan topik pilihan Anda.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('admin-write')}
            className="w-full bg-gray-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-black transition-all shadow-lg"
          >
            Akses Writer Tool
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, light }: { label: string, value: number, color: string, light?: boolean }) {
  return (
    <div className={`p-8 border rounded-sm flex flex-col gap-2 ${light ? 'bg-current text-white border-transparent' : 'bg-white border-gray-200 text-gray-900'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? 'opacity-80' : 'text-gray-400'}`}>{label}</p>
      <p className="text-4xl font-light tracking-tighter">{value}</p>
    </div>
  );
}
