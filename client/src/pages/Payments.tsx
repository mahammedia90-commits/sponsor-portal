/**
 * Payments — Sponsor Payment Management
 * Connected to real tRPC API
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import {
  CreditCard, Download, CheckCircle, Clock,
  DollarSign, Receipt, Bot, Shield, Wallet, Calendar, Building2, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

export default function Payments() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const { data: invoicesData, isLoading: loadingInvoices } = trpc.payments.invoices.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: statsData } = trpc.payments.stats.useQuery(undefined, { refetchOnWindowFocus: false });

  const invoices = invoicesData ?? [];
  const stats = statsData ?? { totalPaid: '0', pendingPayments: 0 };

  const formatAmount = (amount: number | string | null) => {
    const n = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
    return n.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const statusColors: Record<string, { bg: string; text: string; label: Record<string, string> }> = {
    paid: { bg: 'bg-[#987012]/10', text: 'text-[#d4b85a]', label: { ar: 'مدفوع', en: 'Paid' } },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: { ar: 'معلق', en: 'Pending' } },
    overdue: { bg: 'bg-red-500/10', text: 'text-red-400', label: { ar: 'متأخر', en: 'Overdue' } },
    cancelled: { bg: 'bg-muted', text: 'text-muted-foreground', label: { ar: 'ملغي', en: 'Cancelled' } },
  };

  if (loadingInvoices) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-[#987012] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'المدفوعات والفواتير', en: 'Payments & Invoices' })}
        subtitle={l({ ar: 'إدارة المدفوعات والفواتير الرقمية', en: 'Manage payments and digital invoices' })}
        image={IMAGES.contractSigning}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: { ar: 'إجمالي المدفوع', en: 'Total Paid' }, value: formatAmount(stats.totalPaid), icon: CheckCircle, color: 'text-[#d4b85a]' },
          { label: { ar: 'مبالغ معلقة', en: 'Pending' }, value: stats.pendingPayments, icon: Clock, color: 'text-yellow-400' },
          { label: { ar: 'عدد الفواتير', en: 'Invoices' }, value: invoices.length, icon: Receipt, color: 'text-blue-400' },
          { label: { ar: 'طرق الدفع', en: 'Payment Methods' }, value: '3', icon: Wallet, color: 'text-[#987012]' },
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{l(stat.label)}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
        <h3 className="text-xs font-bold text-foreground mb-3">{l({ ar: 'طرق الدفع المتاحة', en: 'Available Payment Methods' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { name: { ar: 'تحويل بنكي', en: 'Bank Transfer' }, desc: { ar: 'جميع البنوك السعودية', en: 'All Saudi Banks' }, icon: Building2 },
            { name: { ar: 'بطاقة ائتمان / مدى', en: 'Credit Card / Mada' }, desc: { ar: 'Visa / Mastercard / مدى', en: 'Visa / Mastercard / Mada' }, icon: CreditCard },
            { name: { ar: 'Apple Pay / STC Pay', en: 'Apple Pay / STC Pay' }, desc: { ar: 'دفع سريع وآمن', en: 'Fast & secure' }, icon: Wallet },
          ].map((method, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-[#987012]/20 transition-colors flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#987012]/10"><method.icon size={14} className="text-[#987012]" /></div>
              <div>
                <p className="text-[10px] font-bold text-foreground">{l(method.name)}</p>
                <p className="text-[9px] text-muted-foreground/50">{l(method.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ZATCA Compliance */}
      <div className="glass-card animate-border-glow rounded-xl p-3 border-[#987012]/10">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-[#d4b85a] shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-[#d4b85a]">{l({ ar: 'فواتير إلكترونية معتمدة', en: 'Certified E-Invoices' })}</p>
            <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'جميع الفواتير متوافقة مع نظام الفوترة الإلكترونية (فاتورة) — تتضمن QR Code ورقم ضريبي وختم ZATCA', en: 'All invoices comply with ZATCA e-invoicing (Fatoora) — includes QR Code, tax number & ZATCA stamp' })}</p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="glass-card animate-border-glow rounded-xl p-8 text-center">
          <Receipt size={32} className="text-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground/70">{l({ ar: 'لا توجد فواتير حالياً', en: 'No invoices yet' })}</p>
          <p className="text-xs text-muted-foreground/50 mt-1">{l({ ar: 'ستظهر الفواتير هنا بعد حجز رعاية', en: 'Invoices will appear here after booking a sponsorship' })}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {invoices.map((inv: any, i: number) => {
            const sc = statusColors[inv.status] || statusColors.pending;
            return (
              <div key={inv.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${sc.bg}`}>
                      {inv.status === 'paid' ? <CheckCircle size={14} className={sc.text} /> : <Clock size={14} className={sc.text} />}
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground/50 font-mono">{inv.invoiceNumber || `INV-${inv.id}`}</p>
                      <h3 className="text-xs font-bold text-foreground">{inv.description || l({ ar: 'فاتورة رعاية', en: 'Sponsorship Invoice' })}</h3>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-foreground">{formatAmount(inv.amount)} <span className="text-[9px] text-muted-foreground/50">{inv.currency || 'SAR'}</span></p>
                    <span className={`text-[9px] ${sc.text}`}>{l(sc.label)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-3 text-[9px] text-muted-foreground/50">
                    <span className="flex items-center gap-1"><Calendar size={9} />{formatDate(inv.issuedAt || inv.createdAt)}</span>
                    {inv.dueDate && <span className="flex items-center gap-1"><Clock size={9} />{l({ ar: 'يستحق:', en: 'Due:' })} {formatDate(inv.dueDate)}</span>}
                  </div>
                  <div className="flex gap-1.5">
                    {inv.status === 'pending' && (
                      <button onClick={() => toast.success(l({ ar: 'جاري توجيهك لبوابة الدفع...', en: 'Redirecting to payment...' }))} className="btn-cta-glass px-3 py-1.5 rounded-lg text-[9px] font-semibold">
                        {l({ ar: 'ادفع الآن', en: 'Pay Now' })}
                      </button>
                    )}
                    <button onClick={() => toast.info(l({ ar: 'جاري تحميل الفاتورة...', en: 'Downloading invoice...' }))} className="px-2.5 py-1.5 rounded-lg text-[9px] border border-border text-muted-foreground/70 flex items-center gap-1 hover:border-[#987012]/20 transition-colors">
                      <Download size={10} />{l({ ar: 'فاتورة', en: 'Invoice' })}
                    </button>
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
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: `إجمالي المدفوعات: ${formatAmount(stats.totalPaid)} ر.س — المعلق: ${stats.pendingPayments} فاتورة. ننصح بسداد المبالغ المعلقة قبل الموعد النهائي للاستفادة من خصم الدفع المبكر.`, en: `Total paid: ${formatAmount(stats.totalPaid)} SAR — Pending: ${stats.pendingPayments} invoices. We recommend paying pending amounts before deadline for early payment discount.` })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
