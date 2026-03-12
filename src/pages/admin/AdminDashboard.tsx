import { useEffect, useState, type FormEvent } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Home, Edit2, Check, X } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  category?: string;
  description?: string;
  logo?: string;
}

interface Work {
  id: string;
  title: string;
  client?: string;
  category?: string;
  description?: string;
  thumbnail?: string;
  year?: string;
}

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description?: string;
  order: number;
}

type Tab = 'brands' | 'works' | 'history';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('brands');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Brand form
  const [bName, setBName] = useState('');
  const [bCat, setBCat] = useState('');
  const [bDesc, setBDesc] = useState('');
  const [bLogo, setBLogo] = useState('');

  // Work form
  const [wTitle, setWTitle] = useState('');
  const [wClient, setWClient] = useState('');
  const [wCat, setWCat] = useState('');
  const [wDesc, setWDesc] = useState('');
  const [wThumb, setWThumb] = useState('');
  const [wYear, setWYear] = useState('');

  // History form
  const [hYear, setHYear] = useState('');
  const [hTitle, setHTitle] = useState('');
  const [hDesc, setHDesc] = useState('');
  const [hOrder, setHOrder] = useState('');

  // Edit states
  const [editBrand, setEditBrand] = useState<string | null>(null);
  const [editWork, setEditWork] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'inc_brands'), snap => {
      setBrands(snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand)));
    });
    const u2 = onSnapshot(collection(db, 'agency_works'), snap => {
      setWorks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Work)));
    });
    const u3 = onSnapshot(query(collection(db, 'history_items'), orderBy('order', 'asc')), snap => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryItem)));
    }, () => {
      // collection might not exist yet
      setHistory([]);
    });
    return () => { u1(); u2(); u3(); };
  }, []);

  const addBrand = async (e: FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return;
    await addDoc(collection(db, 'inc_brands'), {
      name: bName.trim(),
      category: bCat.trim() || undefined,
      description: bDesc.trim() || undefined,
      logo: bLogo.trim() || undefined,
    });
    setBName(''); setBCat(''); setBDesc(''); setBLogo('');
  };

  const deleteBrand = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'inc_brands', id));
  };

  const addWork = async (e: FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim()) return;
    await addDoc(collection(db, 'agency_works'), {
      title: wTitle.trim(),
      client: wClient.trim() || undefined,
      category: wCat.trim() || undefined,
      description: wDesc.trim() || undefined,
      thumbnail: wThumb.trim() || undefined,
      year: wYear.trim() || undefined,
    });
    setWTitle(''); setWClient(''); setWCat(''); setWDesc(''); setWThumb(''); setWYear('');
  };

  const deleteWork = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'agency_works', id));
  };

  const addHistory = async (e: FormEvent) => {
    e.preventDefault();
    if (!hYear.trim() || !hTitle.trim()) return;
    await addDoc(collection(db, 'history_items'), {
      year: hYear.trim(),
      title: hTitle.trim(),
      description: hDesc.trim() || undefined,
      order: Number(hOrder) || history.length + 1,
    });
    setHYear(''); setHTitle(''); setHDesc(''); setHOrder('');
  };

  const deleteHistory = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'history_items', id));
  };

  const startEdit = (type: 'brand' | 'work' | 'history', item: Brand | Work | HistoryItem) => {
    if (type === 'brand') {
      const b = item as Brand;
      setEditBrand(b.id);
      setEditFields({ name: b.name, category: b.category || '', description: b.description || '', logo: b.logo || '' });
    } else if (type === 'work') {
      const w = item as Work;
      setEditWork(w.id);
      setEditFields({ title: w.title, client: w.client || '', category: w.category || '', description: w.description || '', thumbnail: w.thumbnail || '', year: w.year || '' });
    } else {
      const h = item as HistoryItem;
      setEditHistory(h.id);
      setEditFields({ year: h.year, title: h.title, description: h.description || '', order: String(h.order) });
    }
  };

  const saveEdit = async (type: 'brand' | 'work' | 'history', id: string) => {
    const colName = type === 'brand' ? 'inc_brands' : type === 'work' ? 'agency_works' : 'history_items';
    const data: Record<string, string | number | undefined> = {};
    Object.entries(editFields).forEach(([k, v]) => {
      if (k === 'order') {
        data[k] = Number(v) || 0;
      } else {
        data[k] = v.trim() || undefined;
      }
    });
    await updateDoc(doc(db, colName, id), data);
    setEditBrand(null);
    setEditWork(null);
    setEditHistory(null);
  };

  const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const tabCls = (active: boolean) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">IR</span>
            </div>
            <span className="font-bold text-sm">Admin</span>
          </div>
          <Link to="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <Home className="w-4 h-4" /> 사이트로
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('brands')} className={tabCls(tab === 'brands')}>I&C 브랜드</button>
          <button onClick={() => setTab('works')} className={tabCls(tab === 'works')}>Agency 프로젝트</button>
          <button onClick={() => setTab('history')} className={tabCls(tab === 'history')}>연혁</button>
        </div>

        {/* Brands */}
        {tab === 'brands' && (
          <div className="space-y-6">
            <form onSubmit={addBrand} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> 브랜드 추가</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input className={inputCls} placeholder="브랜드명 *" value={bName} onChange={e => setBName(e.target.value)} required />
                <input className={inputCls} placeholder="카테고리" value={bCat} onChange={e => setBCat(e.target.value)} />
              </div>
              <input className={`${inputCls} mb-3`} placeholder="설명" value={bDesc} onChange={e => setBDesc(e.target.value)} />
              <input className={`${inputCls} mb-3`} placeholder="로고 URL" value={bLogo} onChange={e => setBLogo(e.target.value)} />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">추가</button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">브랜드 목록 ({brands.length})</h3>
              </div>
              {brands.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-slate-400">등록된 브랜드가 없습니다.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {brands.map(b => (
                    <div key={b.id} className="px-6 py-4">
                      {editBrand === b.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input className={inputCls} value={editFields.name || ''} onChange={e => setEditFields({ ...editFields, name: e.target.value })} placeholder="브랜드명" />
                            <input className={inputCls} value={editFields.category || ''} onChange={e => setEditFields({ ...editFields, category: e.target.value })} placeholder="카테고리" />
                          </div>
                          <input className={inputCls} value={editFields.description || ''} onChange={e => setEditFields({ ...editFields, description: e.target.value })} placeholder="설명" />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit('brand', b.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"><Check className="w-3 h-3" /></button>
                            <button onClick={() => setEditBrand(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-slate-900">{b.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{[b.category, b.description].filter(Boolean).join(' · ')}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit('brand', b)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => deleteBrand(b.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Works */}
        {tab === 'works' && (
          <div className="space-y-6">
            <form onSubmit={addWork} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> 프로젝트 추가</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input className={inputCls} placeholder="프로젝트명 *" value={wTitle} onChange={e => setWTitle(e.target.value)} required />
                <input className={inputCls} placeholder="클라이언트" value={wClient} onChange={e => setWClient(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input className={inputCls} placeholder="카테고리" value={wCat} onChange={e => setWCat(e.target.value)} />
                <input className={inputCls} placeholder="연도" value={wYear} onChange={e => setWYear(e.target.value)} />
              </div>
              <input className={`${inputCls} mb-3`} placeholder="설명" value={wDesc} onChange={e => setWDesc(e.target.value)} />
              <input className={`${inputCls} mb-3`} placeholder="썸네일 URL" value={wThumb} onChange={e => setWThumb(e.target.value)} />
              <button type="submit" className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">추가</button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">프로젝트 목록 ({works.length})</h3>
              </div>
              {works.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-slate-400">등록된 프로젝트가 없습니다.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {works.map(w => (
                    <div key={w.id} className="px-6 py-4">
                      {editWork === w.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input className={inputCls} value={editFields.title || ''} onChange={e => setEditFields({ ...editFields, title: e.target.value })} placeholder="프로젝트명" />
                            <input className={inputCls} value={editFields.client || ''} onChange={e => setEditFields({ ...editFields, client: e.target.value })} placeholder="클라이언트" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input className={inputCls} value={editFields.category || ''} onChange={e => setEditFields({ ...editFields, category: e.target.value })} placeholder="카테고리" />
                            <input className={inputCls} value={editFields.year || ''} onChange={e => setEditFields({ ...editFields, year: e.target.value })} placeholder="연도" />
                          </div>
                          <input className={inputCls} value={editFields.description || ''} onChange={e => setEditFields({ ...editFields, description: e.target.value })} placeholder="설명" />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit('work', w.id)} className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-md hover:bg-violet-700"><Check className="w-3 h-3" /></button>
                            <button onClick={() => setEditWork(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-slate-900">{w.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{[w.client, w.category, w.year].filter(Boolean).join(' · ')}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit('work', w)} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => deleteWork(w.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="space-y-6">
            <form onSubmit={addHistory} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> 연혁 추가</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <input className={inputCls} placeholder="연도 *" value={hYear} onChange={e => setHYear(e.target.value)} required />
                <input className={inputCls} placeholder="제목 *" value={hTitle} onChange={e => setHTitle(e.target.value)} required />
                <input className={inputCls} placeholder="정렬순서 (숫자)" type="number" value={hOrder} onChange={e => setHOrder(e.target.value)} />
              </div>
              <input className={`${inputCls} mb-3`} placeholder="설명" value={hDesc} onChange={e => setHDesc(e.target.value)} />
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">추가</button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">연혁 목록 ({history.length})</h3>
              </div>
              {history.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-slate-400">등록된 연혁이 없습니다.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map(h => (
                    <div key={h.id} className="px-6 py-4">
                      {editHistory === h.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <input className={inputCls} value={editFields.year || ''} onChange={e => setEditFields({ ...editFields, year: e.target.value })} placeholder="연도" />
                            <input className={inputCls} value={editFields.title || ''} onChange={e => setEditFields({ ...editFields, title: e.target.value })} placeholder="제목" />
                            <input className={inputCls} value={editFields.order || ''} onChange={e => setEditFields({ ...editFields, order: e.target.value })} placeholder="순서" type="number" />
                          </div>
                          <input className={inputCls} value={editFields.description || ''} onChange={e => setEditFields({ ...editFields, description: e.target.value })} placeholder="설명" />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit('history', h.id)} className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700"><Check className="w-3 h-3" /></button>
                            <button onClick={() => setEditHistory(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-slate-900">
                              <span className="text-amber-600 font-bold">{h.year}</span> — {h.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{[h.description, `순서: ${h.order}`].filter(Boolean).join(' · ')}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => startEdit('history', h)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => deleteHistory(h.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
