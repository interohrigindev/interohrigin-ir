import { Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import BrandShowcase from '../../components/v2/BrandShowcase';
import CountUpStats from '../../components/v2/CountUpStats';
import StoryProcess from '../../components/v2/StoryProcess';
import MarqueeBand from '../../components/v2/MarqueeBand';
import ClosingCTA from '../../components/v2/ClosingCTA';
import SectionDots from '../../components/v2/SectionDots';
import GlobalNetwork from '../../components/v2/GlobalNetwork';
import VideoGallery from '../../components/v2/VideoGallery';
import { usePageContent } from '../../hooks/usePageContent';
import { useBrands } from '../../hooks/useBrands';
import { useLang } from '../../contexts/LanguageContext';

const fallback = {
  hero: {
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=1080&fit=crop&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=1080&fit=crop&q=85',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=1080&fit=crop&q=85',
    ],
    label: 'Global Beauty Commerce Group',
    title: 'Connecting Korean',
    titleHighlight: 'Beauty',
    titleEnd: 'to the World',
    subtitle: '인터오리진 I&C는 7개 뷰티 브랜드와 글로벌 유통 네트워크를 기반으로 K-Beauty의 가치를 전 세계에 전달합니다.',
    cta1Text: 'Explore Brands', cta1Link: '/brands',
    cta2Text: 'Contact Us', cta2Link: '/contact',
  },
  stats: [
    { end: 150, suffix: '+', label: '프로젝트 완료' },
    { end: 30, suffix: '+', label: '클라이언트' },
    { end: 8, suffix: '+', label: '경력 연수' },
    { end: 7, suffix: '', label: '뷰티 브랜드' },
  ],
  marquee: {
    texts: ['GLOBAL BEAUTY','K-BEAUTY','COMMERCE','BRANDING','MARKETING','LOGISTICS','AI & TECH','INNOVATION'],
    brandTexts: ['AZH','LA COLLECTA','SHEMONBRED','TIBERIAS','BABY CORNER','THING OF JACOB','DR.ASKL'],
  },
  globalNetwork: {
    label: 'Global Network',
    title: 'Worldwide Presence',
    description: '한국을 거점으로 일본, 미국, 중국, 동남아시아 등 8개국 이상의 유통 네트워크',
    cities: undefined as any,
  },
  process: undefined as any,
  flagship: {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=900&fit=crop&q=85&crop=bottom',
    logo: '/logos/azh.png', label: 'Flagship Brand',
    title: 'Hair & Skincare\n글로벌 8개국\n진출 브랜드',
    description: '2018년 런칭 후 CJ ENM 홈쇼핑 방송 전 수량 매진, 올리브영 전국 입점을 거쳐 미국·홍콩·일본·중동까지 진출한 대표 K-Beauty 브랜드',
    ctaText: 'AZH 보러가기', ctaLink: '/brands',
  },
  ceoQuote: {
    bgImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=700&fit=crop&q=80',
    label: 'CEO Message',
    quote: '브랜드의 가치를 발견하고,\n세상에 전하는 것이\n우리의 사명입니다.',
    author: '오영근 대표이사 — I&C',
    linkText: 'Read More', linkTo: '/about',
  },
  closingCta: {
    bgImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=900&fit=crop&q=80',
    label: 'Our Mission',
    title: '브랜드의 가치를 발견하고,\n세상에 전하는 것이\n우리의 사명입니다.',
    description: '글로벌 K-Beauty 유통 파트너십에 대해 문의해 주세요.',
    buttonText: '문의하기', buttonLink: '/contact',
  },
};

const BG_INTERVAL = 5000;

