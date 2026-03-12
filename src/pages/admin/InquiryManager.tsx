import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../components/admin/Toast';
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  type: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

export default function InquiryManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')),
      (snap) => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry)));
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const remove = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'inquiries', id));
      toast('삭제되었습니다.');
    }
  };

  const toggleRead = async (item: Inquiry) => {
    await updateDoc(doc(db, 'inquiries', item.id), { read: !item.read });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const unreadCount = items.filter(i => !i.read).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">문의 내역</h1>
        <p className="text-sm text-slate-500 mt-1">
          고객 문의 접수 내역 관리
          {unreadCount > 0 && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount}건 미확인</span>}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">전체 문의 ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Mail className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">접수된 문의가 없습니다.</p>
            <p className="text-xs text-slate-300 mt-1">Contact 페이지에서 문의가 접수되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map(inq => (
              <div key={inq.id} className={`transition-colors ${inq.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className="px-5 py-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(inq.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={e => { e.stopPropagation(); toggleRead(inq); }}
                      className={`p-1 rounded ${inq.read ? 'text-slate-300 hover:text-slate-500' : 'text-blue-500 hover:text-blue-700'}`}
                    >
                      {inq.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${inq.read ? 'text-slate-600' : 'font-bold text-slate-900'}`}>
                        {inq.name} {inq.company && <span className="text-slate-400">({inq.company})</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="inline-block bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] mr-2">{inq.type}</span>
                        {inq.email}
                        {inq.createdAt && <span className="ml-2">{new Date(inq.createdAt).toLocaleDateString('ko-KR')}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {expandedId === inq.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    <button onClick={e => { e.stopPropagation(); remove(inq.id); }} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {expandedId === inq.id && (
                  <div className="px-5 pb-4 pl-12">
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${inq.type}&body=%0A%0A--- 원본 문의 ---%0A${encodeURIComponent(inq.message)}`}
                        className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800"
                      >
                        이메일 답장
                      </a>
                      <button
                        onClick={() => toggleRead(inq)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200"
                      >
                        {inq.read ? '미확인으로 표시' : '확인됨으로 표시'}
                      </button>
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
