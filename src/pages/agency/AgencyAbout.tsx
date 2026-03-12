const stats = [
  { value: '200+', label: '프로젝트 수행' },
  { value: '50+', label: '파트너 브랜드' },
  { value: '15명', label: '전문 인력' },
  { value: '300%', label: '평균 ROAS' },
];

const team = [
  { name: '김민수', role: 'CEO / Strategy', desc: '15년 디지털 마케팅 경력' },
  { name: '이지은', role: 'Creative Director', desc: '글로벌 에이전시 출신 크리에이티브 디렉터' },
  { name: '박준혁', role: 'Performance Lead', desc: 'Google & Meta 공인 마케터' },
  { name: '최서연', role: 'Brand Strategist', desc: '브랜드 컨설팅 10년 경력' },
];

const awards = [
  { year: '2024', title: 'Google Premier Partner', org: 'Google' },
  { year: '2024', title: 'Meta Business Partner', org: 'Meta' },
  { year: '2023', title: '대한민국 디지털 광고 대상', org: '한국디지털광고협회' },
  { year: '2023', title: 'Best Performance Agency', org: 'Digital Marketing Awards' },
];

export default function AgencyAbout() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">About</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight max-w-2xl leading-tight">
            성과로 증명하는<br />에이전시
          </h1>
          <p className="mt-4 text-base text-white/40 max-w-xl leading-relaxed">
            Interohrigin Agency는 데이터 기반의 퍼포먼스 마케팅과 감각적인 크리에이티브를 결합하여 브랜드의 실질적인 성장을 이끕니다.
          </p>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-relaxed">
              "우리는 광고를 만들지 않습니다.<br />
              <span className="text-violet-400">브랜드의 성장을 만듭니다.</span>"
            </h2>
            <p className="mt-8 text-white/40 leading-relaxed">
              화려한 광고가 아닌 측정 가능한 성과, 감이 아닌 데이터, 일회성이 아닌 지속적 성장. 이것이 Interohrigin Agency가 추구하는 광고의 본질입니다.
              우리는 클라이언트의 비즈니스를 깊이 이해하고, 각 브랜드에 최적화된 전략을 설계합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-black text-violet-400">{s.value}</p>
              <p className="text-xs md:text-sm text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Team</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">핵심 팀</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name} className="border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-lg font-black text-white/20">{t.name[0]}</span>
                </div>
                <h3 className="font-bold text-white">{t.name}</h3>
                <p className="text-xs text-violet-400 font-semibold mt-1">{t.role}</p>
                <p className="text-sm text-white/30 mt-2">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Awards & Partners</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">수상 & 인증</h2>
          <div className="space-y-0 divide-y divide-white/5">
            {awards.map(a => (
              <div key={a.title} className="flex items-center justify-between py-5">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-mono text-white/20 w-12">{a.year}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">{a.title}</h3>
                    <p className="text-xs text-white/30 mt-0.5">{a.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-violet-600 to-fuchsia-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">함께 일해요</h2>
          <p className="text-violet-100 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            프로젝트 의뢰, 파트너십, 채용 등 어떤 문의든 환영합니다.
          </p>
          <div className="space-y-2 text-sm text-white/80">
            <p>biz@interohrigin.com</p>
            <p>02-6953-0000</p>
          </div>
        </div>
      </section>
    </>
  );
}
