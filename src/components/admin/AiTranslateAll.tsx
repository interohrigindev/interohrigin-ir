import { useState, useEffect } from 'react';
import { Languages, Loader2, CheckCircle } from 'lucide-react';
import { translatePageContent, isGeminiAvailable } from '../../lib/gemini';
import { savePageContent } from '../../hooks/usePageContent';
import { useToast } from './Toast';

interface AiTranslateAllProps {
  /** 번역 원본 (한국어 콘텐츠) */
  content: Record<string, unknown>;
  /** 현재 편집 중인 페이지 ID (home, about, brands, business, contact) */
  pageId: string;
  /** 번역 후 콜백 (편집 폼에 번역 결과 반영할 필요 없음 — 별도 문서에 저장) */
  onTranslated?: () => void;
}

export default function AiTranslateAll({ content, pageId, onTranslated }: AiTranslateAllProps) {
  const { toast } = useToast();
  const [translating, setTranslating] = useState(false);
  const [available, setAvailable] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    isGeminiAvailable().then(setAvailable);
  }, []);

  if (!available) return null;

  const handleTranslate = async () => {
    setTranslating(true);
    setDone(false);
    try {
      const translated = await translatePageContent(content, 'ko', 'en');
      // 영문 문서에 저장 (pages/{pageId}_en)
      await savePageContent(`${pageId}_en`, translated);
      setDone(true);
      onTranslated?.();
      toast('영문 번역이 완료되어 저장되었습니다.');
    } catch (e) {
      toast(e instanceof Error ? e.message : '번역 실패', 'error');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-100">
      <Languages className="w-4 h-4 text-blue-500 shrink-0" />
      <span className="text-xs font-medium text-slate-700 shrink-0">영문 번역:</span>
      <span className="text-[10px] text-slate-400 shrink-0">현재 한국어 콘텐츠를 영어로 번역하여 /en 페이지에 반영합니다</span>
      <button
        onClick={handleTranslate}
        disabled={translating}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
      >
        {translating ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 번역 중...</>
        ) : done ? (
          <><CheckCircle className="w-3.5 h-3.5" /> 완료</>
        ) : (
          '영문 번역 실행'
        )}
      </button>
    </div>
  );
}
