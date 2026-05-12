import React, { useEffect, useState } from 'react';
import { getMyArticles, deleteArticle } from '../services/articleService';
import { Article } from '../types';
import { LayoutDashboard, FileText, CheckCircle, Clock, ArrowRight, Edit3, Trash2, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard({ user, onNavigate, onEdit }: { user: any, onNavigate: (v: any) => void, onEdit?: (id: string) => void }) {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, visitors: 0 });
  const [recent, setRecent] = useState<Article[]>([]);

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const myArticles = await getMyArticles();
        if (myArticles) {
          setStats({
            total: myArticles.length,
            published: myArticles.filter(a => a.status === 'published').length,
            draft: myArticles.filter(a => a.status === 'draft').length,
            visitors: Math.floor(Math.random() * 5000) + 1200 // Mock data for visitors
          });
          setRecent(myArticles.slice(0, 5));
        }
      };
      fetch();
    }
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Hapus artikel ini?")) return;
    try {
      await deleteArticle(id);
      setRecent(prev => prev.filter(a => a.id !== id));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      alert("Gagal menghapus artikel");
    }
  };

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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end pb-8 border-b border-gray-200">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-2 text-lg">Halo <span className="text-indigo-600 font-bold">{user.displayName}</span>, berikut ringkasan portal Anda.</p>
        </div>
        <button 
          onClick={() => onNavigate('admin-write')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-md flex items-center gap-3"
        >
          <FileText className="w-4 h-4" /> Tulis Artikel
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget label="Pengunjung" value={stats.visitors.toLocaleString()} icon={<UserIcon className="w-4 h-4" />} color="bg-indigo-600 text-white" />
        <StatWidget label="Total Artikel" value={stats.total} icon={<FileText className="w-4 h-4" />} />
        <StatWidget label="Published" value={stats.published} icon={<CheckCircle className="w-4 h-4" />} />
        <StatWidget label="Drafts" value={stats.draft} icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Artikel Terbaru Widget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Artikel Terbaru
            </h3>
            <button 
              onClick={() => onNavigate('info-kita')}
              className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100 shadow-sm overflow-hidden">
            {recent.length > 0 ? recent.map((article) => (
              <div 
                key={article.id} 
                className="group cursor-pointer p-6 hover:bg-gray-50 transition-all flex items-center justify-between" 
                onClick={() => onEdit?.(article.id)}
              >
                <div className="flex-1 min-w-0 mr-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      {article.status}
                    </span>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm truncate">
                      {article.title}
                    </h4>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-300" /> {article.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Baru saja'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(article.id); }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(article.id, e)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center">
                <p className="text-gray-300 text-xs uppercase font-bold tracking-widest">Belum ada aktivitas artikel</p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Info Widget */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-indigo-600" /> Info Portal
          </h3>
          <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm space-y-6">
            <div className="space-y-4">
              <InfoRow label="Status" value="Online" color="text-emerald-600" dot />
              <InfoRow label="Platform" value="Portal Adethea" />
              <InfoRow label="Lokasi" value="Indonesia" />
              <InfoRow label="Update Terakhir" value={new Date().toLocaleDateString()} />
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Mulai Menulis Cerdas</p>
              <button 
                onClick={() => onNavigate('admin-write')}
                className="w-full bg-gray-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-black transition-all"
              >
                AI Writing Tool
              </button>
            </div>
          </div>
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
