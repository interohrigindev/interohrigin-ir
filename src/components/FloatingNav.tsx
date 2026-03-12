import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Building2, Megaphone } from 'lucide-react';

export default function FloatingNav() {
  const { pathname } = useLocation();
  const nav = useNavigate();

  if (pathname === '/' || pathname.startsWith('/admin') || pathname.startsWith('/v2')) return null;

  const isInc = pathname.startsWith('/inc');
  const isAgency = pathname.startsWith('/agency');
  const base = 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200';

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 shadow-2xl">
        <button onClick={() => nav('/')} className={`${base} ${!isInc && !isAgency ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </button>
        <button onClick={() => nav('/inc')} className={`${base} ${isInc ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline">I&C</span>
        </button>
        <button onClick={() => nav('/agency')} className={`${base} ${isAgency ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Megaphone className="w-4 h-4" />
          <span className="hidden sm:inline">Agency</span>
        </button>
      </div>
    </nav>
  );
}
