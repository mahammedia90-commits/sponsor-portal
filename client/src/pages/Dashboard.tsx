/**
 * Dashboard — Sponsor Portal
 * Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism + Gold Accents + AI Integration Layer
 * Connected to real tRPC API
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Award, TrendingUp, Users, Eye, Wallet, Calendar,
  ArrowUpRight, ArrowDownRight, Sparkles, FileText, CreditCard,
  Megaphone, BarChart3, Star, Bot, Crown, Shield, Target,
  Zap, CheckCircle, Clock, Bell, ChevronRight, Activity,
  Globe, Briefcase, PieChart, LineChart, ArrowRight,
  Layers, Map, GitCompare, Upload, CalendarDays, Network, FileBarChart,
  Loader2
} from 'lucide-react';

const DASHBOARD_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-analytics-dashboard-S23sSkprnMAhokvRuYStWi.webp';
const AI_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-ai-assistant-HZZXDJTczNPmxkiDehfyXt.webp';
const EVENT_IMGS = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-expo-hall-KF8yTvgvVLMQbi4AKXqhKg.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-brand-display-b5qLQv32gHCTauu66Zc4GR.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-networking-event-fsaLJnjkFJboV6AwCmSY64.webp',
];

/* ── Animated Counter ── */
function AnimatedCounter({ target, duration = 2000 }: { target: number | string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target;
    if (isNaN(num)) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  const suffix = typeof target === 'string' ? target.replace(/[0-9.,]/g, '') : '';
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Scroll Reveal Hook ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const tierColors: Record<string, string> = {
  platinum: 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 text-gray-800',
  gold: 'bg-gradient-to-r from-[#d4a832] via-[#f0e6c8] to-[#d4a832] text-gray-900',
  silver: 'bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 text-gray-800',
  bronze: 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-white',
};

const tierLabels: Record<string, Record<string, string>> = {
  ar: { platinum: 'بلاتيني', gold: 'ذهبي', silver: 'فضي', bronze: 'برونزي' },
  en: { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' },
};

const statusColors: Record<string, string> = {
  active: 'text-[#d4b85a] bg-[#d4b85a]/10',
  pending_review: 'text-amber-400 bg-amber-400/10',
  approved: 'text-blue-400 bg-blue-400/10',
  completed: 'text-[#919187] bg-[#919187]/10',
  rejected: 'text-red-400 bg-red-400/10',
  lead: 'text-blue-300 bg-blue-300/10',
  qualified: 'text-cyan-400 bg-cyan-400/10',
  proposal_sent: 'text-amber-400 bg-amber-400/10',
  negotiation: 'text-orange-400 bg-orange-400/10',
  contract_sent: 'text-indigo-400 bg-indigo-400/10',
  signed: 'text-green-400 bg-green-400/10',
  paid: 'text-emerald-400 bg-emerald-400/10',
  lost: 'text-red-400 bg-red-400/10',
};

const statusLabels: Record<string, Record<string, string>> = {
  ar: { active: 'نشط', pending_review: 'قيد المراجعة', approved: 'معتمد', completed: 'مكتمل', rejected: 'مرفوض', lead: 'عميل محتمل', qualified: 'مؤهل', proposal_sent: 'عرض مرسل', negotiation: 'تفاوض', contract_sent: 'عقد مرسل', signed: 'موقّع', paid: 'مدفوع', lost: 'خسارة' },
  en: { active: 'Active', pending_review: 'Pending', approved: 'Approved', completed: 'Completed', rejected: 'Rejected', lead: 'Lead', qualified: 'Qualified', proposal_sent: 'Proposal Sent', negotiation: 'Negotiation', contract_sent: 'Contract Sent', signed: 'Signed', paid: 'Paid', lost: 'Lost' },
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { sponsor, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const l = useCallback((v: { ar: string; en: string } | string) => typeof v === 'string' ? v : v[language as 'ar' | 'en'] || v.en, [language]);

  // ─── tRPC Data Fetching ───
  const { data: mySponsorships, isLoading: loadingSponsorships } = trpc.sponsorships.list.useQuery();
  const { data: myLeads, isLoading: loadingLeads } = trpc.leads.list.useQuery();
  const { data: eventsData, isLoading: loadingEvents } = trpc.events.list.useQuery({ status: 'active', limit: 3 });
  const { data: dashboardStats } = trpc.analytics.dashboard.useQuery();

  const sponsorships = useMemo(() => mySponsorships ?? [], [mySponsorships]);
  const leads = useMemo(() => myLeads ?? [], [myLeads]);
  const events = useMemo(() => eventsData ?? [], [eventsData]);

  const welcomeSection = useScrollReveal();
  const kpiSection = useScrollReveal();
  const actionsSection = useScrollReveal();
  const sponsorshipsSection = useScrollReveal();
  const eventsSection = useScrollReveal();
  const aiSection = useScrollReveal();
  const quickLinksSection = useScrollReveal();

  const activeSponsorships = sponsorships.filter((s: any) => s.status === 'active').length;
  const totalLeads = leads.length;
  const totalImpressions = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.brandImpressions) || 0), 0);
  const totalInvested = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.totalAmount) || 0), 0);
  const totalEvents = sponsorships.length;
  const avgROI = (dashboardStats as any)?.avgROI ?? 287;

  const userName = sponsor?.contactPerson?.split(' ')[0] || user?.name?.split(' ')[0] || '';

  /* ── Nour Theme — adaptive classes ── */
  const cardBg = isDark
    ? 'bg-[#24221E]/70 backdrop-blur-md border-[#3F341C]/50 hover:border-[#987012]/30'
    : 'bg-white border-[#F0EEE7] hover:border-[#987012]/25 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_rgba(152,112,18,0.15)]';
  const textPrimary = isDark ? 'text-white' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-[#A0A0A0]' : 'text-[#565656]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  const kpis = [
    { label: l({ ar: 'الرعايات النشطة', en: 'Active Sponsorships' }), value: activeSponsorships, icon: Award, trend: '+2', up: true, color: 'from-[#987012]/20 to-[#987012]/5' },
    { label: l({ ar: 'العملاء المحتملون', en: 'Total Leads' }), value: totalLeads, icon: Users, trend: '+24%', up: true, color: 'from-[#fbf8f0]0/15 to-[#fbf8f0]0/5' },
    { label: l({ ar: 'ظهور العلامة', en: 'Brand Impressions' }), value: totalImpressions > 0 ? `${(totalImpressions / 1000000).toFixed(1)}M` : '0', icon: Eye, trend: '+18%', up: true, color: 'from-blue-500/15 to-blue-500/5' },
    { label: l({ ar: 'إجمالي الاستثمار', en: 'Total Invested' }), value: totalInvested > 0 ? `${(totalInvested / 1000).toFixed(0)}K` : '0', icon: Wallet, suffix: l({ ar: 'ر.س', en: 'SAR' }), color: 'from-purple-500/15 to-purple-500/5' },
    { label: l({ ar: 'متوسط العائد', en: 'Avg ROI' }), value: `${avgROI}%`, icon: TrendingUp, trend: '+12%', up: true, color: 'from-amber-500/15 to-amber-500/5' },
    { label: l({ ar: 'الفعاليات المرعية', en: 'Events Sponsored' }), value: totalEvents, icon: Calendar, color: 'from-cyan-500/15 to-cyan-500/5' },
  ];

  const quickActions = [
    { label: l({ ar: 'تصفح فرص الرعاية', en: 'Browse Opportunities' }), icon: Sparkles, route: '/opportunities', primary: true },
    { label: l({ ar: 'عرض العقود', en: 'View Contracts' }), icon: FileText, route: '/contracts' },
    { label: l({ ar: 'سداد دفعة', en: 'Make Payment' }), icon: CreditCard, route: '/payments' },
    { label: l({ ar: 'عرض التحليلات', en: 'View Analytics' }), icon: BarChart3, route: '/analytics' },
    { label: l({ ar: 'خريطة الأصول', en: 'Asset Map' }), icon: Map, route: '/asset-map' },
    { label: l({ ar: 'مقارنة الحزم', en: 'Compare Packages' }), icon: GitCompare, route: '/package-compare' },
  ];

  const quickLinks = [
    { label: l({ ar: 'خريطة أصول الرعاية', en: 'Sponsorship Asset Map' }), icon: Layers, route: '/asset-map', desc: l({ ar: 'استكشف مواقع الرعاية التفاعلية', en: 'Explore interactive sponsorship locations' }) },
    { label: l({ ar: 'مقارنة الحزم', en: 'Package Comparison' }), icon: GitCompare, route: '/package-compare', desc: l({ ar: 'قارن بين حزم الرعاية المتاحة', en: 'Compare available sponsorship packages' }) },
    { label: l({ ar: 'أصول العلامة التجارية', en: 'Brand Assets' }), icon: Upload, route: '/brand-assets', desc: l({ ar: 'ارفع وأدر أصول علامتك', en: 'Upload and manage your brand assets' }) },
    { label: l({ ar: 'تتبع التسليمات', en: 'Deliverables Tracker' }), icon: CheckCircle, route: '/deliverables', desc: l({ ar: 'تابع حالة تسليمات الرعاية', en: 'Track sponsorship deliverables status' }) },
    { label: l({ ar: 'تقويم الفعاليات', en: 'Event Calendar' }), icon: CalendarDays, route: '/event-calendar', desc: l({ ar: 'عرض جميع الفعاليات القادمة', en: 'View all upcoming events' }) },
    { label: l({ ar: 'شبكة التواصل', en: 'Networking Hub' }), icon: Network, route: '/networking', desc: l({ ar: 'تواصل مع التجار والمستثمرين', en: 'Connect with traders and investors' }) },
    { label: l({ ar: 'تقارير ما بعد الفعالية', en: 'Post-Event Reports' }), icon: FileBarChart, route: '/post-event-report', desc: l({ ar: 'تقارير أداء مفصلة', en: 'Detailed performance reports' }) },
    { label: l({ ar: 'حملات تسويقية', en: 'Marketing Campaigns' }), icon: Megaphone, route: '/campaigns', desc: l({ ar: 'أنشئ وأدر حملاتك', en: 'Create and manage your campaigns' }) },
  ];

  const recentActivity = [
    { icon: CheckCircle, text: l({ ar: 'تم اعتماد عقد رعاية مؤتمر البترول', en: 'Petroleum Congress sponsorship contract approved' }), time: l({ ar: 'منذ ساعتين', en: '2 hours ago' }), color: 'text-[#d4b85a]' },
    { icon: CreditCard, text: l({ ar: 'تم استلام دفعة 125,000 ر.س', en: 'Payment of 125,000 SAR received' }), time: l({ ar: 'منذ 5 ساعات', en: '5 hours ago' }), color: 'text-blue-400' },
    { icon: Users, text: l({ ar: '12 عميل محتمل جديد من معرض البناء', en: '12 new leads from Big 5 Construct' }), time: l({ ar: 'أمس', en: 'Yesterday' }), color: 'text-[#987012]' },
    { icon: Eye, text: l({ ar: 'علامتك حققت 45,000 ظهور هذا الأسبوع', en: 'Your brand achieved 45,000 impressions this week' }), time: l({ ar: 'أمس', en: 'Yesterday' }), color: 'text-purple-400' },
    { icon: Bot, text: l({ ar: 'توصية AI: رعاية كأس العالم للرياضات الإلكترونية', en: 'AI Recommendation: Sponsor Esports World Cup' }), time: l({ ar: 'منذ يومين', en: '2 days ago' }), color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ═══ Welcome Banner ═══ */}
      <div ref={welcomeSection.ref} className={`relative rounded-2xl overflow-hidden transition-all duration-700 ${welcomeSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="absolute inset-0">
          <img src={DASHBOARD_BG} alt="" className="w-full h-full object-cover opacity-[0.08]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#987012]/8 via-transparent to-[#987012]/4" />
        {isDark && <div className="absolute inset-0 shimmer opacity-30" />}
        <div className={`relative p-5 sm:p-8 text-center border rounded-2xl backdrop-blur-sm ${isDark ? 'bg-[#24221E]/50 border-[#3F341C]/50' : 'bg-white/70 border-[#F0EEE7]'}`}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#987012]/20 to-[#987012]/5 flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ boxShadow: isDark ? '0 0 30px rgba(152,112,18,0.1)' : 'none' }}>
            <Crown size={26} className="text-[#987012] sm:w-8 sm:h-8" />
          </div>
          <h2 className={`text-lg sm:text-2xl font-bold font-['Cairo'] mb-1.5 ${textPrimary}`}>
            {l({ ar: `مرحباً ${userName || 'بك'}!`, en: `Welcome ${userName || 'back'}!` })}
          </h2>
          <p className={`text-xs sm:text-sm ${textSecondary} mb-4 sm:mb-5 max-w-lg mx-auto leading-relaxed`}>
            {l({ ar: 'ابدأ رحلتك مع Maham Expo — اكتشف فرص الرعاية واستثمر في نجاح علامتك التجارية', en: 'Start your journey with Maham Expo — discover sponsorship opportunities and invest in your brand\'s success' })}
          </p>
          <div className="flex flex-col xs:flex-row gap-2.5 justify-center items-center">
            <Link href="/opportunities">
              <span className="btn-cta-glass px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 group">
                <Sparkles size={14} className="transition-transform group-hover:rotate-12" />
                {l({ ar: 'تصفح فرص الرعاية', en: 'Browse Sponsorship Opportunities' })}
              </span>
            </Link>
            <Link href="/verification">
              <span className={`text-xs sm:text-sm font-medium transition-all duration-300 hover:underline ${isDark ? 'text-[#987012]/70 hover:text-[#987012]' : 'text-[#987012] hover:text-[#5c440a]'}`}>
                {l({ ar: 'وثّق حسابك أولاً', en: 'Verify your account first' })}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ KPI Cards ═══ */}
      <div ref={kpiSection.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-xl border p-3 sm:p-4 transition-all duration-700 hover:scale-[1.03] ${cardBg} ${kpiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-2 sm:mb-3`}>
                <Icon size={16} className="text-[#987012] sm:w-[18px] sm:h-[18px]" />
              </div>
              <p className={`text-base sm:text-xl font-bold ${textPrimary}`}><AnimatedCounter target={kpi.value} /></p>
              {kpi.suffix && <span className={`text-[9px] ${textMuted}`}> {kpi.suffix}</span>}
              <p className={`text-[9px] sm:text-[11px] ${textMuted} mt-0.5`}>{kpi.label}</p>
              {kpi.trend && (
                <div className="flex items-center gap-0.5 mt-1">
                  {kpi.up ? <ArrowUpRight size={10} className="text-[#d4b85a]" /> : <ArrowDownRight size={10} className="text-red-400" />}
                  <span className={`text-[9px] font-semibold ${kpi.up ? 'text-[#d4b85a]' : 'text-red-400'}`}>{kpi.trend}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div ref={actionsSection.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.route}>
              <div className={`rounded-xl border p-3 sm:p-4 text-center transition-all duration-500 hover:scale-[1.04] group cursor-pointer ${
                action.primary
                  ? `${isDark ? 'bg-[#987012]/10 border-[#987012]/20 hover:border-[#987012]/40' : 'bg-[#987012]/5 border-[#987012]/15 hover:border-[#987012]/30'}`
                  : cardBg
              } ${actionsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 50}ms` }}>
                <Icon size={18} className={`mx-auto mb-1.5 transition-transform duration-300 group-hover:scale-110 ${action.primary ? 'text-[#987012]' : isDark ? 'text-[#987012]/60' : 'text-[#987012]/70'} sm:w-5 sm:h-5`} />
                <p className={`text-[9px] sm:text-[11px] font-semibold ${textPrimary} group-hover:text-[#987012] transition-colors`}>{action.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ═══ Sponsorships + Activity + Leads ═══ */}
      <div ref={sponsorshipsSection.ref} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* My Sponsorships */}
        <div className={`lg:col-span-2 rounded-xl border p-3 sm:p-5 transition-all duration-700 ${cardBg} ${sponsorshipsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} font-['Cairo']`}>{l({ ar: 'رعاياتي', en: 'My Sponsorships' })}</h3>
            <Link href="/sponsorships">
              <span className="text-[10px] sm:text-xs text-[#987012] hover:underline flex items-center gap-1 group font-medium">
                {l({ ar: 'عرض الكل', en: 'View All' })}
                <ArrowUpRight size={10} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-2.5">
            {loadingSponsorships ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-[#987012]" />
              </div>
            ) : sponsorships.length === 0 ? (
              <div className="text-center py-8">
                <Award size={32} className="mx-auto mb-2 text-[#987012]/30" />
                <p className={`text-xs ${textMuted}`}>{l({ ar: 'لا توجد رعايات بعد — ابدأ بتصفح الفرص', en: 'No sponsorships yet — start browsing opportunities' })}</p>
              </div>
            ) : (
              sponsorships.slice(0, 4).map((s: any, i: number) => {
                const tier = s.packageTier || s.tier || 'gold';
                const eventTitle = language === 'ar' ? (s.eventTitleAr || s.eventTitle || '') : (s.eventTitleEn || s.eventTitle || '');
                const eventSubtitle = language === 'ar' ? (s.eventTitleEn || '') : (s.eventTitleAr || '');
                return (
                  <div key={s.id} className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl transition-all duration-400 group ${
                    isDark ? 'bg-[#24221E]/50 hover:bg-[#24221E]/80' : 'bg-[#F9F8F5] hover:bg-[#F0EEE7]/60'
                  } ${sponsorshipsSection.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`} style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className={`px-2 py-1 rounded-lg text-[8px] sm:text-[10px] font-bold ${tierColors[tier] || tierColors.gold} whitespace-nowrap shrink-0`}>
                      {tierLabels[language]?.[tier] || tier}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold ${textPrimary} truncate`}>{eventTitle}</p>
                      <p className={`text-[9px] sm:text-[11px] ${textMuted} truncate`}>{eventSubtitle}</p>
                    </div>
                    <div className="text-left hidden sm:block shrink-0">
                      <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{Number(s.totalAmount || 0).toLocaleString()} <span className={`text-[9px] ${textMuted}`}>{l({ ar: 'ر.س', en: 'SAR' })}</span></p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold ${statusColors[s.status] || statusColors.active} whitespace-nowrap shrink-0`}>
                      {statusLabels[language]?.[s.status] || s.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity + Leads */}
        <div className="space-y-4 sm:space-y-6">
          {/* Activity Feed */}
          <div className={`rounded-xl border p-3 sm:p-5 transition-all duration-700 delay-100 ${cardBg} ${sponsorshipsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} font-['Cairo']`}>{l({ ar: 'آخر النشاطات', en: 'Recent Activity' })}</h3>
              <Activity size={14} className="text-[#987012]" />
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${isDark ? 'bg-[#24221E]' : 'bg-[#F9F8F5]'}`}>
                      <Icon size={12} className={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] sm:text-xs ${textSecondary} leading-relaxed`}>{item.text}</p>
                      <p className={`text-[9px] ${textMuted} mt-0.5`}>{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Leads */}
          <div className={`rounded-xl border p-3 sm:p-5 transition-all duration-700 delay-200 ${cardBg} ${sponsorshipsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} font-['Cairo']`}>{l({ ar: 'أبرز العملاء المحتملين', en: 'Top Leads' })}</h3>
              <Link href="/leads">
                <span className="text-[10px] sm:text-xs text-[#987012] hover:underline flex items-center gap-1 group font-medium">
                  {l({ ar: 'عرض الكل', en: 'View All' })}
                  <ArrowUpRight size={10} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
            <div className="space-y-2 sm:space-y-2.5">
              {loadingLeads ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={16} className="animate-spin text-[#987012]" />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-4">
                  <Users size={24} className="mx-auto mb-1 text-[#987012]/30" />
                  <p className={`text-[10px] ${textMuted}`}>{l({ ar: 'لا يوجد عملاء محتملون بعد', en: 'No leads yet' })}</p>
                </div>
              ) : (
                leads.slice(0, 4).map((lead: any, i: number) => (
                  <div key={lead.id || i} className={`flex items-center gap-2.5 p-2 rounded-lg transition-all duration-300 group ${isDark ? 'hover:bg-[#24221E]/50' : 'hover:bg-[#F9F8F5]'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      lead.interestLevel === 'high' ? 'bg-[#d4b85a]/15 text-[#d4b85a]' :
                      lead.interestLevel === 'medium' ? 'bg-amber-400/15 text-amber-400' :
                      'bg-[#919187]/15 text-[#919187]'
                    }`}>
                      {(lead.contactName || '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] sm:text-xs font-semibold ${textPrimary} truncate`}>{lead.companyName || ''}</p>
                      <p className={`text-[9px] ${textMuted} truncate`}>{lead.industry || ''}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      lead.interestLevel === 'high' ? 'bg-[#d4b85a]' :
                      lead.interestLevel === 'medium' ? 'bg-amber-400' :
                      'bg-[#919187]'
                    }`} style={lead.interestLevel === 'high' ? { boxShadow: '0 0 8px rgba(52,211,153,0.4)' } : {}} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Upcoming Events ═══ */}
      <div ref={eventsSection.ref} className={`rounded-xl border overflow-hidden transition-all duration-700 ${cardBg} ${eventsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-between p-3 sm:p-5 pb-2 sm:pb-3">
          <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} font-['Cairo']`}>{l({ ar: 'الفعاليات القادمة', en: 'Upcoming Events' })}</h3>
          <Link href="/opportunities">
            <span className="text-[10px] sm:text-xs text-[#987012] hover:underline flex items-center gap-1 group font-medium">
              {l({ ar: 'عرض الكل', en: 'View All' })}
              <ArrowUpRight size={10} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {loadingEvents ? (
            <div className="col-span-3 flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[#987012]" />
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <Calendar size={32} className="mx-auto mb-2 text-[#987012]/30" />
              <p className={`text-xs ${textMuted}`}>{l({ ar: 'لا توجد فعاليات قادمة حالياً', en: 'No upcoming events at the moment' })}</p>
            </div>
          ) : (
            events.map((event: any, i: number) => {
              const title = language === 'ar' ? (event.titleAr || event.titleEn) : (event.titleEn || event.titleAr);
              const desc = language === 'ar' ? (event.descriptionAr || '') : (event.descriptionEn || '');
              const dateStr = event.startDate ? new Date(event.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
              return (
                <Link key={event.id} href="/opportunities">
                  <div className={`group rounded-xl border overflow-hidden transition-all duration-400 hover:scale-[1.02] ${
                    isDark ? 'border-[#3F341C]/60 hover:border-[#987012]/20 hover:bg-[#24221E]/50' : 'border-[#F0EEE7] hover:border-[#987012]/20 hover:shadow-lg'
                  } ${eventsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative h-28 sm:h-36 overflow-hidden">
                      <img src={event.imageUrl || EVENT_IMGS[i % EVENT_IMGS.length]} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#181715]/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'}`} />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5">
                        <Star size={11} className="text-[#987012] fill-[#987012]" />
                        <span className={`text-[9px] ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{(event.expectedVisitors || 0).toLocaleString()} {l({ ar: 'زائر', en: 'visitors' })}</span>
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <h4 className={`text-xs sm:text-sm font-bold ${textPrimary} mb-0.5 truncate`}>{title}</h4>
                      <p className={`text-[9px] sm:text-[11px] ${textSecondary} mb-2 truncate`}>{desc}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-[9px] sm:text-[10px] ${textMuted}`}>{event.city || ''} — {dateStr}</span>
                          <p className="text-[9px] text-[#987012]/60 mt-0.5">{event.totalSponsorSlots || 0} {l({ ar: 'فرصة رعاية', en: 'sponsor slots' })}</p>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-[#987012] group-hover:underline whitespace-nowrap flex items-center gap-0.5">
                          {l({ ar: 'عرض التفاصيل', en: 'View Details' })}
                          <ArrowUpRight size={9} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* ═══ Quick Navigation Grid ═══ */}
      <div ref={quickLinksSection.ref}>
        <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} mb-3 sm:mb-4 font-['Cairo'] ${quickLinksSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700`}>
          {l({ ar: 'الوصول السريع', en: 'Quick Navigation' })}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={i} href={link.route}>
                <div className={`rounded-xl border p-3 sm:p-4 transition-all duration-500 hover:scale-[1.03] group cursor-pointer ${cardBg} ${quickLinksSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 group-hover:scale-110 ${isDark ? 'bg-[#987012]/8 group-hover:bg-[#987012]/15' : 'bg-[#987012]/5 group-hover:bg-[#987012]/10'}`}>
                    <Icon size={16} className="text-[#987012] sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <p className={`text-[10px] sm:text-xs font-bold ${textPrimary} mb-0.5 truncate group-hover:text-[#987012] transition-colors`}>{link.label}</p>
                  <p className={`text-[8px] sm:text-[10px] ${textMuted} leading-tight line-clamp-2`}>{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══ AI Insights Banner ═══ */}
      <div ref={aiSection.ref} className={`relative rounded-2xl overflow-hidden transition-all duration-700 ${aiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="absolute inset-0">
          <img src={AI_IMG} alt="" className="w-full h-full object-cover opacity-[0.06]" />
        </div>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-[#181715] via-[#24221E]/90 to-[#181715]' : 'bg-gradient-to-r from-[#F9F8F5]/95 via-white/90 to-[#F9F8F5]/95'}`} />
        {isDark && <div className="absolute inset-0 shimmer opacity-20" />}
        <div className={`relative p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 border rounded-2xl glass-panel-gold ${isDark ? 'border-[#3F341C]/50' : 'border-[#F0EEE7]'}`}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#987012]/20 to-[#987012]/5 flex items-center justify-center shrink-0" style={{ boxShadow: isDark ? '0 0 30px rgba(152,112,18,0.1)' : 'none' }}>
            <Bot size={26} className="text-[#987012] sm:w-8 sm:h-8" />
          </div>
          <div className="flex-1 text-center sm:text-right min-w-0">
            <h3 className={`text-sm sm:text-lg font-bold font-['Cairo'] mb-1 ${textPrimary}`}>
              {l({ ar: 'توصيات Maham AI', en: 'Maham AI Recommendations' })}
            </h3>
            <p className={`text-[10px] sm:text-sm ${textSecondary} leading-relaxed`}>
              {l({ ar: 'المساعد الذكي يقترح رعاية مؤتمر البترول العالمي 2026 — متوقع عائد استثمار 340% بناءً على تحليل جمهورك المستهدف وقطاعك الصناعي.', en: 'AI suggests sponsoring World Petroleum Congress 2026 — Expected ROI of 340% based on your target audience and industry sector analysis.' })}
            </p>
          </div>
          <Link href="/ai-assistant">
            <div className="btn-cta-glass px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">
              {l({ ar: 'عرض التوصيات', en: 'View Recommendations' })}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
