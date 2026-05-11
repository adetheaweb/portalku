import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Save, 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  List, 
  Heading1, 
  Heading2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { generateArticleDraft, refineContent } from '../services/geminiService';
import { createArticle } from '../services/articleService';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function ArticleWrite() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [refineQuery, setRefineQuery] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [fontSize, setFontSize] = useState('text-sm');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    setContent(newText);
    
    // Reset focus and selection
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    insertMarkdown(`<div style="text-align: ${alignment}">\n\n`, '\n\n</div>');
  };

  const handleInsertLink = () => {
    const url = prompt("Masukkan URL:");
    if (url) insertMarkdown('[', `](${url})`);
  };

  const handleInsertImage = () => {
    const url = prompt("Masukkan URL Gambar:");
    if (url) insertMarkdown('![alt text](', `${url})`);
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const draft = await generateArticleDraft(topic);
      if (draft) {
        const lines = draft.split('\n');
        setTitle(lines[0].replace(/#+\s*/, '') || topic);
        setContent(draft);
      }
    } catch (err: any) {
      console.error("Gemini Error:", err);
      // Try to parse if it's a JSON string (could be from handleFirestoreError or similar pattern)
      let displayMsg = "Gagal memproses AI";
      try {
        if (err.message) {
          displayMsg += `: ${err.message}`;
        }
      } catch (e) {}
      alert(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!content || !refineQuery) return;
    setLoading(true);
    try {
      const refined = await refineContent(content, refineQuery);
      if (refined) setContent(refined);
    } catch (err: any) {
      console.error("Gemini Error:", err);
      alert(`Gagal memproses perbaikan: ${err.message || "Pastikan koneksi internet stabil."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title || !content) return;
    setIsPublishing(true);
    try {
      await createArticle({
        title,
        content,
        status,
      });
      alert(status === 'published' ? "Artikel berhasil dipublikasikan!" : "Simpan draf berhasil");
      setTitle('');
      setContent('');
      setTopic('');
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan artikel");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      <div className="flex justify-between items-end pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Info Kita</h2>
          <p className="text-gray-500 text-sm mt-1">Tulis artikel cerdas dengan bantuan kecerdasan buatan.</p>
        </div>
        <div className="flex gap-2">
          <button 
            disabled={isPublishing || !content}
            onClick={() => handleSave('published')}
            className="bg-current text-white px-8 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isPublishing ? 'Publishing...' : 'Publish Artikel'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Editor Side */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col overflow-hidden">
          {/* AI Input Bar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4 items-center">
            <div className="flex-1 relative">
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ketik topik artikel di sini..."
                className="w-full pl-4 pr-32 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 px-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>✨ Generate AI</span>}
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="px-4 py-2 border-b border-gray-100 bg-white flex flex-wrap gap-1 items-center">
            <ToolbarButton onClick={() => insertMarkdown('**', '**')} icon={<Bold className="w-4 h-4" />} title="Tebal" />
            <ToolbarButton onClick={() => insertMarkdown('_', '_')} icon={<Italic className="w-4 h-4" />} title="Miring" />
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <ToolbarButton onClick={() => handleAlign('left')} icon={<AlignLeft className="w-4 h-4" />} title="Rata Kiri" />
            <ToolbarButton onClick={() => handleAlign('center')} icon={<AlignCenter className="w-4 h-4" />} title="Rata Tengah" />
            <ToolbarButton onClick={() => handleAlign('right')} icon={<AlignRight className="w-4 h-4" />} title="Rata Kanan" />
            <ToolbarButton onClick={() => handleAlign('justify')} icon={<AlignJustify className="w-4 h-4" />} title="Rata Kiri Kanan" />
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <ToolbarButton onClick={() => insertMarkdown('# ')} icon={<Heading1 className="w-4 h-4" />} title="Heading 1" />
            <ToolbarButton onClick={() => insertMarkdown('## ')} icon={<Heading2 className="w-4 h-4" />} title="Heading 2" />
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <ToolbarButton onClick={() => insertMarkdown('- ')} icon={<List className="w-4 h-4" />} title="Daftar" />
            <ToolbarButton onClick={handleInsertLink} icon={<LinkIcon className="w-4 h-4" />} title="Tautan" />
            <ToolbarButton onClick={handleInsertImage} icon={<ImageIcon className="w-4 h-4" />} title="Gambar" />
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
              <Type className="w-3 h-3" />
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                <option value="text-xs">Kecil</option>
                <option value="text-sm">Normal</option>
                <option value="text-base">Besar</option>
                <option value="text-lg">Ekstra</option>
              </select>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="JUDUL ARTIKEL AKAN MUNCUL DI SINI..."
              className="w-full text-xl font-bold bg-transparent border-0 border-b border-gray-100 focus:border-indigo-600 px-0 py-2 transition-all outline-none uppercase tracking-tight placeholder:text-gray-300"
            />
            <textarea 
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis manual atau gunakan tombol Generate di atas..."
              className={`w-full h-[500px] bg-transparent border-0 resize-none focus:ring-0 text-gray-700 leading-relaxed outline-none font-sans ${fontSize}`}
            />
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center">
             <div className="flex-1 w-full">
               <input 
                 value={refineQuery}
                 onChange={(e) => setRefineQuery(e.target.value)}
                 placeholder="Instruksi AI... (Contoh: buat nada lebih formal)"
                 className="w-full bg-white border border-gray-200 rounded-md px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
             <button 
               onClick={handleRefine}
               disabled={loading || !content}
               className="bg-gray-200 text-gray-700 px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 disabled:opacity-50 transition-colors whitespace-nowrap"
             >
               Apply Refinement
             </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="bg-white border border-gray-200 rounded-sm p-8 min-h-[700px] sticky top-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pratinjau Layout</h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            </div>
          </div>
          
          {content ? (
            <article className={`prose prose-indigo max-w-none prose-h1:text-2xl prose-h1:font-bold prose-h1:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed ${fontSize === 'text-xs' ? 'prose-sm' : fontSize === 'text-lg' ? 'prose-xl' : fontSize === 'text-base' ? 'prose-base' : 'prose-sm'}`}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-gray-300 border-2 border-dashed border-gray-100 rounded-sm">
              <span className="text-4xl mb-4 opacity-20">✍️</span>
              <p className="text-xs font-bold uppercase tracking-widest">Editor Kosong</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 text-gray-400 hover:text-current hover:bg-current-light rounded-sm transition-all"
    >
      {icon}
    </button>
  );
}
