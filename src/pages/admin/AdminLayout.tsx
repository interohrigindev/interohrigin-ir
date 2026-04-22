import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastProvider } from '../../components/admin/Toast';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Video,
  Briefcase,
  Clock,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const pageLinks = [
  { to: '/admin/pages/home', label: 'Home', icon: FileText },
  { to: '/admin/pages/about', label: 'About', icon: FileText },
  { to: '/admin/pages/brands', label: 'Brands', icon: FileText },
  { to: '/admin/pages/business', label: 'Business', icon: FileText },
  { to: '/admin/pages/contact', label: 'Contact', icon: FileText },
];

const dataLinks = [
  { to: '/admin/brands', label: '브랜드 관리', icon: Tag },
  { to: '/admin/portfolio', label: '포트폴리오 관리', icon: Briefcase },
  { to: '/admin/videos', label: '영상 관리', icon: Video },
  { to: '/admin/history', label: '연혁 관리', icon: Clock },
  { to: '/admin/inquiries', label: '문의 내역', icon: MessageSquare },
];

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-slate-900 text-white font-medium'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const sidebar = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center gap-2.5 border-b border-slate-200 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
          <span className="text-white font-black text-xs">IR</span>
        </div>
        <span className="font-bold text-sm text-slate-900">Admin</span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <NavLink to="/admin" end className={navLinkCls} onClick={() => setMobileOpen(false)}>
            <LayoutDashboard className="w-4 h-4" />
            대시보드
          </NavLink>
        </div>

        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">페이지 편집</p>
          <div className="space-y-0.5">
            {pageLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={navLinkCls} onClick={() => setMobileOpen(false)}>
                <l.icon className="w-4 h-4" />
                {l.label}
                <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">데이터 관리</p>
          <div className="space-y-0.5">
            {dataLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={navLinkCls} onClick={() => setMobileOpen(false)}>
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <NavLink to="/admin/settings" className={navLinkCls} onClick={() => setMobileOpen(false)}>
            <Settings className="w-4 h-4" />
            사이트 설정
          </NavLink>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-1 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          사이트 보기
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </nav>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200 flex-col fixed inset-y-0 left-0 z-30">
          {sidebar}
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
              {sidebar}
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 lg:ml-60">
          {/* Top bar */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 sticky top-0 z-20">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900">
              <Menu className="w-5 h-5" />
            </button>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:block">{user.email}</span>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
