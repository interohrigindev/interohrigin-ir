import { useState } from 'react';
import BrandCard from '../../components/v2/BrandCard';
import BrandModal, { type BrandData } from '../../components/v2/BrandModal';
import { usePageContent } from '../../hooks/usePageContent';
import { useBrands, type SharedBrand } from '../../hooks/useBrands';
import { useLang } from '../../contexts/LanguageContext';

const pageFallback = {
  hero: { image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=900&fit=crop&q=85', label: 'Brand Portfolio', title: 'Our Brands', description: '프리미엄 스킨케어부터 더마 코스메틱, 유아용품, 주얼리까지\n7개 뷰티 브랜드가 글로벌 시장을 선도합니다' },
  philosophy: { label: 'Brand Philosophy', title: '아름다움의 가치를\n전 세계에', description: '인터오리진 I&C의 모든 브랜드는 \'품질\', \'혁신\', \'지속가능성\'이라는 세 가지 원칙을 공유합니다. 까다로운 품질 관리를 통해 세계 어디서나 신뢰받는 K-Beauty 제품을 만들어갑니다.', pillars: ['품질', '혁신', '지속가능성'] },
};

function toBrandData(b: SharedBrand): BrandData {
  return {
    logo: b.logo,
    name: b.name,
    category: b.category,
    description: b.description,
    detail: b.detail,
    image: b.image,
    links: {
      website: b.website,
      smartstore: b.smartstore,
      instagram: b.instagram,
    },
  };
}

export default function Brands() {
  const { lang } = useLang();
  const { data: content } = usePageContent('brands', pageFallback, lang);
  const { brands: allBrands } = useBrands();
  const brands = allBrands.filter(b => b.visibleBrands).map(b => lang === 'en' ? {
    ...b,
    description: b.description_en || b.description,
    detail: b.detail_en || b.detail,
    category: b.category_en || b.category,
  } : b);
  const hero = { ...pageFallback.hero, ...(content.hero && typeof content.hero === 'object' && !Array.isArray(content.hero) ? content.hero : {}) };
  const philosophy = content.philosophy && typeof content.philosophy === 'object' && !Array.isArray(content.philosophy) && 'pillars' in content.philosophy
    ? { ...pageFallback.philosophy, ...content.philosophy }
    : pageFallback.philosophy;
  const [selected, setSelected] = useState<BrandData | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '60vh' }}>
        <img
          src={hero.image}
          alt="Brand Portfolio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-24 w-full">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-4">
            {hero.label}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            {hero.title}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
            {(hero.description ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </p>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {brands.slice(0, 4).map(b => (
              <BrandCard key={b.id} logo={b.logo} name={b.name} category={b.category} description={b.description} image={b.image} onClick={() => setSelected(toBrandData(b))} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.slice(4).map(b => (
              <BrandCard key={b.id} logo={b.logo} name={b.name} category={b.category} description={b.description} image={b.image} onClick={() => setSelected(toBrandData(b))} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="relative overflow-hidden bg-slate-900 py-24 md:py-32">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=600&fit=crop&q=80"
          alt="Brand Philosophy"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-6">
            {philosophy.label}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {(philosophy.title ?? '').split('\n').map((line: string, i: number) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </h2>
          <p className="mt-8 text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            {philosophy.description}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-sm mx-auto">
            {philosophy.pillars.map(v => (
              <div key={v} className="text-center">
                <div className="w-1 h-8 bg-brand-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Modal */}
      {selected && (
        <BrandModal brand={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
