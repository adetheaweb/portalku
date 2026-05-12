import React, { useState, useEffect } from 'react';
import { Palette, Image as ImageIcon, Save, CheckCircle2, Layout } from 'lucide-react';
import { getPortalSettings, updatePortalSettings } from '../services/settingsService';
import { PortalSettings } from '../types';

const COLORS = [
  { name: 'Indigo (Default)', value: 'indigo', class: 'bg-indigo-600' },
  { name: 'Emerald', value: 'emerald', class: 'bg-emerald-600' },
  { name: 'Rose', value: 'rose', class: 'bg-rose-600' },
  { name: 'Amber', value: 'amber', class: 'bg-amber-600' },
  { name: 'Slate', value: 'slate', class: 'bg-slate-800' },
];

export default function Settings({ user }: { user: any }) {
  const [settings, setSettings] = useState<PortalSettings>({
    primaryColor: 'indigo',
    headerTitle: 'Portal_adethea',
    headerImageUrl: '',
    slides: []
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await getPortalSettings();
      if (data) {
        // Migrate sliderImages to slides if slides are empty
        let initialSlides = data.slides || [];
        if (initialSlides.length === 0 && data.sliderImages && data.sliderImages.length > 0) {
          initialSlides = data.sliderImages.map(img => ({ imageUrl: img, title: 'Custom Slide', description: '' }));
        }

        setSettings(prev => ({ 
          ...prev, 
          ...data,
          slides: initialSlides
        }));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setSettings({
      ...settings,
      slides: [...(settings.slides || []), { imageUrl: newImageUrl, title: 'Slide Baru', description: '' }]
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setSettings({
      ...settings,
      slides: (settings.slides || []).filter((_, i) => i !== index)
    });
  };

  const handleSlideChange = (index: number, field: string, value: string) => {
    const newSlides = [...(settings.slides || [])];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings({ ...settings, slides: newSlides });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePortalSettings(settings);
      alert("Pengaturan portal diperbarui!");
    } catch (err) {
      alert("Gagal memperbarui pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-400">Area Admin. Silakan login.</div>;

  if (loading) return <div className="p-8 text-center">Memuat...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="pb-8 border-b border-gray-200 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Pengaturan Portal</h2>
          <p className="text-gray-500 mt-2 text-lg">Sesuaikan tampilan branding dan header portal Anda.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-900 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Slider Management */}
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Galeri Slider</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-sm pl-4 pr-24 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="URL atau ..."
                />
                <label className="absolute right-1 top-1 bottom-1 px-3 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center cursor-pointer hover:bg-gray-50 rounded-sm">
                  Upload
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSettings({
                            ...settings,
                            slides: [...(settings.slides || []), { imageUrl: reader.result as string, title: 'Upload Baru', description: '' }]
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <button 
                onClick={handleAddImage}
                className="bg-gray-900 text-white px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Tambah URL
              </button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {settings.slides?.map((slide, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-sm p-4 space-y-4 relative group">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 shrink-0 bg-gray-200 rounded-sm overflow-hidden border border-gray-300">
                      <img src={slide.imageUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <input 
                         type="text"
                         value={slide.title || ''}
                         onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                         className="w-full bg-white border border-gray-200 rounded-sm px-3 py-1 text-[11px] font-bold uppercase tracking-tight focus:ring-1 focus:ring-indigo-500 outline-none"
                         placeholder="Judul Slide"
                       />
                       <textarea 
                         value={slide.description || ''}
                         onChange={(e) => handleSlideChange(idx, 'description', e.target.value)}
                         className="w-full bg-white border border-gray-200 rounded-sm px-3 py-1 text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none h-12 resize-none"
                         placeholder="Keterangan Slide..."
                       />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              ))}
              {(!settings.slides || settings.slides.length === 0) && (
                <div className="py-8 text-center text-gray-400 text-xs italic border-2 border-dashed border-gray-100">
                  Belum ada gambar slider kustom.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color Theme */}
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Template Warna</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSettings({ ...settings, primaryColor: color.value })}
                className={`w-full flex items-center justify-between p-4 border transition-all rounded-sm ${
                  settings.primaryColor === color.value 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full ${color.class}`}></div>
                  <span className="text-sm font-medium text-gray-700">{color.name}</span>
                </div>
                {settings.primaryColor === color.value && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Header Assets */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Layout className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Kustomisasi Header</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Judul Portal</label>
              <input 
                type="text"
                value={settings.headerTitle}
                onChange={(e) => setSettings({ ...settings, headerTitle: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Portal_adethea"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                <span><ImageIcon className="w-3 h-3 inline mr-1" /> Gambar Header (Static)</span>
                <label className="cursor-pointer text-indigo-600 hover:underline">
                  Upload File
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setSettings({ ...settings, headerImageUrl: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </label>
              <input 
                type="text"
                value={settings.headerImageUrl || ''}
                onChange={(e) => setSettings({ ...settings, headerImageUrl: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="URL atau Base64..."
              />
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-8 rounded-sm overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 border-[8px] border-white/10 rotate-45"></div>
             <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-indigo-300">Live Preview</p>
             <div className="flex items-center gap-2 mb-4">
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center font-bold text-xs bg-${settings.primaryColor}-600`}>A</div>
                <span className="font-bold text-sm">{settings.headerTitle}</span>
             </div>
             <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className={`h-full bg-white transition-all duration-500 w-1/2`}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
