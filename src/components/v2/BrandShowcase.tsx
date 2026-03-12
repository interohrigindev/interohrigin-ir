import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../contexts/LanguageContext';
import 'swiper/css';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

export interface BrandItem {
  logo: string;
  name: string;
  nameKo?: string;
  category: string;
  description?: string;
  image: string;
  video?: string; // YouTube embed URL
  visible?: boolean;
  logoScale?: number; // 0.5~2.0, default 1.0
}

interface Props {
  brands: BrandItem[];
}

/* ── Marquee: 브랜드명이 무한 흐르는 배경 텍스트 ── */
function Marquee({ text, reverse }: { text: string; reverse?: boolean }) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="mx-6 md:mx-10 whitespace-nowrap text-[clamp(3rem,10vw,7rem)] font-black uppercase tracking-tight opacity-[0.06] select-none">
      {text}
    </span>
  ));
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
      <div
        className="flex will-change-transform"
        style={{
          animation: `marquee-scroll ${reverse ? '25s' : '20s'} linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {items}{items}
      </div>
    </div>
  );
}

/* ── YouTube URL → embed ID ── */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* ── 개별 브랜드 카드 (플립) ── */
function FlipCard({ brand }: { brand: BrandItem }) {
  const [flipped, setFlipped] = useState(false);
  const scale = brand.logoScale ?? 1;

  const toggle = useCallback(() => setFlipped(v => !v), []);

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={toggle}
    >
      <div
        className="relative w-full transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionDuration: '0.7s',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Front */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', aspectRatio: '3/4' }}
        >
          {brand.video && getYouTubeId(brand.video) ? (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(brand.video)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(brand.video)}&controls=0&showinfo=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                className="absolute pointer-events-none"
                style={{
                  border: 0,
                  /* 16:9 iframe을 3:4 컨테이너에 꽉 채우기: 높이 100% 기준, 폭은 넘침 허용 */
                  top: '50%',
                  left: '50%',
                  width: '177.78vh', /* 100% * 16/9 — 높이 기준 폭 */
                  height: '100%',
                  minWidth: '100%',
                  minHeight: '56.25vw', /* 폭 기준 높이 fallback */
                  transform: 'translate(-50%, -50%)',
                }}
                loading="lazy"
              />
            </div>
          ) : (
            <img
              src={brand.image}
              alt={brand.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-5 left-5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
              {brand.category}
            </span>
          </div>

          {/* Flip hint */}
          <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7.5 21.5V18a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v3.5" />
              <path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end mb-2" style={{ height: `${2.75 * scale}rem`, width: `${110 * scale}px` }}>
              <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full w-auto h-auto brightness-0 invert object-contain" />
            </div>
            <p className="text-sm text-white/60 font-medium">{brand.category}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-between p-7 md:p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            aspectRatio: '3/4',
          }}
        >
          {/* Top */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gold-400/10 text-gold-400 border border-gold-400/20 mb-5">
              {brand.category}
            </span>
            <div className="flex items-end mb-4" style={{ height: `${3.5 * scale}rem`, width: `${120 * scale}px` }}>
              <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full w-auto h-auto brightness-0 invert object-contain" />
            </div>
            {brand.nameKo && (
              <p className="text-sm text-white/40 font-medium mb-3">{brand.nameKo}</p>
            )}
            <div className="h-px bg-white/10 mb-5" />
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {brand.description || `${brand.name} - ${brand.category}`}
            </p>
          </div>

          {/* Bottom CTA */}
          <div>
            <div className="h-px bg-white/10 mb-5" />
            <Link
              to="/brands"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 text-brand-900 text-sm font-bold hover:bg-gold-300 transition-colors"
            >
              View Brand <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function BrandShowcase({ brands }: Props) {
  const { lang } = useLang();
  const visibleBrands = brands;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.brand-showcase-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const activeBrand = visibleBrands[activeIdx] || visibleBrands[0];

  if (!activeBrand) return null;

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      {/* Marquee background text */}
      <Marquee text={activeBrand.name} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="brand-showcase-header flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-3">
              Our Brands
            </span>
            <h2
              className="font-black text-slate-900 tracking-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            >
              Brand Portfolio
            </h2>
            <p className="mt-2 text-slate-500 text-sm md:text-base max-w-lg">
              {lang === 'en'
                ? 'Seven beauty brands spanning premium skincare, haircare, and baby products'
                : '프리미엄 스킨케어부터 헤어케어, 유아용품까지 — 다양한 카테고리를 아우르는 7개 뷰티 브랜드'}
            </p>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <button className="brand-prev w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="brand-next w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1.4}
          centeredSlides={false}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 28 },
          }}
          navigation={{
            prevEl: '.brand-prev',
            nextEl: '.brand-next',
          }}
          pagination={{
            clickable: true,
            el: '.brand-pagination',
            bulletClass: 'brand-dot',
            bulletActiveClass: 'brand-dot-active',
          }}
          onSlideChange={swiper => setActiveIdx(swiper.activeIndex)}
          className="!overflow-visible"
        >
          {visibleBrands.map(b => (
            <SwiperSlide key={b.name}>
              <FlipCard brand={b} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination + CTA */}
        <div className="mt-8 md:mt-12 flex flex-col items-center gap-6">
          <div className="brand-pagination flex items-center justify-center gap-2" />
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
          >
            {lang === 'en' ? 'View All Brands' : '전체 브랜드 보기'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-block;
        }
        .brand-dot-active {
          width: 24px;
          background: #c9a84c;
        }
      `}</style>
    </div>
  );
}
