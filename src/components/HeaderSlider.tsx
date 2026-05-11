import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { PortalSettings } from '../types';

const SLIDES = [
  {
    title: "Portal Adethea: Inovasi Digital",
    description: "Platform informasi dan kreasi konten masa depan dengan bantuan AI.",
    color: "bg-indigo-600",
    image: undefined
  },
  {
    title: "Tulis Artikel Lebih Cepat",
    description: "Gunakan kecerdasan buatan untuk merancang artikel berkualitas dalam hitungan detik.",
    color: "bg-emerald-600",
    image: undefined
  },
  {
    title: "Informasi Terkini",
    description: "Temukan update terbaru mengenai perkembangan teknologi dan berita sekitar kita.",
    color: "bg-rose-600",
    image: undefined
  }
];

export default function HeaderSlider({ settings }: { settings: PortalSettings }) {
  const [current, setCurrent] = useState(0);

  const slides = settings.sliderImages && settings.sliderImages.length > 0 
    ? settings.sliderImages.map((img, i) => ({
        title: `Slide ${i + 1}: Custom Visual`,
        description: 'Dynamic asset from portal settings.',
        image: img
      }))
    : SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const themeClasses: Record<string, string> = {
    indigo: 'bg-indigo-950',
    emerald: 'bg-emerald-950',
    rose: 'bg-rose-950',
    amber: 'bg-amber-950',
    slate: 'bg-slate-950',
  };

  const accentClasses: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
    slate: 'bg-slate-600',
  };

  const textAccentClasses: Record<string, string> = {
    indigo: 'text-indigo-300',
    emerald: 'text-emerald-300',
    rose: 'text-rose-300',
    amber: 'text-amber-300',
    slate: 'text-slate-300',
  };

  return (
    <header className={`relative w-full h-48 ${themeClasses[settings.primaryColor] || 'bg-indigo-950'} overflow-hidden shrink-0 transition-colors duration-700`}>
      {/* Background Image Layer if set (Static Header Image) */}
      {settings.headerImageUrl && !settings.sliderImages?.length && (
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${settings.headerImageUrl})` }}
        />
      )}

      {/* Dynamic Slider Image Background */}
      {slides[current].image && (
        <motion.div 
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 z-0 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        />
      )}

      {/* Brand Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-sm border-b border-white/10 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${accentClasses[settings.primaryColor] || 'bg-indigo-600'} rounded-sm flex items-center justify-center text-white font-bold transition-colors`}>A</div>
          <h1 className="text-xl font-bold text-white tracking-tight">{settings.headerTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col justify-end pb-8 px-12 md:px-24"
        >
          {/* Geometric Accent */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 flex items-center justify-center overflow-hidden pointer-events-none">
            <div className="w-[600px] h-[600px] border-[40px] border-white rotate-45 rounded-[80px]"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.span 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-xs font-bold uppercase tracking-widest ${textAccentClasses[settings.primaryColor] || 'text-indigo-300'} mb-2 block`}
            >
              Featured Insight
            </motion.span>
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-light text-white leading-tight"
            >
              {slides[current].title.split(':').map((part, i) => i === 0 ? <span key={i}>{part}</span> : <span key={i} className="font-bold">:{part}</span>)}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-6 right-12 z-30 flex gap-2">
        <button 
          onClick={prev}
          className="p-2 border border-white/20 hover:bg-white/10 text-white transition-all rounded-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={next}
          className="p-2 border border-white/20 hover:bg-white/10 text-white transition-all rounded-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