export default function Home() {
  const { lang } = useLang();
  const { data: content } = usePageContent('home', fallback, lang);
  const { brands } = useBrands();
  const homeBrands = brands.filter(b => b.visibleHome).map(b => lang === 'en' ? {
    ...b,
    description: b.description_en || b.description,
    category: b.category_en || b.category,
  } : b);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgIdx = useRef(0);

  /* GSAP hero timeline — matchMedia로 모바일 간소화 */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // 데스크톱: 풀 애니메이션
    mm.add('(min-width: 769px)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-label', { opacity: 0, y: 30, duration: 0.6 })
          .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '+=0.3')
          .from('.hero-sub', { opacity: 0, y: 30, duration: 0.6 }, '+=0.3')
          .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5 }, '+=0.3')
          .from('.hero-scroll', { opacity: 0, duration: 0.4 }, '+=0.2');
      }, heroRef);
      return () => ctx.revert();
    });

    // 모바일: 간소화된 애니메이션 (stagger 축소, 거리 줄임)
    mm.add('(max-width: 768px)', () => {
      const ctx = gsap.context(() => {
        gsap.from(['.hero-label', '.hero-title', '.hero-sub', '.hero-cta'], {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
        });
      }, heroRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  /* 배경 이미지 크로스페이드 */
  const heroImages = content.hero.images;
  useEffect(() => {
    const layers = heroRef.current?.querySelectorAll<HTMLImageElement>('.hero-bg-img');
    if (!layers || layers.length === 0) return;

    layers[0].style.opacity = '1';

    const timer = setInterval(() => {
      const prev = bgIdx.current;
      bgIdx.current = (bgIdx.current + 1) % heroImages.length;
      const next = bgIdx.current;

      gsap.to(layers[prev], { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
      gsap.to(layers[next], { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
    }, BG_INTERVAL);

    return () => clearInterval(timer);
  }, [heroImages]);

  const homeSections = [
    { id: 'hero', label: 'Home' },
    { id: 'brands', label: 'Brands' },
    { id: 'global', label: 'Network' },
    { id: 'videos', label: 'Videos' },
    { id: 'process', label: 'Process' },
  ];

  return (
    <>
      {/* 사이드 섹션 인디케이터 */}
      <SectionDots sections={homeSections} />

      {/* ── Fullscreen Hero ── */}
      <section id="hero" ref={heroRef} className="relative h-screen min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden -mt-16">
        {/* 배경 이미지 레이어 */}
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="hero-bg-img absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0, transition: 'none' }}
            {...(i === 0 ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
          />
        ))}

        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="hero-label inline-block text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-gold-400 mb-4 md:mb-6">
            {content.hero.label}
          </span>

          <h1
            className="hero-title font-black tracking-tight text-white leading-[1.08]"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            {content.hero.title}<br />
            <span className="text-gold-400">{content.hero.titleHighlight}</span> {content.hero.titleEnd}
          </h1>

          <p className="hero-sub mt-4 md:mt-8 text-sm md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            {content.hero.subtitle}
          </p>

          <div className="hero-cta mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={content.hero.cta1Link}
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-gold-400 text-brand-900 text-sm font-bold rounded-xl hover:bg-gold-300 transition-colors"
            >
              {content.hero.cta1Text} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={content.hero.cta2Link}
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-white text-sm font-semibold rounded-xl border-2 border-white/30 hover:border-white hover:bg-white/10 transition-colors"
            >
              {content.hero.cta2Text}
            </Link>
          </div>
        </div>

        <div className="hero-scroll absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium hidden md:block">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" />
        </div>
      </section>

      {/* 숫자로 보는 성과 */}
      <CountUpStats metrics={content.stats} />

      {/* Marquee Band */}
      <MarqueeBand texts={content.marquee.texts} />

      {/* Brand Showcase */}
      <section id="brands" className="bg-slate-50 py-14 md:py-28">
        <BrandShowcase brands={homeBrands} />
      </section>

      {/* Flagship 풀블리드 이미지 섹션 */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <img
          src={content.flagship.image}
          alt={content.flagship.label}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <img src={content.flagship.logo} alt="" loading="lazy" className="h-6 md:h-8 w-auto brightness-0 invert" />
              <div className="h-px flex-1 max-w-[40px] md:max-w-[60px] bg-gold-400" />
              <span className="text-[9px] md:text-[10px] tracking-widest uppercase text-gold-400 font-bold">{content.flagship.label}</span>
            </div>
            <h2
              className="font-black text-white tracking-tight leading-tight max-w-xl"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              {(content.flagship.title ?? '').split('\n').map((line: string, i: number) => <span key={i}>{line}<br /></span>)}
            </h2>
            <p className="mt-3 md:mt-4 text-white/60 max-w-sm text-xs md:text-sm leading-relaxed">
              {content.flagship.description}
            </p>
            <Link
              to={content.flagship.ctaLink}
              className="inline-flex items-center gap-2 mt-6 md:mt-8 px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-gold-400 text-white font-semibold text-sm hover:bg-gold-300 transition-colors"
            >
              {content.flagship.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* World Map */}
      <section id="global" className="bg-slate-950 py-14 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10 md:mb-14">
            <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-3">
              {content.globalNetwork?.label || 'Global Network'}
            </span>
            <h2
              className="font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            >
              {content.globalNetwork?.title || 'Worldwide Presence'}
            </h2>
            <p className="mt-2 text-slate-400 text-sm md:text-base max-w-lg">
              {content.globalNetwork?.description || '한국을 거점으로 일본, 미국, 중국, 동남아시아 등 8개국 이상의 유통 네트워크'}
            </p>
          </div>
          <GlobalNetwork cities={content.globalNetwork?.cities} lang={lang} />
        </div>
      </section>

      {/* Brand PR Videos */}
      <section id="videos" className="bg-slate-900 py-14 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 mb-8 md:mb-12">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-2 md:mb-3">Brand Stories</span>
              <h2
                className="font-black text-white tracking-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
              >
                PR Videos
              </h2>
              <p className="mt-1.5 md:mt-2 text-slate-400 text-xs md:text-sm">
                {lang === 'en' ? 'Brand promotional videos — click to play' : '브랜드별 홍보 영상 — 클릭하여 재생'}
              </p>
            </div>
            <p className="text-slate-600 text-xs tracking-widest uppercase hidden md:block">Scroll →</p>
          </div>
          <VideoGallery />
        </div>
      </section>

      {/* Marquee Band — reverse */}
      <MarqueeBand
        direction={1}
        bg="bg-slate-900"
        textColor="text-white/20"
        rotated={false}
        texts={content.marquee.brandTexts}
      />

      {/* CEO Quote */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src={content.ceoQuote.bgImage}
            alt="Office"
            loading="lazy"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-32 text-center">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-5 md:mb-8">{content.ceoQuote.label}</span>
          <blockquote
            className="font-light text-white leading-snug tracking-tight"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3rem)' }}
          >
            {(content.ceoQuote.quote ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br className="hidden md:block" />}{line}</span>)}
          </blockquote>
          <p className="mt-5 md:mt-8 text-slate-400 text-xs md:text-sm tracking-widest uppercase">{content.ceoQuote.author}</p>
          <Link to={content.ceoQuote.linkTo} className="inline-flex items-center gap-2 mt-5 md:mt-8 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
            {content.ceoQuote.linkText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Services — hidden (content moved to Business page) */}

      {/* Our Process — ScrollTrigger pin */}
      <section id="process" className="bg-white">
        <StoryProcess items={content.process} />
      </section>

      {/* ── Closing: Mission + CTA ── */}
      <ClosingCTA />
    </>
  );
}
