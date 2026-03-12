import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/agency', label: 'Home' },
  { to: '/agency/work', label: 'Work' },
  { to: '/agency/services', label: 'Services' },
  { to: '/agency/about', label: 'About' },
];

export default function AgencyLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const linkCls = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors ${active ? 'text-white bg-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/5' : ''}`}
        style={{ mixBlendMode: scrolled ? 'normal' : 'difference' }}
      >
        <div className="max-w-7xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
          <Link to="/agency" className="flex items-center gap-3">
            <img src="/logos/interohrigin.png" alt="INTEROHRIGIN" className="h-5 w-auto brightness-0 invert" />
            <span className="font-bold text-sm tracking-tight">Agency</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/agency'} className={({ isActive }) => linkCls(isActive)}>{l.label}</NavLink>
            ))}
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/agency'} onClick={() => setOpen(false)} className={({ isActive }) => linkCls(isActive)}>{l.label}</NavLink>
            ))}
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/logos/interohrigin.png" alt="INTEROHRIGIN" className="h-4 w-auto brightness-0 invert" />
              <span className="text-white font-bold">Agency</span>
            </div>
            <p className="text-white/30 leading-relaxed">데이터 기반 퍼포먼스 마케팅과 크리에이티브를 결합하여 브랜드의 성장을 가속합니다.</p>
          </div>
          <div>
            <p className="text-white/60 font-semibold mb-3">Links</p>
            <ul className="space-y-2">
              {links.map(l => <li key={l.to}><Link to={l.to} className="text-white/30 hover:text-white transition-colors">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-white/60 font-semibold mb-3">Contact</p>
            <p className="text-white/30 leading-relaxed">서울특별시 강남구 선릉로121길 5, 3층<br />(논현동, 인터오리진타워)<br />Tel. 070-4188-0322<br />biz@interohrigin.com</p>
          </div>
        </div>
        <div className="border-t border-white/5 text-center py-4 text-xs text-white/20">
          &copy; {new Date().getFullYear()} Interohrigin Agency. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
