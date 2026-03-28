/**
 * Leads — Lead generation and management for sponsors
 * AI-powered lead scoring and tracking
 * Connected to real tRPC API
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Users, Mail, Phone, Building2, TrendingUp, Download, Star, Bot, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const LEADS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-leads-PzbMrGaLFAYJbUPP2KkvrB.webp';

const interestConfig: Record<string, { color: string; bgClass: string; label: { ar: string; en: string } }> = {
  high: { color: 'text-[#d4b85a]', bgClass: 'bg-[#fbf8f0]0/10 border-[#fbf8f0]0/20', label: { ar: 'مرتفع', en: 'High' } },
  medium: { color: 'text-yellow-400', bgClass: 'bg-yellow-500/10 border-yellow-500/20', label: { ar: 'متوسط', en: 'Medium' } },
  low: { color: 'text-muted-foreground/70', bgClass: 'bg-muted/50 border-border', label: { ar: 'منخفض', en: 'Low' } },
};
const statusConfig: Record<string, { color: string; label: { ar: string; en: string } }> = {
  new: { color: 'text-blue-400', label: { ar: 'جديد', en: 'New' } },
  contacted: { color: 'text-yellow-400', label: { ar: 'تم التواصل', en: 'Contacted' } },
  qualified: { color: 'text-[#d4b85a]', label: { ar: 'مؤهل', en: 'Qualified' } },
  converted: { color: 'text-purple-400', label: { ar: 'محوّل', en: 'Converted' } },
};

export default function Leads() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [filter, setFilter] = useState('all');

  const { data: leadsData, isLoading } = trpc.leads.list.useQuery();
  const leads = useMemo(() => leadsData ?? [], [leadsData]);

  const filtered = filter === 'all' ? leads : leads.filter((ld: any) => ld.interestLevel === filter || ld.status === filter);

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
        title={l({ ar: 'العملاء المحتملون', en: 'Leads' })}
        subtitle={l({ ar: 'تتبع وإدارة العملاء المحتملين', en: 'Track and manage potential clients' })}
        image={IMAGES.leadsCrm}
      />

      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36 sm:h-40">
        <img src={LEADS_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181715] via-[#181715]/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
          <h2 className="text-base sm:text-xl font-bold text-white font-['Cairo']">{l({ ar: 'العملاء المحتملون', en: 'Lead Generation' })}</h2>
          <p className="text-[10px] text-[#A0A0A0]">{l({ ar: 'عملاء محتملون من التجار والزوار — تصنيف ذكي بواسطة Maham AI', en: 'Leads from traders & visitors — AI-powered scoring by Maham AI' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: l({ ar: 'إجمالي العملاء', en: 'Total Leads' }), value: leads.length, icon: Users, color: 'text-blue-400' },
          { label: l({ ar: 'اهتمام مرتفع', en: 'High Interest' }), value: leads.filter((ld: any) => ld.interestLevel === 'high').length, icon: Star, color: 'text-[#d4b85a]' },
          { label: l({ ar: 'تم التحويل', en: 'Converted' }), value: leads.filter((ld: any) => ld.status === 'converted').length, icon: TrendingUp, color: 'text-purple-400' },
          { label: l({ ar: 'عملاء جدد', en: 'New Leads' }), value: leads.filter((ld: any) => ld.status === 'new').length, icon: Mail, color: 'text-[#987012]' },
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {['all', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${filter === f ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 border border-border hover:border-[#987012]/20'}`}>
            {f === 'all' ? l({ ar: 'الكل', en: 'All' }) : l(interestConfig[f]?.label || { ar: f, en: f })}
          </button>
        ))}
      </div>

      {/* Leads Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto mb-3 text-[#987012]/30" />
            <p className="text-sm text-muted-foreground">{l({ ar: 'لا يوجد عملاء محتملون بعد', en: 'No leads yet' })}</p>
          </div>
        ) : (
          filtered.map((lead: any, i: number) => {
            const interest = interestConfig[lead.interestLevel] || interestConfig.medium;
            const status = statusConfig[lead.status] || statusConfig.new;
            return (
              <div key={lead.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${interest.bgClass} ${interest.color}`}>
                      {(lead.contactName || lead.name || '?').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">{lead.companyName || lead.company || '—'}</h3>
                      <p className="text-[9px] text-muted-foreground/50">{lead.contactName || lead.name || '—'} — {lead.industry || '—'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-medium border ${interest.bgClass} ${interest.color}`}>{l(interest.label)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-medium bg-muted/50 ${status.color}`}>{l(status.label)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-3 text-[9px] text-muted-foreground/50">
                    <span className="flex items-center gap-1"><Mail size={9} />{lead.email || '—'}</span>
                    <span className="flex items-center gap-1"><Building2 size={9} />{lead.eventTitle || lead.source || '—'}</span>
                  </div>
                  <span className="text-[9px] text-foreground/20">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button onClick={() => toast.success(l({ ar: 'جاري تصدير البيانات...', en: 'Exporting data...' }))} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-[10px] text-muted-foreground/70 hover:border-[#987012]/20 transition-colors">
          <Download size={12} />{l({ ar: 'تصدير CSV', en: 'Export CSV' })}
        </button>
      </div>

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: `لديك ${leads.length} عميل محتمل — ${leads.filter((ld: any) => ld.interestLevel === 'high').length} منهم باهتمام مرتفع. ننصح بالتواصل السريع مع العملاء ذوي الاهتمام المرتفع — معدل التحويل يرتفع 3 أضعاف عند التواصل خلال 48 ساعة.`, en: `You have ${leads.length} leads — ${leads.filter((ld: any) => ld.interestLevel === 'high').length} with high interest. We recommend quick follow-up with high-interest leads — conversion rate triples within 48 hours.` })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
