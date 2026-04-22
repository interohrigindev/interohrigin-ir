import { useRef, useLayoutEffect, useState } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageContent } from '../../hooks/usePageContent';
import { useLang } from '../../contexts/LanguageContext';
import PortfolioModal from '../../components/v2/PortfolioModal';

gsap.registerPlugin(ScrollTrigger);

/* ── 비즈니스 영역 데이터 ── */
interface BizArea {
  number: string;
  title: string;
  subtitle: string;
  subtitle_en: string;
  description: string;
  description_en: string;
  features: { text: string; text_en: string }[];
  tags: string[];
  tags_en: string[];
  image: string;
  accent: string;
}

const areas: BizArea[] = [
  {
    number: '01',
    title: 'Global Commerce',
    subtitle: '글로벌 커머스 / 유통',
    subtitle_en: 'Global Commerce / Distribution',
    description:
      '아마존, 큐텐, 쇼피, 라자다 등 주요 글로벌 마켓플레이스에서의 셀링 운영과 자사몰 구축을 통해 브랜드의 해외 시장 진출을 지원합니다. K-Beauty를 전 세계로 유통하는 원스톱 솔루션을 제공합니다.',
    description_en:
      'We support brands\' overseas market entry through selling operations on major global marketplaces like Amazon, Qoo10, Shopee, and Lazada, along with building branded online stores. We provide one-stop solutions for distributing K-Beauty worldwide.',
    features: [
      { text: '글로벌 마켓플레이스 운영 (Amazon, Shopee, Qoo10, Lazada)', text_en: 'Global marketplace operations (Amazon, Shopee, Qoo10, Lazada)' },
      { text: '시장 조사 및 가격 전략 수립', text_en: 'Market research and pricing strategy' },
      { text: '자사몰 구축 및 D2C 솔루션', text_en: 'Online store development and D2C solutions' },
    ],
    tags: ['#글로벌유통', '#D2C', '#마켓플레이스'],
    tags_en: ['#GlobalDistribution', '#D2C', '#Marketplace'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&q=85',
    accent: 'bg-blue-500',
  },
  {
    number: '02',
    title: 'Advertising & PPL',
    subtitle: '광고 / PPL 사업부',
    subtitle_en: 'Advertising / PPL Division',
    description:
      '20년 이상의 마케팅 역량을 기반으로 인플루언서 마케팅, 브랜디드 콘텐츠, 방송 PPL 등 데이터 기반 통합 광고 솔루션을 제공합니다. 퍼포먼스 마케팅과 미디어 바잉까지 전 채널을 커버합니다.',
    description_en:
      'With 20+ years of marketing expertise, we provide data-driven integrated advertising solutions including influencer marketing, branded content, and broadcast PPL. We cover all channels from performance marketing to media buying.',
    features: [
      { text: '인플루언서 마케팅 및 콘텐츠 제작', text_en: 'Influencer marketing and content creation' },
      { text: '방송 PPL 및 브랜디드 콘텐츠', text_en: 'Broadcast PPL and branded content' },
      { text: '퍼포먼스 마케팅 및 미디어 바잉', text_en: 'Performance marketing and media buying' },
    ],
    tags: ['#인플루언서마케팅', '#브랜디드콘텐츠', '#PPL'],
    tags_en: ['#InfluencerMarketing', '#BrandedContent', '#PPL'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop&q=85',
    accent: 'bg-brand-500',
  },
  {
    number: '03',
    title: 'Logistics & Fulfillment',
    subtitle: '글로벌 물류',
    subtitle_en: 'Global Logistics',
    description:
      '한국, 일본, 동남아시아에 위치한 풀필먼트 센터를 통해 원스톱 물류 솔루션을 제공합니다. 통관, 국제 배송, 재고 관리까지 빠르고 정확한 배송 인프라를 운영합니다.',
    description_en:
      'We provide one-stop logistics solutions through fulfillment centers located in Korea, Japan, and Southeast Asia. We operate fast and accurate delivery infrastructure covering customs clearance, international shipping, and inventory management.',
    features: [
      { text: '글로벌 풀필먼트 센터 운영', text_en: 'Global fulfillment center operations' },
      { text: '통관 및 국제 배송 관리', text_en: 'Customs clearance and international shipping' },
      { text: '재고 관리 및 실시간 트래킹', text_en: 'Inventory management and real-time tracking' },
    ],
    tags: ['#글로벌물류', '#풀필먼트', '#원스톱배송'],
    tags_en: ['#GlobalLogistics', '#Fulfillment', '#OneStopShipping'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop&q=85',
    accent: 'bg-emerald-500',
  },
  {
    number: '04',
    title: 'AI & Technology',
    subtitle: 'AI / 테크놀로지',
    subtitle_en: 'AI / Technology',
    description:
      'AI 기반 트렌드 분석, 수요 예측, 마케팅 자동화를 통해 빠르게 변화하는 뷰티 시장에서 경쟁력을 확보합니다. 데이터 드리븐 커머스를 실현하는 기술 역량을 보유하고 있습니다.',
    description_en:
      'We secure competitiveness in the fast-changing beauty market through AI-based trend analysis, demand forecasting, and marketing automation. We possess the technological capabilities to realize data-driven commerce.',
    features: [
      { text: 'AI 기반 뷰티 트렌드 분석', text_en: 'AI-based beauty trend analysis' },
      { text: '수요 예측 및 재고 최적화', text_en: 'Demand forecasting and inventory optimization' },
      { text: '마케팅 자동화 플랫폼', text_en: 'Marketing automation platform' },
    ],
    tags: ['#AI분석', '#데이터드리븐', '#마케팅자동화'],
    tags_en: ['#AIAnalytics', '#DataDriven', '#MarketingAutomation'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&q=85',
    accent: 'bg-violet-500',
  },
];

const pageFallback = {
  hero: {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop&q=80',
    label: 'Business Areas',
    title: '사업 영역',
    description: '커머스, 마케팅, 물류, 테크놀로지를 아우르는 토탈 뷰티 커머스 솔루션',
  },
  partnershipCta: {
    title: '비즈니스 파트너십 문의',
    description: '브랜드 유통, 마케팅 협업, 기술 파트너십 등 다양한 비즈니스 기회를 함께 만들어 갑니다.',
    buttonText: 'Contact Us',
    buttonLink: '/contact',
  },
};

export default function Business() {
  const { lang } = useLang();
  const { data: content } = usePageContent('business', pageFallback, lang);
  const pinRef = useRef<HTMLDivElement>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  /* ── GSAP: 데스크톱 핀 애니메이션 (WishCompany 스타일) ── */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      if (!pinRef.current) return;

      const items = pinRef.current.querySelectorAll<HTMLElement>('.biz-item');
      const totalItems = items.length;

      // 초기 상태: 첫 번째만 보이기
      items.forEach((item, i) => {
        const thumb = item.querySelector('.biz-thumb');
        const desc = item.querySelector('.biz-desc');
        const txtBox = item.querySelector('.biz-txtbox');
        const dim = item.querySelector('.biz-dim');

        if (i === 0) {
          gsap.set(item, { pointerEvents: 'auto' });
          gsap.set(thumb, { opacity: 1 });
          gsap.set(txtBox, { opacity: 1, y: 0 });
          gsap.set(dim, { opacity: 1 });
          gsap.set(desc, { opacity: 1 });
        } else {
          gsap.set(item, { pointerEvents: 'none' });
          gsap.set(thumb, { opacity: 0 });
          gsap.set(txtBox, { opacity: 0, y: '40%' });
          gsap.set(dim, { opacity: 0 });
          gsap.set(desc, { opacity: 0 });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${window.innerHeight * (totalItems + 1)}`,
        },
      });

      // 각 아이템 전환 애니메이션
      for (let i = 0; i < totalItems - 1; i++) {
        const cur = items[i];
        const next = items[i + 1];
        const pos = i * 3;

        // 현재 아이템 fade out + 클릭 차단
        tl.to(cur.querySelector('.biz-desc')!, { opacity: 0, duration: 0.8 }, pos + 1.5);
        tl.to(cur.querySelector('.biz-thumb')!, { opacity: 0, duration: 1 }, pos + 2);
        tl.set(cur, { pointerEvents: 'none' }, pos + 2);

        // 다음 아이템 fade in + 클릭 활성화
        tl.set(next, { pointerEvents: 'auto' }, pos + 2.2);
        tl.to(next.querySelector('.biz-thumb')!, { opacity: 1, duration: 1 }, pos + 2.2);
        tl.to(next.querySelector('.biz-dim')!, { opacity: 1, duration: 0.8 }, pos + 2.5);
        tl.to(next.querySelector('.biz-txtbox')!, { opacity: 1, y: 0, duration: 1 }, pos + 2.5);
        tl.to(next.querySelector('.biz-desc')!, { opacity: 1, duration: 1 }, pos + 2.8);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative -mt-16 pt-16 overflow-hidden">
        <img
          src={content.hero.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-36">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-3">
            {content.hero.label}
          </span>
          <h1
            className="font-black text-white tracking-tight leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
          >
            {content.hero.title}
          </h1>
          <p className="mt-3 text-white/60 max-w-lg text-sm md:text-base">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* ── Business Areas — WishCompany 스타일 핀 섹션 ── */}
      <div ref={pinRef}>
        {/* 데스크톱: 전체 핀 */}
        <div className="hidden md:flex flex-col" style={{ height: '100vh' }}>
          {/* 오버래핑 아이템 */}
          <div className="relative flex-1 min-h-0">
            {areas.map((area, i) => (
              <div
                key={area.number}
                className="biz-item absolute inset-0 flex"
                style={{ zIndex: areas.length - i }}
              >
                {/* 좌측: 이미지 + 오버레이 */}
                <div className="biz-thumb relative w-1/2 h-full overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="biz-dim absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                  {/* 텍스트 오버레이 */}
                  <div className="biz-txtbox absolute bottom-0 left-0 right-0 p-10 lg:p-14">
                    <div className={`inline-block w-12 h-1 ${area.accent} mb-5 rounded-full`} />
                    <span className="block text-5xl lg:text-6xl font-black text-white/15 leading-none mb-3 select-none">
                      {area.number}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 font-medium tracking-wide">
                      {lang !== 'ko' ? area.subtitle_en : area.subtitle}
                    </p>
                  </div>
                </div>

                {/* 우측: 설명 + 기능 + 태그 */}
                <div className="biz-desc w-1/2 h-full flex flex-col justify-center bg-white px-10 lg:px-16">
                  <span className={`inline-block w-10 h-1 ${area.accent} mb-6 rounded-full`} />
                  <h4 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    {area.title}
                  </h4>
                  <p className="mt-4 text-slate-500 leading-relaxed text-sm lg:text-base max-w-md">
                    {lang !== 'ko' ? area.description_en : area.description}
                  </p>

                  {/* 기능 리스트 */}
                  <ul className="mt-6 space-y-3">
                    {area.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${area.accent} flex-shrink-0`} />
                        {lang !== 'ko' ? f.text_en : f.text}
                      </li>
                    ))}
                  </ul>

                  {/* 태그 */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    {(lang !== 'ko' ? area.tags_en : area.tags).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 포트폴리오 버튼 — 02 Advertising & PPL 전용 */}
                  {area.number === '02' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPortfolio(true); }}
                      className="mt-6 self-start inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      {lang !== 'ko' ? 'Portfolio' : '포트폴리오'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 모바일: 카드 리스트 */}
        <div className="md:hidden bg-white py-16">
          <div className="px-6 space-y-16">
            {areas.map((area) => (
              <div key={area.number} className="space-y-5">
                {/* 이미지 */}
                <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={area.image}
                    alt={area.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-3xl font-black text-white/20 leading-none">{area.number}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{area.title}</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      {lang !== 'ko' ? area.subtitle_en : area.subtitle}
                    </p>
                  </div>
                </div>

                {/* 설명 */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {lang !== 'ko' ? area.description_en : area.description}
                </p>

                {/* 기능 */}
                <ul className="space-y-2">
                  {area.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${area.accent} flex-shrink-0`} />
                      {lang !== 'ko' ? f.text_en : f.text}
                    </li>
                  ))}
                </ul>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5">
                  {(lang !== 'ko' ? area.tags_en : area.tags).map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 포트폴리오 버튼 — 02 Advertising & PPL 전용 (모바일) */}
                {area.number === '02' && (
                  <button
                    onClick={() => setShowPortfolio(true)}
                    className="mt-4 self-start inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    {lang !== 'ko' ? 'Portfolio' : '포트폴리오'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {content.partnershipCta.title}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            {content.partnershipCta.description}
          </p>
          <Link
            to={content.partnershipCta.buttonLink}
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            {content.partnershipCta.buttonText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Portfolio Modal */}
      {showPortfolio && <PortfolioModal onClose={() => setShowPortfolio(false)} />}
    </>
  );
}
