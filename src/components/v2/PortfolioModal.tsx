import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePortfolio, type PortfolioItem } from '../../hooks/usePortfolio';
import { useLang } from '../../contexts/LanguageContext';
import PortfolioDetail from './PortfolioDetail';

interface Props {
  onClose: () => void;
}

/* ── 반응형 열 수 계산 ── */
function useColumns() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(3);
      else if (w < 1024) setCols(4);
      else setCols(5);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

/* ── 그리드 셀 ── */
function GridCell({ item, isActive, onSelect }: { item: PortfolioItem; isActive: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
        isActive
          ? 'border-brand-500 ring-2 ring-brand-500/20 scale-[1.02]'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <img src={item.thumbnail} alt={item.brandName} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`absolute bottom-0 inset-x-0 p-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <p className="text-[11px] font-bold text-white truncate drop-shadow-md">{item.brandName}</p>
        <p className="text-[9px] text-white/70 truncate">{item.categories.join(' / ')}</p>
      </div>
      {isActive && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function PortfolioModal({ onClose }: Props) {
  const { lang } = useLang();
  const { items, loading } = usePortfolio();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const detailRef = useRef<HTMLDivElement>(null);
  const cols = useColumns();

  // Body scroll lock + Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', fn);
    };
  }, [onClose]);

  // Scroll to detail when expanded
  useEffect(() => {
    if (expandedId && detailRef.current) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }, [expandedId]);

  const visibleItems = useMemo(() => items.filter(i => i.visible), [items]);
  const allCategories = useMemo(() => Array.from(new Set(visibleItems.flatMap(i => i.categories))).sort(), [visibleItems]);
  const filteredItems = useMemo(
    () => categoryFilter ? visibleItems.filter(i => i.categories.includes(categoryFilter)) : visibleItems,
    [visibleItems, categoryFilter],
  );

  const expandedItem = expandedId ? visibleItems.find(i => i.id === expandedId) : null;

  const handleSelect = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  /* ── 행 단위로 아이템 분할 + 선택된 행 뒤에 detail 삽입 ── */
  const rows: { items: PortfolioItem[]; showDetail: boolean }[] = useMemo(() => {
    const result: { items: PortfolioItem[]; showDetail: boolean }[] = [];
    for (let i = 0; i < filteredItems.length; i += cols) {
      const rowItems = filteredItems.slice(i, i + cols);
      const hasExpanded = expandedId ? rowItems.some(it => it.id === expandedId) : false;
      result.push({ items: rowItems, showDetail: hasExpanded });
    }
    return result;
  }, [filteredItems, cols, expandedId]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {lang !== 'ko' ? 'Portfolio' : '포트폴리오'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang !== 'ko' ? `${filteredItems.length} projects` : `${filteredItems.length}개 프로젝트`}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 space-y-4">
          {/* Category filter */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${!categoryFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {lang !== 'ko' ? 'All' : '전체'}
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${categoryFilter === cat ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-slate-400">{lang !== 'ko' ? 'No portfolio items yet.' : '등록된 포트폴리오가 없습니다.'}</p>
            </div>
          )}

          {/* Grid rows with inline detail */}
          {!loading && rows.map((row, ri) => (
            <div key={ri}>
              {/* Grid row */}
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {row.items.map(item => (
                  <GridCell
                    key={item.id}
                    item={item}
                    isActive={item.id === expandedId}
                    onSelect={() => handleSelect(item.id)}
                  />
                ))}
              </div>

              {/* Inline detail — expands right below this row */}
              {row.showDetail && expandedItem && (
                <div ref={detailRef} className="mt-3 bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-200">
                  <PortfolioDetail item={expandedItem} lang={lang} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
