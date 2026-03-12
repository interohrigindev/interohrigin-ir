import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useToast } from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import AiTranslateAll from '../../../components/admin/AiTranslateAll';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface AreaItem {
  icon: string; title: string; description: string; image: string;
  features: string[];
}

interface BusinessContent {
  hero: { image: string; label: string; title: string; description: string };
  areas: AreaItem[];
  partnershipCta: { title: string; description: string; buttonText: string; buttonLink: string };
}

const defaultContent: BusinessContent = {
  hero: {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop&q=80',
    label: 'Business Areas', title: '사업 영역', description: '커머스, 마케팅, 물류, 테크놀로지를 아우르는 토탈 뷰티 커머스 솔루션',
  },
  areas: [
    { icon: 'ShoppingCart', title: 'Global Commerce', description: 'Amazon, Shopee, Qoo10 등 주요 글로벌 마켓플레이스 운영 및 D2C 자사몰 구축', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80', features: ['글로벌 마켓플레이스 운영', 'D2C 자사몰 구축', '크로스보더 커머스'] },
    { icon: 'Megaphone', title: 'Advertising & PPL', description: '인플루언서 마케팅, 브랜디드 콘텐츠, 방송 PPL 등 통합 광고 솔루션', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&q=80', features: ['인플루언서 마케팅', '브랜디드 콘텐츠', '방송 PPL'] },
    { icon: 'Truck', title: 'Logistics & Fulfillment', description: '글로벌 풀필먼트 센터와 원스톱 물류 시스템', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop&q=80', features: ['글로벌 풀필먼트', '원스톱 물류', '실시간 재고 관리'] },
    { icon: 'Cpu', title: 'AI & Tech', description: 'AI 기반 트렌드 분석, 수요 예측 및 마케팅 자동화', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&q=80', features: ['AI 트렌드 분석', '수요 예측', '마케팅 자동화'] },
  ],
  partnershipCta: { title: '비즈니스 파트너십 문의', description: '브랜드 유통, 마케팅 협업, 기술 파트너십 등 다양한 비즈니스 기회를 함께 만들어 갑니다.', buttonText: 'Contact Us', buttonLink: '/contact' },
};

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[80px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

function Section({ title, badge, children, defaultOpen = false }: { title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50">
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

export default function BusinessEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<BusinessContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'pages', 'business');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setContent(prev => ({ ...prev, ...snap.data() as Partial<BusinessContent> }));
      } else {
        await setDoc(ref, { ...defaultContent, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof BusinessContent>(key: K, value: BusinessContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', 'business'), { ...content, updatedAt: new Date().toISOString() });
      setDirty(false); toast('저장되었습니다.');
    } catch { toast('저장 실패', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Business 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-0.5">사업 영역 페이지 콘텐츠</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      <AiTranslateAll
        content={content as unknown as Record<string, unknown>}
        pageId="business"
      />

      <Section title="Hero 섹션" defaultOpen>
        <div className="space-y-3">
          <ImageUploader label="배경 이미지" value={content.hero.image} onChange={url => update('hero', { ...content.hero, image: url })} folder="business/hero" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={content.hero.label} onChange={e => update('hero', { ...content.hero, label: e.target.value })} /></div>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.hero.title} onChange={e => update('hero', { ...content.hero, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.hero.description} onChange={e => update('hero', { ...content.hero, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="사업 영역" badge={`${content.areas.length}개`}>
        <div className="space-y-4">
          {content.areas.map((area, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{area.title || `영역 ${i + 1}`}</span>
                <button onClick={() => update('areas', content.areas.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>제목</label><input className={inputCls} value={area.title} onChange={e => { const a = [...content.areas]; a[i] = { ...a[i], title: e.target.value }; update('areas', a); }} /></div>
                <div><label className={labelCls}>아이콘명</label><input className={inputCls} value={area.icon} onChange={e => { const a = [...content.areas]; a[i] = { ...a[i], icon: e.target.value }; update('areas', a); }} placeholder="Lucide 아이콘명" /></div>
              </div>
              <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={area.description} onChange={e => { const a = [...content.areas]; a[i] = { ...a[i], description: e.target.value }; update('areas', a); }} /></div>
              <ImageUploader label="이미지" value={area.image} onChange={url => { const a = [...content.areas]; a[i] = { ...a[i], image: url }; update('areas', a); }} folder="business/areas" />
              <div>
                <label className={labelCls}>세부 항목 (줄바꿈으로 구분)</label>
                <textarea className={textareaCls} value={area.features.join('\n')} onChange={e => { const a = [...content.areas]; a[i] = { ...a[i], features: e.target.value.split('\n').filter(Boolean) }; update('areas', a); }} />
              </div>
            </div>
          ))}
          <button onClick={() => update('areas', [...content.areas, { icon: '', title: '', description: '', image: '', features: [] }])} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium"><Plus className="w-4 h-4" /> 영역 추가</button>
        </div>
      </Section>

      <Section title="파트너십 CTA">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.partnershipCta.title} onChange={e => update('partnershipCta', { ...content.partnershipCta, title: e.target.value })} /></div>
            <div><label className={labelCls}>버튼 텍스트</label><input className={inputCls} value={content.partnershipCta.buttonText} onChange={e => update('partnershipCta', { ...content.partnershipCta, buttonText: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.partnershipCta.description} onChange={e => update('partnershipCta', { ...content.partnershipCta, description: e.target.value })} /></div>
        </div>
      </Section>

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50"><Save className="w-4 h-4" /> 변경사항 저장</button>
        </div>
      )}
    </div>
  );
}
