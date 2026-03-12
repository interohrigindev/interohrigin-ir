import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface City {
  id: string;
  flag: string;
  label: string;
  sub: string;
  primary?: boolean;
}

const cities: City[] = [
  { id: 'seoul',      flag: '🇰🇷', label: 'Seoul',        sub: 'HQ · Operations',        primary: true },
  { id: 'tokyo',      flag: '🇯🇵', label: 'Tokyo',        sub: 'Japan Distribution' },
  { id: 'shanghai',   flag: '🇨🇳', label: 'Shanghai',     sub: 'China Market' },
  { id: 'hongkong',   flag: '🇭🇰', label: 'Hong Kong',    sub: 'APAC Commerce' },
  { id: 'bangkok',    flag: '🇹🇭', label: 'Bangkok',      sub: 'SEA Marketing' },
  { id: 'hochiminh',  flag: '🇻🇳', label: 'Ho Chi Minh',  sub: 'Vietnam Ops' },
  { id: 'singapore',  flag: '🇸🇬', label: 'Singapore',    sub: 'SEA Fulfillment' },
  { id: 'jakarta',    flag: '🇮🇩', label: 'Jakarta',      sub: 'Indonesia Distribution' },
  { id: 'la',         flag: '🇺🇸', label: 'Los Angeles',  sub: 'US West Coast' },
];

export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Seoul card first
      gsap.from('.city-card-primary', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true },
      });

      // Connection lines draw
      gsap.from('.network-line', {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        delay: 0.3,
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true },
      });

      // City cards pop in
      gsap.from('.city-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.5,
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const seoul = cities[0];
  const others = cities.slice(1);

  // Split into rows for layout
  const topRow = others.slice(0, 4);    // Tokyo, Shanghai, HK, Bangkok
  const bottomRow = others.slice(4);     // HCM, SG, Jakarta, LA

  return (
    <div ref={containerRef} className="relative">
      {/* Center: Seoul HQ card */}
      <div className="flex justify-center mb-8 md:mb-10">
        <div
          className="city-card-primary relative group"
          onMouseEnter={() => setHovered(seoul.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl px-6 md:px-8 py-5 md:py-6 text-center shadow-lg shadow-brand-500/20">
            {/* Pulse ring */}
            <div className="absolute -inset-2 rounded-3xl border-2 border-brand-400/30 animate-pulse" />
            <span className="text-2xl md:text-3xl">{seoul.flag}</span>
            <h3 className="mt-2 text-base md:text-lg font-bold text-white">{seoul.label}</h3>
            <p className="text-xs text-brand-100/70 font-medium mt-0.5">{seoul.sub}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <MapPin className="w-3 h-3 text-brand-100/50" />
              <span className="text-[10px] text-brand-100/50 font-semibold tracking-wider uppercase">Headquarters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection lines visual */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex items-center gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="network-line h-px w-6 md:w-10 bg-gradient-to-r from-brand-500/60 to-slate-400/30"
              style={{ transformOrigin: 'left center' }}
            />
          ))}
        </div>
      </div>

      {/* City grid */}
      <div className="space-y-3 md:space-y-4">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {topRow.map(city => (
            <div
              key={city.id}
              className="city-card group"
              onMouseEnter={() => setHovered(city.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`
                relative bg-slate-800/80 backdrop-blur-sm border rounded-xl px-4 py-4 md:px-5 md:py-5
                transition-all duration-300 cursor-default
                ${hovered === city.id
                  ? 'border-brand-500/50 bg-slate-800 shadow-lg shadow-brand-500/10 -translate-y-1'
                  : 'border-slate-700/50 hover:border-slate-600'
                }
              `}>
                {/* Active connection indicator */}
                <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-300 ${
                  hovered === city.id ? 'bg-brand-500' : 'bg-slate-700'
                }`} />

                <div className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0 mt-0.5">{city.flag}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-white truncate">{city.label}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">{city.sub}</p>
                  </div>
                </div>

                {/* Status dot */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {bottomRow.map(city => (
            <div
              key={city.id}
              className="city-card group"
              onMouseEnter={() => setHovered(city.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`
                relative bg-slate-800/80 backdrop-blur-sm border rounded-xl px-4 py-4 md:px-5 md:py-5
                transition-all duration-300 cursor-default
                ${hovered === city.id
                  ? 'border-brand-500/50 bg-slate-800 shadow-lg shadow-brand-500/10 -translate-y-1'
                  : 'border-slate-700/50 hover:border-slate-600'
                }
              `}>
                <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-300 ${
                  hovered === city.id ? 'bg-brand-500' : 'bg-slate-700'
                }`} />

                <div className="flex items-start gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0 mt-0.5">{city.flag}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-white truncate">{city.label}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">{city.sub}</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-6 md:gap-10 py-5 border-t border-slate-800">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-black text-white">9</p>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Cities</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-black text-white">8+</p>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Countries</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-black text-white">4</p>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Regions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-black text-gold-400">24/7</p>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Operations</p>
        </div>
      </div>
    </div>
  );
}
