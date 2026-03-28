/**
 * Campaigns — Marketing campaigns management
 * Connected to real tRPC API
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Megaphone, Play, Pause, Eye, Users, TrendingUp, Plus, Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

export default function Campaigns() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const { data: campaignsData, isLoading } = trpc.campaigns.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: statsData } = trpc.campaigns.stats.useQuery(undefined, { refetchOnWindowFocus: false });

  const campaigns = campaignsData ?? [];
  const stats = statsData ?? { total: 0, active: 0, totalImpressions: 0, totalClicks: 0 };

  const formatNumber = (n: number | string | null) => {
    const num = typeof n === 'string' ? parseFloat(n) : (n ?? 0);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-[#987012] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'الحملات التسويقية', en: 'Marketing Campaigns' })}
        subtitle={l({ ar: 'أنشئ وأدر حملاتك التسويقية', en: 'Create and manage your marketing campaigns' })}
        image={IMAGES.leadsCrm}
      />

      <div className="flex items-center justify-between">
        <button onClick={() => toast.info(l({ ar: 'ستتوفر هذه الميزة قريباً', en: 'Feature coming soon' }))} className="btn-cta-glass px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1">
          <Plus size={12} />{l({ ar: 'حملة جديدة', en: 'New Campaign' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: l({ ar: 'إجمالي الحملات', en: 'Total Campaigns' }), value: stats.total, color: 'text-foreground' },
          { label: l({ ar: 'حملات نشطة', en: 'Active' }), value: stats.active, color: 'text-[#d4b85a]' },
          { label: l({ ar: 'إجمالي المشاهدات', en: 'Total Impressions' }), value: formatNumber(stats.totalImpressions), color: 'text-[#987012]' },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 text-center tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Campaign Cards */}
      {campaigns.length === 0 ? (
        <div className="glass-card animate-border-glow rounded-xl p-8 text-center">
          <Megaphone size={32} className="text-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground/70">{l({ ar: 'لا توجد حملات حالياً', en: 'No campaigns yet' })}</p>
          <p className="text-xs text-muted-foreground/50 mt-1">{l({ ar: 'أنشئ حملة تسويقية جديدة لتعزيز ظهور علامتك التجارية', en: 'Create a new marketing campaign to boost your brand visibility' })}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c: any, i: number) => {
            const budget = typeof c.budget === 'string' ? parseFloat(c.budget) : (c.budget ?? 0);
            const spent = typeof c.spent === 'string' ? parseFloat(c.spent) : (c.spent ?? 0);
            const impressions = c.impressions ?? 0;
            const clicks = c.clicks ?? 0;
            const leads = c.leads ?? 0;
            const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0';
            const budgetPct = budget > 0 ? ((spent / budget) * 100).toFixed(0) : '0';

            return (
              <div key={c.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone size={14} className="text-[#987012]" />
                    <span className="text-[9px] text-muted-foreground/50">CMP-{String(c.id).padStart(3, '0')}</span>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${c.status === 'active' ? 'text-[#d4b85a] bg-[#987012]/10 border-[#987012]/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                    {c.status === 'active' ? <Play size={8} /> : <Pause size={8} />}
                    {c.status === 'active' ? l({ ar: 'نشطة', en: 'Active' }) : l({ ar: 'مخطط لها', en: 'Planned' })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-0.5">{language === 'ar' ? c.nameAr : c.nameEn}</h3>
                <p className="text-[9px] text-muted-foreground/50 mb-3">{language === 'ar' ? c.nameEn : c.nameAr}</p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {[
                    { label: l({ ar: 'مشاهدة', en: 'Impressions' }), value: formatNumber(impressions) },
                    { label: l({ ar: 'نقرة', en: 'Clicks' }), value: formatNumber(clicks) },
                    { label: l({ ar: 'عملاء', en: 'Leads' }), value: leads, color: 'text-[#d4b85a]' },
                    { label: 'CTR', value: `${ctr}%` },
                    { label: l({ ar: 'المنفق (ر.س)', en: 'Spent (SAR)' }), value: formatNumber(spent) },
                  ].map((m, j) => (
                    <div key={j} className="text-center p-2 rounded-lg bg-muted/30 border border-border">
                      <p className={`text-xs font-bold ${m.color || 'text-foreground'}`}>{m.value}</p>
                      <p className="text-[8px] text-foreground/20">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-[9px] text-muted-foreground/50 mb-1">
                    <span>{l({ ar: 'الميزانية المستخدمة', en: 'Budget Used' })}</span>
                    <span>{budgetPct}%</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5">
                    <div className="gold-gradient h-1.5 rounded-full transition-all duration-500" style={{ width: `${budgetPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: `لديك ${stats.active} حملة نشطة بإجمالي ${formatNumber(stats.totalImpressions)} مشاهدة و ${formatNumber(stats.totalClicks)} نقرة. ننصح بزيادة ميزانية الحملات الرقمية 20% وتخصيص حملة مستقلة لوسائل التواصل الاجتماعي لتعظيم العائد.`, en: `You have ${stats.active} active campaigns with ${formatNumber(stats.totalImpressions)} total impressions and ${formatNumber(stats.totalClicks)} clicks. We recommend increasing digital campaign budget by 20% and launching a dedicated social media campaign to maximize ROI.` })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
