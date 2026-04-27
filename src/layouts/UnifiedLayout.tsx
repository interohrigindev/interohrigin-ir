import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLang } from '../contexts/LanguageContext';
import { LANGUAGE_META } from '../lib/languages';

gsap.registerPlugin(ScrollTrigger);

const SNS_FALLBACK = {
  instagram: 'https://www.instagram.com/interohrigin_official/',
  youtube: 'https://www.youtube.com/@interohrigin',
  blog: 'https://blog.naver.com/interohrigin',
  kakao: '',
};

/** settings/site 문서의 social 필드 실시간 구독.
 * 어드민에서 SNS URL 변경 시 헤더/푸터 즉시 반영. */
function useSnsLinks() {
  const [social, setSocial] = useState(SNS_FALLBACK);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      const s = snap.data()?.social;
      if (s) setSocial({ ...SNS_FALLBACK, ...s });
    });
    return unsub;
  }, []);
  return [
    { label: 'Instagram', href: social.instagram },
    { label: 'YouTube', href: social.youtube },
    { label: 'Blog', href: social.blog },
    { label: 'Kakao', href: social.kakao },
  ].filter(s => s.href && s.href.trim() !== '');
}

const baseLinks = [
  { path: '/', label: 'Home', end: true },
  { path: '/about', label: 'About Us', end: false },
  { path: '/brands', label: 'Brands', end: false },
  { path: '/business', label: 'Business', end: false },
  { path: '/contact', label: 'Contact', end: false },
];

/** 언어 표시 레이블 */
function langLabel(code: string): string {
  if (code === 'ko') return 'KO';
  return LANGUAGE_META[code]?.deeplCode || code.toUpperCase();
}
function langFullName(code: string): string {
  if (code === 'ko') return '한국어';
  return LANGUAGE_META[code]?.nativeName || code.toUpperCase();
}

