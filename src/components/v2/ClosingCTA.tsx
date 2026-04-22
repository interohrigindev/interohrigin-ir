import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingCTA() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // 데스크톱: 풀 애니메이션
    mm.add('(min-width: 769px)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.closing-content > *', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        });

        if (btnRef.current) {
          gsap.to(btnRef.current, {
            scale: 1.04,
            duration: 1.2,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
      }, sectionRef);
      return () => ctx.revert();
    });

    // 모바일: 간소화
    mm.add('(max-width: 768px)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.closing-content > *', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=900&fit=crop&q=80"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-900/85" />

      <div className="closing-content relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-40 text-center">
        <span className="inline-block text-[10px] font-bold tracking-[0.5em] uppercase text-gold-400 mb-4 md:mb-6">
          Our Mission
        </span>

        <h2
          className="font-black text-white tracking-tight leading-[1.1]"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}
        >
          {lang !== 'ko' ? (
            <>Discovering brand value<br />and <span className="text-gold-400">sharing it</span><br />with the world.</>
          ) : (
            <>브랜드의 가치를 발견하고,<br /><span className="text-gold-400">세상에 전하는 것</span>이<br />우리의 사명입니다.</>
          )}
        </h2>

        <p className="mt-4 md:mt-8 text-sm md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
          {lang !== 'ko'
            ? 'Contact us for global K-Beauty distribution partnerships.'
            : '글로벌 K-Beauty 유통 파트너십에 대해 문의해 주세요.'}
        </p>

        <Link
          ref={btnRef}
          to="/contact"
          className="group relative inline-flex items-center gap-2 mt-8 md:mt-12 px-8 md:px-10 py-4 md:py-5 rounded-2xl border-2 border-gold-400 text-gold-400 font-bold text-sm overflow-hidden transition-colors duration-500 hover:text-slate-900"
        >
          <span className="absolute inset-0 bg-brand-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          <span className="relative z-10 flex items-center gap-2">
            {lang !== 'ko' ? 'Contact Us' : '문의하기'} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
