import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LanguageContextValue {
  lang: string;
  setLang: (lang: string) => void;
  /** 현재 언어에 맞는 경로 prefix ("" | "/en" | "/ja" ...) */
  prefix: string;
  /** 다른 언어로 전환할 때 경로 생성 */
  switchPath: (targetLang: string, currentPath: string) => string;
  /** 활성화된 언어 목록 */
  enabledLangs: string[];
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  setLang: () => {},
  prefix: '',
  switchPath: () => '/',
  enabledLangs: ['en'],
});

export function LanguageProvider({
  lang,
  children,
  enabledLangs = ['en'],
}: {
  lang: string;
  children: ReactNode;
  enabledLangs?: string[];
}) {
  const [currentLang, setCurrentLang] = useState<string>(lang);

  useEffect(() => { setCurrentLang(lang); }, [lang]);

  const prefix = currentLang === 'ko' ? '' : `/${currentLang}`;

  const switchPath = (targetLang: string, currentPath: string) => {
    // 현재 경로에서 언어 prefix 제거 (동적 언어코드 매칭)
    const langPattern = enabledLangs.length > 0
      ? new RegExp(`^\\/(${enabledLangs.join('|')})(?=\\/|$)`)
      : /^\/(en)(?=\/|$)/;
    const stripped = currentPath.replace(langPattern, '') || '/';
    if (targetLang === 'ko') return stripped;
    return `/${targetLang}${stripped === '/' ? '' : stripped}`;
  };

  return (
    <LanguageContext.Provider value={{ lang: currentLang, setLang: setCurrentLang, prefix, switchPath, enabledLangs }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