export default function UnifiedLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { lang, prefix, switchPath, enabledLangs } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const allLangs = ['ko', ...enabledLangs];
  const sns = useSnsLinks();

  const switchToLang = (targetLang: string) => {
    const newPath = switchPath(targetLang, location.pathname);
    navigate(newPath);
    setLangDropdownOpen(false);
    setOpen(false);
  };

  // 언어 prefix가 적용된 링크 목록
  const links = baseLinks.map(l => ({
    to: l.path === '/' ? (prefix || '/') : `${prefix}${l.path}`,
    label: l.label,
    end: l.end,
  }));

  const homePath = prefix || '/';
  const isHome = location.pathname === homePath || location.pathname === `${homePath}/`;

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ScrollSmoother 환경에서도 동작하는 스크롤 감지
  useEffect(() => {
    // 방법 1: ScrollTrigger (ScrollSmoother와 자동 연동)
    const trigger = ScrollTrigger.create({
      start: 80,
      end: 99999,
      onToggle: (self) => setScrolled(self.isActive),
    });

    // 방법 2: 네이티브 scroll 이벤트 (모바일 / ScrollSmoother 비활성 시)
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 방법 3: smooth-wrapper의 scroll 이벤트 감지
    const wrapper = document.getElementById('smooth-wrapper');
    const onWrapperScroll = () => {
      if (wrapper) setScrolled(wrapper.scrollTop > 80);
    };
    wrapper?.addEventListener('scroll', onWrapperScroll, { passive: true });

    return () => {
      trigger.kill();
      window.removeEventListener('scroll', onScroll);
      wrapper?.removeEventListener('scroll', onWrapperScroll);
    };
  }, []);

  // 모바일 메뉴 열림 시 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // 드롭다운 외부 클릭 닫기
  useEffect(() => {
    if (!langDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-dropdown')) setLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langDropdownOpen]);

  const desktopLinkCls = (active: boolean) =>
    `px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-300 ease-in-out ${
      active
        ? scrolled ? 'text-brand-700 bg-brand-50/80' : 'text-gold-400 bg-white/10'
        : scrolled
          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
          : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;

  /* ── Header + Mobile Menu: Portal로 body 직속 렌더링 (ScrollSmoother transform 회피) ── */
  const headerEl = (
    <>
      <header
        className={`fixed inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? 'top-0 bg-transparent'
            : scrolled
              ? 'top-3 md:top-4 px-4 md:px-6'
              : 'top-0 bg-transparent'
        }`}
      >
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled && !open
              ? 'max-w-5xl mx-auto bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60 rounded-2xl'
              : 'max-w-7xl mx-auto'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${
            scrolled && !open ? 'h-14 px-5 md:px-6' : 'h-16 px-6 lg:px-8'
          }`}>
            <Link to={homePath} onClick={handleHomeClick} className="relative z-50">
              <img
                src="/logos/interohrigin-inc.png"
                alt="INTEROHRIGIN I&C"
                className={`w-auto transition-all duration-300 ${
                  scrolled && !open ? 'h-5 md:h-6' : 'h-5 md:h-6 brightness-0 invert'
                }`}
              />
            </Link>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center gap-0.5">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={l.to === homePath ? handleHomeClick : undefined}
                  className={({ isActive }) => desktopLinkCls(isActive)}
                >
                  {l.label}
                </NavLink>
              ))}

              {/* 언어 드롭다운 */}
              <div className="relative ml-2 lang-dropdown">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-300 border ${
                    scrolled
                      ? 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400'
                      : 'border-white/20 text-white/70 hover:text-white hover:border-white/50'
                  }`}
                >
                  {langLabel(lang)}
                  <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden min-w-[120px] z-50">
                    {allLangs.map(code => (
                      <button
                        key={code}
                        onClick={() => switchToLang(code)}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                          code === lang
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {langLabel(code)} <span className="text-slate-400 ml-1">{langFullName(code)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* 모바일 햄버거 */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden relative z-50 p-2 rounded-lg transition-colors duration-300 text-white hover:bg-white/10"
              style={scrolled && !open ? { color: '#475569' } : undefined}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 모바일 Fullscreen Overlay Menu ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-slate-900/98 backdrop-blur-xl" />
        <nav className="relative h-full flex flex-col items-center justify-center gap-2">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={(e) => { setOpen(false); if (l.to === homePath) handleHomeClick(e); }}
              className={({ isActive }) =>
                `text-2xl font-bold tracking-tight transition-all duration-300 py-3 px-6 rounded-xl ${
                  isActive ? 'text-gold-400' : 'text-white/70 hover:text-white'
                }`
              }
              style={{
                transitionDelay: open ? `${i * 60}ms` : '0ms',
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                opacity: open ? 1 : 0,
              }}
            >
              {l.label}
            </NavLink>
          ))}

          {/* Language buttons in overlay */}
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            style={{
              transitionDelay: open ? `${links.length * 60}ms` : '0ms',
              transform: open ? 'translateY(0)' : 'translateY(20px)',
              opacity: open ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            {allLangs.map(code => (
              <button
                key={code}
                onClick={() => switchToLang(code)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  code === lang
                    ? 'bg-gold-400 text-slate-900'
                    : 'border border-white/20 text-white/70 hover:text-white hover:border-white/50'
                }`}
              >
                {langFullName(code)}
              </button>
            ))}
          </div>

          {/* SNS in overlay */}
          <div
            className="flex items-center gap-4 mt-6"
            style={{
              transitionDelay: open ? `${links.length * 60}ms` : '0ms',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            {sns.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-white transition-colors border border-slate-700 rounded-lg px-3 py-1.5"
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Header를 body 직속으로 포탈 렌더링 — ScrollSmoother transform 영향 회피 */}
      {createPortal(headerEl, document.body)}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ── UI Strings ── */
const UI_STRINGS: Record<string, Record<string, string>> = {
  footerDescription: {
    ko: '글로벌 뷰티 마켓을 리드하는 토탈 커머스 기업. 20년 이상의 마케팅 역량과 유통 네트워크로 브랜드 가치를 극대화합니다.',
    en: 'A total commerce group leading the global beauty market. We maximize brand value with 20+ years of marketing expertise and distribution networks.',
    ja: 'グローバルビューティーマーケットをリードするトータルコマース企業。20年以上のマーケティング力と流通ネットワークでブランド価値を最大化します。',
    zh: '引领全球美妆市场的综合商务集团。凭借20多年的营销能力和分销网络，最大化品牌价值。',
  },
  footerAddress: {
    ko: '서울특별시 강남구 선릉로121길 5, 3층\n(논현동, 인터오리진타워)',
    en: '3F, 5 Seolleung-ro 121-gil, Gangnam-gu\nSeoul, South Korea',
    ja: '韓国ソウル市江南区宣陵路121ギル5、3階\n（論峴洞、インターオリジンタワー）',
    zh: '韩国首尔市江南区宣陵路121街5号3层\n（论岘洞，INTEROHRIGIN大厦）',
  },
};

function getUIString(key: string, lang: string): string {
  const map = UI_STRINGS[key];
  if (!map) return '';
  return map[lang] || map.en || map.ko || '';
}

/* ── Footer ── */
function Footer() {
  const { lang, prefix } = useLang();
  const footerLinks = baseLinks.map(l => ({
    to: l.path === '/' ? (prefix || '/') : `${prefix}${l.path}`,
    label: l.label,
  }));

  const addressText = getUIString('footerAddress', lang);
  const descText = getUIString('footerDescription', lang);

  const sns = useSnsLinks();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* 회사 정보 */}
        <div className="footer-col col-span-2 md:col-span-1">
          <div className="mb-4">
            <img src="/logos/interohrigin-inc.png" alt="INTEROHRIGIN I&C" className="h-5 w-auto brightness-0 invert" loading="lazy" />
          </div>
          <p className="leading-relaxed text-slate-500 text-xs md:text-sm">
            {descText}
          </p>
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            {sns.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <p className="text-white font-semibold mb-3 text-xs md:text-sm">Quick Links</p>
          <ul className="space-y-1.5">
            {footerLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors text-xs md:text-sm">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business */}
        <div className="footer-col">
          <p className="text-white font-semibold mb-3 text-xs md:text-sm">Business</p>
          <ul className="space-y-1.5 text-slate-500 text-xs md:text-sm">
            <li>Global Commerce</li>
            <li>Advertising & PPL</li>
            <li>Logistics</li>
            <li>AI & Tech</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <p className="text-white font-semibold mb-3 text-xs md:text-sm">Contact</p>
          <p className="text-slate-500 leading-relaxed text-xs md:text-sm">
            {addressText.split('\n').map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
            <br />Tel. 070-4188-0322<br />biz@interohrigin.com
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center py-4 md:py-5 text-[10px] md:text-xs text-slate-600">
        &copy; {new Date().getFullYear()} INTEROHRIGIN I&C. All rights reserved.
      </div>
    </footer>
  );
}
