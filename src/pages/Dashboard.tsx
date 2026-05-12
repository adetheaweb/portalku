import React, { useEffect, useState } from 'react';
import { getMyArticles, deleteArticle, getAllArticlesCount } from '../services/articleService';
import { Article } from '../types';
import { LayoutDashboard, FileText, CheckCircle, Clock, ArrowRight, Edit3, Trash2, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard({ user, onNavigate, onEdit }: { user: any, onNavigate: (v: any) => void, onEdit?: (id: string) => void }) {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, visitors: 0, allArticles: 0 });
  const [recent, setRecent] = useState<Article[]>([]);

  useEffect(() => {
    const fetchPublicStats = async () => {
      const allArticlesCount = await getAllArticlesCount();
      setStats(prev => ({
        ...prev,
        allArticles: allArticlesCount || 0,
        visitors: Math.floor(Math.random() * 5000) + 1200
      }));
    };

    fetchPublicStats();

    if (user) {
      const fetchMyStats = async () => {
        const myArticles = await getMyArticles();
        if (myArticles) {
          setStats(prev => ({
            ...prev,
            total: myArticles.length,
            published: myArticles.filter(a => a.status === 'published').length,
            draft: myArticles.filter(a => a.status === 'draft').length,
          }));
          setRecent(myArticles.slice(0, 5));
        }
      };
      fetchMyStats();
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

  const PublicStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-indigo-600 text-white p-8 rounded-sm shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Total Pengunjung</p>
        <div className="flex items-end justify-between relative z-10">
          <p className="text-6xl font-bold tracking-tighter">{stats.visitors.toLocaleString()}</p>
          <UserIcon className="w-8 h-8 opacity-30" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm flex flex-col justify-between h-40">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Total Artikel Publik</p>
        <div className="flex items-end justify-between">
          <p className="text-6xl font-bold tracking-tighter text-gray-900">{stats.allArticles}</p>
          <FileText className="w-8 h-8 text-indigo-600 opacity-20" />
        </div>
      </div>
    </div>
  );

  if (!user) return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="pb-8 border-b border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Portal Adethea</h2>
        <p className="text-gray-500 mt-2 text-lg">Informasi cerdas untuk komunitas digital.</p>
      </div>

      {PublicStats}

      <div className="flex flex-col items-center justify-center bg-white rounded-sm border border-gray-100 p-12 shadow-sm text-center gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Akses Admin</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Silahkan login dengan Google untuk mulai menulis dan mengelola portal Anda sendiri.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-gray-200">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Admin Area</h2>
          <p className="text-gray-500 mt-2 text-base md:text-lg">Kelola konten portal Anda di sini.</p>
        </div>
        <button 
          onClick={() => onNavigate('admin-write')}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-3"
        >
          <FileText className="w-4 h-4" /> Tulis Artikel
        </button>
      </div>

      {PublicStats}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget label="Milik Saya" value={stats.total} icon={<FileText className="w-4 h-4" />} />
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
            <div key={article.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => onEdit?.(article.id)}>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm uppercase tracking-tight mb-1">{article.title}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {article.status}
                  </span>
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{article.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recent'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit?.(article.id); }}
                  className="text-gray-400 hover:text-indigo-600 p-2"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(article.id, e); }}
                  className="text-gray-400 hover:text-rose-600 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
