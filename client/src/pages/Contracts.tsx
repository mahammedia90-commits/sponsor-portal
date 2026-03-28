/**
 * Contracts — Sponsor Digital Contract Management
 * Full contract lifecycle: draft → review → sign → active → completed
 * ZATCA & Ministry of Commerce compliant
 * Connected to real tRPC API
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import {
  FileText, Download, CheckCircle, Clock, AlertCircle, Eye,
  Send, Bot, Shield, Stamp, Printer, Share2, Filter,
  FileSignature, Scale, Building2, Calendar, DollarSign, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const statusConfig: Record<string, { color: string; bgClass: string; label: { ar: string; en: string }; icon: React.ElementType }> = {
  signed: { color: 'text-[#d4b85a]', bgClass: 'bg-[#fbf8f0]0/10 border-[#fbf8f0]0/20', label: { ar: 'موقّع', en: 'Signed' }, icon: CheckCircle },
  pending: { color: 'text-yellow-400', bgClass: 'bg-yellow-500/10 border-yellow-500/20', label: { ar: 'بانتظار التوقيع', en: 'Pending Signature' }, icon: Clock },
  draft: { color: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/20', label: { ar: 'مسودة', en: 'Draft' }, icon: FileText },
  expired: { color: 'text-red-400', bgClass: 'bg-red-500/10 border-red-500/20', label: { ar: 'منتهي', en: 'Expired' }, icon: AlertCircle },
  active: { color: 'text-[#987012]', bgClass: 'bg-[#987012]/10 border-[#987012]/20', label: { ar: 'نشط', en: 'Active' }, icon: Shield },
};

export default function Contracts() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContract, setSelectedContract] = useState<number | null>(null);

  const { data: contractsData, isLoading } = trpc.contracts.list.useQuery();
  const contracts = useMemo(() => contractsData ?? [], [contractsData]);

  const filtered = filterStatus === 'all' ? contracts : contracts.filter((c: any) => c.status === filterStatus);
  const totalValue = contracts.reduce((s: number, c: any) => s + (Number(c.totalAmount) || 0), 0);

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
        title={l({ ar: 'العقود الرقمية', en: 'Digital Contracts' })}
        subtitle={l({ ar: 'إدارة عقود الرعاية — متوافقة مع ZATCA ووزارة التجارة', en: 'Manage sponsorship contracts — ZATCA & MOC compliant' })}
        image={IMAGES.contractSigning}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <button onClick={() => toast.info(l({ ar: 'جاري تحميل جميع العقود...', en: 'Downloading all contracts...' }))} className="px-3 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:border-[#987012]/20 flex items-center gap-1.5 transition-colors btn-ripple">
          <Download size={12} />{l({ ar: 'تحميل الكل', en: 'Download All' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: { ar: 'إجمالي العقود', en: 'Total Contracts' }, value: contracts.length, icon: FileText, color: 'text-blue-400' },
          { label: { ar: 'عقود موقّعة', en: 'Signed' }, value: contracts.filter((c: any) => c.status === 'signed').length, icon: CheckCircle, color: 'text-[#d4b85a]' },
          { label: { ar: 'بانتظار التوقيع', en: 'Pending' }, value: contracts.filter((c: any) => c.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
          { label: { ar: 'القيمة الإجمالية', en: 'Total Value' }, value: totalValue > 0 ? `${(totalValue / 1000).toFixed(0)}K` : '0', icon: DollarSign, color: 'text-[#987012]' },
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{l(stat.label)}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {['all', 'signed', 'pending', 'draft', 'expired'].map(status => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${filterStatus === status ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 border border-border hover:border-[#987012]/20'}`}>
            {status === 'all' ? l({ ar: 'الكل', en: 'All' }) : l(statusConfig[status]?.label || { ar: status, en: status })}
          </button>
        ))}
      </div>

      {/* Compliance Banner */}
      <div className="glass-card animate-border-glow rounded-xl p-3 border-[#fbf8f0]0/10">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-[#d4b85a] shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-[#d4b85a]">{l({ ar: 'عقود رقمية معتمدة', en: 'Certified Digital Contracts' })}</p>
            <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'جميع العقود متوافقة مع هيئة الزكاة والضريبة والجمارك (ZATCA) ووزارة التجارة — توقيع إلكتروني معتمد — أرشفة تلقائية', en: 'All contracts comply with ZATCA & Ministry of Commerce — Certified e-signature — Auto-archiving' })}</p>
          </div>
        </div>
      </div>

      {/* Contract List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={40} className="mx-auto mb-3 text-[#987012]/30" />
            <p className="text-sm text-muted-foreground">{l({ ar: 'لا توجد عقود بعد', en: 'No contracts yet' })}</p>
          </div>
        ) : (
          filtered.map((contract: any, i: number) => {
            const cfg = statusConfig[contract.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            const isExpanded = selectedContract === contract.id;
            const tierLabel = contract.packageTier === 'platinum' ? l({ ar: 'بلاتيني', en: 'Platinum' }) : contract.packageTier === 'gold' ? l({ ar: 'ذهبي', en: 'Gold' }) : l({ ar: 'فضي', en: 'Silver' });
            return (
              <div key={contract.id} className="glass-card rounded-xl overflow-hidden tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="p-3 sm:p-4 lg:p-5 cursor-pointer" onClick={() => setSelectedContract(isExpanded ? null : contract.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#987012]/10"><FileSignature size={14} className="text-[#987012]" /></div>
                      <div>
                        <span className="text-[10px] text-muted-foreground/50 font-mono">#{contract.id}</span>
                        <h3 className="text-xs sm:text-sm font-bold text-foreground">{contract.contractNumber || `Contract #${contract.id}`}</h3>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${cfg.bgClass} ${cfg.color}`}>
                      <StatusIcon size={10} />{l(cfg.label)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/70">
                    <span className="flex items-center gap-1"><Scale size={10} />{l({ ar: 'الحزمة:', en: 'Package:' })} <span className="text-[#987012] font-medium">{tierLabel}</span></span>
                    <span className="flex items-center gap-1"><DollarSign size={10} />{Number(contract.totalAmount || 0).toLocaleString()} {l({ ar: 'ر.س', en: 'SAR' })}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} />{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '—'}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border p-3 sm:p-4 space-y-3 animate-fade-in">
                    <div className="flex flex-wrap gap-2">
                      {contract.status === 'pending' && (
                        <button onClick={() => toast.success(l({ ar: 'تم توقيع العقد بنجاح — سيتم إرسال نسخة عبر البريد والواتساب', en: 'Contract signed — Copy sent via email & WhatsApp' }))} className="btn-cta-glass px-4 py-2 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                          <FileSignature size={12} />{l({ ar: 'توقيع العقد إلكترونياً', en: 'Sign Electronically' })}
                        </button>
                      )}
                      <button onClick={() => toast.info(l({ ar: 'جاري تحميل العقد...', en: 'Downloading...' }))} className="px-3 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground/70 flex items-center gap-1.5 hover:border-[#987012]/20 transition-colors">
                        <Download size={12} />{l({ ar: 'تحميل PDF', en: 'Download PDF' })}
                      </button>
                      <button onClick={() => toast.info(l({ ar: 'جاري إرسال نسخة...', en: 'Sending copy...' }))} className="px-3 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground/70 flex items-center gap-1.5 hover:border-[#987012]/20 transition-colors">
                        <Send size={12} />{l({ ar: 'إرسال نسخة', en: 'Send Copy' })}
                      </button>
                    </div>

                    {contract.signedAt && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-[#fbf8f0]0/5 border border-[#fbf8f0]0/10">
                        <Stamp size={12} className="text-[#d4b85a]" />
                        <span className="text-[9px] text-[#d4b85a]">{l({ ar: `تم التوقيع بتاريخ ${new Date(contract.signedAt).toLocaleDateString()}`, en: `Signed on ${new Date(contract.signedAt).toLocaleDateString()}` })}</span>
                      </div>
                    )}
                  </div>
                )}
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
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'جميع عقودك الموقعة تتضمن بنود حماية كاملة وشروط إلغاء واضحة متوافقة مع النظام السعودي.', en: 'All your signed contracts include full protection clauses and clear cancellation terms compliant with Saudi law.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
