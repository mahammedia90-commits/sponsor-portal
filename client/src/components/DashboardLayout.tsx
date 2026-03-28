/**
 * DashboardLayout — Maham Expo Sponsor Portal
 * Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism + Gold Accents + Dual Mode (Light/Dark)
 */
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useRoute } from 'wouter';
import { useLanguage, allLanguages } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard, Sparkles, FileText, CreditCard, Users, BarChart3,
  Bot, MessageSquare, Bell, HelpCircle, User, Shield, Megaphone,
  Eye, Calculator, Search, Globe, ChevronLeft, ChevronRight, Menu, X,
  Building2, Award, Sun, Moon, Crown, Map, Layers, Upload, ListChecks,
  Calendar, ClipboardList, Handshake, ChevronDown, LogOut
} from 'lucide-react';

// Real Maham Expo logos
const LOGO_DARK = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/mahamexpo-logo-dark_2f2c36c9.jpeg';
const LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/mahamexpo-logo-white_b6f5381f.webp';

interface NavItem {
  key: string;
  icon: React.ElementType;
  route: string;
  badge?: number;
  section?: string;
}

const navItems: NavItem[] = [
  { key: 'nav.dashboard', icon: LayoutDashboard, route: '/dashboard', section: 'main' },
  { key: 'nav.opportunities', icon: Sparkles, route: '/opportunities', section: 'main' },
  { key: 'nav.mySponsorships', icon: Award, route: '/sponsorships', section: 'main' },
  { key: 'nav.contracts', icon: FileText, route: '/contracts', section: 'manage' },
  { key: 'nav.payments', icon: CreditCard, route: '/payments', section: 'manage' },
  { key: 'nav.leads', icon: Users, route: '/leads', section: 'manage' },
  { key: 'nav.campaigns', icon: Megaphone, route: '/campaigns', section: 'marketing' },
  { key: 'nav.brandExposure', icon: Eye, route: '/brand-exposure', section: 'marketing' },
  { key: 'nav.analytics', icon: BarChart3, route: '/analytics', section: 'marketing' },
  { key: 'nav.roiCalculator', icon: Calculator, route: '/roi-calculator', section: 'marketing' },
  { key: 'nav.assetMap', icon: Map, route: '/asset-map', section: 'sponsorship' },
  { key: 'nav.packageComparison', icon: Layers, route: '/package-compare', section: 'sponsorship' },
  { key: 'nav.brandAssets', icon: Upload, route: '/brand-assets', section: 'sponsorship' },
  { key: 'nav.deliveryTracking', icon: ListChecks, route: '/deliverables', section: 'sponsorship' },
  { key: 'nav.eventCalendar', icon: Calendar, route: '/event-calendar', section: 'sponsorship' },
  { key: 'nav.postEventReport', icon: ClipboardList, route: '/post-event-report', section: 'sponsorship' },
  { key: 'nav.networking', icon: Handshake, route: '/networking', section: 'sponsorship' },
  { key: 'nav.aiAssistant', icon: Bot, route: '/ai-assistant', section: 'tools' },
  { key: 'nav.messages', icon: MessageSquare, route: '/messages', section: 'tools' },
  { key: 'nav.teamManagement', icon: Building2, route: '/team', section: 'tools' },
  { key: 'nav.profile', icon: User, route: '/profile', section: 'account' },
  { key: 'nav.kyc', icon: Shield, route: '/verification', section: 'account' },
  { key: 'nav.helpCenter', icon: HelpCircle, route: '/help', section: 'account' },
];

const mobileBottomItems = ['nav.dashboard', 'nav.opportunities', 'nav.mySponsorships', 'nav.leads', 'nav.analytics'];

