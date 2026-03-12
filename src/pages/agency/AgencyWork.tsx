import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Work {
  id: string;
  title: string;
  client?: string;
  category?: string;
  thumbnail?: string;
  description?: string;
  year?: string;
}

const fallback: Work[] = [
  { id: '1', title: 'K-Beauty Global Campaign', client: 'BLANC', category: 'Campaign', year: '2024', description: '글로벌 K-뷰티 브랜드 런칭 캠페인' },
  { id: '2', title: 'D2C Brand Identity', client: 'AERO', category: 'Branding', year: '2024', description: 'D2C 라이프스타일 브랜드 아이덴티티 구축' },
  { id: '3', title: 'Performance Growth x3', client: 'DRIFT', category: 'Performance', year: '2023', description: 'ROAS 300% 달성 퍼포먼스 마케팅' },
  { id: '4', title: 'Social Media Strategy', client: 'COZY', category: 'Social', year: '2023', description: '인스타그램 팔로워 10만 달성 소셜 전략' },
  { id: '5', title: 'Product Launch Video', client: 'ECHO', category: 'Creative', year: '2024', description: '신제품 런칭 바이럴 영상 제작' },
  { id: '6', title: 'Rebranding Project', client: 'FORMA', category: 'Branding', year: '2023', description: '키친웨어 브랜드 리브랜딩 프로젝트' },
];

const categories = ['All', 'Campaign', 'Branding', 'Performance', 'Social', 'Creative'];

export default function AgencyWork() {
  const [works, setWorks] = useState<Work[]>(fallback);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'agency_works'), snap => {
      if (!snap.empty) {
        setWorks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Work)));
      }
    });
    return unsub;
  }, []);

  const filtered = filter === 'All' ? works : works.filter(w => w.category === filter);

  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold mb-3">Our Work</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">프로젝트</h1>
          <p className="mt-4 text-base text-white/40 max-w-xl">데이터와 크리에이티브로 만들어낸 성과들입니다.</p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-black sticky top-16 z-30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === c
                    ? 'bg-violet-600 text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(w => (
              <div key={w.id} className="group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/5 mb-4">
                  {w.thumbnail ? (
                    <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                      <span className="text-2xl font-black text-white/10">{w.client}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  {w.category && (
                    <span className="text-[10px] tracking-[0.2em] uppercase text-violet-400 font-semibold">{w.category}</span>
                  )}
                  {w.year && (
                    <span className="text-[10px] text-white/20">{w.year}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">{w.title}</h3>
                {w.client && <p className="text-xs text-white/30 mt-1">{w.client}</p>}
                {w.description && <p className="text-sm text-white/30 mt-2 leading-relaxed">{w.description}</p>}
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-white/30 py-20">해당 카테고리의 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>
    </>
  );
}
