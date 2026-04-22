import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PortfolioGallery {
  label: string;
  label_en: string;
  images: string[];
}

export interface PortfolioItem {
  id: string;
  brandName: string;
  thumbnail: string;
  heroImage: string;
  categories: string[];
  description: string;
  description_en: string;
  galleries: PortfolioGallery[];
  order: number;
  visible: boolean;
}

export const PORTFOLIO_DEFAULTS: Omit<PortfolioItem, 'id'> = {
  brandName: '',
  thumbnail: '',
  heroImage: '',
  categories: [],
  description: '',
  description_en: '',
  galleries: [],
  order: 0,
  visible: true,
};

function stripToken(url: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.delete('token');
    return u.toString();
  } catch {
    return url;
  }
}

function normalize(raw: Record<string, unknown>, id: string): PortfolioItem {
  return {
    ...PORTFOLIO_DEFAULTS,
    ...raw,
    id,
    thumbnail: stripToken(raw.thumbnail as string || ''),
    heroImage: stripToken(raw.heroImage as string || ''),
    categories: Array.isArray(raw.categories) ? raw.categories as string[] : [],
    galleries: Array.isArray(raw.galleries)
      ? (raw.galleries as PortfolioGallery[]).map(g => ({
          label: g.label || '',
          label_en: g.label_en || '',
          images: Array.isArray(g.images) ? g.images.map(stripToken) : [],
        }))
      : [],
    order: Number(raw.order) || 0,
    visible: raw.visible !== undefined ? Boolean(raw.visible) : true,
  } as PortfolioItem;
}

export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'portfolio_items'), orderBy('order', 'asc')),
      (snap) => {
        setItems(snap.docs.map(d => normalize(d.data(), d.id)));
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  const updateItem = async (id: string, data: Partial<Omit<PortfolioItem, 'id'>>) => {
    await updateDoc(doc(db, 'portfolio_items', id), data);
  };

  const addItem = async (data: Omit<PortfolioItem, 'id'>) => {
    await addDoc(collection(db, 'portfolio_items'), data);
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, 'portfolio_items', id));
  };

  return { items, loading, updateItem, addItem, removeItem, PORTFOLIO_DEFAULTS };
}
