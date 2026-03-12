import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';

interface Video {
  id: string;
  brand: string;
  logo: string;
}

const videos: Video[] = [
  { id: 'KuxG-WqMJx4', brand: 'AZH', logo: '/logos/azh.png' },
  { id: '5zEB-l_WXqM', brand: 'AZH', logo: '/logos/azh.png' },
  { id: 'TCO1Pj1a2JQ', brand: 'SHEMONBRED', logo: '/logos/shemonbred.png' },
  { id: '61yR08BDr48', brand: 'SHEMONBRED', logo: '/logos/shemonbred.png' },
  { id: 'K0jhkd9dXF8', brand: 'LA COLLECTA', logo: '/logos/lacollecta.png' },
  { id: '7ZepBF8iRrw', brand: 'LA COLLECTA', logo: '/logos/lacollecta.png' },
  { id: '6I3t4jNFDxc', brand: 'Tiberias', logo: '/logos/tiberias.png' },
  { id: 'caS-RL7wtg4', brand: 'Baby Corner', logo: '/logos/babycorner.png' },
  { id: 'sHTi_5oAt1M', brand: 'DR.ASKL', logo: '/logos/draskl.png' },
  { id: '0zm6ip733-A', brand: 'THING OF JACOB', logo: '/logos/thingofjacob.png' },
];

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm"
        style={{ aspectRatio: '9/16' }}
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <img src={video.logo} alt={video.brand} className="h-6 w-auto brightness-0 invert object-contain mx-auto" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function VideoGallery() {
  const [active, setActive] = useState<Video | null>(null);

  return (
    <>
      {/* Horizontal scroll gallery */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {videos.map(v => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className="group relative flex-shrink-0 overflow-hidden rounded-2xl bg-slate-900 focus:outline-none"
              style={{ width: 180, aspectRatio: '9/16' }}
            >
              <img
                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.brand}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-all duration-300" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-300">
                  <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <img
                  src={v.logo}
                  alt={v.brand}
                  className="h-5 w-auto brightness-0 invert object-contain"
                />
                <p className="text-[10px] text-white/60 mt-1 tracking-widest uppercase">Brand Video</p>
              </div>

              <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Shorts
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </>
  );
}
