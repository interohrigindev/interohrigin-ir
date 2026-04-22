import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { PortfolioItem, PortfolioGallery } from '../../hooks/usePortfolio';

/* ── 풀스크린 라이트박스 ── */
function Lightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [images.length, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      <span className="absolute top-5 left-5 text-white/60 text-sm font-medium">{idx + 1} / {images.length}</span>

      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <img
        src={images[idx]}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        onClick={e => e.stopPropagation()}
        draggable={false}
      />
    </div>,
    document.body,
  );
}

/* ── 인터랙티브 Peek 캐러셀 (스와이프 + 드래그 + 스프링 + 깊이감) ── */
function GalleryCarousel({ gallery, brandName }: { gallery: PortfolioGallery; brandName: string }) {
  const [idx, setIdx] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const dragStart = useRef<{ x: number; t: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const images = gallery.images;
  if (images.length === 0) return null;

  const MAIN = 72;
  const PEEK = 14;
  const SWIPE_THRESHOLD = 40;

  const goTo = useCallback((i: number) => {
    setIdx(((i % images.length) + images.length) % images.length);
    setDragOffset(0);
  }, [images.length]);

  /* ── 포인터 이벤트 (터치 + 마우스 통합) ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (images.length <= 1) return;
    dragStart.current = { x: e.clientX, t: Date.now() };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [images.length]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current || !isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    setDragOffset(dx);
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dt = Date.now() - dragStart.current.t;
    const velocity = Math.abs(dx) / Math.max(dt, 1);

    // 빠른 플릭 또는 충분한 드래그 거리
    if (Math.abs(dx) > SWIPE_THRESHOLD || velocity > 0.4) {
      if (dx < 0) goTo(idx + 1);
      else goTo(idx - 1);
    } else {
      setDragOffset(0);
    }

    dragStart.current = null;
    setIsDragging(false);
  }, [idx, goTo]);

  // 드래그를 %로 변환
  const trackWidth = trackRef.current?.offsetWidth || 1;
  const dragPct = (dragOffset / trackWidth) * 100;
  const baseTranslate = -idx * MAIN + PEEK;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{gallery.label}</p>
        <span className="text-[10px] text-slate-400 font-medium">{idx + 1} / {images.length}</span>
      </div>

      <div className="relative group select-none">
        <div
          ref={trackRef}
          className="overflow-hidden rounded-xl bg-slate-900 cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(${baseTranslate + dragPct}%)`,
              transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            {images.map((img, i) => {
              const dist = Math.abs(i - idx);
              const isCurrent = dist === 0;
              // 깊이감: 거리에 따라 scale, opacity, blur 조절
              const scale = isCurrent ? 1 : Math.max(0.82, 1 - dist * 0.08);
              const opacity = isCurrent ? 1 : Math.max(0.25, 1 - dist * 0.3);

              return (
                <div key={i} className="flex-shrink-0 px-1.5" style={{ width: `${MAIN}%` }}>
                  <div
                    className="rounded-lg overflow-hidden relative"
                    style={{
                      aspectRatio: '16/10',
                      transform: `scale(${scale})`,
                      opacity,
                      transition: isDragging ? 'none' : 'all 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
                      filter: isCurrent ? 'none' : `brightness(0.6)`,
                    }}
                  >
                    <img
                      src={img}
                      alt={`${brandName} ${gallery.label} ${i + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                      draggable={false}
                    />
                    {/* 현재 이미지 — 확대 버튼 */}
                    {isCurrent && !isDragging && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* 현재 이미지 — 미묘한 글로우 */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-lg ring-1 ring-white/20 pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 좌우 네비 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(idx - 1)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(idx + 1)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? 'bg-white w-5 shadow-sm shadow-white/50' : 'bg-white/35 w-1.5 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 라이트박스 */}
      {lightboxIdx !== null && (
        <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}

interface Props {
  item: PortfolioItem;
  lang: string;
}

export default function PortfolioDetail({ item, lang }: Props) {
  const desc = lang !== 'ko' && item.description_en ? item.description_en : item.description;

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      {item.heroImage && (
        <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '21/9' }}>
          <img key={item.id} src={item.heroImage} alt={item.brandName} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{item.brandName}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.categories.map(cat => (
                <span key={cat} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Title (no hero) */}
      {!item.heroImage && (
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.brandName}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.categories.map(cat => (
              <span key={cat} className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {desc && (
        <div className="bg-white rounded-xl p-4">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">
            {lang !== 'ko' ? 'Project Introduction' : '프로젝트 소개'}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{desc}</p>
        </div>
      )}

      {/* Galleries — iOS 캐러셀 */}
      {item.galleries.length > 0 && (
        <div className={`grid gap-4 ${item.galleries.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {item.galleries.map((gallery, gi) => (
            <GalleryCarousel key={gi} gallery={gallery} brandName={item.brandName} />
          ))}
        </div>
      )}
    </div>
  );
}
