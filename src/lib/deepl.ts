import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/* ── DeepL 지원 언어 매핑 ── */
const LANG_MAP: Record<string, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
  zh: 'ZH',
  es: 'ES',
};

/* ── API 키 관리 (Firestore 기반) ── */
let cachedApiKey: string | null = null;

export async function getDeeplApiKey(): Promise<string | null> {
  if (cachedApiKey) return cachedApiKey;
  try {
    const snap = await getDoc(doc(db, 'settings', 'api_keys'));
    if (snap.exists()) {
      cachedApiKey = snap.data().deepl_api_key || null;
    }
  } catch { /* ignore */ }
  return cachedApiKey;
}

export async function saveDeeplApiKey(key: string): Promise<void> {
  await setDoc(
    doc(db, 'settings', 'api_keys'),
    { deepl_api_key: key, updatedAt: new Date().toISOString() },
    { merge: true },
  );
  cachedApiKey = key;
}

export async function isDeeplAvailable(): Promise<boolean> {
  const key = await getDeeplApiKey();
  return !!key;
}

/* ── Cloud Function 프록시를 통한 DeepL API 호출 ── */
async function callDeeplProxy(endpoint: string, apiKey: string, body?: unknown) {
  const res = await fetch('/api/deepl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, apiKey, body }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 403) throw new Error('DeepL API 인증 실패 — 키를 확인하세요.');
    if (res.status === 456) throw new Error('DeepL 번역 할당량이 초과되었습니다.');
    throw new Error(`DeepL API 오류 (${res.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

/* ── 단일 텍스트 번역 ── */
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string,
): Promise<string> {
  const apiKey = await getDeeplApiKey();
  if (!apiKey) throw new Error('DeepL API 키가 설정되지 않았습니다. 사이트 설정에서 API 키를 입력하세요.');

  const sourceLang = LANG_MAP[fromLang] || fromLang.toUpperCase();
  const targetLang = LANG_MAP[toLang] || toLang.toUpperCase();

  const data = await callDeeplProxy('/v2/translate', apiKey, {
    text: [text],
    source_lang: sourceLang,
    target_lang: targetLang,
  });

  return data.translations[0].text;
}

/* ── 일괄 텍스트 번역 (배열) ── */
export async function translateTexts(
  texts: string[],
  fromLang: string,
  toLang: string,
): Promise<string[]> {
  if (texts.length === 0) return [];

  const apiKey = await getDeeplApiKey();
  if (!apiKey) throw new Error('DeepL API 키가 설정되지 않았습니다.');

  const sourceLang = LANG_MAP[fromLang] || fromLang.toUpperCase();
  const targetLang = LANG_MAP[toLang] || toLang.toUpperCase();

  const data = await callDeeplProxy('/v2/translate', apiKey, {
    text: texts,
    source_lang: sourceLang,
    target_lang: targetLang,
  });

  return data.translations.map((t: { text: string }) => t.text);
}

/* ── 페이지 콘텐츠 일괄 번역 ── */
export async function translatePageContent(
  content: Record<string, unknown>,
  fromLang: string,
  toLang: string,
): Promise<Record<string, unknown>> {
  const entries = extractTextFields(content);
  if (entries.length === 0) return content;

  const texts = entries.map(e => e.value);
  const translations = await translateTexts(texts, fromLang, toLang);

  return applyTranslations(content, entries, translations);
}

/* ── 연결 테스트 ── */
export async function testDeeplConnection(apiKey: string): Promise<{ success: boolean; usage?: { character_count: number; character_limit: number }; error?: string }> {
  try {
    const data = await callDeeplProxy('/v2/usage', apiKey);
    return {
      success: true,
      usage: {
        character_count: data.character_count,
        character_limit: data.character_limit,
      },
    };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : '알 수 없는 오류' };
  }
}

/* ── 유틸리티 ── */

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
      continue;
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

function applyTranslations(
  content: Record<string, unknown>,
  entries: TextEntry[],
  translations: string[],
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(content));

  entries.forEach((entry, i) => {
    if (!translations[i]) return;
    const { path } = entry;

    let current: unknown = result;
    for (let j = 0; j < path.length - 1; j++) {
      current = (current as Record<string, unknown>)[path[j]];
    }

    const lastKey = path[path.length - 1];
    (current as Record<string, unknown>)[lastKey] = translations[i];
  });

  return result;
}
