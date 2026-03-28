/**
 * My Sponsorships — Sponsor's active and past sponsorships
 * Connected to real tRPC API
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Award, Calendar, MapPin, Users, Eye, TrendingUp, Bot, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const tierConfig: Record<string, { label: { ar: string; en: string }; badge: string }> = {
  platinum: { label: { ar: 'بلاتيني', en: 'Platinum' }, badge: 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 text-gray-800' },
  gold: { label: { ar: 'ذهبي', en: 'Gold' }, badge: 'bg-[#fbf8f0]0 text-white' },
  silver: { label: { ar: 'فضي', en: 'Silver' }, badge: 'bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 text-gray-800' },
  bronze: { label: { ar: 'برونزي', en: 'Bronze' }, badge: 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-white' },
};
const statusConfig: Record<string, { label: { ar: string; en: string }; color: string }> = {
  active: { label: { ar: 'نشط', en: 'Active' }, color: 'text-[#d4b85a] bg-[#fbf8f0]0/10 border-[#fbf8f0]0/20' },
  pending_review: { label: { ar: 'قيد المراجعة', en: 'Pending' }, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved: { label: { ar: 'معتمد', en: 'Approved' }, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  completed: { label: { ar: 'مكتمل', en: 'Completed' }, color: 'text-muted-foreground/70 bg-muted/50 border-border' },
  rejected: { label: { ar: 'مرفوض', en: 'Rejected' }, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  cancelled: { label: { ar: 'ملغي', en: 'Cancelled' }, color: 'text-muted-foreground/50 bg-muted/50 border-border' },
};

export default function Sponsorships() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [filter, setFilter] = useState('all');

  const { data: sponsorshipsData, isLoading } = trpc.sponsorships.list.useQuery();
  const sponsorships = useMemo(() => sponsorshipsData ?? [], [sponsorshipsData]);

  const filters = [
    { key: 'all', label: l({ ar: 'الكل', en: 'All' }) },
    { key: 'active', label: l({ ar: 'نشط', en: 'Active' }) },
    { key: 'pending_review', label: l({ ar: 'قيد المراجعة', en: 'Pending' }) },
    { key: 'approved', label: l({ ar: 'معتمد', en: 'Approved' }) },
    { key: 'completed', label: l({ ar: 'مكتمل', en: 'Completed' }) },
  ];

  const filtered = filter === 'all' ? sponsorships : sponsorships.filter((s: any) => s.status === filter);
  const totalAmount = sponsorships.reduce((s: number, sp: any) => s + (Number(sp.totalAmount) || 0), 0);
  const totalLeads = sponsorships.reduce((s: number, sp: any) => s + (Number(sp.leadsGenerated) || 0), 0);
  const totalImpressions = sponsorships.reduce((s: number, sp: any) => s + (Number(sp.brandImpressions) || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-[#987012]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'رعاياتي', en: 'My Sponsorships' })}
        subtitle={l({ ar: 'إدارة جميع رعاياتك النشطة', en: 'Manage all your active sponsorships' })}
        image={IMAGES.expoHall}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: l({ ar: 'إجمالي الرعايات', en: 'Total Sponsorships' }), value: sponsorships.length, color: 'text-foreground' },
          { label: l({ ar: 'إجمالي الاستثمار', en: 'Total Investment' }), value: totalAmount > 0 ? `${(totalAmount / 1000).toFixed(0)}K` : '0', suffix: l({ ar: 'ر.س', en: 'SAR' }), color: 'text-[#987012]' },
          { label: l({ ar: 'عملاء محتملون', en: 'Leads Generated' }), value: totalLeads.toLocaleString(), color: 'text-[#d4b85a]' },
          { label: l({ ar: 'مشاهدات العلامة', en: 'Brand Impressions' }), value: totalImpressions > 0 ? `${(totalImpressions / 1000000).toFixed(1)}M` : '0', color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value} {s.suffix && <span className="text-[9px] text-muted-foreground/50">{s.suffix}</span>}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${filter === f.key ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 border border-border hover:border-[#987012]/20'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Sponsorships List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Award size={40} className="mx-auto mb-3 text-[#987012]/30" />
            <p className="text-sm text-muted-foreground">{l({ ar: 'لا توجد رعايات بعد', en: 'No sponsorships yet' })}</p>
          </div>
        ) : (
          filtered.map((s: any, i: number) => {
            const tier = tierConfig[s.packageTier || s.tier || 'gold'] || tierConfig.gold;
            const status = statusConfig[s.status] || statusConfig.active;
            const eventTitle = language === 'ar' ? (s.eventTitleAr || s.eventTitle || '') : (s.eventTitleEn || s.eventTitle || '');
            const eventSubtitle = language === 'ar' ? (s.eventTitleEn || '') : (s.eventTitleAr || '');
            return (
              <div key={s.id} className="glass-card rounded-xl overflow-hidden tilt-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${tier.badge}`}>{l(tier.label)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${status.color}`}>{l(status.label)}</span>
                    </div>
                    <span className="text-[9px] text-foreground/20">#{s.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{eventTitle}</h3>
                  <p className="text-[9px] text-muted-foreground/50 mb-3">{eventSubtitle}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { icon: MapPin, text: s.city || '—' },
                      { icon: Calendar, text: s.startDate ? new Date(s.startDate).toLocaleDateString() : '—' },
                      { icon: Users, text: s.expectedVisitors ? `${Number(s.expectedVisitors).toLocaleString()}+` : '—' },
                      { icon: Eye, text: Number(s.brandImpressions) > 0 ? `${(Number(s.brandImpressions) / 1000).toFixed(0)}K` : '—' },
                      { icon: TrendingUp, text: Number(s.leadsGenerated) > 0 ? `${s.leadsGenerated}` : '—' },
                    ].map((item, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50">
                        <item.icon size={10} className="text-[#987012]/50" />{item.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border px-4 py-2.5 flex items-center justify-between bg-muted/20">
                  <p className="text-sm font-bold text-[#987012]">{Number(s.totalAmount || 0).toLocaleString()} <span className="text-[9px] text-muted-foreground/50">{l({ ar: 'ر.س', en: 'SAR' })}</span></p>
                  <span className="text-[10px] text-[#987012] font-medium cursor-pointer hover:underline">{l({ ar: 'عرض التفاصيل', en: 'View Details' })}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: `لديك ${sponsorships.length} رعاية بإجمالي استثمار ${(totalAmount / 1000).toFixed(0)}K ر.س. ننصح بتصفح الفرص الجديدة لتعزيز حضور علامتك التجارية.`, en: `You have ${sponsorships.length} sponsorships totaling ${(totalAmount / 1000).toFixed(0)}K SAR. We recommend browsing new opportunities to enhance your brand presence.` })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
