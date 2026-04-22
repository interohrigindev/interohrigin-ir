import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import UnifiedLayout from './layouts/UnifiedLayout';
import Home from './pages/v2/Home';
import About from './pages/v2/About';
import Brands from './pages/v2/Brands';
import Business from './pages/v2/Business';
import Contact from './pages/v2/Contact';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEnabledLanguages } from './hooks/useEnabledLanguages';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import HomeEditor from './pages/admin/pages/HomeEditor';
import AboutEditor from './pages/admin/pages/AboutEditor';
import BrandsEditor from './pages/admin/pages/BrandsEditor';
import BusinessEditor from './pages/admin/pages/BusinessEditor';
import ContactEditor from './pages/admin/pages/ContactEditor';
import BrandManager from './pages/admin/BrandManager';
import VideoManager from './pages/admin/VideoManager';
import ServiceManager from './pages/admin/ServiceManager';
import HistoryManager from './pages/admin/HistoryManager';
import InquiryManager from './pages/admin/InquiryManager';
import PortfolioManager from './pages/admin/PortfolioManager';
import SiteSettings from './pages/admin/SiteSettings';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function SmoothWrapper({ children }: { children: React.ReactNode }) {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useLayoutEffect(() => {
    // 모바일(768px 이하)에서는 ScrollSmoother 비활성화 — 성능 이슈 방지
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      smootherRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5,
        effects: true,
      });
      (window as any).__smoother = smootherRef.current;

      return () => {
        smootherRef.current?.kill();
        smootherRef.current = null;
        (window as any).__smoother = null;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
        </div>
      </div>
    </>
  );
}

/** 랜딩 페이지 라우트 세트 (언어별 재사용) */
function LandingRoutes({ lang, enabledLangs }: { lang: string; enabledLangs: string[] }) {
  return (
    <LanguageProvider lang={lang} enabledLangs={enabledLangs}>
      <SmoothWrapper>
        <UnifiedLayout />
      </SmoothWrapper>
    </LanguageProvider>
  );
}

/** 동적 언어 라우트 — /:lang/* 에서 유효한 언어인지 검증 */
function LangValidator({ enabledLangs }: { enabledLangs: string[] }) {
  const { lang } = useParams<{ lang: string }>();
  if (!lang || !enabledLangs.includes(lang)) {
    return <Navigate to="/" replace />;
  }
  return <LandingRoutes lang={lang} enabledLangs={enabledLangs} />;
}

function AppRoutes() {
  const { enabledLangs } = useEnabledLanguages();

  return (
    <Routes>
      {/* 한국어 (기본) */}
      <Route path="/" element={<LandingRoutes lang="ko" enabledLangs={enabledLangs} />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="brands" element={<Brands />} />
        <Route path="business" element={<Business />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* 동적 다국어 라우트 */}
      <Route path="/:lang" element={<LangValidator enabledLangs={enabledLangs} />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="brands" element={<Brands />} />
        <Route path="business" element={<Business />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pages/home" element={<HomeEditor />} />
        <Route path="pages/about" element={<AboutEditor />} />
        <Route path="pages/brands" element={<BrandsEditor />} />
        <Route path="pages/business" element={<BusinessEditor />} />
        <Route path="pages/contact" element={<ContactEditor />} />
        <Route path="brands" element={<BrandManager />} />
        <Route path="videos" element={<VideoManager />} />
        <Route path="services" element={<ServiceManager />} />
        <Route path="history" element={<HistoryManager />} />
        <Route path="portfolio" element={<PortfolioManager />} />
        <Route path="inquiries" element={<InquiryManager />} />
        <Route path="settings" element={<SiteSettings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
