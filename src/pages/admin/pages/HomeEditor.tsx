import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useToast } from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import AiAssistButton from '../../../components/admin/AiAssistButton';
import AiTranslateAll from '../../../components/admin/AiTranslateAll';
import { Link } from 'react-router-dom';
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ExternalLink,
} from 'lucide-react';
import { useBrands } from '../../../hooks/useBrands';

/* ── 타입 정의 ── */
interface HeroData {
  images: string[];
  label: string;
  title: string;
  titleHighlight: string;
  titleEnd: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

interface StatItem {
  end: number;
  suffix: string;
  label: string;
}

interface FlagshipData {
  image: string;
  logo: string;
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface CeoQuoteData {
  bgImage: string;
  label: string;
  quote: string;
  author: string;
  linkText: string;
  linkTo: string;
}

interface ClosingCtaData {
  bgImage: string;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface MarqueeData {
  texts: string[];
  brandTexts: string[];
}

interface NetworkCity {
  id: string;
  flag: string;
  label: string;
  sub: string;
  sub_en?: string;
  image?: string;
  primary?: boolean;
}

interface GlobalNetworkData {
  label: string;
  title: string;
  description: string;
  cities: NetworkCity[];
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  description_en: string;
  image: string;
}

interface HomeContent {
  hero: HeroData;
  stats: StatItem[];
  marquee: MarqueeData;
  globalNetwork: GlobalNetworkData;
  process: ProcessStep[];
  flagship: FlagshipData;
  ceoQuote: CeoQuoteData;
  closingCta: ClosingCtaData;
}

/* ── 기본 데이터 (현재 하드코딩 값) ── */
const defaultContent: HomeContent = {
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
    cta1Text: 'Explore Brands',
    cta1Link: '/brands',
    cta2Text: 'Contact Us',
    cta2Link: '/contact',
  },
  stats: [
    { end: 150, suffix: '+', label: '프로젝트 완료' },
    { end: 30, suffix: '+', label: '클라이언트' },
    { end: 8, suffix: '+', label: '경력 연수' },
    { end: 7, suffix: '', label: '뷰티 브랜드' },
  ],
  marquee: {
    texts: ['GLOBAL BEAUTY', 'K-BEAUTY', 'COMMERCE', 'BRANDING', 'MARKETING', 'LOGISTICS', 'AI & TECH', 'INNOVATION'],
    brandTexts: ['AZH', 'LA COLLECTA', 'SHEMONBRED', 'TIBERIAS', 'BABY CORNER', 'THING OF JACOB', 'DR.ASKL'],
  },
  globalNetwork: {
    label: 'Global Network',
    title: 'Worldwide Presence',
    description: '한국을 거점으로 일본, 미국, 중국, 동남아시아 등 8개국 이상의 유통 네트워크',
    cities: [
      { id: 'seoul', flag: '🇰🇷', label: 'Seoul', sub: 'HQ · Operations', sub_en: 'HQ · Operations', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=500&fit=crop&q=75', primary: true },
      { id: 'tokyo', flag: '🇯🇵', label: 'Tokyo', sub: 'Japan Distribution', sub_en: 'Japan Distribution', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&q=70' },
      { id: 'shanghai', flag: '🇨🇳', label: 'Shanghai', sub: 'China Market', sub_en: 'China Market', image: 'https://images.unsplash.com/photo-1537531383496-f4749b798367?w=600&h=400&fit=crop&q=70' },
      { id: 'hongkong', flag: '🇭🇰', label: 'Hong Kong', sub: 'APAC Commerce', sub_en: 'APAC Commerce', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&h=400&fit=crop&q=70' },
      { id: 'bangkok', flag: '🇹🇭', label: 'Bangkok', sub: 'SEA Marketing', sub_en: 'SEA Marketing', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop&q=70' },
      { id: 'hochiminh', flag: '🇻🇳', label: 'Ho Chi Minh', sub: 'Vietnam Ops', sub_en: 'Vietnam Ops', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop&q=70' },
      { id: 'singapore', flag: '🇸🇬', label: 'Singapore', sub: 'SEA Fulfillment', sub_en: 'SEA Fulfillment', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop&q=70' },
      { id: 'jakarta', flag: '🇮🇩', label: 'Jakarta', sub: 'Indonesia Distribution', sub_en: 'Indonesia Distribution', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&h=400&fit=crop&q=70' },
      { id: 'la', flag: '🇺🇸', label: 'Los Angeles', sub: 'US West Coast', sub_en: 'US West Coast', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=400&fit=crop&q=70' },
    ],
  },
  process: [
    { number: '01', title: 'Brand Discovery', description: '글로벌 시장에서 잠재력 있는 K-Beauty 브랜드를 발굴하고, 브랜드의 핵심 가치와 차별점을 분석합니다.', description_en: 'We discover high-potential K-Beauty brands in the global market and analyze their core values and differentiators.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&q=80' },
    { number: '02', title: 'Strategy & Planning', description: '타깃 국가별 시장 진입 전략을 수립하고, 브랜딩·마케팅·유통 채널을 설계합니다.', description_en: 'We establish market entry strategies for each target country and design branding, marketing, and distribution channels.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&h=600&fit=crop&q=80' },
    { number: '03', title: 'Global Launch', description: 'Amazon, Shopee, Qoo10 등 주요 마켓플레이스 입점과 D2C 자사몰을 동시에 오픈합니다.', description_en: 'We simultaneously launch on major marketplaces like Amazon, Shopee, and Qoo10 along with D2C online stores.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&h=600&fit=crop&q=80' },
    { number: '04', title: 'Growth & Scale', description: '실시간 데이터 모니터링과 AI 기반 수요 예측으로 재고·광고·가격을 최적화합니다.', description_en: 'We optimize inventory, advertising, and pricing through real-time data monitoring and AI-based demand forecasting.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&q=80' },
  ],
  flagship: {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=900&fit=crop&q=85&crop=bottom',
    logo: '/logos/azh.png',
    label: 'Flagship Brand',
    title: 'Hair & Skincare\n글로벌 8개국\n진출 브랜드',
    description: '2018년 런칭 후 CJ ENM 홈쇼핑 방송 전 수량 매진, 올리브영 전국 입점을 거쳐 미국·홍콩·일본·중동까지 진출한 대표 K-Beauty 브랜드',
    ctaText: 'AZH 보러가기',
    ctaLink: '/brands',
  },
  ceoQuote: {
    bgImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=700&fit=crop&q=80',
    label: 'CEO Message',
    quote: '"브랜드의 가치를 발견하고,\n세상에 전하는 것이\n우리의 사명입니다."',
    author: '오영근 대표이사 — I&C',
    linkText: 'Read More',
    linkTo: '/about',
  },
  closingCta: {
    bgImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=900&fit=crop&q=80',
    label: 'Our Mission',
    title: '브랜드의 가치를 발견하고,\n세상에 전하는 것이\n우리의 사명입니다.',
    description: '글로벌 K-Beauty 유통 파트너십에 대해 문의해 주세요.',
    buttonText: '문의하기',
    buttonLink: '/contact',
  },
};

/* ── 공용 스타일 ── */
const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[80px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
const sectionCardCls = 'bg-white rounded-xl border border-slate-200 overflow-hidden';

/* ── 접이식 섹션 래퍼 ── */
function CollapsibleSection({ title, badge, children, defaultOpen = false }: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={sectionCardCls}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-slate-900">{title}</h3>
          {badge && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{badge}</span>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

/* ── 브랜드 관리 바로가기 카드 ── */
function BrandLinkCard() {
  const { brands } = useBrands();
  const homeCount = brands.filter(b => b.visibleHome).length;
  return (
    <div className={sectionCardCls}>
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-slate-900">브랜드 쇼케이스</h3>
          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Home에 {homeCount}개 표시</span>
        </div>
        <Link
          to="/admin/brands"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          브랜드 관리 <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      <div className="px-5 pb-4 text-xs text-slate-400">
        브랜드 추가/수정/삭제는 <strong>데이터 관리 &gt; 브랜드 관리</strong>에서 통합 관리됩니다.
      </div>
    </div>
  );
}

/* ── 메인 에디터 ── */
export default function HomeEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Firestore 실시간 구독 (문서가 없으면 기본 데이터 자동 저장)
  useEffect(() => {
    const ref = doc(db, 'pages', 'home');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<HomeContent>;
        // Deep merge: ensure nested objects like globalNetwork get default fields
        setContent(prev => {
          const merged = { ...prev, ...data };
          // Ensure globalNetwork.cities exists
          if (merged.globalNetwork && !merged.globalNetwork.cities) {
            merged.globalNetwork = { ...merged.globalNetwork, cities: defaultContent.globalNetwork.cities };
          }
          // Ensure process exists
          if (!merged.process) {
            merged.process = defaultContent.process;
          }
          return merged;
        });
      } else {
        await setDoc(ref, { ...defaultContent, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', 'home'), {
        ...content,
        updatedAt: new Date().toISOString(),
      });
      setDirty(false);
      toast('저장되었습니다.');
    } catch (err) {
      toast('저장 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Home 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-0.5">홈 페이지의 모든 섹션 콘텐츠를 편집합니다</p>
        </div>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      {/* ── AI 일괄 번역 ── */}
      <AiTranslateAll
        content={content as unknown as Record<string, unknown>}
        pageId="home"
      />

      {/* ── Hero Section ── */}
      <CollapsibleSection title="Hero 섹션" badge="메인 비주얼" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>배경 이미지 ({content.hero.images.length}장)</label>
            <div className="grid grid-cols-3 gap-3">
              {content.hero.images.map((img, i) => (
                <div key={i} className="relative">
                  <ImageUploader
                    value={img}
                    onChange={(url) => {
                      const imgs = [...content.hero.images];
                      imgs[i] = url;
                      update('hero', { ...content.hero, images: imgs });
                    }}
                    folder="home/hero"
                  />
                  {content.hero.images.length > 1 && (
                    <button
                      onClick={() => {
                        const imgs = content.hero.images.filter((_, j) => j !== i);
                        update('hero', { ...content.hero, images: imgs });
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md text-xs z-10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => update('hero', { ...content.hero, images: [...content.hero.images, ''] })}
                className="border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center h-40 hover:border-slate-300 transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>상단 라벨</label>
              <input className={inputCls} value={content.hero.label} onChange={e => update('hero', { ...content.hero, label: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>제목 첫줄</label>
              <input className={inputCls} value={content.hero.title} onChange={e => update('hero', { ...content.hero, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>강조 단어 (금색)</label>
              <input className={inputCls} value={content.hero.titleHighlight} onChange={e => update('hero', { ...content.hero, titleHighlight: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>제목 끝부분</label>
              <input className={inputCls} value={content.hero.titleEnd} onChange={e => update('hero', { ...content.hero, titleEnd: e.target.value })} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>서브타이틀</label>
              <AiAssistButton value={content.hero.subtitle} onApply={v => update('hero', { ...content.hero, subtitle: v })} fieldLabel="서브타이틀" context="K-Beauty 글로벌 유통 기업 소개" />
            </div>
            <textarea className={textareaCls} value={content.hero.subtitle} onChange={e => update('hero', { ...content.hero, subtitle: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>CTA1 텍스트</label>
              <input className={inputCls} value={content.hero.cta1Text} onChange={e => update('hero', { ...content.hero, cta1Text: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>CTA1 링크</label>
              <input className={inputCls} value={content.hero.cta1Link} onChange={e => update('hero', { ...content.hero, cta1Link: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>CTA2 텍스트</label>
              <input className={inputCls} value={content.hero.cta2Text} onChange={e => update('hero', { ...content.hero, cta2Text: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>CTA2 링크</label>
              <input className={inputCls} value={content.hero.cta2Link} onChange={e => update('hero', { ...content.hero, cta2Link: e.target.value })} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Stats ── */}
      <CollapsibleSection title="숫자 통계" badge={`${content.stats.length}개 항목`}>
        <div className="space-y-3">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <input
                className={`${inputCls} w-20`}
                type="number"
                value={stat.end}
                onChange={e => {
                  const s = [...content.stats];
                  s[i] = { ...s[i], end: Number(e.target.value) };
                  update('stats', s);
                }}
                placeholder="숫자"
              />
              <input
                className={`${inputCls} w-16`}
                value={stat.suffix}
                onChange={e => {
                  const s = [...content.stats];
                  s[i] = { ...s[i], suffix: e.target.value };
                  update('stats', s);
                }}
                placeholder="접미사"
              />
              <input
                className={inputCls}
                value={stat.label}
                onChange={e => {
                  const s = [...content.stats];
                  s[i] = { ...s[i], label: e.target.value };
                  update('stats', s);
                }}
                placeholder="라벨"
              />
              <button onClick={() => {
                const s = content.stats.filter((_, j) => j !== i);
                update('stats', s);
              }} className="p-1.5 text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => update('stats', [...content.stats, { end: 0, suffix: '', label: '' }])}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> 항목 추가
          </button>
        </div>
      </CollapsibleSection>

      {/* ── Marquee ── */}
      <CollapsibleSection title="Marquee 텍스트" badge="스크롤 배너">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>상단 마키 텍스트</label>
            <textarea
              className={textareaCls}
              value={content.marquee.texts.join('\n')}
              onChange={e => update('marquee', { ...content.marquee, texts: e.target.value.split('\n').filter(Boolean) })}
              placeholder="줄바꿈으로 구분"
            />
            <p className="text-xs text-slate-400 mt-1">한 줄에 하나씩 입력</p>
          </div>
          <div>
            <label className={labelCls}>브랜드 마키 텍스트</label>
            <textarea
              className={textareaCls}
              value={content.marquee.brandTexts.join('\n')}
              onChange={e => update('marquee', { ...content.marquee, brandTexts: e.target.value.split('\n').filter(Boolean) })}
              placeholder="줄바꿈으로 구분"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Brands Showcase (통합 관리) ── */}
      <BrandLinkCard />

      {/* ── Global Network ── */}
      <CollapsibleSection title="글로벌 네트워크" badge={`${(content.globalNetwork?.cities || []).length}개 도시`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>상단 라벨</label>
              <input className={inputCls} value={content.globalNetwork.label} onChange={e => update('globalNetwork', { ...content.globalNetwork, label: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>제목</label>
              <input className={inputCls} value={content.globalNetwork.title} onChange={e => update('globalNetwork', { ...content.globalNetwork, title: e.target.value })} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>설명</label>
              <AiAssistButton value={content.globalNetwork.description} onApply={v => update('globalNetwork', { ...content.globalNetwork, description: v })} fieldLabel="글로벌 네트워크 설명" context="K-Beauty 글로벌 유통 네트워크 소개" />
            </div>
            <textarea className={textareaCls} value={content.globalNetwork.description} onChange={e => update('globalNetwork', { ...content.globalNetwork, description: e.target.value })} />
          </div>

          {/* Cities CRUD */}
          <div>
            <label className={labelCls}>도시 목록</label>
            <div className="space-y-2">
              {(content.globalNetwork?.cities || []).map((city, i) => (
                <div key={city.id || i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                  <GripVertical className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <input
                      className={`${inputCls} w-full`}
                      value={city.flag}
                      onChange={e => {
                        const cities = [...(content.globalNetwork.cities || [])];
                        cities[i] = { ...cities[i], flag: e.target.value };
                        update('globalNetwork', { ...content.globalNetwork, cities });
                      }}
                      placeholder="🇰🇷 국기"
                    />
                    <input
                      className={`${inputCls} w-full`}
                      value={city.label}
                      onChange={e => {
                        const cities = [...(content.globalNetwork.cities || [])];
                        cities[i] = { ...cities[i], label: e.target.value };
                        update('globalNetwork', { ...content.globalNetwork, cities });
                      }}
                      placeholder="도시명"
                    />
                    <input
                      className={`${inputCls} w-full`}
                      value={city.sub}
                      onChange={e => {
                        const cities = [...(content.globalNetwork.cities || [])];
                        cities[i] = { ...cities[i], sub: e.target.value };
                        update('globalNetwork', { ...content.globalNetwork, cities });
                      }}
                      placeholder="역할 (한국어)"
                    />
                    <input
                      className={`${inputCls} w-full`}
                      value={city.sub_en || ''}
                      onChange={e => {
                        const cities = [...(content.globalNetwork.cities || [])];
                        cities[i] = { ...cities[i], sub_en: e.target.value };
                        update('globalNetwork', { ...content.globalNetwork, cities });
                      }}
                      placeholder="역할 (English)"
                    />
                    <div className="col-span-2 md:col-span-3">
                      <ImageUploader
                        label="랜드마크 이미지"
                        value={city.image || ''}
                        onChange={url => {
                          const cities = [...(content.globalNetwork.cities || [])];
                          cities[i] = { ...cities[i], image: url };
                          update('globalNetwork', { ...content.globalNetwork, cities });
                        }}
                        folder="home/network"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-600 col-span-2 md:col-span-1">
                      <input
                        type="checkbox"
                        checked={city.primary || false}
                        onChange={e => {
                          const cities = (content.globalNetwork.cities || []).map((c, j) => ({
                            ...c,
                            primary: j === i ? e.target.checked : false,
                          }));
                          update('globalNetwork', { ...content.globalNetwork, cities });
                        }}
                        className="rounded"
                      />
                      본사 (HQ)
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      const cities = (content.globalNetwork.cities || []).filter((_, j) => j !== i);
                      update('globalNetwork', { ...content.globalNetwork, cities });
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const cities = [...(content.globalNetwork.cities || []), {
                    id: `city-${Date.now()}`,
                    flag: '',
                    label: '',
                    sub: '',
                    sub_en: '',
                    image: '',
                  }];
                  update('globalNetwork', { ...content.globalNetwork, cities });
                }}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> 도시 추가
              </button>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Process Steps ── */}
      <CollapsibleSection title="프로세스 (How We Work)" badge={`${(content.process || []).length}단계`}>
        <div className="space-y-3">
          {(content.process || []).map((step, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Step {step.number}</span>
                <button
                  onClick={() => {
                    const p = (content.process || []).filter((_, j) => j !== i);
                    update('process', p);
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={inputCls}
                  value={step.number}
                  onChange={e => {
                    const p = [...(content.process || [])];
                    p[i] = { ...p[i], number: e.target.value };
                    update('process', p);
                  }}
                  placeholder="번호 (01, 02...)"
                />
                <input
                  className={inputCls}
                  value={step.title}
                  onChange={e => {
                    const p = [...(content.process || [])];
                    p[i] = { ...p[i], title: e.target.value };
                    update('process', p);
                  }}
                  placeholder="제목"
                />
              </div>
              <div>
                <label className={labelCls}>설명 (한국어)</label>
                <textarea
                  className={textareaCls}
                  value={step.description}
                  onChange={e => {
                    const p = [...(content.process || [])];
                    p[i] = { ...p[i], description: e.target.value };
                    update('process', p);
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>설명 (English)</label>
                <textarea
                  className={textareaCls}
                  value={step.description_en}
                  onChange={e => {
                    const p = [...(content.process || [])];
                    p[i] = { ...p[i], description_en: e.target.value };
                    update('process', p);
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>이미지 URL</label>
                <ImageUploader
                  value={step.image}
                  onChange={url => {
                    const p = [...(content.process || [])];
                    p[i] = { ...p[i], image: url };
                    update('process', p);
                  }}
                  folder="home/process"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const p = [...(content.process || []), {
                number: String((content.process || []).length + 1).padStart(2, '0'),
                title: '',
                description: '',
                description_en: '',
                image: '',
              }];
              update('process', p);
            }}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> 단계 추가
          </button>
        </div>
      </CollapsibleSection>

      {/* ── Flagship ── */}
      <CollapsibleSection title="AZH 플래그십 섹션">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ImageUploader label="배경 이미지" value={content.flagship.image} onChange={url => update('flagship', { ...content.flagship, image: url })} folder="home/flagship" />
            <ImageUploader label="로고" value={content.flagship.logo} onChange={url => update('flagship', { ...content.flagship, logo: url })} folder="home/flagship" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>라벨</label>
              <input className={inputCls} value={content.flagship.label} onChange={e => update('flagship', { ...content.flagship, label: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>CTA 텍스트</label>
              <input className={inputCls} value={content.flagship.ctaText} onChange={e => update('flagship', { ...content.flagship, ctaText: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>제목 (줄바꿈: \n)</label>
            <textarea className={textareaCls} value={content.flagship.title} onChange={e => update('flagship', { ...content.flagship, title: e.target.value })} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>설명</label>
              <AiAssistButton value={content.flagship.description} onApply={v => update('flagship', { ...content.flagship, description: v })} fieldLabel="플래그십 브랜드 설명" context="AZH K-Beauty 헤어케어 브랜드" />
            </div>
            <textarea className={textareaCls} value={content.flagship.description} onChange={e => update('flagship', { ...content.flagship, description: e.target.value })} />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── CEO Quote ── */}
      <CollapsibleSection title="CEO 인용문">
        <div className="space-y-4">
          <ImageUploader label="배경 이미지" value={content.ceoQuote.bgImage} onChange={url => update('ceoQuote', { ...content.ceoQuote, bgImage: url })} folder="home/ceo" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>라벨</label>
              <input className={inputCls} value={content.ceoQuote.label} onChange={e => update('ceoQuote', { ...content.ceoQuote, label: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>저자</label>
              <input className={inputCls} value={content.ceoQuote.author} onChange={e => update('ceoQuote', { ...content.ceoQuote, author: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>인용문 (줄바꿈: \n)</label>
            <textarea className={textareaCls} value={content.ceoQuote.quote} onChange={e => update('ceoQuote', { ...content.ceoQuote, quote: e.target.value })} />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Closing CTA ── */}
      <CollapsibleSection title="클로징 CTA">
        <div className="space-y-4">
          <ImageUploader label="배경 이미지" value={content.closingCta.bgImage} onChange={url => update('closingCta', { ...content.closingCta, bgImage: url })} folder="home/closing" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>라벨</label>
              <input className={inputCls} value={content.closingCta.label} onChange={e => update('closingCta', { ...content.closingCta, label: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>버튼 텍스트</label>
              <input className={inputCls} value={content.closingCta.buttonText} onChange={e => update('closingCta', { ...content.closingCta, buttonText: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>제목 (줄바꿈: \n)</label>
            <textarea className={textareaCls} value={content.closingCta.title} onChange={e => update('closingCta', { ...content.closingCta, title: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>설명</label>
            <textarea className={textareaCls} value={content.closingCta.description} onChange={e => update('closingCta', { ...content.closingCta, description: e.target.value })} />
          </div>
        </div>
      </CollapsibleSection>

      {/* 하단 고정 저장 버튼 */}
      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            변경사항 저장
          </button>
        </div>
      )}
    </div>
  );
}
