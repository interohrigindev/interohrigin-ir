interface Props {
  year: string;
  title: string;
  description?: string;
  isLast?: boolean;
  dark?: boolean;
}

export default function TimelineItem({ year, title, description, isLast, dark = false }: Props) {
  return (
    <div className="relative pl-10 pb-10 group">
      {/* Line */}
      {!isLast && (
        <div className={`absolute left-[13px] top-7 w-px h-full transition-colors ${dark ? 'bg-white/10 group-hover:bg-brand-500/50' : 'bg-slate-200 group-hover:bg-brand-300'}`} />
      )}
      {/* Dot */}
      <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${dark ? 'border-white/20 bg-slate-900 group-hover:border-brand-500' : 'border-slate-200 bg-white group-hover:border-brand-500'}`}>
        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${dark ? 'bg-white/30 group-hover:bg-brand-500' : 'bg-slate-300 group-hover:bg-brand-500'}`} />
      </div>
      <span className={`text-sm font-black tracking-wider ${dark ? 'text-gold-400' : 'text-brand-600'}`}>{year}</span>
      <h4 className={`mt-1 font-bold text-base ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      {description && (
        <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-white/50' : 'text-slate-500'}`}>{description}</p>
      )}
    </div>
  );
}
