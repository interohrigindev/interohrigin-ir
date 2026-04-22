import { useState, useRef, useCallback, type FormEvent } from 'react';
import { useToast } from '../../components/admin/Toast';
import ImageUploader from '../../components/admin/ImageUploader';
import AiAssistButton from '../../components/admin/AiAssistButton';
import { useBrands, type SharedBrand } from '../../hooks/useBrands';
import { translateText, isDeeplAvailable } from '../../lib/deepl';
import { useEnabledLanguages } from '../../hooks/useEnabledLanguages';
import { LANGUAGE_META } from '../../lib/languages';
import { Plus, Trash2, Edit2, Check, X, ChevronUp, Eye, EyeOff, Home, LayoutGrid, GripVertical, Languages, Loader2, ChevronDown } from 'lucide-react';

/* ── 브랜드 다국어 번역 ── */
function BrandTranslateAll({ brands, updateBrand }: { brands: SharedBrand[]; updateBrand: (id: string, data: Partial<Omit<SharedBrand, 'id'>>) => Promise<void> }) {
  const { toast } = useToast();
  const [translating, setTranslating] = useState(false);
  const [available, setAvailable] = useState(false);
  const [done, setDone] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { enabledLangs } = useEnabledLanguages();

  useState(() => { isDeeplAvailable().then(setAvailable); });

  if (!available) return null;

  const handleTranslate = async (lang?: string) => {
    const toLang = lang || targetLang;
    setTranslating(true);
    setDone(false);
    try {
      const suffix = `_${toLang}`;
      const needTranslation = brands.filter(b => b.description && !(b as any)[`description${suffix}`]);
      const targets = needTranslation.length > 0 ? needTranslation : brands.filter(b => b.description || b.detail);

      for (const b of targets) {
        const updates: Record<string, string> = {};
        if (b.description) updates[`description_${toLang}`] = await translateText(b.description, 'ko', toLang);
        if (b.detail) updates[`detail_${toLang}`] = await translateText(b.detail, 'ko', toLang);
        if (b.category) updates[`category_${toLang}`] = await translateText(b.category, 'ko', toLang);
        await updateBrand(b.id, updates as any);
      }
      setDone(true);
      const langName = LANGUAGE_META[toLang]?.nativeName || toLang.toUpperCase();
      toast(`브랜드 ${langName} 번역이 완료되었습니다.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : '번역 실패', 'error');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-100">
      <Languages className="w-4 h-4 text-blue-500 shrink-0" />
      <span className="text-xs font-medium text-slate-700 shrink-0">브랜드 번역</span>
      <span className="text-[10px] text-slate-400">description, detail, category 번역</span>

      {/* 타겟 언어 선택 */}
      <div className="relative ml-auto shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={translating}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
        >
          {(LANGUAGE_META[targetLang]?.deeplCode || targetLang).toUpperCase()}
          <ChevronDown className="w-3 h-3" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden min-w-[140px] z-50">
            {enabledLangs.map(code => (
              <button
                key={code}
                onClick={() => { setTargetLang(code); setDropdownOpen(false); }}
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
        onClick={() => handleTranslate()}
        disabled={translating}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0"
      >
        {translating ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 번역 중...</>
        ) : done ? (
          <><Languages className="w-3.5 h-3.5" /> 완료</>
        ) : (
          '일괄 번역'
        )}
      </button>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[60px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

export default function BrandManager() {
  const { toast } = useToast();
  const { brands, loading, updateBrand, addBrand, removeBrand, BRAND_DEFAULTS } = useBrands();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SharedBrand, 'id'>>(BRAND_DEFAULTS);

  /* ── 드래그 앤 드롭 상태 ── */
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => {
    dragIdx.current = idx;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  }, []);

  const handleDrop = useCallback(async (targetIdx: number) => {
    const fromIdx = dragIdx.current;
    dragIdx.current = null;
    setDragOverIdx(null);
    if (fromIdx === null || fromIdx === targetIdx) return;

    // 새 순서 계산: 드래그 아이템을 빼고 target 위치에 삽입
    const reordered = [...brands];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    // Firestore에 order 값 일괄 업데이트
    const updates = reordered.map((b, i) =>
      b.order !== i + 1 ? updateBrand(b.id, { order: i + 1 }) : null
    ).filter(Boolean);
    await Promise.all(updates);
    toast('순서가 변경되었습니다.');
  }, [brands, updateBrand, toast]);

  const handleDragEnd = useCallback(() => {
    dragIdx.current = null;
    setDragOverIdx(null);
  }, []);

  const resetForm = () => setForm({ ...BRAND_DEFAULTS });

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addBrand({ ...form, order: form.order || brands.length + 1 });
    resetForm();
    setShowAdd(false);
    toast('브랜드가 추가되었습니다.');
  };

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await removeBrand(id);
      toast('삭제되었습니다.');
    }
  };

  const startEdit = (item: SharedBrand) => {
    setEditId(item.id);
    const { id, ...rest } = item;
    setForm(rest);
  };

  const saveEdit = async () => {
    if (!editId) return;
    await updateBrand(editId, { ...form });
    setEditId(null);
    resetForm();
    toast('수정되었습니다.');
  };

  const cancelEdit = () => { setEditId(null); resetForm(); };

  const toggleVisibility = async (id: string, field: 'visibleHome' | 'visibleBrands', current: boolean) => {
    await updateBrand(id, { [field]: !current });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>브랜드명 (영문) *</label><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className={labelCls}>브랜드명 (한글)</label><input className={inputCls} value={form.nameKo} onChange={e => setForm({ ...form, nameKo: e.target.value })} /></div>
        <div><label className={labelCls}>카테고리</label><input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className={labelCls}>간단 소개</label>
          <AiAssistButton value={form.description} onApply={v => setForm({ ...form, description: v })} fieldLabel={`${form.name} 소개`} context={`${form.name} - ${form.category} 브랜드`} />
        </div>
        <textarea className={textareaCls} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="메인 페이지 카드 뒷면에 표시" />
      </div>
      <div><label className={labelCls}>상세 설명</label><textarea className={textareaCls} value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} placeholder="브랜드 페이지 모달에 표시" /></div>
      <div className="grid grid-cols-2 gap-3">
        <ImageUploader label="로고" value={form.logo} onChange={url => setForm({ ...form, logo: url })} folder="brands/logos" />
        <ImageUploader label="이미지" value={form.image} onChange={url => setForm({ ...form, image: url })} folder="brands/images" />
      </div>
      <div>
        <label className={labelCls}>배경 영상 (YouTube 링크)</label>
        <input className={inputCls} value={form.video} onChange={e => setForm({ ...form, video: e.target.value })} placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..." />
        <p className="text-xs text-slate-400 mt-1">입력 시 이미지 대신 유튜브 영상이 카드 배경에 자동 재생됩니다</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>로고 크기 ({((form.logoScale) * 100).toFixed(0)}%)</label>
          <div className="flex items-center gap-3">
            <input type="range" min="0.5" max="2" step="0.1" value={form.logoScale} onChange={e => setForm({ ...form, logoScale: Number(e.target.value) })} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <button onClick={() => setForm({ ...form, logoScale: 1 })} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200">초기화</button>
          </div>
        </div>
        <div><label className={labelCls}>정렬순서</label><input className={inputCls} type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>웹사이트</label><input className={inputCls} value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
        <div><label className={labelCls}>스마트스토어</label><input className={inputCls} value={form.smartstore} onChange={e => setForm({ ...form, smartstore: e.target.value })} /></div>
        <div><label className={labelCls}>인스타그램</label><input className={inputCls} value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
        <span className="text-sm font-medium text-slate-700">페이지 노출:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.visibleHome} onChange={e => setForm({ ...form, visibleHome: e.target.checked })} className="w-4 h-4 accent-blue-600 rounded" />
          <span className="text-sm text-slate-600">Home</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.visibleBrands} onChange={e => setForm({ ...form, visibleBrands: e.target.checked })} className="w-4 h-4 accent-blue-600 rounded" />
          <span className="text-sm text-slate-600">Brands</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">브랜드 관리</h1>
          <p className="text-sm text-slate-500 mt-1">여기서 변경하면 Home · Brands 페이지에 동시 반영됩니다</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditId(null); resetForm(); }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          {showAdd ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? '접기' : '추가'}
        </button>
      </div>

      <BrandTranslateAll brands={brands} updateBrand={updateBrand} />

      {showAdd && (
        <form onSubmit={add} className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-4">새 브랜드</h3>
          <FormFields />
          <button type="submit" className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">추가</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">브랜드 목록 ({brands.length})</h3>
          <span className="text-xs text-slate-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> 드래그하여 순서 변경</span>
        </div>
        {brands.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">등록된 브랜드가 없습니다.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {brands.map((b, idx) => (
              <div
                key={b.id}
                draggable={editId !== b.id}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={`px-5 py-4 transition-colors ${
                  dragOverIdx === idx ? 'bg-blue-50 border-t-2 border-blue-400' : ''
                } ${editId !== b.id ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {editId === b.id ? (
                  <div>
                    <FormFields />
                    <div className="flex gap-2 mt-3">
                      <button onClick={saveEdit} className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md hover:bg-slate-800 flex items-center gap-1"><Check className="w-3 h-3" /> 저장</button>
                      <button onClick={cancelEdit} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 flex items-center gap-1"><X className="w-3 h-3" /> 취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-300 hover:text-slate-500 shrink-0">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-slate-300 w-5 text-center shrink-0">{idx + 1}</span>
                      {b.logo && <img src={b.logo} alt={b.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1" />}
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          {b.name}
                          {b.nameKo && <span className="text-slate-400 text-xs ml-1">({b.nameKo})</span>}
                          <span className="text-slate-400 text-xs ml-2">· {b.category}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{b.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Home 토글 */}
                      <button
                        onClick={() => toggleVisibility(b.id, 'visibleHome', b.visibleHome)}
                        className={`p-2 rounded-md transition-colors flex items-center gap-1 ${b.visibleHome ? 'text-blue-600' : 'text-slate-300'}`}
                        title={`Home ${b.visibleHome ? '표시중' : '숨김'}`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        {b.visibleHome ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      {/* Brands 토글 */}
                      <button
                        onClick={() => toggleVisibility(b.id, 'visibleBrands', b.visibleBrands)}
                        className={`p-2 rounded-md transition-colors flex items-center gap-1 ${b.visibleBrands ? 'text-green-600' : 'text-slate-300'}`}
                        title={`Brands ${b.visibleBrands ? '표시중' : '숨김'}`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        {b.visibleBrands ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => startEdit(b)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(b.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
