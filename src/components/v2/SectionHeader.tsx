interface Props {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, description, center = true }: Props) {
  return (
    <div className={center ? 'text-center' : ''}>
      {label && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{description}</p>
      )}
    </div>
  );
}
