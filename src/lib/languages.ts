/**
 * 다국어 지원 — 언어 메타데이터 및 유틸리티
 *
 * Firestore `settings/languages` 문서 구조:
 *   { enabled: ['en', 'ja'], labels: { en: 'English', ja: '日本語' } }
 *
 * 문서 미존재 시 기본값: enabled = ['en']
 */

/** DeepL 지원 언어 기준 — 지원 가능한 전체 언어 목록 */
export const LANGUAGE_META: Record<string, { label: string; nativeName: string; deeplCode: string }> = {
  en: { label: 'English', nativeName: 'English', deeplCode: 'EN' },
  ja: { label: 'Japanese', nativeName: '日本語', deeplCode: 'JA' },
  zh: { label: 'Chinese', nativeName: '中文', deeplCode: 'ZH' },
  es: { label: 'Spanish', nativeName: 'Español', deeplCode: 'ES' },
  fr: { label: 'French', nativeName: 'Français', deeplCode: 'FR' },
  de: { label: 'German', nativeName: 'Deutsch', deeplCode: 'DE' },
  pt: { label: 'Portuguese', nativeName: 'Português', deeplCode: 'PT' },
  ru: { label: 'Russian', nativeName: 'Русский', deeplCode: 'RU' },
  id: { label: 'Indonesian', nativeName: 'Bahasa Indonesia', deeplCode: 'ID' },
  vi: { label: 'Vietnamese', nativeName: 'Tiếng Việt', deeplCode: 'VI' },
  th: { label: 'Thai', nativeName: 'ไทย', deeplCode: 'TH' },
  ar: { label: 'Arabic', nativeName: 'العربية', deeplCode: 'AR' },
};

/** 기본 활성 언어 (Firestore 문서 없을 때) */
export const DEFAULT_ENABLED_LANGS = ['en'];

/**
 * 로컬라이즈된 필드 접근 유틸리티
 *
 * getLocalizedField(brand, 'description', 'ja')
 *   → brand.description_ja || brand.description
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  lang: string,
): string {
  if (lang === 'ko') {
    return (obj[field] as string) || '';
  }
  const localized = obj[`${field}_${lang}`] as string | undefined;
  return localized || (obj[field] as string) || '';
}
