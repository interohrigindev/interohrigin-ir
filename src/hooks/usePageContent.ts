import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CACHE_PREFIX = 'pageContent:v1:';

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch {
    /* quota exceeded or storage disabled — 캐시 실패는 무시 */
  }
}

/**
 * fallback 기본값 위에 Firestore 데이터를 얕은 deep merge.
 * Firestore에 없는 키는 fallback 값으로 유지됩니다.
 */
function mergeWithFallback<T extends Record<string, unknown>>(
  firestore: Record<string, unknown>,
  fallback: T,
): T {
  const result = { ...fallback } as Record<string, unknown>;
  for (const key of Object.keys(fallback)) {
    const fsVal = firestore[key];
    const fbVal = fallback[key];
    if (fsVal === undefined || fsVal === null) {
      continue;
    }
    if (
      Array.isArray(fbVal) && Array.isArray(fsVal) &&
      fbVal.length > 0 && typeof fbVal[0] === 'object' && fbVal[0] !== null
    ) {
      // 배열 내 객체: Firestore 값 위에 fallback 스키마를 merge
      const template = fbVal[0] as Record<string, unknown>;
      result[key] = (fsVal as Record<string, unknown>[]).map((item, i) => {
        const base = i < fbVal.length ? { ...(fbVal[i] as Record<string, unknown>) } : { ...template };
        return { ...base, ...item };
      });
    } else if (
      typeof fbVal === 'object' && fbVal !== null && !Array.isArray(fbVal) &&
      typeof fsVal === 'object' && fsVal !== null && !Array.isArray(fsVal)
    ) {
      result[key] = { ...fbVal, ...fsVal as Record<string, unknown> };
    } else {
      result[key] = fsVal;
    }
  }
  return result as T;
}

/**
 * Firestore `pages/{pageId}` 문서를 실시간 구독하고,
 * 데이터가 없으면 fallback을 반환합니다.
 * Firestore에 일부 필드만 있어도 fallback과 merge하여 안전하게 사용합니다.
 *
 * lang이 'ko'가 아니면 `pages/{pageId}_{lang}` 문서를 읽습니다.
 */
export function usePageContent<T extends Record<string, unknown>>(
  pageId: string,
  fallback: T,
  lang: string = 'ko',
): { data: T; loading: boolean; error: string | null } {
  const docId = lang === 'ko' ? pageId : `${pageId}_${lang}`;

  // 초기 state: localStorage 캐시 → fallback 순. 재방문자는 첫 렌더부터 실제 이미지 URL을 가짐.
  const [data, setData] = useState<T>(() => {
    const cached = readCache<Record<string, unknown>>(docId);
    return cached ? mergeWithFallback(cached, fallback) : fallback;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = doc(db, 'pages', docId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const fsData = snap.data();
          setData(mergeWithFallback(fsData, fallback));
          writeCache(docId, fsData);
        } else {
          setData(fallback);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`usePageContent(${pageId}):`, err);
        setError(err.message);
        setData(fallback);
        setLoading(false);
      },
    );
    return unsub;
    // fallback is static default — no need in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  return { data, loading, error };
}

/**
 * 페이지 콘텐츠를 Firestore에 저장합니다.
 */
export async function savePageContent(pageId: string, data: Record<string, unknown>) {
  const ref = doc(db, 'pages', pageId);
  await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}
