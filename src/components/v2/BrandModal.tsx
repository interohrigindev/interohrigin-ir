import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ShoppingBag, Instagram } from 'lucide-react';
import { useLang } from '../../contexts/LanguageContext';

export interface BrandData {
  logo: string;
  name: string;
  category: string;
  description: string;
  detail: string;
  image: string;
  links: {
    website?: string;
    smartstore?: string;
    instagram?: string;
  };
}

interface Props {
  brand: BrandData;
  onClose: () => void;
}

export default function BrandModal({ brand, onClose }: Props) {
  const { lang } = useLang();
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', fn);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative md:w-[42%] h-56 md:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={brand.image}
            alt={brand.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-5 left-5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/15 backdrop-blur-sm text-white border border-white/20">
              {brand.category}
            </span>
          </div>
          <div className="absolute bottom-6 left-6">
            <img src={brand.logo} alt={brand.name} className="h-8 w-auto brightness-0 invert object-contain" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 flex flex-col">
          <div className="flex-1">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-500 mb-2 block">
              {brand.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{brand.name}</h2>

            <div className="mt-5 mb-5 h-px bg-slate-100" />

            <p className="text-sm text-slate-600 leading-relaxed">{brand.description}</p>

            {brand.detail && (
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">{brand.detail}</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-4">
              {lang === 'en' ? 'Visit Links' : '사이트 바로가기'}
            </p>
            <div className="flex flex-col gap-3">
              {brand.links.website && (
                <a
                  href={brand.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{lang === 'en' ? 'Official Website' : '공식 홈페이지'}</span>
                  <span className="ml-auto text-white/40 group-hover:text-white/70 text-xs transition-colors">↗</span>
                </a>
              )}
              {brand.links.smartstore && (
                <a
                  href={brand.links.smartstore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#03C75A] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{lang === 'en' ? 'Naver Smartstore' : '네이버 스마트스토어'}</span>
                  <span className="ml-auto text-white/60 group-hover:text-white text-xs transition-colors">↗</span>
                </a>
              )}
              {brand.links.instagram && (
                <a
                  href={brand.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors border-2 border-slate-200 hover:border-pink-400 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent text-slate-700"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>Instagram</span>
                  <span className="ml-auto text-slate-400 group-hover:text-white text-xs transition-colors">↗</span>
                </a>
              )}
              {!brand.links.website && !brand.links.smartstore && !brand.links.instagram && (
                <p className="text-sm text-slate-400 text-center py-2">
                  {lang === 'en' ? 'Links coming soon.' : '링크 준비 중입니다.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
