import { Link } from 'react-router-dom';
import { BarChart3, Palette, Film, Share2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: BarChart3,
    title: 'Performance Marketing',
    desc: '데이터 기반의 정밀한 타겟팅과 최적화로 광고 효율을 극대화합니다.',
    details: ['Google / Meta Ads', 'Programmatic Buying', 'ROAS 최적화', 'Attribution 분석'],
  },
  {
    icon: Palette,
    title: 'Brand Strategy & Design',
    desc: '브랜드의 핵심 가치를 발견하고 시각적 아이덴티티로 구현합니다.',
    details: ['브랜드 전략 수립', 'Visual Identity', 'Brand Guideline', 'Naming & Verbal Identity'],
  },
  {
    icon: Film,
    title: 'Creative Production',
    desc: '영상, 디자인, 카피까지 크리에이티브 전 영역을 커버합니다.',
    details: ['영상 제작 & 편집', '모션 그래픽', '광고 소재 디자인', '카피라이팅'],
  },
  {
    icon: Share2,
    title: 'Social & Content',
    desc: '소셜 미디어 전략 수립부터 콘텐츠 제작, 운영까지 원스톱 서비스를 제공합니다.',
    details: ['SNS 채널 운영', '콘텐츠 마케팅', '인플루언서 마케팅', '커뮤니티 관리'],
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: '비즈니스 목표와 시장 환경을 분석하고, 핵심 과제를 정의합니다.' },
  { step: '02', title: 'Strategy', desc: '데이터에 기반한 마케팅 전략과 크리에이티브 방향을 수립합니다.' },
  { step: '03', title: 'Execution', desc: '전략에 맞는 크리에이티브 제작과 미디어 집행을 실행합니다.' },
  { step: '04', title: 'Optimization', desc: '실시간 데이터 모니터링을 통해 지속적으로 성과를 개선합니다.' },
];

export default function AgencyServices() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Services</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">서비스</h1>
          <p className="mt-4 text-base text-white/40 max-w-xl">퍼포먼스와 크리에이티브를 결합한 풀-퍼널 마케팅 서비스를 제공합니다.</p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(s => (
              <div key={s.title} className="border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 transition-colors">
                <s.icon className="w-8 h-8 text-violet-400 mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.details.map(d => (
                    <li key={d} className="flex items-center gap-2 text-sm text-white/30">
                      <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Process</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">작업 프로세스</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                <span className="text-5xl font-black text-white/[0.04]">{p.step}</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">{p.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">프로젝트를 시작하세요</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto text-sm">브랜드의 성장을 위한 최적의 솔루션을 제안해 드립니다.</p>
          <Link to="/agency/about" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold text-sm hover:bg-violet-700 transition-colors">
            문의하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
