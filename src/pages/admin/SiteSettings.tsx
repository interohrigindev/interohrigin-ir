import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../components/admin/Toast';
import ImageUploader from '../../components/admin/ImageUploader';
import { Save, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { saveGeminiApiKey, getGeminiApiKey, testGeminiConnection } from '../../lib/gemini';

interface SiteSettingsData {
  company: { name: string; nameEn: string; ceo: string; businessNumber: string; address: string; phone: string; email: string };
  social: { instagram: string; youtube: string; blog: string; kakao: string };
  footer: { copyright: string; description: string };
  logo: { main: string; white: string; favicon: string };
}

const defaultSettings: SiteSettingsData = {
  company: {
    name: '(주)인터오리진아이엔씨',
    nameEn: 'Interohrigin I&C',
    ceo: '오영근',
    businessNumber: '',
    address: '서울특별시 강남구 선릉로121길 5, 3층 (논현동, 인터오리진타워)',
    phone: '070-4188-0322',
    email: 'biz@interohrigin.com',
  },
  social: { instagram: '', youtube: '', blog: '', kakao: '' },
  footer: {
    copyright: '2024 Interohrigin I&C. All rights reserved.',
    description: '브랜드의 가치를 발견하고, 세상에 전하는 글로벌 뷰티 커머스 그룹',
  },
  logo: { main: '/logos/interohrigin-inc.png', white: '', favicon: '' },
};

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

function Section({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

/* ── API Key 관리 섹션 ── */
function ApiKeySection() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  const [testError, setTestError] = useState('');
  const [connectedModel, setConnectedModel] = useState('');

  useEffect(() => {
    getGeminiApiKey().then(key => {
      if (key) {
        setHasKey(true);
        setApiKey(key);
      }
    });
  }, []);

  const saveKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    try {
      await saveGeminiApiKey(apiKey.trim());
      setHasKey(true);
      toast('API 키가 저장되었습니다.');
    } catch {
      toast('저장 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  const testKey = async () => {
    setTesting(true);
    setTestResult(null);
    setTestError('');
    setConnectedModel('');
    try {
      const result = await testGeminiConnection(apiKey.trim());
      if (result.success) {
        setTestResult('success');
        setConnectedModel(result.model || '');
        toast(`API 연결 성공! (${result.model})`);
      } else {
        setTestResult('fail');
        setTestError(result.error || '알 수 없는 오류');
        toast(`API 연결 실패: ${result.error}`, 'error');
      }
    } catch (e) {
      setTestResult('fail');
      const msg = e instanceof Error ? e.message : '알 수 없는 오류';
      setTestError(msg);
      console.error('Gemini API test failed:', e);
      toast(`API 연결 실패: ${msg}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const maskedKey = apiKey ? apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4) : '';

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-900">Google Gemini AI</p>
            <p className="text-xs text-slate-500 mt-0.5">AI 번역, 카피 생성, 텍스트 개선 기능에 사용됩니다.</p>
            <p className="text-xs text-slate-400 mt-1">
              API 키 발급: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google AI Studio</a>
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Gemini API Key</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              className={inputCls}
              type={showKey ? 'text' : 'password'}
              value={showKey ? apiKey : (hasKey ? maskedKey : apiKey)}
              onChange={e => { setApiKey(e.target.value); setTestResult(null); }}
              placeholder="AIzaSy..."
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={testKey}
            disabled={testing || !apiKey.trim()}
            className="px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
          >
            {testing ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : '테스트'}
          </button>
          <button
            onClick={saveKey}
            disabled={saving || !apiKey.trim()}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '저장'}
          </button>
        </div>
        {testResult && (
          <div className={`flex items-center gap-1.5 mt-2 text-xs ${testResult === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
            {testResult === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {testResult === 'success' ? `API 연결 성공 — ${connectedModel} 모델로 AI 기능을 사용할 수 있습니다.` : `API 연결 실패: ${testError || '키를 확인해 주세요.'}`}
          </div>
        )}
      </div>

      {hasKey && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
          <CheckCircle className="w-3.5 h-3.5" />
          API 키가 설정되어 있습니다. AI 기능을 사용할 수 있습니다.
        </div>
      )}
    </div>
  );
}

export default function SiteSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'settings', 'site');
    return onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setSettings(prev => ({ ...prev, ...snap.data() as Partial<SiteSettingsData> }));
      } else {
        await setDoc(ref, { ...defaultSettings, updatedAt: new Date().toISOString() });
      }
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const update = <K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { ...settings, updatedAt: new Date().toISOString() });
      setDirty(false);
      toast('저장되었습니다.');
    } catch {
      toast('저장 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">사이트 설정</h1>
          <p className="text-sm text-slate-500 mt-0.5">회사 정보, API, SNS, 푸터 등 사이트 전반 설정</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {dirty ? '변경사항 저장' : '저장됨'}
        </button>
      </div>

      <Section title="AI 설정" icon={<Sparkles className="w-4 h-4 text-blue-500" />} defaultOpen>
        <ApiKeySection />
      </Section>

      <Section title="회사 정보">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>회사명 (한글)</label><input className={inputCls} value={settings.company.name} onChange={e => update('company', { ...settings.company, name: e.target.value })} /></div>
            <div><label className={labelCls}>회사명 (영문)</label><input className={inputCls} value={settings.company.nameEn} onChange={e => update('company', { ...settings.company, nameEn: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>대표이사</label><input className={inputCls} value={settings.company.ceo} onChange={e => update('company', { ...settings.company, ceo: e.target.value })} /></div>
            <div><label className={labelCls}>사업자등록번호</label><input className={inputCls} value={settings.company.businessNumber} onChange={e => update('company', { ...settings.company, businessNumber: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>주소</label><input className={inputCls} value={settings.company.address} onChange={e => update('company', { ...settings.company, address: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>전화번호</label><input className={inputCls} value={settings.company.phone} onChange={e => update('company', { ...settings.company, phone: e.target.value })} /></div>
            <div><label className={labelCls}>이메일</label><input className={inputCls} value={settings.company.email} onChange={e => update('company', { ...settings.company, email: e.target.value })} /></div>
          </div>
        </div>
      </Section>

      <Section title="SNS / 소셜 링크">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Instagram</label><input className={inputCls} value={settings.social.instagram} onChange={e => update('social', { ...settings.social, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
          <div><label className={labelCls}>YouTube</label><input className={inputCls} value={settings.social.youtube} onChange={e => update('social', { ...settings.social, youtube: e.target.value })} placeholder="https://youtube.com/..." /></div>
          <div><label className={labelCls}>Blog</label><input className={inputCls} value={settings.social.blog} onChange={e => update('social', { ...settings.social, blog: e.target.value })} placeholder="https://blog.naver.com/..." /></div>
          <div><label className={labelCls}>Kakao Channel</label><input className={inputCls} value={settings.social.kakao} onChange={e => update('social', { ...settings.social, kakao: e.target.value })} placeholder="https://pf.kakao.com/..." /></div>
        </div>
      </Section>

      <Section title="로고">
        <div className="grid grid-cols-3 gap-3">
          <ImageUploader label="메인 로고" value={settings.logo.main} onChange={url => update('logo', { ...settings.logo, main: url })} folder="settings/logo" />
          <ImageUploader label="화이트 로고" value={settings.logo.white} onChange={url => update('logo', { ...settings.logo, white: url })} folder="settings/logo" />
          <ImageUploader label="파비콘" value={settings.logo.favicon} onChange={url => update('logo', { ...settings.logo, favicon: url })} folder="settings/logo" />
        </div>
      </Section>

      <Section title="푸터">
        <div className="space-y-3">
          <div><label className={labelCls}>저작권 문구</label><input className={inputCls} value={settings.footer.copyright} onChange={e => update('footer', { ...settings.footer, copyright: e.target.value })} /></div>
          <div><label className={labelCls}>설명</label><input className={inputCls} value={settings.footer.description} onChange={e => update('footer', { ...settings.footer, description: e.target.value })} /></div>
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
