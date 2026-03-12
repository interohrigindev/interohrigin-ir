import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const capabilities = [
  { num: '01', title: 'Performance Marketing', desc: '데이터 기반의 퍼포먼스 마케팅으로 측정 가능한 성과를 만듭니다.' },
  { num: '02', title: 'Brand Strategy', desc: '브랜드 아이덴티티 설계부터 포지셔닝 전략까지, 브랜드의 방향을 잡습니다.' },
  { num: '03', title: 'Creative Production', desc: '영상, 디자인, 카피라이팅 등 크리에이티브 전 영역을 커버합니다.' },
  { num: '04', title: 'Social & Content', desc: '소셜 미디어 운영과 콘텐츠 마케팅으로 브랜드 팬덤을 구축합니다.' },
];

const featured = [
  { title: 'K-Beauty Global Launch', client: 'BLANC', tag: 'Campaign' },
  { title: 'D2C Brand Building', client: 'AERO', tag: 'Branding' },
  { title: 'Performance Growth x3', client: 'DRIFT', tag: 'Performance' },
];

const marqueeText = 'STRATEGY — CREATIVE — PERFORMANCE — DATA — BRANDING — CONTENT — ';

export default function AgencyHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black" />
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-xs tracking-[0.4em] uppercase text-violet-400 font-semibold mb-6">Creative Agency</p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
            데이터와<br />
            크리에이티브의<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">완벽한 결합</span>
          </h1>
          <p className="mt-8 text-base md:text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
            퍼포먼스 마케팅의 정밀함과 크리에이티브의 힘을 결합하여 브랜드의 성장을 가속합니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Link to="/agency/work" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold text-sm hover:bg-violet-700 transition-colors">
              Work 보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/agency/services" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/5 transition-colors">
              서비스 소개
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 overflow-hidden">
            <div className="w-px h-full bg-white/40 animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                성과를 만드는<br />광고 에이전시
              </h2>
            </div>
            <p className="text-white/40 leading-relaxed">
              Interohrigin Agency는 데이터 분석 기반의 퍼포먼스 마케팅과 감각적인 크리에이티브를 결합하여, 브랜드가 실질적인 비즈니스 성과를 달성할 수 있도록 돕습니다. 우리는 단순한 광고가 아닌, 브랜드의 성장 파트너가 되겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-black border-y border-white/5 py-8 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[marqueeText, marqueeText].map((t, i) => (
            <span key={i} className="text-3xl md:text-5xl font-black text-white/[0.03] tracking-wider">{t}</span>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">우리가 하는 일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {capabilities.map(c => (
              <div key={c.num} className="bg-black p-8 md:p-10 group hover:bg-white/[0.02] transition-colors">
                <span className="text-xs font-mono text-violet-400/60">{c.num}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{c.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Featured</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">주요 프로젝트</h2>
            </div>
            <Link to="/agency/work" className="hidden md:inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(f => (
              <Link key={f.title} to="/agency/work" className="group block">
                <div className="aspect-[4/3] bg-white/5 rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white/10">{f.client}</span>
                  </div>
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-violet-400 font-semibold">{f.tag}</span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-xs text-white/30 mt-1">{f.client}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-violet-600 to-fuchsia-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">프로젝트가 있으신가요?</h2>
          <p className="text-violet-100 mb-8 max-w-md mx-auto text-sm">브랜드의 다음 단계를 함께 만들어 갑시다.</p>
          <Link to="/agency/about" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 rounded-lg font-semibold text-sm hover:bg-violet-50 transition-colors">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
