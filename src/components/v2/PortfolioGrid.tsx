import type { PortfolioItem } from '../../hooks/usePortfolio';

interface Props {
  items: PortfolioItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function PortfolioGrid({ items, activeId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              isActive
                ? 'border-brand-500 ring-2 ring-brand-500/20 scale-[1.02]'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <img
              src={item.thumbnail}
              alt={item.brandName}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div
              className={`absolute bottom-0 inset-x-0 p-2 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <p className="text-[11px] font-bold text-white truncate drop-shadow-md">
                {item.brandName}
              </p>
              <p className="text-[9px] text-white/70 truncate">
                {item.categories.join(' / ')}
              </p>
            </div>
            {/* Active indicator */}
            {isActive && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
