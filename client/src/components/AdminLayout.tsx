/**
 * AdminLayout — Supervisor Panel Layout
 * Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism + Gold Accents + Professional Sidebar
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Calendar, Award, FileText, CreditCard,
  Users, Bell, BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, ArrowLeft, Menu, X, Shield, Sun, Moon, Globe,
  Plus, UserPlus, FileSignature, Receipt, ChevronDown,
  Building2, Sparkles
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  key: string;
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  path: string;
  badge?: number;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { language, isRTL, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';

  // Fetch pending counts for badges
  const { data: kpis } = trpc.admin.dashboard.kpis.useQuery(undefined, {
    retry: false,
    refetchInterval: 30000,
  });

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      icon: LayoutDashboard,
      labelAr: 'لوحة القيادة',
      labelEn: 'Executive Dashboard',
      path: '/admin',
    },
    {
      key: 'events',
      icon: Calendar,
      labelAr: 'إدارة الفعاليات',
      labelEn: 'Event Management',
      path: '/admin/events',
    },
    {
      key: 'approvals',
      icon: Award,
      labelAr: 'موافقات الرعاية',
      labelEn: 'Sponsorship Approvals',
      path: '/admin/approvals',
      badge: kpis?.pendingApprovals ?? 0,
    },
    {
      key: 'sponsors',
      icon: Users,
      labelAr: 'إدارة الرعاة',
      labelEn: 'Sponsor Management',
      path: '/admin/sponsors',
    },
    {
      key: 'contracts',
      icon: FileText,
      labelAr: 'إدارة العقود',
      labelEn: 'Contract Management',
      path: '/admin/contracts',
    },
    {
      key: 'payments',
      icon: CreditCard,
      labelAr: 'إدارة المدفوعات',
      labelEn: 'Payment Management',
      path: '/admin/payments',
    },
    {
      key: 'notifications',
      icon: Bell,
      labelAr: 'إدارة الإشعارات',
      labelEn: 'Notification Management',
      path: '/admin/notifications',
    },
    {
      key: 'reports',
      icon: BarChart3,
      labelAr: 'التقارير',
      labelEn: 'Reports',
      path: '/admin/reports',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location === '/admin';
    return location.startsWith(path);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = '/'; },
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${
        isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]/60'
      }`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#987012] via-[#d4a832] to-[#987012] flex items-center justify-center shrink-0 shadow-lg">
          <Shield size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold gold-text truncate">MAHAM EXPO</h2>
            <p className={`text-[9px] ${isDark ? 'text-muted-foreground' : 'text-[#919187]'} truncate`}>
              {language === 'ar' ? 'لوحة المشرف' : 'Admin Panel'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className={`px-3 py-3 border-b ${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]/60'}`}>
          <p className={`text-[9px] font-semibold uppercase tracking-wider mb-2 ${
            isDark ? 'text-[#987012]/70' : 'text-[#987012]/60'
          }`}>
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { icon: Plus, label: language === 'ar' ? 'فعالية' : 'Event', path: '/admin/events?action=create' },
              { icon: UserPlus, label: language === 'ar' ? 'راعي' : 'Sponsor', path: '/admin/sponsors' },
              { icon: FileSignature, label: language === 'ar' ? 'عقد' : 'Contract', path: '/admin/contracts' },
              { icon: Receipt, label: language === 'ar' ? 'فاتورة' : 'Invoice', path: '/admin/payments' },
            ].map((action, i) => (
              <Link key={i} href={action.path}>
                <span className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-medium transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.03] hover:bg-[#987012]/10 text-muted-foreground hover:text-[#987012] border border-white/[0.04]'
                    : 'bg-[#F9F8F5] hover:bg-[#987012]/5 text-[#919187] hover:text-[#987012] border border-[#F0EEE7]/40'
                }`}>
                  <action.icon size={11} />
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.key} href={item.path}>
              <span className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer group relative ${
                active
                  ? isDark
                    ? 'bg-[#987012]/12 text-[#d4a832] border border-[#987012]/20 shadow-[0_0_15px_rgba(152,112,18,0.06)]'
                    : 'bg-[#987012]/8 text-[#987012] border border-[#987012]/15 shadow-sm'
                  : isDark
                    ? 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                    : 'text-[#919187] hover:text-[#565656] hover:bg-[#F9F8F5]'
              }`}>
                {active && (
                  <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#987012]`} />
                )}
                <Icon size={16} className={`shrink-0 transition-colors ${active ? 'text-[#987012]' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="truncate">{language === 'ar' ? item.labelAr : item.labelEn}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="mr-auto ml-0 rtl:ml-auto rtl:mr-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/15 text-red-500 border border-red-500/20">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
                {collapsed && item.badge && item.badge > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`border-t px-3 py-3 space-y-2 ${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]/60'}`}>
        {/* Theme Toggle */}
        {!collapsed && toggleTheme && (
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-300 ${
              isDark ? 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]' : 'text-[#919187] hover:text-[#565656] hover:bg-[#F9F8F5]'
            }`}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}</span>
          </button>
        )}

        {/* Back to Portal */}
        <Link href="/dashboard">
          <span className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-300 cursor-pointer ${
            isDark ? 'text-muted-foreground hover:text-[#987012] hover:bg-[#987012]/5' : 'text-[#919187] hover:text-[#987012] hover:bg-[#987012]/5'
          }`}>
            <ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />
            {!collapsed && <span>{language === 'ar' ? 'العودة للبوابة' : 'Back to Portal'}</span>}
          </span>
        </Link>

        {/* User Info */}
        {!collapsed && user && (
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${
            isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#987012] to-[#d4a832] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {(user.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-semibold truncate ${isDark ? 'text-foreground' : 'text-[#010101]'}`}>
                {user.name || (language === 'ar' ? 'المشرف' : 'Admin')}
              </p>
              <p className={`text-[9px] truncate ${isDark ? 'text-muted-foreground' : 'text-[#919187]'}`}>
                {language === 'ar' ? 'مشرف النظام' : 'System Admin'}
              </p>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
              title={language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b ${
        isDark ? 'bg-[#0a0c12]/95 border-white/[0.06]' : 'bg-white/95 border-[#F0EEE7]/60'
      } backdrop-blur-xl`}>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/5">
          <Menu size={20} className={isDark ? 'text-foreground' : 'text-[#565656]'} />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#987012]" />
          <span className="text-sm font-bold gold-text">
            {language === 'ar' ? 'لوحة المشرف' : 'Admin Panel'}
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-72 ${
            isDark ? 'bg-[#0a0c12]' : 'bg-white'
          } shadow-2xl`}>
            <button
              onClick={() => setMobileOpen(false)}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-1.5 rounded-lg ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
              }`}
            >
              <X size={18} className={isDark ? 'text-foreground' : 'text-[#565656]'} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 z-30 border-${isRTL ? 'l' : 'r'} transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-[220px]'
      } ${
        isDark
          ? 'bg-[#0a0c12]/95 border-white/[0.06]'
          : 'bg-white/95 border-[#F0EEE7]/60'
      } backdrop-blur-xl`}>
        <SidebarContent />

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? '-left-3' : '-right-3'} w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isDark
              ? 'bg-[#0a0c12] border-white/10 text-muted-foreground hover:text-[#987012] hover:border-[#987012]/30'
              : 'bg-white border-[#F0EEE7] text-[#919187] hover:text-[#987012] hover:border-[#987012]/30'
          } shadow-sm`}
        >
          {isRTL
            ? (collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />)
            : (collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />)
          }
        </button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        collapsed ? (isRTL ? 'lg:mr-16' : 'lg:ml-16') : (isRTL ? 'lg:mr-[220px]' : 'lg:ml-[220px]')
      } pt-14 lg:pt-0 min-h-screen`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
