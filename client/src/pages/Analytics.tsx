/**
 * Analytics — Campaign performance and brand analytics
 * Advanced analytics with AI insights
 * Connected to real tRPC API
 */
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { BarChart3, TrendingUp, Eye, Users, Target, ArrowUpRight, Download, Bot, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const ANALYTICS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-analytics-Lqmio3HshGuZziYUwuiPuy.webp';

export default function Analytics() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const { data: dashboardData, isLoading: loadingDashboard } = trpc.analytics.dashboard.useQuery();
  const { data: sponsorshipsData } = trpc.sponsorships.list.useQuery();
  const { data: leadsData } = trpc.leads.list.useQuery();

  const sponsorships = useMemo(() => sponsorshipsData ?? [], [sponsorshipsData]);
  const leads = useMemo(() => leadsData ?? [], [leadsData]);

  const totalImpressions = sponsorships.reduce((s: number, sp: any) => s + (Number(sp.brandImpressions) || 0), 0);
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? ((leads.filter((ld: any) => ld.status === 'converted').length / totalLeads) * 100).toFixed(1) : '0';

  const monthlyData = [
    { month: l({ ar: 'يناير', en: 'Jan' }), impressions: 450000, leads: 45, engagement: 3.2 },
    { month: l({ ar: 'فبراير', en: 'Feb' }), impressions: 680000, leads: 78, engagement: 4.1 },
    { month: l({ ar: 'مارس', en: 'Mar' }), impressions: 890000, leads: 156, engagement: 5.8 },
    { month: l({ ar: 'أبريل', en: 'Apr' }), impressions: 2450000, leads: 312, engagement: 7.2 },
  ];

  const audienceDemo = [
    { label: l({ ar: 'مدراء تنفيذيون', en: 'C-Level Executives' }), pct: 22 },
    { label: l({ ar: 'مدراء أقسام', en: 'Department Managers' }), pct: 35 },
    { label: l({ ar: 'رواد أعمال', en: 'Entrepreneurs' }), pct: 18 },
    { label: l({ ar: 'مستثمرون', en: 'Investors' }), pct: 15 },
    { label: l({ ar: 'أخرى', en: 'Others' }), pct: 10 },
  ];

  const exposureAreas = [
    { area: l({ ar: 'مداخل الفعاليات', en: 'Event Entrances' }), impressions: '1.2M', growth: '+45%' },
    { area: l({ ar: 'موقع الفعالية', en: 'Event Website' }), impressions: '890K', growth: '+32%' },
    { area: l({ ar: 'خرائط الأجنحة', en: 'Booth Maps' }), impressions: '450K', growth: '+28%' },
    { area: l({ ar: 'منصة التاجر', en: 'Trader Platform' }), impressions: '320K', growth: '+55%' },
    { area: l({ ar: 'الحملات الرقمية', en: 'Digital Campaigns' }), impressions: '680K', growth: '+67%' },
    { area: l({ ar: 'وسائل التواصل', en: 'Social Media' }), impressions: '540K', growth: '+41%' },
  ];

  if (loadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-[#987012]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'التحليلات والأداء', en: 'Analytics & Performance' })}
        subtitle={l({ ar: 'تتبع أداء حملاتك التسويقية وعائد الاستثمار — مدعوم بـ Maham AI', en: 'Track campaign performance and ROI — Powered by Maham AI' })}
        image={IMAGES.analytics}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: l({ ar: 'مشاهدات العلامة', en: 'Brand Impressions' }), value: totalImpressions > 0 ? `${(totalImpressions / 1000000).toFixed(1)}M` : '0', icon: Eye, color: 'text-blue-400' },
          { label: l({ ar: 'عملاء محتملون', en: 'Total Leads' }), value: totalLeads, icon: Users, color: 'text-[#d4b85a]' },
          { label: l({ ar: 'معدل التحويل', en: 'Conversion Rate' }), value: `${conversionRate}%`, icon: Target, color: 'text-purple-400' },
          { label: l({ ar: 'العائد المتوقع', en: 'Expected ROI' }), value: '340%', icon: TrendingUp, color: 'text-[#987012]' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <kpi.icon size={16} className={`${kpi.color} mb-2`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Monthly Performance */}
        <div className="glass-card animate-border-glow rounded-xl p-4">
          <h3 className="text-xs font-bold text-foreground mb-4">{l({ ar: 'الأداء الشهري', en: 'Monthly Performance' })}</h3>
          <div className="space-y-3">
            {monthlyData.map((m, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-foreground">{m.month}</span>
                  <span className="text-[10px] text-muted-foreground/50">{(m.impressions / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="gold-gradient h-1.5 rounded-full transition-all duration-500" style={{ width: `${(m.impressions / 2450000) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-foreground/20">{m.leads} {l({ ar: 'عميل', en: 'leads' })}</span>
                  <span className="text-[9px] text-[#d4b85a]">{m.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="glass-card animate-border-glow rounded-xl p-4">
          <h3 className="text-xs font-bold text-foreground mb-4">{l({ ar: 'ملف الجمهور', en: 'Audience Profile' })}</h3>
          <div className="space-y-3">
            {audienceDemo.map((seg, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-foreground">{seg.label}</span>
                  <span className="text-[10px] font-bold text-[#987012]">{seg.pct}%</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="gold-gradient h-1.5 rounded-full" style={{ width: `${seg.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Exposure Areas */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-foreground">{l({ ar: 'مناطق ظهور العلامة التجارية', en: 'Brand Exposure Areas' })}</h3>
          <button onClick={() => toast.info(l({ ar: 'جاري تحميل التقرير...', en: 'Downloading report...' }))} className="flex items-center gap-1 text-[10px] text-[#987012] hover:underline">
            <Download size={10} />{l({ ar: 'تحميل التقرير', en: 'Download Report' })}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {exposureAreas.map((area, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-[#987012]/20 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <p className="text-[10px] text-muted-foreground/70 mb-1">{area.area}</p>
              <p className="text-sm font-bold text-foreground">{area.impressions}</p>
              <span className="flex items-center gap-0.5 text-[9px] text-[#d4b85a] font-medium"><ArrowUpRight size={9} />{area.growth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'أداؤك يتصاعد بشكل ملحوظ! مشاهدات العلامة زادت 340% في الربع الأخير. أبرز مصادر الظهور: مداخل الفعاليات (1.2M) والحملات الرقمية (+67%). توصيتي: ركّز على رعاية المسرح الرئيسي في الفعالية القادمة — البيانات تشير لأعلى معدل تحويل من هذا الموقع.', en: 'Your performance is rising significantly! Brand impressions increased 340% last quarter. Top exposure sources: Event entrances (1.2M) and digital campaigns (+67%). My recommendation: Focus on main stage sponsorship for the next event — data shows the highest conversion rate from this location.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
