import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Shield, ArrowRight } from 'lucide-react';

const values = [
  { icon: Target, title: '데이터 중심', desc: '모든 의사결정은 시장 데이터와 소비자 인사이트에 기반합니다.' },
  { icon: Heart, title: '브랜드 파트너십', desc: '단순 유통이 아닌, 브랜드와 함께 성장하는 진정한 파트너십을 추구합니다.' },
  { icon: Zap, title: '빠른 실행력', desc: '트렌드를 선도하는 빠른 의사결정과 실행으로 시장 기회를 선점합니다.' },
  { icon: Shield, title: '신뢰와 투명성', desc: '정직한 비즈니스와 투명한 소통으로 장기적 신뢰를 구축합니다.' },
];

const timeline = [
  { year: '2016', title: '인터오리진아이엔씨 법인설립', desc: '브랜드 전문 유통 기업으로 출발' },
  { year: '2017', title: '색조&스킨케어 전문 브랜드 [JUST PURE] 런칭', desc: '자체 브랜드 사업 시작' },
  { year: '2018', title: '[AZH] 런칭', desc: 'CJ ENM 홈쇼핑 방송 런칭 후 전 수량 매진 · 올리브영 전국매장 입점 · 헤어&스킨케어 전문 브랜드' },
  { year: '2019', title: '[AZH] 롯데홈쇼핑 방송 런칭', desc: '399 by AZH 프리미엄 살롱 런칭' },
  { year: '2020', title: '[SHEMONBRED] 런칭', desc: 'OCN·JTBC·SBS·TV조선 다수 드라마 PPL 제작지원 · 남성 토탈 케어 [MR. PROJECT] 런칭 · AZH SSG/올리브영 입점' },
  { year: '2021', title: '[Baby Corner] 런칭', desc: '프리미엄 유아 화장품 브랜드 · AZH SBS/TV조선 PPL · 쿠팡 로켓배송 입점 · SHEMONBRED W컨셉/29CM/무신사 입점' },
  { year: '2022', title: '[AZH] 한경 BUSINESS 헤어 케어 부문 1위', desc: 'AZH 브라질 상파울루 드럭스토어 SER 입점 · 미국 LA 팝업스토어 · [HEYTAN] 런칭 · [BEGIN COFFEE] 런칭 · 사옥 이전' },
  { year: '2023', title: '[LA COLLECTA] 런칭', desc: 'SHEMONBRED CJ Onstyle/시코르 공식 입점 · AZH JTBC \'닥터 차정숙\' 제작지원' },
  { year: '2025', title: '[Tiberias] · [THING OF JACOB] · [DR.ASKL] 런칭', desc: '신규 브랜드 3종 동시 런칭으로 포트폴리오 확대' },
];

export default function IncAbout() {
  return (
    <>
      {/* Hero — 풀스크린 이미지 */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '65vh' }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1000&fit=crop&q=85"
          alt="About Interohrigin"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/60 to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-24 w-full">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-300 font-bold mb-4">About Us</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            브랜드 전문<br />유통 기업
          </h1>
          <p className="mt-5 text-white/60 max-w-2xl leading-relaxed">
            (주)인터오리진아이엔씨는 2003년 설립한 모기업 (주)인터오리진을 기반하여,
            코스메틱부터 주얼리까지 다양한 브랜드를 런칭한 브랜드 전문 유통 기업입니다.
          </p>
        </div>
      </section>

      {/* Mission — 이미지 + 텍스트 */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=85"
                alt="Our Mission"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <blockquote className="text-lg md:text-xl font-bold text-white leading-relaxed">
                    "브랜드의 가치를 발견하고,<br />세상에 전하는 것이 우리의 사명입니다."
                  </blockquote>
                  <p className="mt-3 text-sm text-white/60">— 오영근 대표이사</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-blue-600 font-bold mb-3">Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                코스메틱부터 주얼리까지,<br />브랜드의 가치를 만듭니다
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                (주)인터오리진아이엔씨는 브랜드 전문 유통 기업입니다. 2003년 설립한 모기업인 (주)인터오리진을
                기반하여, 국내 대기업부터 글로벌 브랜드의 다양한 광고 캠페인의 경험과 성공을 바탕으로
                시장의 변화를 빠르게 인식하고 브랜드를 개발하며 마케팅 역량을 발휘하여 성장해왔습니다.
              </p>
              <p className="text-slate-500 leading-relaxed">
                앞으로도 하루가 다르게 변화하는 시장을 주도하는 브랜드로 성장하기 위해
                혁신적인 트렌드 리딩그룹으로 끊임없이 도약할 것입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-600 font-bold mb-3">Core Values</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">핵심 가치</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={v.title} className="group relative overflow-hidden bg-white rounded-2xl p-8 border border-slate-100 hover:bg-blue-600 transition-colors duration-500">
                <div className="absolute top-3 right-5 text-[4rem] font-black text-slate-100 group-hover:text-blue-500 transition-colors duration-500 leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10">
                  <v.icon className="w-8 h-8 text-blue-600 group-hover:text-white mb-4 transition-colors duration-500" />
                  <h3 className="font-bold text-slate-900 group-hover:text-white mb-2 transition-colors duration-500">{v.title}</h3>
                  <p className="text-sm text-slate-500 group-hover:text-blue-100 leading-relaxed transition-colors duration-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History — 다크 배경 */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=800&fit=crop&q=80"
          alt="History"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-blue-400 font-bold mb-4">History</p>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight">HISTORY</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {timeline.map((t, i) => (
              <div key={t.year} className="relative flex gap-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border-2 border-white/20 bg-slate-900 group-hover:border-blue-500 transition-colors flex items-center justify-center mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30 group-hover:bg-blue-500 transition-colors" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/10 group-hover:bg-blue-500/40 transition-colors" />}
                </div>
                <div className="pb-10">
                  <p className="text-sm font-black text-blue-400 tracking-wider">{t.year}</p>
                  <h3 className="text-base font-bold text-white mt-1">{t.title}</h3>
                  <p className="text-sm text-white/50 mt-1.5 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-blue-600">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=400&fit=crop&q=80"
          alt="Partnership"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">파트너십을 시작하세요</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm">브랜드의 글로벌 성장을 위한 첫 걸음, 지금 시작하세요.</p>
          <Link to="/inc/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
            문의하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
