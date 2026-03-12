import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/inc', label: 'Home' },
  { to: '/inc/about', label: 'About' },
  { to: '/inc/brands', label: 'Brands' },
  { to: '/inc/contact', label: 'Contact' },
];

export default function IncLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const linkCls = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Nav */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
          <Link to="/inc" className="flex items-center gap-3">
            <img src="/logos/interohrigin.png" alt="INTEROHRIGIN" className="h-5 w-auto" />
            <span className="font-bold text-sm tracking-tight text-blue-600">I&C</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/inc'} className={({ isActive }) => linkCls(isActive)}>{l.label}</NavLink>
            ))}
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-3 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/inc'} onClick={() => setOpen(false)} className={({ isActive }) => linkCls(isActive)}>{l.label}</NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 pt-16"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/logos/interohrigin.png" alt="INTEROHRIGIN" className="h-4 w-auto brightness-0 invert" />
              <span className="text-white font-bold">I&C</span>
            </div>
            <p className="leading-relaxed text-slate-500">20년 이상의 마케팅 역량과 글로벌 유통 네트워크를 통해 브랜드의 가치를 극대화합니다.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Links</p>
            <ul className="space-y-2">
              {links.map(l => <li key={l.to}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Contact</p>
            <p className="text-slate-500 leading-relaxed">서울특별시 강남구 선릉로121길 5, 3층<br />(논현동, 인터오리진타워)<br />Tel. 070-4188-0322<br />biz@interohrigin.com</p>
          </div>
        </div>
        <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} I&C. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
