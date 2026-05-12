import React, { useEffect, useState } from 'react';
import { getPublishedArticles, deleteArticle, getAllArticlesCount } from '../services/articleService';
import { Article } from '../types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Clock, User as UserIcon, BookOpen, ArrowRight, Edit3, Trash2, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';

export default function InfoKita({ onEdit, onNavigate }: { onEdit?: (id: string) => void, onNavigate?: (v: any) => void }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ total: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [data, totalCount] = await Promise.all([
          getPublishedArticles(),
          getAllArticlesCount()
        ]);
        if (data) setArticles(data);
        setStats({
          total: totalCount || 0,
          visitors: Math.floor(Math.random() * 5000) + 1200
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Hapus artikel ini?")) return;
    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      if (selectedArticle?.id === id) setSelectedArticle(null);
    } catch (err) {
      alert("Gagal menghapus artikel");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-current">
      {!selectedArticle && (
        <div className="space-y-10">
          <div className="pb-8 border-b border-gray-200">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Info Kita</h2>
            <p className="text-gray-500 mt-2 text-lg">Update informasi terkurasi dari komunitas digital kami.</p>
          </div>

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
                 <p className="text-6xl font-bold tracking-tighter text-gray-900">{stats.total}</p>
                 <FileText className="w-8 h-8 text-indigo-600 opacity-20" />
               </div>
            </div>
          </div>
        </div>
      )}

      {selectedArticle ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 border border-gray-200 rounded-sm shadow-sm relative"
        >
          <button 
            onClick={() => setSelectedArticle(null)}
            className="mb-12 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            ← Kembali ke daftar
          </button>
          
          <div className="flex flex-wrap gap-6 items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 pb-8 border-b border-gray-100">
            <span className="flex items-center gap-2">
              <UserIcon className="w-3 h-3 text-indigo-400" /> {selectedArticle.authorName}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-indigo-400" /> {selectedArticle.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Freshly Baked'}
            </span>
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-sm">Artikel</span>
            
            {(currentUser?.uid === selectedArticle.authorId) && (
              <div className="flex gap-4 ml-auto">
                <button 
                  onClick={() => onEdit?.(selectedArticle.id)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button 
                  onClick={(e) => handleDelete(selectedArticle.id, e)}
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-800 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-[1.1] tracking-tight">{selectedArticle.title}</h1>
          
          <div className="prose prose-lg prose-indigo max-w-none prose-p:text-gray-600 prose-p:leading-loose">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{selectedArticle.content}</ReactMarkdown>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.length > 0 ? articles.map((article, idx) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-white border border-gray-200 rounded-sm p-8 hover:border-indigo-600 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-indigo-50"
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 group-hover:text-indigo-600 transition-colors">
                {article.authorName} • {article.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Update'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:tracking-tight transition-all line-clamp-2 leading-tight">
                {article.title}
              </h3>
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   Read Full <BookOpen className="w-3 h-3" />
                </span>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
                
                {(currentUser?.uid === article.authorId) && (
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(article.id); }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(article.id, e)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-24 text-center border border-dashed border-gray-200 rounded-sm">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.3em]">No Articles Available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
