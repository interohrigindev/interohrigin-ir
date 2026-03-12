import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Brand {
  id: string;
  name: string;
  category?: string;
  description?: string;
  logo?: string;
  url?: string;
}

const brandImages: Record<string, string> = {
  'AZH': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=450&fit=crop&q=80',
  'Tiberias': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=450&fit=crop&q=80',
  'SHEMONBRED': 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=450&fit=crop&q=80',
  'Baby Corner': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=450&fit=crop&q=80',
  'LA COLLECTA': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop&q=80',
  'THING OF JACOB': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=450&fit=crop&q=80',
  'DR.ASKL': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=450&fit=crop&q=80',
};

const fallback: Brand[] = [
  { id: '1', name: 'AZH', category: 'Hair & Skincare', description: '헤어 & 스킨케어 분야의 프로페셔널하고 트렌디한 최상의 솔루션. 2018년 런칭, 미국·홍콩·일본·브라질·중동 글로벌 진출.', logo: '/logos/azh.png' },
  { id: '2', name: 'Tiberias', category: 'Skincare', description: '사해 미네랄 성분 하이엔드 스킨케어. 이스라엘 자연의 치유력을 담은 프리미엄 스킨케어.', logo: '/logos/tiberias.png' },
  { id: '3', name: 'SHEMONBRED', category: 'Color Cosmetics', description: '2020년 런칭. \'Select your colour\' — 본연의 아름다움을 추구하는 색조 전문 브랜드. 2023년 토탈 스킨케어로 확장.', logo: '/logos/shemonbred.png' },
  { id: '4', name: 'Baby Corner', category: 'Baby Cosmetics', description: '2021년 런칭. 아이를 위한 프리미엄 유아 화장품. EWG 그린 등급 원료, FSC 인증 패키지.', logo: '/logos/babycorner.png' },
  { id: '5', name: 'LA COLLECTA', category: 'Jewelry', description: '2023년 런칭. 아름다움을 수집하는 여성들을 위한 주얼리 컬렉션. 클래식 디자인과 젠더리스 무드.', logo: '/logos/lacollecta.png' },
  { id: '6', name: 'THING OF JACOB', category: 'Lifestyle Beauty', description: '일상 속 자기만의 아름다움을 표현하는 라이프스타일 뷰티 브랜드.', logo: '/logos/thingofjacob.png' },
  { id: '7', name: 'DR.ASKL', category: 'Derma Cosmetic', description: '피부과학 기반 더마 코스메틱 솔루션. 임상 테스트를 거친 안전하고 효과적인 스킨케어.', logo: '/logos/draskl.png' },
];

export default function IncBrands() {
  const [brands, setBrands] = useState<Brand[]>(fallback);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inc_brands'), snap => {
      if (!snap.empty) {
        setBrands(snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand)));
      }
    });
    return unsub;
  }, []);

  return (
    <>
      {/* Hero — AZH 이미지 풀스크린 */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '55vh' }}>
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=900&fit=crop&q=85"
          alt="Brand Portfolio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-20 w-full">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-400 font-bold mb-4">Our Brands</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            브랜드 포트폴리오
          </h1>
          <p className="mt-4 text-white/60 max-w-xl leading-relaxed">
            데이터 기반으로 기획하고 글로벌 시장에서 검증된 자체 브랜드 포트폴리오
          </p>
        </div>
      </section>

      {/* Brands Grid — image cards */}
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map(b => {
              const img = brandImages[b.name];
              return (
                <div
                  key={b.id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {img ? (
                      <img
                        src={img}
                        alt={b.name}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Logo over image */}
                    <div className="absolute bottom-4 left-5">
                      {b.logo && (
                        <img src={b.logo} alt={b.name} className="h-7 w-auto brightness-0 invert object-contain" />
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    {b.category && (
                      <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md mb-3">
                        {b.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{b.name}</h3>
                    {b.description && (
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{b.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="relative overflow-hidden bg-blue-900 py-20 md:py-28">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=600&fit=crop&q=80"
          alt="Brand Philosophy"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-blue-300 font-bold mb-6">Brand Philosophy</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">아름다움의 가치를 전 세계에</h2>
          <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            인터오리진 I&C의 모든 브랜드는 '품질', '혁신', '지속가능성'이라는 세 가지 원칙을 공유합니다.
          </p>
        </div>
      </section>
    </>
  );
}
