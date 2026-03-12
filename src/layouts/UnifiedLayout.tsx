import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const sns = [
  { label: 'Instagram', href: 'https://www.instagram.com/interohrigin_official/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@interohrigin' },
  { label: 'Blog', href: 'https://blog.naver.com/interohrigin' },
];

const baseLinks = [
  { path: '/', label: 'Home', end: true },
  { path: '/about', label: 'About Us', end: false },
  { path: '/brands', label: 'Brands', end: false },
  { path: '/business', label: 'Business', end: false },
  { path: '/contact', label: 'Contact', end: false },
];

export default function UnifiedLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, prefix, switchPath } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  // 언어 prefix가 적용된 링크 목록
  const links = baseLinks.map(l => ({
    to: l.path === '/' ? (prefix || '/') : `${prefix}${l.path}`,
    label: l.label,
    end: l.end,
  }));

  const toggleLang = () => {
    const targetLang = lang === 'ko' ? 'en' : 'ko';
    const newPath = switchPath(targetLang, location.pathname);
    navigate(newPath);
  };

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
              <button
                onClick={toggleLang}
                className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-300 border ${
                  scrolled
                    ? 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400'
                    : 'border-white/20 text-white/70 hover:text-white hover:border-white/50'
                }`}
              >
                {lang === 'ko' ? 'EN' : 'KO'}
              </button>
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

          {/* Language toggle in overlay */}
          <button
            onClick={() => { toggleLang(); setOpen(false); }}
            className="mt-6 px-5 py-2 rounded-xl border border-white/20 text-sm font-bold text-white/70 hover:text-white hover:border-white/50 transition-colors"
            style={{
              transitionDelay: open ? `${links.length * 60}ms` : '0ms',
              transform: open ? 'translateY(0)' : 'translateY(20px)',
              opacity: open ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            {lang === 'ko' ? 'English' : '한국어'}
          </button>

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

/* ── Footer ── */
function Footer() {
  const { lang, prefix } = useLang();
  const footerLinks = baseLinks.map(l => ({
    to: l.path === '/' ? (prefix || '/') : `${prefix}${l.path}`,
    label: l.label,
  }));
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* 회사 정보 */}
        <div className="footer-col col-span-2 md:col-span-1">
          <div className="mb-4">
            <img src="/logos/interohrigin-inc.png" alt="INTEROHRIGIN I&C" className="h-5 w-auto brightness-0 invert" loading="lazy" />
          </div>
          <p className="leading-relaxed text-slate-500 text-xs md:text-sm">
            {lang === 'en'
              ? 'A total commerce group leading the global beauty market. We maximize brand value with 20+ years of marketing expertise and distribution networks.'
              : '글로벌 뷰티 마켓을 리드하는 토탈 커머스 기업. 20년 이상의 마케팅 역량과 유통 네트워크로 브랜드 가치를 극대화합니다.'}
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
            {lang === 'en' ? (
              <>3F, 5 Seolleung-ro 121-gil, Gangnam-gu<br />Seoul, South Korea<br />Tel. 070-4188-0322<br />biz@interohrigin.com</>
            ) : (
              <>서울특별시 강남구 선릉로121길 5, 3층<br />(논현동, 인터오리진타워)<br />Tel. 070-4188-0322<br />biz@interohrigin.com</>
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center py-4 md:py-5 text-[10px] md:text-xs text-slate-600">
        &copy; {new Date().getFullYear()} INTEROHRIGIN I&C. All rights reserved.
      </div>
    </footer>
  );
}