const sectionLabels: Record<string, Record<string, string>> = {
  ar: { main: 'الرئيسية', manage: 'الإدارة', marketing: 'التسويق والتحليلات', sponsorship: 'إدارة الرعاية', tools: 'الأدوات', account: 'الحساب' },
  en: { main: 'Main', manage: 'Management', marketing: 'Marketing & Analytics', sponsorship: 'Sponsorship Management', tools: 'Tools', account: 'Account' },
  fr: { main: 'Principal', manage: 'Gestion', marketing: 'Marketing', sponsorship: 'Parrainage', tools: 'Outils', account: 'Compte' },
  es: { main: 'Principal', manage: 'Gestión', marketing: 'Marketing', sponsorship: 'Patrocinio', tools: 'Herramientas', account: 'Cuenta' },
  de: { main: 'Haupt', manage: 'Verwaltung', marketing: 'Marketing', sponsorship: 'Sponsoring', tools: 'Werkzeuge', account: 'Konto' },
  zh: { main: '主要', manage: '管理', marketing: '营销', sponsorship: '赞助管理', tools: '工具', account: '账户' },
  tr: { main: 'Ana', manage: 'Yönetim', marketing: 'Pazarlama', sponsorship: 'Sponsorluk', tools: 'Araçlar', account: 'Hesap' },
  ur: { main: 'اہم', manage: 'انتظام', marketing: 'مارکیٹنگ', sponsorship: 'سپانسرشپ', tools: 'ٹولز', account: 'اکاؤنٹ' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t, language, setLanguage, isRTL, languageFlag } = useLanguage();
  const { unreadCount, user, logout: authLogout, sponsor } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [headerLangDropdownOpen, setHeaderLangDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const headerLangDropdownRef = useRef<HTMLDivElement>(null);

  const sections = ['main', 'manage', 'marketing', 'sponsorship', 'tools', 'account'];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
      if (headerLangDropdownRef.current && !headerLangDropdownRef.current.contains(e.target as Node)) setHeaderLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [location]);

  const currentPageTitle = navItems.find(i => location === i.route || (i.route !== '/dashboard' && location.startsWith(i.route)));
  const headerBlurred = scrollY > 10;

  /* ===== COLOR HELPERS ===== */
  const activeColor = isDark ? 'text-[#d4b85a]' : 'text-[#987012]';
  const activeBg = isDark ? 'bg-[#d4b85a]/10' : 'bg-[#987012]/5';
  const hoverBg = isDark ? 'hover:bg-[#2a2313]' : 'hover:bg-[#fbf8f0]';
  const accentDot = isDark ? 'bg-[#d4b85a]' : 'bg-[#987012]';
  const badgeBg = isDark ? 'bg-[#d4b85a] text-[#1a1610]' : 'bg-[#987012] text-white';
  const mutedText = isDark ? 'text-[#a89070]' : 'text-[#8b7355]';
  const sectionText = isDark ? 'text-[#5c440a]' : 'text-[#b8891a]';

  /* ===== NAV ITEM RENDERER ===== */
  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = location === item.route || (item.route !== '/dashboard' && location.startsWith(item.route));
    const Icon = item.icon;
    const badge = item.key === 'nav.notifications' ? unreadCount : item.badge;

    if (isMobile) {
      return (
        <Link key={item.key} href={item.route}>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all duration-300 ${
            isActive
              ? `${activeColor} ${activeBg}`
              : `${mutedText} ${isDark ? 'active:bg-[#2a2313]' : 'active:bg-[#fbf8f0]'}`
          }`}>
            <Icon size={16} className="shrink-0" />
            <span className={`truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>{t(item.key)}</span>
            {badge && badge > 0 && (
              <span className={`${badgeBg} text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 min-w-[1.25rem] text-center`}>
                {badge}
              </span>
            )}
          </div>
        </Link>
      );
    }

    return (
      <Link key={item.key} href={item.route}>
        <div
          className={`group flex items-center gap-2.5 mx-1.5 xl:mx-2 px-2.5 xl:px-3 py-[0.55rem] rounded-lg text-xs xl:text-[13px] transition-all duration-500 relative overflow-hidden ${
            isActive
              ? `${activeColor} ${activeBg} font-bold`
              : `${mutedText} hover:text-[#d4a843] ${isDark ? 'hover:bg-[rgba(212,168,67,0.05)]' : 'hover:bg-[rgba(212,168,67,0.05)]'}`
          }`}
          onMouseEnter={() => setHoveredItem(item.key)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Nour Theme: Gold border indicator on active item */}
          {isActive && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-[15%] bottom-[15%] w-[3px] rounded-full`}
              style={{ background: isDark ? '#d4b85a' : '#987012' }} />
          )}

          <div className="relative z-10">
            <Icon size={16} className={`shrink-0 transition-all duration-500 ${
              isActive ? '' : 'group-hover:scale-110 group-hover:rotate-[6deg]'
            }`} />
          </div>

          {sidebarOpen && (
            <div className="flex items-center justify-between flex-1 min-w-0 relative z-10">
              <span className={`truncate ${isActive ? 'font-bold' : 'font-medium'}`}>{t(item.key)}</span>
              {badge && badge > 0 && (
                <span className={`${badgeBg} text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 min-w-[1.25rem] text-center`}>
                  {badge}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  };

  /* ===== LANGUAGE DROPDOWN ===== */
  const LanguageDropdown = ({ isHeader = false }: { isHeader?: boolean }) => {
    const isOpen = isHeader ? headerLangDropdownOpen : langDropdownOpen;
    const setOpen = isHeader ? setHeaderLangDropdownOpen : setLangDropdownOpen;
    const ref = isHeader ? headerLangDropdownRef : langDropdownRef;

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs transition-all duration-300 ${
            isHeader
              ? 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              : `${mutedText} ${hoverBg} w-full px-2.5 xl:px-3 py-2`
          }`}
        >
          <Globe size={isHeader ? 13 : 15} className="shrink-0" />
          <span className="font-medium text-[10px] sm:text-xs">{languageFlag} {allLanguages.find(l => l.code === language)?.name}</span>
          <ChevronDown size={11} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            className={`absolute z-[100] mt-1 rounded-xl overflow-hidden ${
              isHeader ? (isRTL ? 'left-0' : 'right-0') : (isRTL ? 'right-0' : 'left-0')
            } ${isHeader ? 'bottom-auto top-full' : 'bottom-full top-auto mb-1'}`}
            style={{
              background: isDark ? 'rgba(26, 22, 16, 0.98)' : '#fffefb',
              backdropFilter: 'blur(24px)',
              border: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.12)' : 'rgba(63, 52, 28, 0.1)'}`,
              minWidth: '10rem',
              animation: 'fadeInUp 0.2s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(63, 52, 28, 0.1)',
            }}
          >
            <div className="py-1">
              {allLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all duration-200 ${
                    language === lang.code
                      ? `${activeColor} font-semibold ${activeBg}`
                      : `${mutedText} ${hoverBg}`
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentDot}`} style={{ marginInlineStart: 'auto' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        ref={sidebarRef}
        className={`hidden lg:flex flex-col fixed top-0 h-screen z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? 'w-60 xl:w-64' : 'w-[4.5rem]'
        } ${isRTL ? 'right-0' : 'left-0'}`}
        style={{
          background: isDark
            ? 'rgba(10, 10, 10, 0.92)'
            : '#FFFFFF',
          backdropFilter: isDark ? 'blur(24px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: isDark ? 'blur(24px) saturate(1.5)' : 'none',
          boxShadow: isDark
            ? (isRTL ? '-1px 0 40px rgba(0,0,0,0.5)' : '1px 0 40px rgba(0,0,0,0.5)')
            : (isRTL ? '-1px 0 20px rgba(0,0,0,0.04)' : '1px 0 20px rgba(0,0,0,0.04)'),
          borderRight: isRTL ? 'none' : `1px solid ${isDark ? 'rgba(212, 168, 67, 0.10)' : '#F0EEE7'}`,
          borderLeft: isRTL ? `1px solid ${isDark ? 'rgba(212, 168, 67, 0.10)' : '#F0EEE7'}` : 'none',
        }}
      >
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, #d4b85a, transparent)'
            : 'linear-gradient(90deg, transparent, #987012, transparent)',
          opacity: isDark ? 0.5 : 0.3,
        }} />

        {/* Logo — Real Maham Expo */}
        <div className="p-3 xl:p-4 shrink-0" style={{
          borderBottom: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.08)' : 'rgba(63, 52, 28, 0.06)'}`,
        }}>
          {sidebarOpen ? (
            <div className="text-center group">
              <div className="relative inline-block">
                <img
                  src={isDark ? LOGO_DARK : LOGO_WHITE}
                  alt="Maham Expo"
                  className="h-14 xl:h-16 w-auto mx-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-1.5 space-y-0.5">
                <p className={`text-[9px] xl:text-[10px] leading-tight truncate ${isDark ? 'text-[#7a5a0e]' : 'text-[#b8891a]'}`}>{t('app.company')}</p>
                <p className={`text-[8px] xl:text-[9px] leading-tight truncate ${isDark ? 'text-[#5c440a]' : 'text-[#d4a832]'}`}>{t('app.companyEn')}</p>
                <p className={`text-[7px] xl:text-[8px] mt-0.5 truncate ${isDark ? 'text-[#4d3a11]' : 'text-[#dccb8f]'}`}>{t('app.companyParent')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto border ${
                isDark ? 'bg-[#d4b85a]/10 border-[#d4b85a]/15' : 'bg-[#987012]/5 border-[#987012]/10'
              }`}>
                <Crown size={17} className={isDark ? 'text-[#d4b85a]' : 'text-[#987012]'} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2.5">
          {sections.map(section => {
            const items = navItems.filter(i => i.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section} className="mb-1.5">
                {sidebarOpen && (
                  <p className={`px-3 xl:px-4 py-1.5 text-[8px] xl:text-[9px] uppercase tracking-[0.15em] font-semibold ${sectionText}`}>
                    {sectionLabels[language]?.[section] || sectionLabels['en']?.[section] || section}
                  </p>
                )}
                {items.map(item => renderNavItem(item))}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 space-y-0.5 shrink-0" style={{
          borderTop: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.08)' : 'rgba(63, 52, 28, 0.06)'}`,
        }}>
          {sidebarOpen && (
            <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-1 ${isDark ? 'bg-[#d4b85a]/5' : 'bg-[#987012]/3'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isDark ? 'bg-[#d4b85a]/10 border-[#d4b85a]/15' : 'bg-[#987012]/5 border-[#987012]/10'
              }`}>
                <Crown size={14} className={isDark ? 'text-[#d4b85a]' : 'text-[#987012]'} />
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-medium truncate ${isDark ? 'text-[#f5ecd4]' : 'text-[#3f341c]'}`}>{sponsor?.companyName || user?.name || t('role.sponsor')}</p>
                <p className={`text-[9px] truncate ${isDark ? 'text-[#7a5a0e]' : 'text-[#b8891a]'}`}>{sponsor?.brandName || t('role.company')}</p>
              </div>
            </div>
          )}

          {sidebarOpen && <LanguageDropdown />}

          {sidebarOpen && toggleTheme && (
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center gap-2.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-[13px] transition-all duration-300 group theme-toggle-btn ${
                mutedText} ${hoverBg}`}
            >
              <div className="relative transition-transform duration-500 group-hover:rotate-180">
                {isDark ? <Sun size={15} className="group-hover:text-[#e6b830] transition-colors" /> : <Moon size={15} className="group-hover:text-[#987012] transition-colors" />}
              </div>
              <span className="font-medium">{isDark ? t('theme.light') : t('theme.dark')}</span>
            </button>
          )}
          {sidebarOpen && (
            <button
              onClick={async () => {
                try { await logoutMutation.mutateAsync(); } catch {}
                window.location.href = '/';
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-[13px] transition-all duration-300 group ${
                isDark ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10' : 'text-red-500/50 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <LogOut size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="font-medium">{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center justify-center p-2 transition-all duration-300 rounded-xl ${
              isDark ? 'text-[#5c440a] hover:text-[#d4b85a] hover:bg-[#2a2313]' : 'text-[#dccb8f] hover:text-[#987012] hover:bg-[#fbf8f0]'
            }`}
          >
            <div className="transition-transform duration-500" style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </div>
          </button>
        </div>
      </aside>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        style={{
          background: isDark ? 'rgba(26, 22, 16, 0.95)' : 'rgba(255, 253, 249, 0.95)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderTop: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.1)' : 'rgba(63, 52, 28, 0.06)'}`,
          boxShadow: isDark ? '0 -4px 24px rgba(0,0,0,0.2)' : '0 -4px 24px rgba(63,52,28,0.04)',
        }}
      >
        <div className="flex justify-around items-center py-1.5 px-1">
          {navItems.filter(i => mobileBottomItems.includes(i.key)).map(item => {
            const isActive = location === item.route;
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.route}>
                <div className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[3.25rem] ${
                  isActive
                    ? `${activeColor} ${activeBg}`
                    : isDark ? 'text-[#7a5a0e]' : 'text-[#b8891a]'
                }`}>
                  <div className="relative">
                    <Icon size={19} className={`shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                    {isActive && (
                      <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${accentDot}`} />
                    )}
                  </div>
                  <span className={`text-[8px] sm:text-[9px] leading-tight text-center truncate max-w-[3.5rem] ${isActive ? 'font-semibold' : ''}`}>
                    {t(item.key).split(' ')[0]}
                  </span>
                </div>
              </Link>
            );
          })}
          <button onClick={() => setMobileMenuOpen(true)} className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 min-w-[3.25rem] ${isDark ? 'text-[#7a5a0e]' : 'text-[#b8891a]'}`}>
            <Menu size={19} className="shrink-0" />
            <span className="text-[8px] sm:text-[9px] leading-tight">{t('common.more')}</span>
          </button>
        </div>
      </div>

      {/* ===== MOBILE SLIDE-OUT MENU ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}
            style={{ animation: 'fadeInUp 0.25s cubic-bezier(0.22,1,0.36,1)' }} />
          <div
            className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-[min(18rem,85vw)] h-full overflow-y-auto overscroll-contain scrollbar-thin`}
            onClick={e => e.stopPropagation()}
            style={{
              background: isDark ? '#1a1610' : '#fffefb',
              animation: isRTL ? 'slideInRight 0.35s cubic-bezier(0.22,1,0.36,1)' : 'slideInLeft 0.35s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: isRTL ? '-8px 0 40px rgba(0,0,0,0.2)' : '8px 0 40px rgba(0,0,0,0.2)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
              background: isDark ? 'linear-gradient(90deg, transparent, #d4b85a, transparent)' : 'linear-gradient(90deg, transparent, #987012, transparent)',
              opacity: isDark ? 0.5 : 0.3,
            }} />

            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 sticky top-0 z-10"
              style={{
                borderBottom: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.08)' : 'rgba(63, 52, 28, 0.06)'}`,
                background: isDark ? 'rgba(26, 22, 16, 0.98)' : 'rgba(255, 254, 251, 0.98)',
                backdropFilter: 'blur(16px)',
              }}>
              <div className="min-w-0 flex items-center gap-2">
                <img
                  src={isDark ? LOGO_DARK : LOGO_WHITE}
                  alt="Maham Expo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button onClick={() => setMobileMenuOpen(false)}
                className={`p-1.5 shrink-0 transition-all duration-300 rounded-lg ${isDark ? 'text-[#7a5a0e] hover:text-[#d4b85a] hover:bg-[#2a2313]' : 'text-[#b8891a] hover:text-[#987012] hover:bg-[#fbf8f0]'}`}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-3 stagger-children">
              {sections.map(section => {
                const items = navItems.filter(i => i.section === section);
                if (items.length === 0) return null;
                return (
                  <div key={section} className="mb-2.5">
                    <p className={`px-2 py-1 text-[8px] uppercase tracking-[0.15em] font-semibold ${sectionText}`}>
                      {sectionLabels[language]?.[section] || sectionLabels['en']?.[section]}
                    </p>
                    {items.map(item => renderNavItem(item, true))}
                  </div>
                );
              })}

              {/* Mobile Footer Actions */}
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.08)' : 'rgba(63, 52, 28, 0.06)'}` }}>
                <div className="mb-2">
                  <p className={`px-2 py-1 text-[8px] uppercase tracking-[0.15em] font-semibold ${sectionText}`}>
                    {t('lang.select')}
                  </p>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {allLanguages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all duration-300 ${
                          language === lang.code
                            ? `${activeColor} font-semibold ${activeBg}`
                            : `${mutedText} ${isDark ? 'active:bg-[#2a2313]' : 'active:bg-[#fbf8f0]'}`
                        }`}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        <span className="truncate text-[11px]">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {toggleTheme && (
                  <button onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                      mutedText} ${isDark ? 'active:bg-[#2a2313]' : 'active:bg-[#fbf8f0]'}`}>
                    <div className="transition-transform duration-500">
                      {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </div>
                    <span className="font-medium">{isDark ? t('theme.light') : t('theme.dark')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-w-0 transition-all duration-500 pb-16 lg:pb-0" ref={mainRef}>
        <style>{`
          @media (min-width: 1024px) {
            .main-content-area {
              ${isRTL ? 'margin-right' : 'margin-left'}: ${sidebarOpen ? '15rem' : '4.5rem'};
              transition: margin 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            }
          }
          @media (min-width: 1280px) {
            .main-content-area {
              ${isRTL ? 'margin-right' : 'margin-left'}: ${sidebarOpen ? '16rem' : '4.5rem'};
            }
          }
        `}</style>

        {/* Top Header */}
        <header
          className="sticky top-0 z-30 transition-all duration-500 main-content-area"
          style={{
            background: isDark
              ? (headerBlurred ? 'rgba(10, 10, 10, 0.80)' : 'rgba(24, 23, 21, 0.98)')
              : (headerBlurred ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.99)'),
            backdropFilter: headerBlurred ? 'blur(24px) saturate(1.5)' : 'blur(12px)',
            WebkitBackdropFilter: headerBlurred ? 'blur(24px) saturate(1.5)' : 'blur(12px)',
            borderBottom: `1px solid ${isDark ? (headerBlurred ? 'rgba(212, 168, 67, 0.10)' : 'rgba(63, 52, 28, 0.15)') : (headerBlurred ? '#F0EEE7' : 'rgba(240, 238, 231, 0.5)')}`,
            boxShadow: headerBlurred
              ? (isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)')
              : 'none',
          }}
        >
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-12 sm:h-14">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button className="lg:hidden p-1 shrink-0 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={20} className="text-muted-foreground" />
              </button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
                  {currentPageTitle ? t(currentPageTitle.key) : t('nav.dashboard')}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Search */}
              <div className={`hidden md:flex items-center rounded-xl px-3 py-1.5 gap-2 transition-all duration-500 border ${
                searchFocused
                  ? isDark
                    ? 'w-56 lg:w-64 xl:w-72 bg-[#2a2313] border-[#d4b85a]/30'
                    : 'w-56 lg:w-64 xl:w-72 bg-white border-[#987012]/30 shadow-sm'
                  : isDark
                    ? 'w-40 lg:w-48 xl:w-52 bg-[#2a2313]/50 border-[#3f341c]'
                    : 'w-40 lg:w-48 xl:w-52 bg-[#fbf8f0] border-[#e8d9a8]'
              }`}>
                <Search size={14} className={`shrink-0 transition-colors duration-300 ${searchFocused ? (isDark ? 'text-[#d4b85a]' : 'text-[#987012]') : 'text-muted-foreground'}`} />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="bg-transparent text-xs lg:text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground/60 min-w-0"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>

              <div className="hidden sm:block">
                <LanguageDropdown isHeader />
              </div>

              {toggleTheme && (
                <button onClick={toggleTheme}
                  className={`theme-toggle p-1.5 sm:p-2 rounded-xl transition-all duration-300 group`}
                  style={{
                    background: isDark ? 'rgba(212, 184, 90, 0.06)' : 'rgba(152, 112, 18, 0.04)',
                    border: `1px solid ${isDark ? 'rgba(212, 184, 90, 0.1)' : 'rgba(152, 112, 18, 0.08)'}`,
                  }}
                  title={isDark ? t('theme.light') : t('theme.dark')}>
                  <div className="transition-transform duration-700 group-hover:rotate-[360deg]">
                    {isDark ? <Sun size={15} className="text-[#d4b85a] group-hover:text-[#e6b830]" /> : <Moon size={15} className="text-[#987012] group-hover:text-[#7a5a0e]" />}
                  </div>
                </button>
              )}

              <Link href="/notifications">
                <div className={`relative p-1.5 sm:p-2 rounded-xl transition-all duration-300 group ${hoverBg}`}>
                  <Bell size={16} className={`transition-all duration-300 group-hover:rotate-12 ${
                    isDark ? 'text-[#a89070] group-hover:text-[#d4b85a]' : 'text-[#8b7355] group-hover:text-[#987012]'
                  }`} />
                  {unreadCount > 0 && (
                    <span className={`absolute -top-0.5 -right-0.5 ${badgeBg} text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[1.25rem] text-center`}>
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link href="/profile">
                <div className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1 rounded-xl transition-all duration-300 group ${hoverBg}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 border ${
                    isDark
                      ? 'bg-[#d4b85a]/10 border-[#d4b85a]/15 group-hover:bg-[#d4b85a]/20'
                      : 'bg-[#987012]/5 border-[#987012]/10 group-hover:bg-[#987012]/10'
                  }`}>
                    <User size={13} className={isDark ? 'text-[#d4b85a]' : 'text-[#987012]'} />
                  </div>
                  <div className="hidden sm:block text-right min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-foreground truncate">{sponsor?.companyName || user?.name || t('role.sponsor')}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{sponsor?.brandName || t('role.company')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6 main-content-area">
          <div className="animate-luxury-entrance">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
