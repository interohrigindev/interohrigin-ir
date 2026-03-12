import { useEffect, useState, type FormEvent } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../components/admin/Toast';
import { Plus, Trash2, Edit2, Check, X, Play } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  brand: string;
  logo: string;
  order: number;
}

const defaultVideos: Omit<VideoItem, 'id'>[] = [
  { youtubeId: 'KuxG-WqMJx4', brand: 'AZH', logo: '/logos/azh.png', order: 1 },
  { youtubeId: '5zEB-l_WXqM', brand: 'AZH', logo: '/logos/azh.png', order: 2 },
  { youtubeId: 'TCO1Pj1a2JQ', brand: 'SHEMONBRED', logo: '/logos/shemonbred.png', order: 3 },
  { youtubeId: '61yR08BDr48', brand: 'SHEMONBRED', logo: '/logos/shemonbred.png', order: 4 },
  { youtubeId: 'K0jhkd9dXF8', brand: 'LA COLLECTA', logo: '/logos/lacollecta.png', order: 5 },
  { youtubeId: '7ZepBF8iRrw', brand: 'LA COLLECTA', logo: '/logos/lacollecta.png', order: 6 },
  { youtubeId: '6I3t4jNFDxc', brand: 'Tiberias', logo: '/logos/tiberias.png', order: 7 },
  { youtubeId: 'caS-RL7wtg4', brand: 'Baby Corner', logo: '/logos/babycorner.png', order: 8 },
  { youtubeId: 'sHTi_5oAt1M', brand: 'DR.ASKL', logo: '/logos/draskl.png', order: 9 },
  { youtubeId: '0zm6ip733-A', brand: 'THING OF JACOB', logo: '/logos/thingofjacob.png', order: 10 },
];

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export default function VideoManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtubeId, setYoutubeId] = useState('');
  const [brand, setBrand] = useState('');
  const [logo, setLogo] = useState('');
  const [order, setOrder] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'videos'), orderBy('order', 'asc')),
      async (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as VideoItem));
        if (data.length === 0 && loading) {
          // 기본 데이터 시딩
          for (const v of defaultVideos) {
            await addDoc(collection(db, 'videos'), v);
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
    if (!youtubeId.trim() || !brand.trim()) return;
    await addDoc(collection(db, 'videos'), {
      youtubeId: youtubeId.trim(),
      brand: brand.trim(),
      logo: logo.trim(),
      order: Number(order) || items.length + 1,
    });
    setYoutubeId(''); setBrand(''); setLogo(''); setOrder('');
    toast('영상이 추가되었습니다.');
  };

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'videos', id));
      toast('삭제되었습니다.');
    }
  };

  const startEdit = (item: VideoItem) => {
    setEditId(item.id);
    setEditFields({ youtubeId: item.youtubeId, brand: item.brand, logo: item.logo, order: String(item.order) });
  };

  const saveEdit = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'videos', editId), {
      youtubeId: editFields.youtubeId?.trim(),
      brand: editFields.brand?.trim(),
      logo: editFields.logo?.trim(),
      order: Number(editFields.order) || 0,
    });
    setEditId(null);
    toast('수정되었습니다.');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">영상 관리</h1>
        <p className="text-sm text-slate-500 mt-1">브랜드 PR 영상(YouTube Shorts) 관리</p>
      </div>

      <form onSubmit={add} className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> 영상 추가
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
          <input className={inputCls} placeholder="YouTube ID *" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} required />
          <input className={inputCls} placeholder="브랜드명 *" value={brand} onChange={e => setBrand(e.target.value)} required />
          <input className={inputCls} placeholder="로고 경로" value={logo} onChange={e => setLogo(e.target.value)} />
          <input className={inputCls} placeholder="정렬순서" type="number" value={order} onChange={e => setOrder(e.target.value)} />
        </div>
        <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">추가</button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">영상 목록 ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">등록된 영상이 없습니다.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(v => (
              <div key={v.id} className="px-5 py-4">
                {editId === v.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      <input className={inputCls} value={editFields.youtubeId || ''} onChange={e => setEditFields({ ...editFields, youtubeId: e.target.value })} placeholder="YouTube ID" />
                      <input className={inputCls} value={editFields.brand || ''} onChange={e => setEditFields({ ...editFields, brand: e.target.value })} placeholder="브랜드" />
                      <input className={inputCls} value={editFields.logo || ''} onChange={e => setEditFields({ ...editFields, logo: e.target.value })} placeholder="로고" />
                      <input className={inputCls} value={editFields.order || ''} onChange={e => setEditFields({ ...editFields, order: e.target.value })} type="number" placeholder="순서" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md hover:bg-slate-800"><Check className="w-3 h-3" /></button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"><X className="w-3 h-3" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`} alt={v.brand} className="w-16 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          <span className="text-brand-600 font-bold">{v.brand}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Play className="w-3 h-3" /> {v.youtubeId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(v)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(v.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
