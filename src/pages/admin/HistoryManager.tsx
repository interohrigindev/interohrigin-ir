import { useEffect, useState, useRef, type FormEvent } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { translateTexts, isDeeplAvailable } from '../../lib/deepl';
import { useToast } from '../../components/admin/Toast';
import { useEnabledLanguages } from '../../hooks/useEnabledLanguages';
import { LANGUAGE_META } from '../../lib/languages';
import { Plus, Trash2, Edit2, Check, X, Languages, Loader2, ChevronDown } from 'lucide-react';

interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description?: string;
  title_en?: string;
  description_en?: string;
  order: number;
}

const seedData: Omit<HistoryItem, 'id'>[] = [
  { year: '2016', title: '인터오리진아이엔씨 법인설립', description: '브랜드 전문 유통 기업으로 출발', order: 1 },
  { year: '2017', title: '색조&스킨케어 전문 브랜드 [JUST PURE] 런칭', description: '자체 브랜드 사업 시작', order: 2 },
  { year: '2018', title: '[AZH] 런칭', description: 'CJ ENM 홈쇼핑 방송 런칭 후 전 수량 매진 · 올리브영 전국매장 입점', order: 3 },
  { year: '2019', title: '[AZH] 롯데홈쇼핑 방송 런칭', description: '399 by AZH 프리미엄 살롱 런칭', order: 4 },
  { year: '2020', title: '[SHEMONBRED] 런칭', description: '다수 드라마 PPL 제작지원 · [MR. PROJECT] 런칭 · AZH SSG/올리브영 입점', order: 5 },
  { year: '2021', title: '[Baby Corner] 런칭', description: '프리미엄 유아 화장품 · AZH SBS/TV조선 PPL · 쿠팡 로켓배송 입점', order: 6 },
  { year: '2022', title: '[AZH] 한경 BUSINESS 헤어 케어 부문 1위', description: '[HEYTAN] 런칭 · 미국 LA 팝업스토어 · [BEGIN COFFEE] 런칭 · 사옥 이전', order: 7 },
  { year: '2023', title: '[LA COLLECTA] 런칭', description: 'SHEMONBRED CJ Onstyle/시코르 공식 입점 · AZH JTBC \'닥터 차정숙\' 제작지원', order: 8 },
  { year: '2025', title: '[Tiberias] · [THING OF JACOB] · [DR.ASKL] 런칭', description: '신규 브랜드 3종 동시 런칭', order: 9 },
];

