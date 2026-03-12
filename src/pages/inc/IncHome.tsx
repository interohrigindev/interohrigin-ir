import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShoppingBag, BarChart3, Users } from 'lucide-react';

const stats = [
  { value: '7', label: '뷰티 브랜드' },
  { value: '8개국+', label: '진출 국가' },
  { value: '20+', label: '년 경력' },
  { value: '100+', label: '리테일 파트너' },
];

const services = [
  { icon: Globe, title: '글로벌 유통', desc: '아마존, 쇼피, 라쿠텐 등 주요 마켓플레이스를 통한 글로벌 유통 네트워크 운영' },
  { icon: ShoppingBag, title: '자체 브랜드', desc: '시장 데이터 기반의 자체 브랜드 기획, 소싱, 런칭까지 풀사이클 브랜드 빌딩' },
  { icon: BarChart3, title: '데이터 분석', desc: '실시간 시장 트렌드 분석과 경쟁사 모니터링을 통한 전략적 의사결정 지원' },
  { icon: Users, title: '브랜드 매니지먼트', desc: '브랜드 입점부터 운영, 마케팅까지 원스톱 매니지먼트 서비스 제공' },
];

const brandLogos = [
  { src: '/logos/azh.png', name: 'AZH' },
  { src: '/logos/tiberias.png', name: 'Tiberias' },
  { src: '/logos/shemonbred.png', name: 'SHEMONBRED' },
  { src: '/logos/babycorner.png', name: 'Baby Corner' },
  { src: '/logos/lacollecta.png', name: 'LA COLLECTA' },
  { src: '/logos/thingofjacob.png', name: 'THING OF JACOB' },
  { src: '/logos/draskl.png', name: 'DR.ASKL' },
];

export default function IncHome() {
  return (
    <>
      {/* Hero — AZH 이미지 기반 풀스크린 */}
      <section className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left text */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-32 md:py-0 bg-white md:w-[48%]">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-600 font-bold mb-5">Commerce & Brand</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
            글로벌 커머스의<br />
            <span className="text-blue-600">새로운 기준</span>을<br />
            만들어 갑니다
          </h1>
          <p className="mt-6 text-base text-slate-500 max-w-sm leading-relaxed">
            20년 이상의 이커머스 노하우와 글로벌 네트워크로 브랜드의 해외 진출을 성공적으로 이끕니다.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/inc/brands" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
              브랜드 보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/inc/about" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-slate-900 transition-colors">
              회사 소개
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-slate-100 pt-10">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-blue-600">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — AZH 이미지 */}
        <div className="relative flex-1 min-h-[55vh] md:min-h-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&h=1800&fit=crop&q=90"
            alt="AZH — Hair & Skincare"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          {/* AZH 배지 */}
          <div className="absolute bottom-10 left-8">
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/10 flex items-center gap-4">
              <img src="/logos/azh.png" alt="AZH" className="h-6 w-auto brightness-0 invert" />
              <div>
                <p className="text-[10px] tracking-widest uppercase text-blue-400 font-semibold">Flagship Brand</p>
                <p className="text-sm text-white font-bold mt-0.5">Hair & Skincare</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logo Marquee */}
      <section className="bg-slate-50 py-10 overflow-hidden border-y border-slate-100">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...brandLogos, ...brandLogos].map((b, i) => (
            <div key={i} className="mx-10 shrink-0 h-10 flex items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src={b.src} alt={b.name} className="h-full w-auto max-w-[100px] object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Brand visual grid */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-600 font-bold mb-3">Brand Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">대표 브랜드</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { logo: '/logos/azh.png', name: 'AZH', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/shemonbred.png', name: 'SHEMONBRED', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/lacollecta.png', name: 'LA COLLECTA', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/tiberias.png', name: 'Tiberias', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/babycorner.png', name: 'Baby Corner', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/draskl.png', name: 'DR.ASKL', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=400&fit=crop&q=80' },
              { logo: '/logos/thingofjacob.png', name: 'THING OF JACOB', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=400&fit=crop&q=80' },
            ].slice(0, 4).map(b => (
              <Link key={b.name} to="/inc/brands" className="group relative overflow-hidden rounded-2xl" style={{ aspectRatio: '1' }}>
                <img src={b.img} alt={b.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <img src={b.logo} alt={b.name} className="h-5 w-auto brightness-0 invert object-contain" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/inc/brands" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              전체 브랜드 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 풀블리드 이미지 섹션 */}
      <section className="relative h-[55vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop&q=85"
          alt="K-Beauty Products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <p className="text-[10px] tracking-[0.4em] uppercase text-blue-300 font-bold mb-4">K-Beauty Commerce</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-xl">
              20년 이상의<br />마케팅 역량으로<br />브랜드 가치를 극대화
            </h2>
            <Link to="/inc/about" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors">
              회사 소개 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-600 font-bold mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">핵심 서비스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <div key={s.title} className="group relative overflow-hidden rounded-2xl bg-slate-50 p-8 hover:bg-blue-600 transition-colors duration-500">
                <div className="absolute top-0 right-0 text-[6rem] font-black text-slate-100 group-hover:text-blue-500 transition-colors duration-500 leading-none select-none pr-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10">
                  <s.icon className="w-8 h-8 text-blue-600 group-hover:text-white mb-4 transition-colors duration-500" />
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2 transition-colors duration-500">{s.title}</h3>
                  <p className="text-sm text-slate-500 group-hover:text-blue-100 leading-relaxed transition-colors duration-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=500&fit=crop&q=80"
          alt="Beauty"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">함께 성장할 준비가 되셨나요?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">글로벌 커머스 파트너십에 관심이 있으시면 언제든 연락주세요.</p>
          <Link to="/inc/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 transition-colors">
            문의하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
