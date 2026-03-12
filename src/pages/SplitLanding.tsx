import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

type Side = 'left' | 'right' | null;

export default function SplitLanding() {
  const [hovered, setHovered] = useState<Side>(null);
  const nav = useNavigate();

  const paneStyle = (side: Side) => ({
    flex: hovered === side ? 1.5 : hovered === null ? 1 : 0.7,
    transition: 'flex 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  const bgScale = (side: Side) => ({
    transform: hovered === side ? 'scale(1.06)' : 'scale(1)',
    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-black select-none">
      {/* I&C */}
      <div
        className="relative flex items-center justify-center cursor-pointer overflow-hidden min-h-[50vh] md:min-h-0"
        style={paneStyle('left')}
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => nav('/inc')}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=1000&fit=crop)', ...bgScale('left') }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-slate-900/90" />

        <div className="relative z-10 text-center text-white px-6 space-y-4">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto opacity-60" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-blue-300/70 font-semibold">Commerce & Brand</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9]">
            <img src="/logos/interohrigin.png" alt="" className="h-10 md:h-14 w-auto brightness-0 invert mx-auto mb-2" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">I&C</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm max-w-xs mx-auto leading-relaxed">글로벌 이커머스와 자체 브랜드 포트폴리오를 운영하는 커머스 부문</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs md:text-sm text-white/80">
            Enter I&C <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-0 h-full w-px bg-white/5" />
      </div>

      {/* Agency */}
      <div
        className="relative flex items-center justify-center cursor-pointer overflow-hidden min-h-[50vh] md:min-h-0"
        style={paneStyle('right')}
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => nav('/agency')}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&h=1000&fit=crop)', ...bgScale('right') }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/95 via-violet-950/80 to-black/90" />

        <div className="relative z-10 text-center text-white px-6 space-y-4">
          <Sparkles className="w-8 h-8 text-violet-400 mx-auto opacity-60" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-violet-300/70 font-semibold">Creative Agency</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9]">
            <img src="/logos/interohrigin.png" alt="" className="h-10 md:h-14 w-auto brightness-0 invert mx-auto mb-2" />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Agency</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm max-w-xs mx-auto leading-relaxed">데이터 기반 퍼포먼스와 크리에이티브를 결합하는 광고 에이전시</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs md:text-sm text-white/80">
            Enter Agency <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Center logo — desktop */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl p-3">
          <img src="/logos/interohrigin.png" alt="INTEROHRIGIN" className="w-full h-full object-contain brightness-0 invert" />
        </div>
      </div>

      {/* Unified site link */}
      <button
        onClick={() => nav('/v2')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/20 transition-all"
      >
        Unified Site (Option B) <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Bottom */}
      <p className="absolute bottom-3 inset-x-0 text-center text-[10px] text-white/15 tracking-wider z-10">
        &copy; {new Date().getFullYear()} Interohrigin Group
      </p>
    </div>
  );
}
