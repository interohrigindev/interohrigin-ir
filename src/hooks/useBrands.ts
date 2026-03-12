import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SharedBrand {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  logo: string;
  image: string;
  video: string;
  description: string;
  detail: string;
  website: string;
  smartstore: string;
  instagram: string;
  order: number;
  logoScale: number;
  visibleHome: boolean;
  visibleBrands: boolean;
  // 영문 필드 (번역)
  description_en: string;
  detail_en: string;
  category_en: string;
}

const BRAND_DEFAULTS: Omit<SharedBrand, 'id'> = {
  name: '', nameKo: '', category: '', logo: '', image: '', video: '',
  description: '', detail: '', website: '', smartstore: '', instagram: '',
  order: 0, logoScale: 1, visibleHome: true, visibleBrands: true,
  description_en: '', detail_en: '', category_en: '',
};

function normalize(raw: Record<string, unknown>, id: string): SharedBrand {
  return {
    ...BRAND_DEFAULTS,
    ...raw,
    id,
    // 이전 visible 필드 호환: visible → visibleHome + visibleBrands
    visibleHome: raw.visibleHome !== undefined ? Boolean(raw.visibleHome) : raw.visible !== undefined ? Boolean(raw.visible) : true,
    visibleBrands: raw.visibleBrands !== undefined ? Boolean(raw.visibleBrands) : raw.visible !== undefined ? Boolean(raw.visible) : true,
    logoScale: Number(raw.logoScale) || 1,
    order: Number(raw.order) || 0,
  } as SharedBrand;
}

/**
 * brand_items 컬렉션을 실시간 구독하는 공유 훅.
 * 어드민/랜딩 양쪽에서 사용합니다.
 */
export function useBrands() {
  const [brands, setBrands] = useState<SharedBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'brand_items'), orderBy('order', 'asc')),
      (snap) => {
        setBrands(snap.docs.map(d => normalize(d.data(), d.id)));
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  const updateBrand = async (id: string, data: Partial<Omit<SharedBrand, 'id'>>) => {
    await updateDoc(doc(db, 'brand_items', id), data);
  };

  const addBrand = async (data: Omit<SharedBrand, 'id'>) => {
    await addDoc(collection(db, 'brand_items'), data);
  };

  const removeBrand = async (id: string) => {
    await deleteDoc(doc(db, 'brand_items', id));
  };

  return { brands, loading, updateBrand, addBrand, removeBrand, BRAND_DEFAULTS };
}
