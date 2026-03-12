import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useToast } from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import AiTranslateAll from '../../../components/admin/AiTranslateAll';
import { Save, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBrands } from '../../../hooks/useBrands';

interface PhilosophyData {
  label: string;
  title: string;
  description: string;
  pillars: string[];
}

interface BrandsContent {
  hero: { image: string; label: string; title: string; description: string };
  philosophy: PhilosophyData;
}

const defaultContent: BrandsContent = {
  hero: {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=900&fit=crop&q=85',
    label: 'Brand Portfolio', title: 'Our Brands', description: '프리미엄 스킨케어부터 더마 코스메틱, 유아용품, 주얼리까지\n7개 뷰티 브랜드가 글로벌 시장을 선도합니다',
  },
  philosophy: {
    label: 'Brand Philosophy',
    title: '아름다움의 가치를\n전 세계에',
    description: '인터오리진 I&C의 모든 브랜드는 \'품질\', \'혁신\', \'지속가능성\'이라는 세 가지 원칙을 공유합니다. 까다로운 품질 관리를 통해 세계 어디서나 신뢰받는 K-Beauty 제품을 만들어갑니다.',
    pillars: ['품질', '혁신', '지속가능성'],
  },
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

function BrandLinkCard() {
  const { brands } = useBrands();
  const brandsCount = brands.filter(b => b.visibleBrands).length;
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-slate-900">브랜드 상세</h3>
          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Brands에 {brandsCount}개 표시</span>
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

export default function BrandsEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<BrandsContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'pages', 'brands');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        if (Array.isArray(raw.philosophy)) {
          raw.philosophy = defaultContent.philosophy;
        }
        setContent(prev => ({ ...prev, ...raw as Partial<BrandsContent> }));
      } else {
        await setDoc(ref, { ...defaultContent, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof BrandsContent>(key: K, value: BrandsContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', 'brands'), { ...content, updatedAt: new Date().toISOString() });
      setDirty(false); toast('저장되었습니다.');
    } catch { toast('저장 실패', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Brands 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-0.5">브랜드 소개 페이지 콘텐츠</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      <AiTranslateAll
        content={content as unknown as Record<string, unknown>}
        pageId="brands"
      />

      <Section title="Hero 섹션" defaultOpen>
        <div className="space-y-3">
          <ImageUploader label="배경 이미지" value={content.hero.image} onChange={url => update('hero', { ...content.hero, image: url })} folder="brands/hero" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={content.hero.label} onChange={e => update('hero', { ...content.hero, label: e.target.value })} /></div>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.hero.title} onChange={e => update('hero', { ...content.hero, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.hero.description} onChange={e => update('hero', { ...content.hero, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="브랜드 철학">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={content.philosophy.label} onChange={e => update('philosophy', { ...content.philosophy, label: e.target.value })} /></div>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.philosophy.title} onChange={e => update('philosophy', { ...content.philosophy, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.philosophy.description} onChange={e => update('philosophy', { ...content.philosophy, description: e.target.value })} /></div>
          <div>
            <label className={labelCls}>핵심 원칙 (줄바꿈으로 구분)</label>
            <textarea className={textareaCls} value={content.philosophy.pillars.join('\n')} onChange={e => update('philosophy', { ...content.philosophy, pillars: e.target.value.split('\n').filter(Boolean) })} />
          </div>
        </div>
      </Section>

      <BrandLinkCard />

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50"><Save className="w-4 h-4" /> 변경사항 저장</button>
        </div>
      )}
    </div>
  );
}
