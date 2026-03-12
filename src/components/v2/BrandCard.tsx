interface Props {
  logo: string;
  name: string;
  category: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export default function BrandCard({ logo, name, category, description, image, onClick }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-900"
      style={{ aspectRatio: '3/4' }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover scale-100"
        style={{ transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
      />
      {/* hover scale via JS workaround — use group-hover in parent */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 pointer-events-none" />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top: category badge */}
      <div className="absolute top-6 left-6">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
          {category}
        </span>
      </div>

      {/* 우상단: 상세보기 힌트 */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-brand-500 text-white">
          View ↗
        </span>
      </div>

      {/* Bottom: logo + name + description */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="mb-3">
          <img src={logo} alt={name} className="h-7 w-auto brightness-0 invert object-contain" />
        </div>
        <p className="text-base font-bold text-white tracking-tight">{name}</p>
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-28">
          <p className="mt-3 text-sm text-white/70 leading-relaxed">{description}</p>
        </div>
        <div className="mt-4 h-px bg-white/20 w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}
