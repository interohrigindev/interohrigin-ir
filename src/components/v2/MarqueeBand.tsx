import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeBandProps {
  texts?: string[];
  separator?: string;
  speed?: number;        // base duration in seconds
  direction?: 1 | -1;    // 1 = left-to-right, -1 = right-to-left
  rotated?: boolean;
  bg?: string;            // tailwind bg class
  textColor?: string;     // tailwind text class
}

const DEFAULTS = [
  'GLOBAL BEAUTY',
  'K-BEAUTY',
  'COMMERCE',
  'BRANDING',
  'MARKETING',
  'LOGISTICS',
  'AI & TECH',
  'INTEROHRIGIN I&C',
];

export default function MarqueeBand({
  texts = DEFAULTS,
  separator = ' \u2014 ',
  speed = 30,
  direction = -1,
  rotated = true,
  bg = 'bg-brand-500',
  textColor = 'text-slate-900',
}: MarqueeBandProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const content = texts.join(separator) + separator;

  useLayoutEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    // xPercent: 0 → -50 (또는 반대) — 복제된 절반만큼 이동하면 원점 루프
    const from = direction === -1 ? 0 : -50;
    const to = direction === -1 ? -50 : 0;

    gsap.set(track, { xPercent: from });

    const tween = gsap.to(track, {
      xPercent: to,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    // 스크롤 방향에 따라 속도 변화
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.direction === 1 ? 1.5 : 0.3; // 아래로 스크롤=빠르게, 위로=느리게
        gsap.to(tween, { timeScale: v, duration: 0.3, overwrite: true });
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [speed, direction]);

  return (
    <div
      ref={wrapperRef}
      className={`${bg} overflow-hidden py-4 md:py-5 select-none`}
      style={rotated ? { transform: 'rotate(-2deg)', margin: '0 -2%', width: '104%' } : undefined}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {/* 원본 + 복제 2세트 = 끊김 없는 루프 */}
        {[0, 1].map(copy => (
          <span
            key={copy}
            className={`${textColor} text-sm md:text-base font-black tracking-[0.2em] uppercase shrink-0`}
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  );
}
