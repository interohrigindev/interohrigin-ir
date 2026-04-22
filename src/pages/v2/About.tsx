import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Target, Eye, Heart, Globe } from 'lucide-react';
import SectionHeader from '../../components/v2/SectionHeader';
import TimelineItem from '../../components/v2/TimelineItem';
import { usePageContent } from '../../hooks/usePageContent';
import { useLang } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../lib/languages';

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description?: string;
  title_en?: string;
  description_en?: string;
  order: number;
}

const aboutFallback = {
  hero: { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1000&fit=crop&q=85', label: 'About Us', title: '인터오리진\nI&C', description: '2003년 설립한 모기업 (주)인터오리진을 기반으로, 코스메틱부터 주얼리까지 다양한 브랜드를 런칭한 브랜드 전문 유통 기업' },
  vision: { title: '브랜드의 가치를 발견하고\n세상에 전합니다', description: '국내 대기업부터 글로벌 브랜드의 다양한 광고 캠페인 경험과 성공을 바탕으로, 코스메틱부터 주얼리까지 다양한 브랜드를 런칭하며 성장하는 브랜드 전문 유통 기업이 되겠습니다.' },
  mission: { title: '광고 캠페인의 경험을 바탕으로\n브랜드 전문 유통을 선도', description: '2003년 설립한 모기업 (주)인터오리진의 마케팅 역량을 기반으로, 자체 브랜드 개발과 글로벌 유통을 통해 브랜드의 가치를 극대화합니다.' },
  ceo: { image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=85', name: '오영근 대표이사', role: '대표이사', company: '(주)인터오리진아이엔씨', label: 'CEO Message', sectionTitle: '대표이사\n인사말', paragraphs: ['안녕하십니까. (주)인터오리진아이엔씨 대표이사 오영근입니다.', '(주)인터오리진아이엔씨는 브랜드 전문 유통 기업입니다.', '앞으로도 혁신적인 트렌드 리딩그룹으로 끊임없이 도약할 것입니다.', '감사합니다.\n오영근 대표이사'] },
  values: [
    { title: 'Innovation', desc: '끊임없는 혁신으로 뷰티 산업의 새로운 기준을 세웁니다.' },
    { title: 'Transparency', desc: '파트너와 고객에게 투명한 비즈니스를 약속합니다.' },
    { title: 'Quality', desc: '최고 품질의 제품만을 선별하여 글로벌 시장에 전달합니다.' },
    { title: 'Global Reach', desc: '전 세계 소비자와 연결하는 글로벌 네트워크를 구축합니다.' },
  ],
};

const defaultIcons = [Target, Eye, Heart, Globe];

const fallbackHistory: Omit<HistoryItem, 'id'>[] = [
  { year: '2016', title: '인터오리진아이엔씨 법인설립', description: '브랜드 전문 유통 기업으로 출발', order: 1 },
  { year: '2017', title: '색조&스킨케어 전문 브랜드 [JUST PURE] 런칭', description: '자체 브랜드 사업 시작', order: 2 },
  { year: '2018', title: '[AZH] 런칭', description: 'CJ ENM 홈쇼핑 방송 런칭 후 전 수량 매진 · 올리브영 전국매장 입점', order: 3 },
  { year: '2019', title: '[AZH] 롯데홈쇼핑 방송 런칭', description: '399 by AZH 프리미엄 살롱 런칭', order: 4 },
  { year: '2020', title: '[SHEMONBRED] 런칭', description: '다수 드라마 PPL 제작지원 · [MR. PROJECT] 런칭 · AZH SSG/올리브영 입점', order: 5 },
  { year: '2021', title: '[Baby Corner] 런칭', description: '프리미엄 유아 화장품 · AZH SBS/TV조선 PPL · 쿠팡 로켓배송 입점', order: 6 },
  { year: '2022', title: '[AZH] 한경 BUSINESS 헤어 케어 부문 1위', description: '[HEYTAN] 런칭 · 미국 LA 팝업스토어 · [BEGIN COFFEE] 런칭 · 사옥 이전', order: 7 },
  { year: '2023', title: '[LA COLLECTA] 런칭', description: 'SHEMONBRED CJ Onstyle/시코르 공식 입점 · AZH JTBC \'닥터 차정숙\' 제작지원', order: 8 },
  { year: '2025', title: '[Tiberias] · [THING OF JACOB] · [DR.ASKL] 런칭', description: '신규 브랜드 3종 동시 런칭', order: 9 },
];

export default function About() {
  const { lang } = useLang();
  const { data: content } = usePageContent('about', aboutFallback, lang);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'history_items'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, snap => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryItem));
      setHistory(items.length > 0 ? items : fallbackHistory.map((h, i) => ({ ...h, id: String(i) })));
    }, () => {
      setHistory(fallbackHistory.map((h, i) => ({ ...h, id: String(i) })));
    });
    return unsub;
  }, []);

  return (
    <>
      {/* Hero — cinematic full screen */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '70vh' }}>
        <img
          src={content.hero.image}
          alt="About Interohrigin"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-24 w-full">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-4">
            {content.hero.label}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            {(content.hero.title ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/60 max-w-2xl leading-relaxed">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Vision & Mission — split with accent colors */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-100">
            <div className="relative p-12 md:p-16 bg-slate-900 text-white">
              <div className="absolute top-0 right-0 text-[10rem] font-black text-white/5 leading-none select-none">V</div>
              <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-4">Vision</span>
              <h3 className="text-2xl md:text-3xl font-black leading-snug">
                {(content.vision.title ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}
              </h3>
              <p className="mt-6 text-slate-400 leading-relaxed">
                {content.vision.description}
              </p>
            </div>
            <div className="relative p-12 md:p-16 bg-brand-500 text-white">
              <div className="absolute top-0 right-0 text-[10rem] font-black text-gold-400/40 leading-none select-none">M</div>
              <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-brand-100 mb-4">Mission</span>
              <h3 className="text-2xl md:text-3xl font-black leading-snug">
                {(content.mission.title ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}
              </h3>
              <p className="mt-6 text-brand-100/70 leading-relaxed">
                {content.mission.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message — editorial layout */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '4/3' }}>
              <img
                src={content.ceo.image}
                alt="CEO"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-transparent" />
              <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl rounded-xl px-5 py-4 text-white border border-white/10">
                <p className="font-bold text-sm">{content.ceo.name}</p>
                <p className="text-xs text-white/60 mt-0.5">{content.ceo.company}</p>
              </div>
            </div>
            {/* Text */}
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-brand-500 mb-4">{content.ceo.label}</span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
                {(content.ceo.sectionTitle || '대표이사\n인사말').split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
              </h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                {content.ceo.paragraphs.map((p, i) => (
                  <p key={i} className={i === content.ceo.paragraphs.length - 1 ? 'font-bold text-slate-900 pt-2' : ''}>
                    {p.split('\n').map((line, j) => <span key={j}>{j > 0 && <br />}{line}</span>)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader label="Core Values" title={lang !== 'ko' ? 'Core Values' : '핵심 가치'} />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.values.map((v, i) => {
              const Icon = defaultIcons[i % defaultIcons.length];
              return (
              <div key={v.title} className="group relative overflow-hidden rounded-2xl bg-slate-50 p-8 hover:bg-slate-900 transition-colors duration-500">
                <div className="absolute top-4 right-6 text-[4rem] font-black text-slate-100 group-hover:text-slate-800 transition-colors duration-500 leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-500/20 flex items-center justify-center mb-6 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-brand-600 group-hover:text-gold-400 transition-colors duration-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white text-lg transition-colors duration-500">{v.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 group-hover:text-slate-400 leading-relaxed transition-colors duration-500">{v.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline — editorial style */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop&q=80"
          alt="History"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-4">History</span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight">HISTORY</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {history.map((h, i) => (
              <TimelineItem
                key={h.id}
                year={h.year}
                title={getLocalizedField(h as any, 'title', lang)}
                description={getLocalizedField(h as any, 'description', lang)}
                isLast={i === history.length - 1}
                dark
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
