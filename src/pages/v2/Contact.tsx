import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { sendContactEmail } from '../../lib/emailjs';
import { usePageContent } from '../../hooks/usePageContent';
import { useLang } from '../../contexts/LanguageContext';

const defaultInquiryTypes = [
  'Brand Distribution',
  'Marketing Partnership',
  'Logistics Inquiry',
  'General Inquiry',
];

const contactFallback = {
  hero: { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop&q=80', label: 'Contact', title: '문의하기', description: '비즈니스 파트너십, 브랜드 유통, 기술 협업 등 어떤 문의든 환영합니다' },
  info: { address: '서울특별시 강남구 선릉로121길 5, 3층 (논현동, 인터오리진타워)', phone: '070-4188-0322', email: 'biz@interohrigin.com', businessHours: 'Mon – Fri: 09:00 – 18:00 (KST)' },
  inquiryTypes: defaultInquiryTypes,
};

export default function Contact() {
  const { lang } = useLang();
  const { data: content } = usePageContent('contact', contactFallback, lang);
  const inquiryTypes = content.inquiryTypes?.length ? content.inquiryTypes : defaultInquiryTypes;
  const [form, setForm] = useState({ name: '', email: '', company: '', type: inquiryTypes[0], message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendContactEmail(form);
      setSent(true);
      setForm({ name: '', email: '', company: '', type: inquiryTypes[0], message: '' });
    } catch (err) {
      console.error(err);
      alert(lang === 'en' ? 'Failed to send. Please try again.' : '전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors';

  return (
    <>
      {/* Hero with background image */}
      <section className="relative -mt-16 pt-16 overflow-hidden">
        <img
          src={content.hero.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-36">
          <span className="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 mb-3">
            {content.hero.label}
          </span>
          <h1
            className="font-black text-white tracking-tight leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
          >
            {content.hero.title}
          </h1>
          <p className="mt-3 text-white/60 max-w-lg text-sm md:text-base">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900">
                  {lang === 'en' ? 'Your inquiry has been submitted' : '문의가 접수되었습니다'}
                </h3>
                <p className="mt-3 text-slate-500">
                  {lang === 'en' ? 'We will get back to you shortly.' : '빠른 시일 내에 답변드리겠습니다.'}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {lang === 'en' ? 'New Inquiry' : '새 문의 작성'}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                    <input className={inputCls} value={form.name} onChange={set('name')} required placeholder={lang === 'en' ? 'John Doe' : '홍길동'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <input className={inputCls} type="email" value={form.email} onChange={set('email')} required placeholder="email@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                    <input className={inputCls} value={form.company} onChange={set('company')} placeholder={lang === 'en' ? 'Company Name' : '회사명'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Inquiry Type</label>
                    <select className={inputCls} value={form.type} onChange={set('type')}>
                      {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                  <textarea className={`${inputCls} resize-none`} rows={6} value={form.message} onChange={set('message')} required placeholder={lang === 'en' ? 'Please enter your message' : '문의 내용을 입력해 주세요'} />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {sending ? (lang === 'en' ? 'Sending...' : '전송 중...') : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 mb-6">Contact Info</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Address</p>
                    <p className="text-sm text-slate-500 mt-0.5">{content.info.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Phone</p>
                    <p className="text-sm text-slate-500 mt-0.5">{content.info.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-500 mt-0.5">{content.info.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="font-bold mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>{content.info.businessHours}</p>
                <p>Sat – Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
