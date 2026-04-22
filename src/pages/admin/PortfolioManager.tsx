import { useState, useRef, useCallback, type FormEvent } from 'react';
import { useToast } from '../../components/admin/Toast';
import ImageUploader from '../../components/admin/ImageUploader';
import AiAssistButton from '../../components/admin/AiAssistButton';
import { usePortfolio, PORTFOLIO_DEFAULTS, type PortfolioItem, type PortfolioGallery } from '../../hooks/usePortfolio';
import { Plus, Trash2, Edit2, Check, X, ChevronUp, Eye, EyeOff, GripVertical, ImagePlus, Database, Loader2 } from 'lucide-react';
import { SEED_DATA } from '../../lib/portfolioSeedData';

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[60px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

export default function PortfolioManager() {
  const { toast } = useToast();
  const { items, loading, updateItem, addItem, removeItem } = usePortfolio();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PortfolioItem, 'id'>>(PORTFOLIO_DEFAULTS);

  /* ── 드래그 앤 드롭 ── */
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => { dragIdx.current = idx; }, []);
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
    const reordered = [...items];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    const updates = reordered.map((p, i) =>
      p.order !== i + 1 ? updateItem(p.id, { order: i + 1 }) : null,
    ).filter(Boolean);
    await Promise.all(updates);
    toast('순서가 변경되었습니다.');
  }, [items, updateItem, toast]);
  const handleDragEnd = useCallback(() => { dragIdx.current = null; setDragOverIdx(null); }, []);

  const resetForm = () => setForm({ ...PORTFOLIO_DEFAULTS });

  /* ── 갤러리 헬퍼 ── */
  const addGallery = () => {
    setForm({ ...form, galleries: [...form.galleries, { label: '', label_en: '', images: [] }] });
  };
  const updateGallery = (gi: number, field: keyof PortfolioGallery, value: string | string[]) => {
    const gals = [...form.galleries];
    gals[gi] = { ...gals[gi], [field]: value };
    setForm({ ...form, galleries: gals });
  };
  const removeGallery = (gi: number) => {
    setForm({ ...form, galleries: form.galleries.filter((_, i) => i !== gi) });
  };

  /* ── CRUD ── */
  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.brandName.trim()) return;
    await addItem({ ...form, order: form.order || items.length + 1 });
    resetForm();
    setShowAdd(false);
    toast('포트폴리오가 추가되었습니다.');
  };

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await removeItem(id);
      toast('삭제되었습니다.');
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditId(item.id);
    const { id, ...rest } = item;
    setForm(rest);
  };

  const saveEdit = async () => {
    if (!editId) return;
    await updateItem(editId, { ...form });
    setEditId(null);
    resetForm();
    toast('수정되었습니다.');
  };

  const cancelEdit = () => { setEditId(null); resetForm(); };

  const toggleVisibility = async (id: string, current: boolean) => {
    await updateItem(id, { visible: !current });
  };

  /* ── 시드 데이터 일괄 임포트 ── */
  const [seeding, setSeeding] = useState(false);
  const handleSeed = async () => {
    if (!confirm(`기존 데이터를 모두 삭제하고 ${SEED_DATA.length}개를 새로 임포트합니다. 계속하시겠습니까?`)) return;
    setSeeding(true);
    try {
      // 기존 데이터 전부 삭제
      for (const p of items) {
        await removeItem(p.id);
      }
      // 새 데이터 임포트
      for (let i = 0; i < SEED_DATA.length; i++) {
        const s = SEED_DATA[i];
        await addItem({
          brandName: s.brandName,
          thumbnail: s.thumbnail,
          heroImage: s.heroImage,
          categories: s.categories,
          description: s.description,
          description_en: '',
          galleries: s.galleries,
          order: i + 1,
          visible: true,
        });
      }
      toast(`${SEED_DATA.length}개 포트폴리오가 임포트되었습니다.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : '임포트 실패', 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  const FormFields = () => (
    <div className="space-y-4">
      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>브랜드명 *</label>
          <input className={inputCls} value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} placeholder="BMW, 컴포즈커피 등" />
        </div>
        <div>
          <label className={labelCls}>카테고리 (콤마 구분)</label>
          <input
            className={inputCls}
            value={form.categories.join(', ')}
            onChange={e => setForm({ ...form, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder="PPL, Online, SNS Marketing"
          />
        </div>
      </div>

      {/* 이미지 */}
      <div className="grid grid-cols-2 gap-3">
        <ImageUploader label="썸네일 이미지" value={form.thumbnail} onChange={url => setForm({ ...form, thumbnail: url })} folder="portfolio/thumbnails" />
        <ImageUploader label="히어로 배너 이미지" value={form.heroImage} onChange={url => setForm({ ...form, heroImage: url })} folder="portfolio/heroes" />
      </div>

      {/* 설명 */}
      <div>
        <div className="flex items-center justify-between">
          <label className={labelCls}>프로젝트 소개 (한국어)</label>
          <AiAssistButton value={form.description} onApply={v => setForm({ ...form, description: v })} fieldLabel={`${form.brandName} 프로젝트 소개`} context={`${form.brandName} - ${form.categories.join(', ')} 프로젝트`} />
        </div>
        <textarea className={textareaCls} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="- JTBC 드라마 '맨투맨' 간접광고 진행&#10;- SBS 드라마 '사랑의 온도' 간접광고 진행" />
      </div>
      <div>
        <label className={labelCls}>프로젝트 소개 (영문)</label>
        <textarea className={textareaCls} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} placeholder="English description (optional)" />
      </div>

      {/* 갤러리 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>이미지 갤러리</label>
          <button type="button" onClick={addGallery} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
            <ImagePlus className="w-3.5 h-3.5" /> 갤러리 추가
          </button>
        </div>
        {form.galleries.length === 0 && (
          <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg">
            갤러리가 없습니다. "갤러리 추가" 버튼을 클릭하세요.
          </p>
        )}
        <div className="space-y-3">
          {form.galleries.map((gal, gi) => (
            <div key={gi} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
              <div className="flex items-center gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  value={gal.label}
                  onChange={e => updateGallery(gi, 'label', e.target.value)}
                  placeholder="라벨 (예: PPL, Online)"
                />
                <input
                  className={`${inputCls} flex-1`}
                  value={gal.label_en}
                  onChange={e => updateGallery(gi, 'label_en', e.target.value)}
                  placeholder="English label"
                />
                <button type="button" onClick={() => removeGallery(gi)} className="p-1.5 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">이미지 URL (줄바꿈으로 구분)</label>
                <textarea
                  className={`${textareaCls} text-xs`}
                  value={gal.images.join('\n')}
                  onChange={e => updateGallery(gi, 'images', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                  rows={3}
                  placeholder="https://interohrigin.com/upload/image1.jpg&#10;https://interohrigin.com/upload/image2.jpg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메타 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>정렬순서</label>
          <input className={inputCls} type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 accent-blue-600 rounded" />
            <span className="text-sm text-slate-600">노출</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">포트폴리오 관리</h1>
          <p className="text-sm text-slate-500 mt-1">Business 페이지 Advertising & PPL 섹션의 포트폴리오를 관리합니다</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditId(null); resetForm(); }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          {showAdd ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? '접기' : '추가'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={add} className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-4">새 포트폴리오</h3>
          <FormFields />
          <button type="submit" className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">추가</button>
        </form>
      )}

      {/* 리임포트 버튼 (데이터가 있을 때도 표시) */}
      {items.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
          <span className="text-xs text-amber-700">데이터를 초기화하고 기존 사이트에서 다시 가져오려면:</span>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors shrink-0"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            {seeding ? '임포트 중...' : '전체 리임포트'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">포트폴리오 목록 ({items.length})</h3>
          <span className="text-xs text-slate-400 flex items-center gap-1"><GripVertical className="w-3 h-3" /> 드래그하여 순서 변경</span>
        </div>
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center space-y-4">
            <p className="text-sm text-slate-400">등록된 포트폴리오가 없습니다.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {seeding ? '임포트 중...' : `기존 사이트 데이터 임포트 (${SEED_DATA.length}개)`}
            </button>
            <p className="text-xs text-slate-400">interohrigin.com의 포트폴리오 데이터를 일괄 임포트합니다</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((p, idx) => (
              <div
                key={p.id}
                draggable={editId !== p.id}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={`px-5 py-4 transition-colors ${
                  dragOverIdx === idx ? 'bg-blue-50 border-t-2 border-blue-400' : ''
                } ${editId !== p.id ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {editId === p.id ? (
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
                      {p.thumbnail && <img src={p.thumbnail} alt={p.brandName} className="w-10 h-10 object-cover rounded-lg bg-slate-50" />}
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          {p.brandName}
                          <span className="text-slate-400 text-xs ml-2">· {p.categories.join(' / ')}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisibility(p.id, p.visible)}
                        className={`p-2 rounded-md transition-colors ${p.visible ? 'text-blue-600' : 'text-slate-300'}`}
                        title={p.visible ? '표시중' : '숨김'}
                      >
                        {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
