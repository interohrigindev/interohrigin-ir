import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useCountUp from '../../hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

export interface Metric {
  end: number;
  suffix: string;
  label: string;
}

const defaultMetrics: Metric[] = [
  { end: 150, suffix: '+', label: '프로젝트 완료' },
  { end: 30, suffix: '+', label: '클라이언트' },
  { end: 8, suffix: '+', label: '경력 연수' },
  { end: 7, suffix: '', label: '뷰티 브랜드' },
];

function StatItem({ metric }: { metric: Metric }) {
  const { value, start } = useCountUp({ end: metric.end, duration: 2000 });
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: start,
    });

    return () => trigger.kill();
  }, [start]);

  return (
    <div ref={ref} className="text-center py-8 md:py-10">
      <p className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-none">
        {Math.floor(value)}
        <span className="text-brand-500">{metric.suffix}</span>
      </p>
      <p className="mt-3 text-sm md:text-base text-slate-500 font-medium tracking-wide">
        {metric.label}
      </p>
    </div>
  );
}

export default function CountUpStats({ metrics }: { metrics?: Metric[] }) {
  const items = metrics ?? defaultMetrics;
  return (
    <section className="bg-white py-20 md:py-28 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map(m => (
            <StatItem key={m.label} metric={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
