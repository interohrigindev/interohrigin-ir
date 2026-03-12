import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function IncContact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputCls = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-blue-600 font-semibold mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">문의하기</h1>
          <p className="mt-4 text-base text-slate-500 max-w-xl">비즈니스 파트너십, 브랜드 입점, 기타 문의사항을 남겨주세요.</p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">문의가 접수되었습니다</h3>
                  <p className="text-sm text-slate-500">빠른 시일 내에 담당자가 연락드리겠습니다.</p>
                </div>
              ) : (
                <form onSubmit={handle} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">이름 *</label>
                      <input required className={inputCls} placeholder="홍길동" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">이메일 *</label>
                      <input required type="email" className={inputCls} placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">회사명</label>
                    <input className={inputCls} placeholder="회사명을 입력하세요" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">문의 내용 *</label>
                    <textarea required rows={5} className={`${inputCls} resize-none`} placeholder="문의 내용을 입력하세요" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    문의 보내기
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">주소</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">서울특별시 강남구<br />선릉로121길 5, 3층<br />(논현동, 인터오리진타워)</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">전화</h3>
                    <p className="text-sm text-slate-500 mt-1">070-4188-0322</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">이메일</h3>
                    <p className="text-sm text-slate-500 mt-1">biz@interohrigin.com</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-slate-200 rounded-2xl aspect-[4/3] flex items-center justify-center">
                <p className="text-sm text-slate-400 font-medium">지도 영역</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
