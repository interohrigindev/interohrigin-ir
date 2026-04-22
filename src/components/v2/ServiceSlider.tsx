import { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../contexts/LanguageContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  image: string;
  title: string;
  description: string;
  description_en: string;
  link: string;
}

const services: Service[] = [
  {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80',
    title: 'Global Commerce',
    description: 'Amazon, Shopee, Qoo10 등 주요 글로벌 마켓플레이스 운영 및 D2C 자사몰 구축으로 K-Beauty를 전 세계로 유통합니다.',
    description_en: 'We distribute K-Beauty worldwide through major global marketplaces like Amazon, Shopee, and Qoo10, along with D2C online store solutions.',
    link: '/business',
  },
  {
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&q=80',
    title: 'Advertising & PPL',
    description: '인플루언서 마케팅, 브랜디드 콘텐츠, 방송 PPL 등 데이터 기반 통합 광고 솔루션을 제공합니다.',
    description_en: 'We provide data-driven integrated advertising solutions including influencer marketing, branded content, and broadcast PPL.',
    link: '/business',
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop&q=80',
    title: 'Logistics & Fulfillment',
    description: '글로벌 풀필먼트 센터와 원스톱 물류 시스템으로 빠르고 정확한 배송 인프라를 운영합니다.',
    description_en: 'We operate fast and accurate delivery infrastructure through global fulfillment centers and one-stop logistics systems.',
    link: '/business',
  },
  {
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&q=80',
    title: 'AI & Tech',
    description: 'AI 기반 트렌드 분석, 수요 예측 및 마케팅 자동화로 데이터 드리븐 커머스를 실현합니다.',
    description_en: 'We realize data-driven commerce through AI-based trend analysis, demand forecasting, and marketing automation.',
    link: '/business',
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=500&fit=crop&q=80',
    title: 'Brand Incubation',
    description: '제품 기획부터 브랜딩, 마케팅, 유통까지 — 뷰티 브랜드의 전 과정을 함께 설계합니다.',
    description_en: 'From product planning to branding, marketing, and distribution — we design the entire journey of beauty brands together.',
    link: '/brands',
  },
];

/* ── 개별 서비스 카드 (플립/확장) ── */
function ServiceCard({ s, index, lang }: { s: Service; index: number; lang: string }) {
  const [flipped, setFlipped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const desc = lang !== 'ko' ? s.description_en : s.description;
  const detailLabel = lang !== 'ko' ? 'Learn More' : '자세히 보기';

  const toggle = useCallback(() => {
    // 768px 기준 모바일 판별 (md breakpoint)
    if (window.innerWidth < 768) {
      setExpanded(v => !v);
    } else {
      setFlipped(v => !v);
    }
  }, []);

  return (
    <div className="service-card" style={{ perspective: '1000px' }}>
      {/* ── 데스크톱: 3D 플립 ── */}
      <div
        className="hidden md:block cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={toggle}
      >
        <div
          className="relative w-full transition-transform duration-600 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transitionDuration: '0.6s',
          }}
        >
          {/* 앞면 */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative h-80 overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                  {s.title}
                </h3>
              </div>
              {/* 플립 힌트 */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>

          {/* 뒷면 */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-center p-8"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400 mb-3">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {s.title}
            </h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              {desc}
            </p>
            <Link
              to={s.link}
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-400 transition-colors self-start"
            >
              {detailLabel} <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={e => { e.stopPropagation(); setFlipped(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 모바일: 확장 방식 ── */}
      <div className="md:hidden" onClick={toggle}>
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 cursor-pointer transition-shadow duration-300 hover:shadow-lg">
          {/* 이미지 + 타이틀 (항상 표시) */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{s.title}</h3>
            </div>
            {/* 토글 인디케이터 */}
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ChevronLeft
                className="w-4 h-4 text-white/70 transition-transform duration-300"
                style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(0deg)' }}
              />
            </div>
          </div>

          {/* 확장 영역 */}
          <div
            className="overflow-hidden transition-all duration-400 ease-in-out"
            style={{
              maxHeight: expanded ? '200px' : '0px',
              opacity: expanded ? 1 : 0,
              transitionDuration: '0.4s',
            }}
          >
            <div className="p-5 border-t border-slate-100">
              <p className="text-sm text-slate-500 leading-relaxed">
                {desc}
              </p>
              <Link
                to={s.link}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-600 hover:text-brand-500 transition-colors"
              >
                {detailLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 슬라이더 래퍼 ── */
export default function ServiceSlider() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
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

  return (
    <div ref={sectionRef} className="relative">
      {/* 네비게이션 화살표 */}
      <div className="hidden md:flex items-center gap-2 absolute -top-16 right-0 z-10">
        <button className="svc-prev w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="svc-next w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: '.svc-prev',
          nextEl: '.svc-next',
        }}
        pagination={{
          clickable: true,
          el: '.svc-pagination',
          bulletClass: 'svc-dot',
          bulletActiveClass: 'svc-dot-active',
        }}
        className="!overflow-visible"
      >
        {services.map((s, i) => (
          <SwiperSlide key={s.title}>
            <ServiceCard s={s} index={i} lang={lang} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지네이션 dots */}
      <div className="svc-pagination mt-8 flex items-center justify-center gap-2" />

      {/* 커스텀 dot 스타일 */}
      <style>{`
        .svc-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-block;
        }
        .svc-dot-active {
          width: 24px;
          background: #4a3a9f;
        }
      `}</style>
    </div>
  );
}
