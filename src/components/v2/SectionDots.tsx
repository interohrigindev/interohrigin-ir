import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface SectionMeta {
  id: string;
  label: string;
}

interface Props {
  sections: SectionMeta[];
}

export default function SectionDots({ sections }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Portal to body to escape ScrollSmoother's transform
  return createPortal(
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-3">
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="group flex items-center gap-2"
          aria-label={s.label}
        >
          {/* Label — visible on hover or active */}
          <span
            className={`text-[10px] font-medium tracking-wide uppercase transition-all duration-300 ${
              i === active
                ? 'opacity-100 text-brand-600 translate-x-0'
                : 'opacity-0 group-hover:opacity-100 text-slate-400 translate-x-2 group-hover:translate-x-0'
            }`}
          >
            {s.label}
          </span>

          {/* Dot */}
          <span
            className={`block rounded-full transition-all duration-300 ${
              i === active
                ? 'w-3 h-3 bg-gold-400 shadow-lg shadow-gold-400/30'
                : 'w-2 h-2 bg-slate-300 group-hover:bg-slate-500'
            }`}
          />
        </button>
      ))}
    </nav>,
    document.body,
  );
}
