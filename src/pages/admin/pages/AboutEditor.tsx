import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useToast } from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import AiTranslateAll from '../../../components/admin/AiTranslateAll';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface AboutContent {
  hero: { image: string; label: string; title: string; description: string };
  vision: { title: string; description: string };
  mission: { title: string; description: string };
  ceo: { image: string; name: string; role: string; company: string; label: string; sectionTitle: string; paragraphs: string[] };
  values: { title: string; desc: string }[];
}

const defaultContent: AboutContent = {
  hero: {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1000&fit=crop&q=85',
    label: 'About Us',
    title: '인터오리진\nI&C',
    description: '2003년 설립한 모기업 (주)인터오리진을 기반으로, 코스메틱부터 주얼리까지 다양한 브랜드를 런칭한 브랜드 전문 유통 기업',
  },
  vision: {
    title: '브랜드의 가치를 발견하고\n세상에 전합니다',
    description: '국내 대기업부터 글로벌 브랜드의 다양한 광고 캠페인 경험과 성공을 바탕으로, 코스메틱부터 주얼리까지 다양한 브랜드를 런칭하며 성장하는 브랜드 전문 유통 기업이 되겠습니다.',
  },
  mission: {
    title: '광고 캠페인의 경험을 바탕으로\n브랜드 전문 유통을 선도',
    description: '2003년 설립한 모기업 (주)인터오리진의 마케팅 역량을 기반으로, 자체 브랜드 개발과 글로벌 유통을 통해 브랜드의 가치를 극대화합니다.',
  },
  ceo: {
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=85',
    name: '오영근 대표이사',
    role: '대표이사',
    company: '(주)인터오리진아이엔씨',
    label: 'CEO Message',
    sectionTitle: '대표이사\n인사말',
    paragraphs: [
      '안녕하십니까. (주)인터오리진아이엔씨 대표이사 오영근입니다.',
      '(주)인터오리진아이엔씨는 브랜드 전문 유통 기업입니다. 2003년 설립한 모기업인 (주)인터오리진을 기반하여, 국내 대기업부터 글로벌 브랜드의 다양한 광고 캠페인의 경험과 성공을 바탕으로 시장의 변화를 빠르게 인식하고 브랜드를 개발하며 마케팅 역량을 발휘하여 코스메틱부터 주얼리까지 다양한 브랜드를 런칭하며 성장해왔습니다.',
      '앞으로도 하루가 다르게 변화하는 시장을 주도하는 브랜드로 성장하기 위해 혁신적인 트렌드 리딩그룹으로 끊임없이 도약할 것입니다.',
      '감사합니다.\n오영근 대표이사',
    ],
  },
  values: [
    { title: 'Innovation', desc: '끊임없는 혁신으로 뷰티 산업의 새로운 기준을 세웁니다.' },
    { title: 'Transparency', desc: '파트너와 고객에게 투명한 비즈니스를 약속합니다.' },
    { title: 'Quality', desc: '최고 품질의 제품만을 선별하여 글로벌 시장에 전달합니다.' },
    { title: 'Global Reach', desc: '전 세계 소비자와 연결하는 글로벌 네트워크를 구축합니다.' },
  ],
};

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[80px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
        <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

export default function AboutEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'pages', 'about');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setContent(prev => ({ ...prev, ...snap.data() as Partial<AboutContent> }));
      } else {
        await setDoc(ref, { ...defaultContent, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', 'about'), { ...content, updatedAt: new Date().toISOString() });
      setDirty(false);
      toast('저장되었습니다.');
    } catch (err) {
      toast('저장 실패', 'error');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">About 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-0.5">회사소개 페이지 콘텐츠</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      <AiTranslateAll
        content={content as unknown as Record<string, unknown>}
        pageId="about"
      />

      <Section title="Hero 섹션" defaultOpen>
        <div className="space-y-3">
          <ImageUploader label="배경 이미지" value={content.hero.image} onChange={url => update('hero', { ...content.hero, image: url })} folder="about/hero" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={content.hero.label} onChange={e => update('hero', { ...content.hero, label: e.target.value })} /></div>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.hero.title} onChange={e => update('hero', { ...content.hero, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.hero.description} onChange={e => update('hero', { ...content.hero, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="Vision">
        <div className="space-y-3">
          <div><label className={labelCls}>제목</label><textarea className={textareaCls} value={content.vision.title} onChange={e => update('vision', { ...content.vision, title: e.target.value })} /></div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.vision.description} onChange={e => update('vision', { ...content.vision, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="Mission">
        <div className="space-y-3">
          <div><label className={labelCls}>제목</label><textarea className={textareaCls} value={content.mission.title} onChange={e => update('mission', { ...content.mission, title: e.target.value })} /></div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.mission.description} onChange={e => update('mission', { ...content.mission, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="CEO 메시지">
        <div className="space-y-3">
          <ImageUploader label="CEO 이미지" value={content.ceo.image} onChange={url => update('ceo', { ...content.ceo, image: url })} folder="about/ceo" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>이름</label><input className={inputCls} value={content.ceo.name} onChange={e => update('ceo', { ...content.ceo, name: e.target.value })} /></div>
            <div><label className={labelCls}>회사명</label><input className={inputCls} value={content.ceo.company} onChange={e => update('ceo', { ...content.ceo, company: e.target.value })} /></div>
          </div>
          <div>
            <label className={labelCls}>인사말 문단 (각 문단을 편집)</label>
            {content.ceo.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea className={`${textareaCls} flex-1`} value={p} onChange={e => {
                  const ps = [...content.ceo.paragraphs];
                  ps[i] = e.target.value;
                  update('ceo', { ...content.ceo, paragraphs: ps });
                }} />
                <button onClick={() => {
                  const ps = content.ceo.paragraphs.filter((_, j) => j !== i);
                  update('ceo', { ...content.ceo, paragraphs: ps });
                }} className="p-1.5 text-red-400 hover:text-red-600 self-start mt-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => update('ceo', { ...content.ceo, paragraphs: [...content.ceo.paragraphs, ''] })} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
              <Plus className="w-4 h-4" /> 문단 추가
            </button>
          </div>
        </div>
      </Section>

      <Section title="핵심 가치">
        <div className="space-y-3">
          {content.values.map((v, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <input className={`${inputCls} w-32`} value={v.title} onChange={e => {
                const vs = [...content.values];
                vs[i] = { ...vs[i], title: e.target.value };
                update('values', vs);
              }} placeholder="제목" />
              <input className={inputCls} value={v.desc} onChange={e => {
                const vs = [...content.values];
                vs[i] = { ...vs[i], desc: e.target.value };
                update('values', vs);
              }} placeholder="설명" />
              <button onClick={() => update('values', content.values.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => update('values', [...content.values, { title: '', desc: '' }])} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
            <Plus className="w-4 h-4" /> 항목 추가
          </button>
        </div>
      </Section>

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50">
            <Save className="w-4 h-4" /> 변경사항 저장
          </button>
        </div>
      )}
    </div>
  );
}
