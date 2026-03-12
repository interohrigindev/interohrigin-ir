import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import {
  Tag,
  Video,
  Briefcase,
  Clock,
  MessageSquare,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface StatCard {
  label: string;
  count: number;
  icon: typeof Tag;
  to: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const collections = [
        { name: 'brands', label: '브랜드', icon: Tag, to: '/admin/brands', color: 'bg-blue-50 text-blue-600' },
        { name: 'videos', label: 'PR 영상', icon: Video, to: '/admin/videos', color: 'bg-violet-50 text-violet-600' },
        { name: 'services', label: '서비스', icon: Briefcase, to: '/admin/services', color: 'bg-emerald-50 text-emerald-600' },
        { name: 'history_items', label: '연혁', icon: Clock, to: '/admin/history', color: 'bg-amber-50 text-amber-600' },
        { name: 'contact_submissions', label: '문의', icon: MessageSquare, to: '/admin/inquiries', color: 'bg-rose-50 text-rose-600' },
      ];

      const results = await Promise.all(
        collections.map(async (c) => {
          try {
            const snap = await getCountFromServer(collection(db, c.name));
            return { ...c, count: snap.data().count };
          } catch {
            return { ...c, count: 0 };
          }
        })
      );
      setStats(results);
      setLoading(false);
    }
    fetchCounts();
  }, []);

  const quickLinks = [
    { to: '/admin/pages/home', label: 'Home 페이지 편집' },
    { to: '/admin/pages/about', label: 'About 페이지 편집' },
    { to: '/admin/pages/brands', label: 'Brands 페이지 편집' },
    { to: '/admin/pages/business', label: 'Business 페이지 편집' },
    { to: '/admin/pages/contact', label: 'Contact 페이지 편집' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">대시보드</h1>
        <p className="text-sm text-slate-500 mt-1">Interohrigin I&C 콘텐츠 관리</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="w-8 h-8 bg-slate-100 rounded-lg mb-3" />
                <div className="h-6 bg-slate-100 rounded w-10 mb-1" />
                <div className="h-4 bg-slate-100 rounded w-16" />
              </div>
            ))
          : stats.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </Link>
            ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            페이지 편집 바로가기
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {quickLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {l.label}
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
