import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_ENABLED_LANGS } from '../lib/languages';

/**
 * Firestore `settings/languages` 문서를 실시간 구독하여
 * 현재 활성화된 언어 코드 배열을 반환합니다.
 *
 * 문서 미존재 시 기본값 ['en'] 반환.
 */
export function useEnabledLanguages() {
  const [enabledLangs, setEnabledLangs] = useState<string[]>(DEFAULT_ENABLED_LANGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'settings', 'languages');
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setEnabledLangs(data.enabled?.length ? data.enabled : DEFAULT_ENABLED_LANGS);
        } else {
          setEnabledLangs(DEFAULT_ENABLED_LANGS);
        }
        setLoading(false);
      },
      () => {
        setEnabledLangs(DEFAULT_ENABLED_LANGS);
        setLoading(false);
      },
    );
  }, []);

  return { enabledLangs, loading };
}
