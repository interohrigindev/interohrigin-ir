import { useState, useEffect } from 'react';
import { Languages, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { translatePageContent, isDeeplAvailable } from '../../lib/deepl';
import { savePageContent } from '../../hooks/usePageContent';
import { useToast } from './Toast';
import { useEnabledLanguages } from '../../hooks/useEnabledLanguages';
import { LANGUAGE_META } from '../../lib/languages';

interface AiTranslateAllProps {
  /** 번역 원본 (한국어 콘텐츠) */
  content: Record<string, unknown>;
  /** 현재 편집 중인 페이지 ID (home, about, brands, business, contact) */
  pageId: string;
  /** 번역 후 콜백 */
  onTranslated?: () => void;
}

export default function AiTranslateAll({ content, pageId, onTranslated }: AiTranslateAllProps) {
  const { toast } = useToast();
  const [translating, setTranslating] = useState(false);
  const [available, setAvailable] = useState(false);
  const [done, setDone] = useState(false);
  const [targetLang, setTargetLang] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { enabledLangs } = useEnabledLanguages();

  useEffect(() => {
    isDeeplAvailable().then(setAvailable);
  }, []);

  useEffect(() => {
    // 기본 타겟 언어 설정
    if (enabledLangs.length > 0 && !targetLang) {
      setTargetLang(enabledLangs[0]);
    }
  }, [enabledLangs, targetLang]);

  if (!available) return null;

  const handleTranslate = async (lang?: string) => {
    const toLang = lang || targetLang;
    if (!toLang) return;
    setTranslating(true);
    setDone(false);
    try {
      const translated = await translatePageContent(content, 'ko', toLang);
      await savePageContent(`${pageId}_${toLang}`, translated);
      setDone(true);
      onTranslated?.();
      const langName = LANGUAGE_META[toLang]?.nativeName || toLang.toUpperCase();
      toast(`${langName} 번역이 완료되어 저장되었습니다.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : '번역 실패', 'error');
    } finally {
      setTranslating(false);
    }
  };

  const handleTranslateAll = async () => {
    setTranslating(true);
    setDone(false);
    try {
      for (const lang of enabledLangs) {
        const translated = await translatePageContent(content, 'ko', lang);
        await savePageContent(`${pageId}_${lang}`, translated);
      }
      setDone(true);
      onTranslated?.();
      toast(`전체 ${enabledLangs.length}개 언어 번역이 완료되었습니다.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : '번역 실패', 'error');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-100">
      <Languages className="w-4 h-4 text-blue-500 shrink-0" />
      <span className="text-xs font-medium text-slate-700 shrink-0">번역:</span>
      <span className="text-[10px] text-slate-400 shrink-0">한국어 콘텐츠를 번역하여 해당 언어 페이지에 반영</span>

      {/* 타겟 언어 선택 */}
      <div className="relative ml-auto shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={translating}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
        >
          {targetLang ? `${(LANGUAGE_META[targetLang]?.deeplCode || targetLang).toUpperCase()}` : '언어'}
          <ChevronDown className="w-3 h-3" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden min-w-[140px] z-50">
            {enabledLangs.map(code => (
              <button
                key={code}
                onClick={() => { setTargetLang(code); setDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                  code === targetLang ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {code.toUpperCase()} {LANGUAGE_META[code]?.nativeName || code}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handleTranslate()}
        disabled={translating || !targetLang}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
      >
        {translating ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 번역 중...</>
        ) : done ? (
          <><CheckCircle className="w-3.5 h-3.5" /> 완료</>
        ) : (
          '번역 실행'
        )}
      </button>

      {enabledLangs.length > 1 && (
        <button
          onClick={handleTranslateAll}
          disabled={translating}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors shrink-0"
        >
          전체 번역
        </button>
      )}
    </div>
  );
}