export default function HistoryManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [order, setOrder] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [deeplReady, setDeeplReady] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { enabledLangs } = useEnabledLanguages();
  const seeded = useRef(false);

  useEffect(() => { isDeeplAvailable().then(setDeeplReady); }, []);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'history_items'), orderBy('order', 'asc')),
      async (snap) => {
        if (snap.empty && !seeded.current) {
          seeded.current = true;
          // Auto-seed with default history data
          const col = collection(db, 'history_items');
          const existing = await getDocs(col);
          if (existing.empty) {
            for (const item of seedData) {
              await addDoc(col, item);
            }
          }
          return;
        }
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryItem)));
      },
      () => setItems([])
    );
  }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !title.trim()) return;
    await addDoc(collection(db, 'history_items'), {
      year: year.trim(),
      title: title.trim(),
      description: desc.trim() || undefined,
      order: Number(order) || items.length + 1,
    });
    setYear(''); setTitle(''); setDesc(''); setOrder('');
  };

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'history_items', id));
  };

  const startEdit = (item: HistoryItem) => {
    setEditId(item.id);
    setEditFields({ year: item.year, title: item.title, description: item.description || '', order: String(item.order) });
  };

  const saveEdit = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'history_items', editId), {
      year: editFields.year?.trim(),
      title: editFields.title?.trim(),
      description: editFields.description?.trim() || undefined,
      order: Number(editFields.order) || 0,
    });
    setEditId(null);
  };

  const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">연혁 관리</h1>
        <p className="text-sm text-slate-500 mt-1">회사 연혁 타임라인 항목을 관리합니다</p>
      </div>

      <form onSubmit={add} className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> 연혁 추가
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input className={inputCls} placeholder="연도 *" value={year} onChange={e => setYear(e.target.value)} required />
          <input className={inputCls} placeholder="제목 *" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className={inputCls} placeholder="정렬순서" type="number" value={order} onChange={e => setOrder(e.target.value)} />
        </div>
        <input className={`${inputCls} mb-3`} placeholder="설명" value={desc} onChange={e => setDesc(e.target.value)} />
        <button type="submit" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">추가</button>
      </form>

      {deeplReady && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-100">
          <Languages className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-medium text-slate-700 shrink-0">연혁 번역</span>
          <span className="text-[10px] text-slate-400">title, description 번역</span>

          {/* 타겟 언어 선택 */}
          <div className="relative ml-auto shrink-0">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              disabled={translating}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
            >
              {(LANGUAGE_META[targetLang]?.deeplCode || targetLang).toUpperCase()}
              <ChevronDown className="w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden min-w-[140px] z-50">
                {enabledLangs.map(code => (
                  <button
                    key={code}
                    onClick={() => { setTargetLang(code); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      code === targetLang ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {code.toUpperCase()} {LANGUAGE_META[code]?.nativeName || code}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              setTranslating(true);
              try {
                const suffix = `_${targetLang}`;
                const toTranslate = items.filter(h => h.title && !(h as any)[`title${suffix}`]);
                const targets = toTranslate.length > 0 ? toTranslate : items.filter(h => h.title);
                if (targets.length === 0) { toast('번역할 항목이 없습니다.'); return; }

                const titles = targets.map(h => h.title);
                const descs = targets.map(h => h.description || '');
                const hasDesc = descs.some(d => d.length > 0);

                const translatedTitles = await translateTexts(titles, 'ko', targetLang);
                const translatedDescs = hasDesc ? await translateTexts(descs, 'ko', targetLang) : descs.map(() => '');

                for (let i = 0; i < targets.length; i++) {
                  const updates: Record<string, string> = { [`title_${targetLang}`]: translatedTitles[i] };
                  if (targets[i].description) updates[`description_${targetLang}`] = translatedDescs[i];
                  await updateDoc(doc(db, 'history_items', targets[i].id), updates);
                }
                const langName = LANGUAGE_META[targetLang]?.nativeName || targetLang.toUpperCase();
                toast(`연혁 ${langName} 번역이 완료되었습니다.`);
              } catch (e) {
                toast(e instanceof Error ? e.message : '번역 실패', 'error');
              } finally {
                setTranslating(false);
              }
            }}
            disabled={translating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
          >
            {translating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 번역 중...</>
            ) : '일괄 번역'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">연혁 목록 ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">등록된 연혁이 없습니다.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(h => (
              <div key={h.id} className="px-5 py-4">
                {editId === h.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input className={inputCls} value={editFields.year || ''} onChange={e => setEditFields({ ...editFields, year: e.target.value })} />
                      <input className={inputCls} value={editFields.title || ''} onChange={e => setEditFields({ ...editFields, title: e.target.value })} />
                      <input className={inputCls} value={editFields.order || ''} onChange={e => setEditFields({ ...editFields, order: e.target.value })} type="number" />
                    </div>
                    <input className={inputCls} value={editFields.description || ''} onChange={e => setEditFields({ ...editFields, description: e.target.value })} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700"><Check className="w-3 h-3" /></button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">
                        <span className="text-amber-600 font-bold">{h.year}</span> — {h.title}
                      </p>
                      {h.description && <p className="text-xs text-slate-400 mt-0.5">{h.description}</p>}
                      {h.title_en && <p className="text-xs text-blue-400 mt-0.5">EN: {h.title_en}{h.description_en ? ` — ${h.description_en}` : ''}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(h)} className="p-2 text-slate-400 hover:text-amber-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(h.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
