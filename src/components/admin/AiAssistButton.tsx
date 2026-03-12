import { useState, useRef, useEffect } from 'react';
import { Sparkles, Languages, Wand2, FileText, Loader2, Check, X, RotateCcw } from 'lucide-react';
import { translateText, generateCopy, improveText, isGeminiAvailable, SUPPORTED_LANGUAGES, type LangCode } from '../../lib/gemini';

interface AiAssistButtonProps {
  value: string;
  onApply: (text: string) => void;
  fieldLabel?: string;
  context?: string;
  compact?: boolean;
}

type Mode = 'translate' | 'generate' | 'improve' | null;

export default function AiAssistButton({ value, onApply, fieldLabel, context, compact }: AiAssistButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [available, setAvailable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isGeminiAvailable().then(setAvailable);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!available) return null;

  const reset = () => { setMode(null); setResult(''); setError(''); };

  const handleTranslate = async (toLang: LangCode) => {
    if (!value.trim()) { setError('텍스트를 먼저 입력하세요.'); return; }
    setLoading(true); setError('');
    try {
      const translated = await translateText(value, 'ko', toLang);
      setResult(translated);
    } catch (e) { setError(e instanceof Error ? e.message : '번역 실패'); }
    finally { setLoading(false); }
  };

  const handleGenerate = async (type: 'brand_description' | 'marketing_copy' | 'hero_title') => {
    setLoading(true); setError('');
    try {
      const text = await generateCopy({ type, context: context || fieldLabel, language: 'ko' });
      setResult(text);
    } catch (e) { setError(e instanceof Error ? e.message : '생성 실패'); }
    finally { setLoading(false); }
  };

  const handleImprove = async (improveMode: 'rewrite' | 'shorten' | 'expand' | 'seo') => {
    if (!value.trim()) { setError('텍스트를 먼저 입력하세요.'); return; }
    setLoading(true); setError('');
    try {
      const text = await improveText(value, improveMode);
      setResult(text);
    } catch (e) { setError(e instanceof Error ? e.message : '개선 실패'); }
    finally { setLoading(false); }
  };

  const apply = () => {
    onApply(result);
    setOpen(false);
    reset();
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(!open); reset(); }}
        className={`inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors ${compact ? 'p-1' : 'px-2 py-1 text-xs font-medium'}`}
        title="AI 어시스턴트"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {!compact && 'AI'}
      </button>

      {open && (
        <div className="absolute z-50 top-full right-0 mt-1 w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              AI 어시스턴트
              {fieldLabel && <span className="text-slate-400 font-normal">— {fieldLabel}</span>}
            </p>
          </div>

          {/* Result view */}
          {result ? (
            <div className="p-4 space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={apply} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                  <Check className="w-3.5 h-3.5" /> 적용
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-medium rounded-lg hover:bg-slate-50">
                  <RotateCcw className="w-3.5 h-3.5" /> 다시
                </button>
                <button onClick={() => { setOpen(false); reset(); }} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="p-8 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-xs text-slate-400">AI가 처리 중입니다...</p>
            </div>
          ) : error ? (
            <div className="p-4 space-y-3">
              <p className="text-xs text-red-500 bg-red-50 rounded-lg p-3">{error}</p>
              <button onClick={reset} className="text-xs text-blue-500 hover:underline">다시 시도</button>
            </div>
          ) : !mode ? (
            /* Mode selection */
            <div className="p-3 space-y-1">
              <button onClick={() => setMode('translate')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors">
                <Languages className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">번역</p>
                  <p className="text-[10px] text-slate-400">다른 언어로 번역</p>
                </div>
              </button>
              <button onClick={() => setMode('generate')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors">
                <Wand2 className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">생성</p>
                  <p className="text-[10px] text-slate-400">AI로 새 텍스트 생성</p>
                </div>
              </button>
              <button onClick={() => setMode('improve')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors">
                <FileText className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">개선</p>
                  <p className="text-[10px] text-slate-400">기존 텍스트 리라이팅</p>
                </div>
              </button>
            </div>
          ) : mode === 'translate' ? (
            <div className="p-3 space-y-1">
              <button onClick={reset} className="text-[10px] text-slate-400 hover:text-slate-600 mb-1">&larr; 뒤로</button>
              {(Object.entries(SUPPORTED_LANGUAGES) as [LangCode, string][])
                .filter(([code]) => code !== 'ko')
                .map(([code, name]) => (
                  <button key={code} onClick={() => handleTranslate(code)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 text-left">
                    한국어 → {name}
                  </button>
                ))}
            </div>
          ) : mode === 'generate' ? (
            <div className="p-3 space-y-1">
              <button onClick={reset} className="text-[10px] text-slate-400 hover:text-slate-600 mb-1">&larr; 뒤로</button>
              <button onClick={() => handleGenerate('brand_description')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">브랜드 설명 생성</button>
              <button onClick={() => handleGenerate('marketing_copy')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">마케팅 카피 생성</button>
              <button onClick={() => handleGenerate('hero_title')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">히어로 타이틀 생성</button>
            </div>
          ) : mode === 'improve' ? (
            <div className="p-3 space-y-1">
              <button onClick={reset} className="text-[10px] text-slate-400 hover:text-slate-600 mb-1">&larr; 뒤로</button>
              <button onClick={() => handleImprove('rewrite')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">더 매력적으로 리라이팅</button>
              <button onClick={() => handleImprove('shorten')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">간결하게 줄이기</button>
              <button onClick={() => handleImprove('expand')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">더 상세하게 확장</button>
              <button onClick={() => handleImprove('seo')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">SEO 최적화</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
