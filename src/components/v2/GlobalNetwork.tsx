import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface NetworkCity {
  id: string;
  flag: string;
  label: string;
  sub: string;
  sub_en?: string;
  image?: string;
  primary?: boolean;
}

/** Flag emoji → 2-letter country code (e.g. 🇰🇷 → KR) */
function flagToCode(flag: string): string {
  try {
    const points = [...flag];
    if (points.length < 2) return flag;
    const codes = points
      .filter(c => (c.codePointAt(0) ?? 0) >= 0x1F1E6)
      .map(c => String.fromCharCode((c.codePointAt(0)! - 0x1F1E6) + 65));
    return codes.length === 2 ? codes.join('') : flag;
  } catch {
    return flag;
  }
}

const defaultCities: NetworkCity[] = [
  { id: 'seoul', flag: '🇰🇷', label: 'Seoul', sub: 'HQ · Operations', sub_en: 'HQ · Operations', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=500&fit=crop&q=75', primary: true },
  { id: 'tokyo', flag: '🇯🇵', label: 'Tokyo', sub: 'Japan Distribution', sub_en: 'Japan Distribution', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&q=70' },
  { id: 'shanghai', flag: '🇨🇳', label: 'Shanghai', sub: 'China Market', sub_en: 'China Market', image: 'https://images.unsplash.com/photo-1537531383496-f4749b798367?w=600&h=400&fit=crop&q=70' },
  { id: 'hongkong', flag: '🇭🇰', label: 'Hong Kong', sub: 'APAC Commerce', sub_en: 'APAC Commerce', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&h=400&fit=crop&q=70' },
  { id: 'bangkok', flag: '🇹🇭', label: 'Bangkok', sub: 'SEA Marketing', sub_en: 'SEA Marketing', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop&q=70' },
  { id: 'hochiminh', flag: '🇻🇳', label: 'Ho Chi Minh', sub: 'Vietnam Ops', sub_en: 'Vietnam Ops', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop&q=70' },
  { id: 'singapore', flag: '🇸🇬', label: 'Singapore', sub: 'SEA Fulfillment', sub_en: 'SEA Fulfillment', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop&q=70' },
  { id: 'jakarta', flag: '🇮🇩', label: 'Jakarta', sub: 'Indonesia Distribution', sub_en: 'Indonesia Distribution', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600&h=400&fit=crop&q=70' },
  { id: 'la', flag: '🇺🇸', label: 'Los Angeles', sub: 'US West Coast', sub_en: 'US West Coast', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=400&fit=crop&q=70' },
];

interface Props {
  cities?: NetworkCity[];
  lang?: string;
}

export default function GlobalNetwork({ cities = defaultCities, lang = 'ko' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const hq = cities.find(c => c.primary) || cities[0];
  const satellites = cities.filter(c => !c.primary);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.nw-hq', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });

      gsap.from('.nw-pulse', {
        scaleY: 0, opacity: 0, duration: 0.5, stagger: 0.04, delay: 0.4,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });

      gsap.from('.nw-node', {
        y: 40, opacity: 0, scale: 0.95, duration: 0.6,
        stagger: 0.06, ease: 'power3.out', delay: 0.5,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });

      gsap.from('.nw-stat', {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.8,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cities]);

  const cityCount = cities.length;
  const countryCount = new Set(cities.map(c => c.flag)).size;

  return (
    <div ref={containerRef} className="relative">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── HQ Banner ── */}
      <div className="nw-hq relative overflow-hidden rounded-2xl mb-6 md:mb-8 group">
        {hq?.image && (
          <img
            src={hq.image}
            alt={hq.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/70" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gold-400/8 blur-3xl" />

        <div className="relative flex items-center gap-5 md:gap-8 px-6 md:px-10 py-6 md:py-8">
          {/* HQ Country Code Badge */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-3 rounded-full border border-brand-400/20 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-6 rounded-full border border-brand-400/10 animate-[ping_4s_ease-in-out_0.5s_infinite]" />
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-xl md:text-2xl font-black text-white tracking-wider">
                {flagToCode(hq?.flag || '')}
              </span>
            </div>
          </div>

          {/* HQ Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider">Active</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{hq?.label}</h3>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5 font-medium">
              {lang === 'en' && hq?.sub_en ? hq.sub_en : hq?.sub}
            </p>
          </div>

          {/* HQ Badge */}
          <div className="hidden md:flex items-center gap-2 ml-auto px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Headquarters</span>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      </div>

      {/* ── Connection Pulses ── */}
      <div className="flex justify-center gap-1 mb-6 md:mb-8">
        {satellites.map((_, i) => (
          <div
            key={i}
            className="nw-pulse w-1 h-4 md:h-6 rounded-full origin-top"
            style={{
              background: `linear-gradient(to bottom, rgba(99,102,241,${0.4 - i * 0.03}), transparent)`,
            }}
          />
        ))}
      </div>

      {/* ── City Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {satellites.map((city) => {
          const code = flagToCode(city.flag);
          return (
            <div
              key={city.id}
              className="nw-node group/card"
              onMouseEnter={() => setActive(city.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div
                className={`
                  relative overflow-hidden rounded-xl border aspect-[4/3]
                  transition-all duration-500 cursor-default
                  ${active === city.id
                    ? 'border-brand-500/50 shadow-xl shadow-brand-500/10 -translate-y-1.5'
                    : 'border-slate-700/30 hover:border-slate-600/40'
                  }
                `}
              >
                {/* Background landmark image */}
                {city.image ? (
                  <img
                    src={city.image}
                    alt={city.label}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                      active === city.id ? 'scale-110 brightness-[0.35]' : 'scale-100 brightness-[0.2]'
                    }`}
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800/80" />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    active === city.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15), transparent 70%)',
                  }}
                />

                {/* Top: Country code badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] md:text-xs font-black tracking-wider transition-all duration-500 backdrop-blur-sm ${
                      active === city.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/10 text-white/70 border border-white/10'
                    }`}
                  >
                    {code}
                  </span>
                </div>

                {/* Status dot */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full transition-colors duration-300 ${
                        active === city.id ? 'bg-emerald-400 animate-ping opacity-50' : 'bg-slate-500'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-300 ${
                        active === city.id ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                  </span>
                </div>

                {/* Content - positioned at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-10">
                  <h4 className="text-sm md:text-base font-bold text-white tracking-tight drop-shadow-md">
                    {city.label}
                  </h4>
                  <p
                    className={`text-[10px] md:text-xs font-medium leading-snug mt-0.5 transition-colors duration-500 ${
                      active === city.id ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {lang === 'en' && city.sub_en ? city.sub_en : city.sub}
                  </p>
                </div>

                {/* Bottom gradient on hover */}
                <div
                  className={`absolute bottom-0 inset-x-0 h-px transition-opacity duration-500 z-10 ${
                    active === city.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.4), transparent)' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Stats Bar ── */}
      <div className="mt-10 md:mt-14 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 md:pt-10">
          {[
            { value: String(cityCount), label: 'Cities', highlight: false },
            { value: `${countryCount}+`, label: 'Countries', highlight: false },
            { value: '4', label: 'Regions', highlight: false },
            { value: '24/7', label: 'Operations', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className="nw-stat text-center group cursor-default">
              <p
                className={`text-3xl md:text-4xl font-black tracking-tight transition-colors duration-300 ${
                  stat.highlight
                    ? 'text-gold-400 group-hover:text-gold-300'
                    : 'text-white group-hover:text-brand-300'
                }`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-[0.15em] group-hover:text-slate-400 transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
