import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

let genAI: GoogleGenerativeAI | null = null;
let cachedApiKey: string | null = null;
let resolvedModel: string | null = null;

/* ── 모델 fallback 목록 (우선순위 순) ── */
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

export function getResolvedModel(): string | null {
  return resolvedModel;
}

export function getModelCandidates(): readonly string[] {
  return MODEL_CANDIDATES;
}

/* ── API 키 관리 (Firestore 기반) ── */
export async function getGeminiApiKey(): Promise<string | null> {
  if (cachedApiKey) return cachedApiKey;
  try {
    const snap = await getDoc(doc(db, 'settings', 'api_keys'));
    if (snap.exists()) {
      cachedApiKey = snap.data().gemini_api_key || null;
    }
  } catch { /* ignore */ }
  return cachedApiKey;
}

export async function saveGeminiApiKey(key: string): Promise<void> {
  await setDoc(doc(db, 'settings', 'api_keys'), { gemini_api_key: key, updatedAt: new Date().toISOString() }, { merge: true });
  cachedApiKey = key;
  genAI = null;
  resolvedModel = null; // 키 변경 시 모델도 재탐색
}

async function getClient(): Promise<GoogleGenerativeAI> {
  const key = await getGeminiApiKey();
  if (!key) throw new Error('Gemini API 키가 설정되지 않았습니다. 사이트 설정에서 API 키를 입력하세요.');
  if (!genAI || cachedApiKey !== key) {
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

async function getModel() {
  const client = await getClient();

  // 이미 검증된 모델이 있으면 바로 사용
  if (resolvedModel) {
    return client.getGenerativeModel({ model: resolvedModel });
  }

  // fallback 체인: 순서대로 시도하여 사용 가능한 모델 탐색
  for (const candidate of MODEL_CANDIDATES) {
    try {
      const model = client.getGenerativeModel({ model: candidate });
      await model.generateContent('test');
      resolvedModel = candidate;
      console.log(`[Gemini] 모델 연결 성공: ${candidate}`);
      return model;
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      // 404(모델 없음) 또는 모델 관련 에러면 다음 후보로
      if (msg.includes('404') || msg.includes('no longer available') || msg.includes('not found') || msg.includes('not supported')) {
        console.warn(`[Gemini] ${candidate} 사용 불가, 다음 모델 시도...`);
        continue;
      }
      // 인증 에러 등 다른 문제는 즉시 throw
      throw e;
    }
  }
  throw new Error(`사용 가능한 Gemini 모델이 없습니다. 시도한 모델: ${MODEL_CANDIDATES.join(', ')}`);
}

/* ── API 키 + 모델 연결 테스트 (SiteSettings용) ── */
export async function testGeminiConnection(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const testClient = new GoogleGenerativeAI(apiKey);

  for (const candidate of MODEL_CANDIDATES) {
    try {
      const model = testClient.getGenerativeModel({ model: candidate });
      const result = await model.generateContent('Say "OK" in one word.');
      const text = result.response.text();
      if (text) {
        return { success: true, model: candidate };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('404') || msg.includes('no longer available') || msg.includes('not found') || msg.includes('not supported')) {
        continue;
      }
      return { success: false, error: msg || '알 수 없는 오류' };
    }
  }
  return { success: false, error: `사용 가능한 모델 없음 (${MODEL_CANDIDATES.join(', ')})` };
}

/* ── 지원 언어 ── */
export const SUPPORTED_LANGUAGES = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
} as const;

export type LangCode = keyof typeof SUPPORTED_LANGUAGES;

/* ── 다국어 텍스트 타입 ── */
export type LocalizedText = Partial<Record<LangCode, string>>;

/* ── AI 번역 ── */
export async function translateText(
  text: string,
  fromLang: LangCode,
  toLang: LangCode,
): Promise<string> {
  const model = await getModel();
  const prompt = `Translate the following ${SUPPORTED_LANGUAGES[fromLang]} text to ${SUPPORTED_LANGUAGES[toLang]}.
Keep the tone and style consistent. Preserve any \\n line breaks exactly as they are.
Only return the translated text, nothing else.

Text:
${text}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/* ── 페이지 콘텐츠 일괄 번역 ── */
export async function translatePageContent(
  content: Record<string, unknown>,
  fromLang: LangCode,
  toLang: LangCode,
): Promise<Record<string, unknown>> {
  const model = await getModel();

  // 텍스트 필드만 추출 (깊은 탐색)
  const textEntries = extractTextFields(content);
  if (textEntries.length === 0) return content;

  // 효율적 일괄 번역: 모든 텍스트를 하나의 프롬프트로
  const numbered = textEntries.map((e, i) => `[${i}] ${e.value}`).join('\n---\n');

  const prompt = `You are a professional translator. Translate ALL of the following numbered ${SUPPORTED_LANGUAGES[fromLang]} texts to ${SUPPORTED_LANGUAGES[toLang]}.

Rules:
- Maintain the original tone and brand voice
- Preserve line breaks (\\n) exactly
- Keep brand names (AZH, SHEMONBRED, LA COLLECTA, Tiberias, Baby Corner, THING OF JACOB, DR.ASKL, Interohrigin) unchanged
- Keep technical terms and proper nouns in their original form when appropriate
- Return ONLY the translations in the exact same numbered format [0], [1], etc.

Texts:
${numbered}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 번역 결과 파싱
  const translations = parseNumberedResponse(responseText, textEntries.length);

  // 원본에 번역 적용
  return applyTranslations(content, textEntries, translations, toLang);
}

/* ── 마케팅 카피 생성 ── */
export async function generateCopy(params: {
  type: 'brand_description' | 'service_description' | 'marketing_copy' | 'ceo_message' | 'hero_title' | 'custom';
  context?: string;
  brandName?: string;
  tone?: 'professional' | 'friendly' | 'luxury' | 'innovative';
  language?: LangCode;
  customPrompt?: string;
}): Promise<string> {
  const model = await getModel();
  const lang = params.language || 'ko';
  const tone = params.tone || 'professional';

  const toneGuide: Record<string, string> = {
    professional: '전문적이고 신뢰감 있는',
    friendly: '친근하고 따뜻한',
    luxury: '고급스럽고 세련된',
    innovative: '혁신적이고 미래지향적인',
  };

  const typePrompts: Record<string, string> = {
    brand_description: `Write a compelling brand description for "${params.brandName || 'the brand'}".
Context: ${params.context || 'K-Beauty brand'}.
Keep it concise (2-3 sentences).`,
    service_description: `Write a service description for "${params.context || 'the service'}".
Focus on benefits and value proposition. Keep it concise (2-3 sentences).`,
    marketing_copy: `Write marketing copy for: ${params.context || 'K-Beauty products'}.
Make it engaging and action-oriented. Keep it concise.`,
    ceo_message: `Write a professional CEO greeting message for a K-Beauty distribution company.
Context: ${params.context || 'Interohrigin I&C is a brand distribution company'}.
Write 3-4 paragraphs.`,
    hero_title: `Write a powerful hero section headline for: ${params.context || 'a global beauty commerce company'}.
Keep it short (under 10 words) and impactful.`,
    custom: params.customPrompt || 'Generate content.',
  };

  const prompt = `You are a ${toneGuide[tone]} copywriter for a K-Beauty company.
Write in ${SUPPORTED_LANGUAGES[lang]}.
${typePrompts[params.type]}
Only return the generated text, no explanations.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/* ── 텍스트 개선 ── */
export async function improveText(
  text: string,
  mode: 'rewrite' | 'shorten' | 'expand' | 'seo',
  language?: LangCode,
): Promise<string> {
  const model = await getModel();
  const lang = language || 'ko';

  const modePrompts: Record<string, string> = {
    rewrite: '더 매력적이고 세련되게 리라이팅해 주세요. 핵심 의미는 유지하세요.',
    shorten: '핵심 메시지를 유지하면서 더 간결하게 줄여 주세요.',
    expand: '더 상세하고 풍부하게 확장해 주세요. 구체적인 내용을 추가하세요.',
    seo: 'SEO에 최적화된 형태로 개선해 주세요. 자연스러운 키워드를 포함하세요.',
  };

  const prompt = `${modePrompts[mode]}
Write in ${SUPPORTED_LANGUAGES[lang]}.
Preserve any \\n line breaks.
Only return the improved text, nothing else.

Original text:
${text}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/* ── 유틸리티 함수들 ── */

interface TextEntry {
  path: string[];
  value: string;
}

function extractTextFields(obj: unknown, path: string[] = []): TextEntry[] {
  const entries: TextEntry[] = [];
  if (!obj || typeof obj !== 'object') return entries;

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key === 'updatedAt' || key === 'image' || key === 'images' || key === 'logo'
      || key === 'icon' || key === 'link' || key === 'links' || key === 'bgImage'
      || key === 'ctaLink' || key === 'buttonLink' || key === 'smartstore'
      || key === 'instagram' || key === 'website' || key === 'youtubeId') {
      continue; // URL/이미지/링크 필드 스킵
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      entries.push({ path: [...path, key], value });
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'string' && item.trim().length > 0) {
          entries.push({ path: [...path, key, String(i)], value: item });
        } else if (typeof item === 'object' && item !== null) {
          entries.push(...extractTextFields(item, [...path, key, String(i)]));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      entries.push(...extractTextFields(value, [...path, key]));
    }
  }

  return entries;
}

