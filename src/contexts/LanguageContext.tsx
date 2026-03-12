import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type LangCode = 'ko' | 'en';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  /** 현재 언어에 맞는 경로 prefix ("" | "/en") */
  prefix: string;
  /** 다른 언어로 전환할 때 경로 생성 */
  switchPath: (targetLang: LangCode, currentPath: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  setLang: () => {},
  prefix: '',
  switchPath: () => '/',
});

export function LanguageProvider({ lang, children }: { lang: LangCode; children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LangCode>(lang);

  useEffect(() => { setCurrentLang(lang); }, [lang]);

  const prefix = currentLang === 'ko' ? '' : `/${currentLang}`;

  const switchPath = (targetLang: LangCode, currentPath: string) => {
    // 현재 경로에서 언어 prefix 제거
    const stripped = currentPath.replace(/^\/(en)/, '') || '/';
    if (targetLang === 'ko') return stripped;
    return `/${targetLang}${stripped === '/' ? '' : stripped}`;
  };

  return (
    <LanguageContext.Provider value={{ lang: currentLang, setLang: setCurrentLang, prefix, switchPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
