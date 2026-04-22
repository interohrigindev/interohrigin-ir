import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  description: string;
  description_en: string;
  image: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Brand Discovery',
    description:
      '글로벌 시장에서 잠재력 있는 K-Beauty 브랜드를 발굴하고, 브랜드의 핵심 가치와 차별점을 분석합니다. 시장 데이터와 AI 기반 트렌드 분석을 통해 성공 가능성을 검증합니다.',
    description_en:
      'We discover high-potential K-Beauty brands in the global market and analyze their core values and differentiators. We validate success potential through market data and AI-based trend analysis.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&q=80',
  },
  {
    number: '02',
    title: 'Strategy & Planning',
    description:
      '타깃 국가별 시장 진입 전략을 수립하고, 브랜딩·마케팅·유통 채널을 설계합니다. 인플루언서 네트워크와 미디어 플랜을 통합적으로 기획합니다.',
    description_en:
      'We establish market entry strategies for each target country and design branding, marketing, and distribution channels. We plan influencer networks and media strategies holistically.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&h=600&fit=crop&q=80',
  },
  {
    number: '03',
    title: 'Global Launch',
    description:
      'Amazon, Shopee, Qoo10 등 주요 마켓플레이스 입점과 D2C 자사몰을 동시에 오픈합니다. 글로벌 풀필먼트 센터를 통해 안정적인 물류 인프라를 구축합니다.',
    description_en:
      'We simultaneously launch on major marketplaces like Amazon, Shopee, and Qoo10 along with D2C online stores. We build stable logistics infrastructure through global fulfillment centers.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&h=600&fit=crop&q=80',
  },
  {
    number: '04',
    title: 'Growth & Scale',
    description:
      '실시간 데이터 모니터링과 AI 기반 수요 예측으로 재고·광고·가격을 최적화합니다. 지속적인 콘텐츠 마케팅과 리텐션 전략으로 브랜드를 성장시킵니다.',
    description_en:
      'We optimize inventory, advertising, and pricing through real-time data monitoring and AI-based demand forecasting. We grow brands with continuous content marketing and retention strategies.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&q=80',
  },
];

interface Props {
  items?: Step[];
}

export default function StoryProcess({ items }: Props) {
  const { lang } = useLang();
  const activeSteps = (items && items.length > 0) ? items : steps;
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const cards = rootRef.current!.querySelectorAll<HTMLElement>('.process-card');
      cards.forEach((card) => {
        gsap.set(card, { y: 40, opacity: 0 });
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const desc = (step: Step) => lang !== 'ko' ? step.description_en : step.description;

  return (
    <div ref={rootRef} className="py-14 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-brand-500 mb-3">
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            How We Work
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-lg">
            {lang !== 'ko'
              ? 'From brand discovery to global scaling — a proven 4-step process'
              : '브랜드 발굴부터 글로벌 스케일링까지 — 검증된 4단계 프로세스'}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-12">
          {activeSteps.map((step, i) => (
            <div
              key={step.number}
              className={`process-card flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden aspect-[3/2] bg-slate-900 flex-shrink-0">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-4 left-5 text-5xl md:text-6xl font-black text-white/20 leading-none select-none">
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold-400" />
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-gold-500">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-slate-500 leading-relaxed text-sm md:text-base max-w-md">
                  {desc(step)}
                </p>
                {/* Progress dots */}
                <div className="flex items-center gap-2 mt-6">
                  {activeSteps.map((_, j) => (
                    <div
                      key={j}
                      className={`h-1.5 rounded-full ${
                        j === i ? 'w-8 bg-gold-400' : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