function parseNumberedResponse(response: string, expectedCount: number): string[] {
  const translations: string[] = [];
  const lines = response.split('\n');
  let current = '';
  let currentIdx = -1;

  for (const line of lines) {
    const match = line.match(/^\[(\d+)\]\s*(.*)/);
    if (match) {
      if (currentIdx >= 0) {
        translations[currentIdx] = current.trim();
      }
      currentIdx = parseInt(match[1]);
      current = match[2];
    } else if (currentIdx >= 0 && line.trim() !== '---') {
      current += '\n' + line;
    }
  }
  if (currentIdx >= 0) {
    translations[currentIdx] = current.trim();
  }

  // 누락된 항목 빈 문자열로 채우기
  for (let i = 0; i < expectedCount; i++) {
    if (!translations[i]) translations[i] = '';
  }

  return translations;
}

function applyTranslations(
  content: Record<string, unknown>,
  entries: TextEntry[],
  translations: string[],
  _toLang: LangCode,
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(content));

  entries.forEach((entry, i) => {
    if (!translations[i]) return;
    const { path } = entry;

    // 현재 값이 문자열이면 { ko: 원본, en: 번역 } 형태로 변환
    let current: unknown = result;
    for (let j = 0; j < path.length - 1; j++) {
      current = (current as Record<string, unknown>)[path[j]];
    }

    const lastKey = path[path.length - 1];
    const parentObj = current as Record<string, unknown>;

    // 번역된 텍스트로 직접 대체 (에디터 input은 단순 문자열을 기대)
    parentObj[lastKey] = translations[i];
  });

  return result;
}

/* ── Gemini 사용 가능 여부 확인 ── */
export async function isGeminiAvailable(): Promise<boolean> {
  const key = await getGeminiApiKey();
  return !!key;
}
