import { useEffect, useState, type FormEvent } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../components/admin/Toast';
import { Plus, Trash2, Edit2, Check, X, ChevronUp } from 'lucide-react';

interface ServiceItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  order: number;
}

const defaultServices: Omit<ServiceItem, 'id'>[] = [
  { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80', title: 'Global Commerce', description: 'Amazon, Shopee, Qoo10 등 주요 글로벌 마켓플레이스 운영 및 D2C 자사몰 구축으로 K-Beauty를 전 세계로 유통합니다.', link: '/business', order: 1 },
  { image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&q=80', title: 'Advertising & PPL', description: '인플루언서 마케팅, 브랜디드 콘텐츠, 방송 PPL 등 데이터 기반 통합 광고 솔루션을 제공합니다.', link: '/business', order: 2 },
  { image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop&q=80', title: 'Logistics & Fulfillment', description: '글로벌 풀필먼트 센터와 원스톱 물류 시스템으로 빠르고 정확한 배송 인프라를 운영합니다.', link: '/business', order: 3 },
  { image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&q=80', title: 'AI & Tech', description: 'AI 기반 트렌드 분석, 수요 예측 및 마케팅 자동화로 데이터 드리븐 커머스를 실현합니다.', link: '/business', order: 4 },
  { image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=500&fit=crop&q=80', title: 'Brand Incubation', description: '제품 기획부터 브랜딩, 마케팅, 유통까지 — 뷰티 브랜드의 전 과정을 함께 설계합니다.', link: '/brands', order: 5 },
];

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[60px]`;
const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

export default function ServiceManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ image: '', title: '', description: '', link: '', order: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ image: '', title: '', description: '', link: '', order: '' });

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'services'), orderBy('order', 'asc')),
      async (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem));
        if (data.length === 0 && loading) {
          for (const s of defaultServices) {
            await addDoc(collection(db, 'services'), s);
          }
        } else {
          setItems(data);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [loading]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addDoc(collection(db, 'services'), {
      image: form.image.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      link: form.link.trim() || '/business',
      order: Number(form.order) || items.length + 1,
    });
    setForm({ image: '', title: '', description: '', link: '', order: '' });
    setShowAdd(false);
    toast('서비스가 추가되었습니다.');
  };

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'services', id));
      toast('삭제되었습니다.');
    }
  };

  const startEdit = (item: ServiceItem) => {
    setEditId(item.id);
    setEditForm({ image: item.image, title: item.title, description: item.description, link: item.link, order: String(item.order) });
  };

  const saveEdit = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'services', editId), {
      image: editForm.image.trim(),
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      link: editForm.link.trim(),
      order: Number(editForm.order) || 0,
    });
    setEditId(null);
    toast('수정되었습니다.');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">서비스 관리</h1>
          <p className="text-sm text-slate-500 mt-1">홈 페이지 서비스 슬라이더 항목 관리</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          {showAdd ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? '접기' : '추가'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={add} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>제목 *</label><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className={labelCls}>링크</label><input className={inputCls} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/business" /></div>
          </div>
          <div><label className={labelCls}>설명</label><textarea className={textareaCls} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className={labelCls}>이미지 URL</label><input className={inputCls} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">추가</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">서비스 목록 ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">등록된 서비스가 없습니다.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(s => (
              <div key={s.id} className="px-5 py-4">
                {editId === s.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input className={inputCls} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="제목" />
                      <input className={inputCls} value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} placeholder="링크" />
                      <input className={inputCls} value={editForm.order} onChange={e => setEditForm({ ...editForm, order: e.target.value })} type="number" placeholder="순서" />
                    </div>
                    <textarea className={textareaCls} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="설명" />
                    <input className={inputCls} value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} placeholder="이미지 URL" />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md hover:bg-slate-800"><Check className="w-3 h-3" /></button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {s.image && <img src={s.image} alt={s.title} className="w-20 h-14 object-cover rounded-lg" />}
                      <div>
                        <p className="font-medium text-sm text-slate-900">{s.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{s.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(s.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
