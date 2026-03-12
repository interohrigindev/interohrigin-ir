import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useToast } from '../../../components/admin/Toast';
import ImageUploader from '../../../components/admin/ImageUploader';
import AiTranslateAll from '../../../components/admin/AiTranslateAll';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactContent {
  hero: { image: string; label: string; title: string; description: string };
  info: { address: string; phone: string; email: string; businessHours: string };
  inquiryTypes: string[];
}

const defaultContent: ContactContent = {
  hero: {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop&q=80',
    label: 'Contact', title: '문의하기', description: '비즈니스 파트너십, 브랜드 유통, 기술 협업 등 어떤 문의든 환영합니다',
  },
  info: {
    address: '서울특별시 강남구 선릉로121길 5, 3층 (논현동, 인터오리진타워)',
    phone: '070-4188-0322',
    email: 'biz@interohrigin.com',
    businessHours: 'Mon – Fri: 09:00 – 18:00 (KST)',
  },
  inquiryTypes: ['Brand Distribution', 'Marketing Partnership', 'Logistics Inquiry', 'General Inquiry'],
};

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[80px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50">
        <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

export default function ContactEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<ContactContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'pages', 'contact');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setContent(prev => ({ ...prev, ...snap.data() as Partial<ContactContent> }));
      } else {
        await setDoc(ref, { ...defaultContent, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof ContactContent>(key: K, value: ContactContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', 'contact'), { ...content, updatedAt: new Date().toISOString() });
      setDirty(false); toast('저장되었습니다.');
    } catch { toast('저장 실패', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Contact 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-0.5">문의 페이지 콘텐츠</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      <AiTranslateAll
        content={content as unknown as Record<string, unknown>}
        pageId="contact"
      />

      <Section title="Hero 섹션" defaultOpen>
        <div className="space-y-3">
          <ImageUploader label="배경 이미지" value={content.hero.image} onChange={url => update('hero', { ...content.hero, image: url })} folder="contact/hero" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>라벨</label><input className={inputCls} value={content.hero.label} onChange={e => update('hero', { ...content.hero, label: e.target.value })} /></div>
            <div><label className={labelCls}>제목</label><input className={inputCls} value={content.hero.title} onChange={e => update('hero', { ...content.hero, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={content.hero.description} onChange={e => update('hero', { ...content.hero, description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="연락처 정보">
        <div className="space-y-3">
          <div><label className={labelCls}>주소</label><input className={inputCls} value={content.info.address} onChange={e => update('info', { ...content.info, address: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>전화번호</label><input className={inputCls} value={content.info.phone} onChange={e => update('info', { ...content.info, phone: e.target.value })} /></div>
            <div><label className={labelCls}>이메일</label><input className={inputCls} value={content.info.email} onChange={e => update('info', { ...content.info, email: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>영업시간</label><input className={inputCls} value={content.info.businessHours} onChange={e => update('info', { ...content.info, businessHours: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="문의 유형">
        <div className="space-y-2">
          {content.inquiryTypes.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputCls} value={t} onChange={e => {
                const ts = [...content.inquiryTypes];
                ts[i] = e.target.value;
                update('inquiryTypes', ts);
              }} />
              <button onClick={() => update('inquiryTypes', content.inquiryTypes.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => update('inquiryTypes', [...content.inquiryTypes, ''])} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium"><Plus className="w-4 h-4" /> 유형 추가</button>
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
