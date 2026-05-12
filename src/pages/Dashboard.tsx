import React, { useEffect, useState } from 'react';
import { getMyArticles, deleteArticle } from '../services/articleService';
import { Article } from '../types';
import { LayoutDashboard, FileText, CheckCircle, Clock, ArrowRight, Edit3, Trash2, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard({ user, onNavigate, onEdit }: { user: any, onNavigate: (v: any) => void, onEdit?: (id: string) => void }) {
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
          setRecent(myArticles.slice(0, 5));
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
        <h2 className="text-xl font-bold text-gray-900">Portal Adethea</h2>
        <p className="text-gray-500 text-sm">Silahkan login untuk mengakses fitur admin.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end pb-8 border-b border-gray-200">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Area</h2>
          <p className="text-gray-500 mt-2 text-lg">Kelola konten portal Anda di sini.</p>
        </div>
        <button 
          onClick={() => onNavigate('admin-write')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-md flex items-center gap-3"
        >
          <FileText className="w-4 h-4" /> Tulis Artikel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget label="Total Milik Saya" value={stats.total} icon={<FileText className="w-4 h-4" />} />
        <StatWidget label="Live" value={stats.published} icon={<CheckCircle className="w-4 h-4" />} />
        <StatWidget label="Draf" value={stats.draft} icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Artikel Saya</h3>
          <button onClick={() => onNavigate('info-kita')} className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] hover:underline">Lihat Portal</button>
        </div>
        <div className="space-y-4">
          {recent.length > 0 ? recent.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
              <div>
                <p className="font-bold text-gray-900 text-sm uppercase tracking-tight">{article.title}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{article.status}</p>
              </div>
              <button 
                onClick={() => onEdit?.(article.id)}
                className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800"
              >
                Atur
              </button>
            </div>
          )) : (
            <p className="text-center py-12 text-gray-300 text-xs uppercase font-bold tracking-widest">Belum ada artikel</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color?: string }) {
  return (
    <div className={`p-6 border rounded-sm shadow-sm flex flex-col justify-between h-40 ${color ? color : 'bg-white border-gray-200 text-gray-900 text-current'}`}>
      <div className="flex justify-between items-start">
        <span className={`p-2 rounded-sm ${color ? 'bg-white/20' : 'bg-gray-50 text-indigo-600'}`}>{icon}</span>
      </div>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${color ? 'opacity-70' : 'text-gray-400'}`}>{label}</p>
        <p className="text-4xl font-bold tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color, dot }: { label: string, value: string, color?: string, dot?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-400 uppercase font-bold tracking-widest text-[9px]">{label}</span>
      <span className={`font-bold flex items-center gap-2 ${color ? color : 'text-gray-900'}`}>
        {dot && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
        {value}
      </span>
    </div>
  );
}
