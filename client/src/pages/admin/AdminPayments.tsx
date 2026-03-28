/**
 * Admin Payments Management
 * Track payments, invoices, and collection
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  CreditCard, Search, DollarSign, CheckCircle, Clock,
  AlertTriangle, Loader2, Building2, Calendar, Eye,
  Download, Filter, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPayments() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [statusFilter, setStatusFilter] = useState('all');

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  const { data: payments, isLoading } = trpc.admin.payments.invoices.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const { data: collectionStats } = trpc.admin.payments.collectionStats.useQuery();

  const confirmMutation = trpc.admin.payments.markPaid.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم تأكيد الدفع' : 'Payment confirmed' );
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20',
    paid: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
    partial: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
    overdue: 'bg-red-500/15 text-red-600 border-red-500/20',
    refunded: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
    cancelled: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending: { ar: 'بانتظار الدفع', en: 'Pending' },
    paid: { ar: 'مدفوع', en: 'Paid' },
    partial: { ar: 'دفع جزئي', en: 'Partial' },
    overdue: { ar: 'متأخر', en: 'Overdue' },
    refunded: { ar: 'مسترد', en: 'Refunded' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
          {isAr ? 'إدارة المدفوعات' : 'Payment Management'}
        </h1>
        <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
          {isAr ? 'تتبع المدفوعات والفواتير والتحصيل' : 'Track payments, invoices, and collection'}
        </p>
      </div>

      {/* Collection Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي المستحق' : 'Total Due', value: collectionStats?.totalDue ?? 0, icon: DollarSign, color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
          { label: isAr ? 'المحصّل' : 'Collected', value: collectionStats?.totalCollected ?? 0, icon: CheckCircle, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
          { label: isAr ? 'المتأخر' : 'Overdue', value: collectionStats?.totalOverdue ?? 0, icon: AlertTriangle, color: 'text-red-500', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
          { label: isAr ? 'نسبة التحصيل' : 'Collection Rate', value: `${collectionStats?.collectionRate ?? 0}%`, icon: TrendingUp, color: 'text-[#987012]', bg: isDark ? 'bg-[#987012]/10' : 'bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <Icon size={14} className={stat.color} />
              </div>
              <p className={`text-lg font-bold ${textPrimary}`}>
                {typeof stat.value === 'number' ? `${stat.value.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : stat.value}
              </p>
              <p className={`text-[9px] ${textMuted}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'paid', 'partial', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-2 rounded-xl text-[10px] font-medium transition-all border ${
              statusFilter === status
                ? 'bg-[#987012]/10 text-[#987012] border-[#987012]/20'
                : isDark ? 'text-muted-foreground border-white/[0.06] hover:border-white/10' : 'text-[#919187] border-[#F0EEE7] hover:border-[#987012]/15'
            }`}
          >
            {status === 'all' ? (isAr ? 'الكل' : 'All') : (isAr ? statusLabels[status]?.ar : statusLabels[status]?.en)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#987012]" />
        </div>
      ) : !payments?.length ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <CreditCard size={48} className={`mx-auto mb-3 ${textMuted}`} />
          <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا توجد مدفوعات' : 'No payments found'}</p>
        </div>
      ) : (
        <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted}`}>{isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted}`}>{isAr ? 'الراعي' : 'Sponsor'}</th>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted} hidden sm:table-cell`}>{isAr ? 'الفعالية' : 'Event'}</th>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted} hidden md:table-cell`}>{isAr ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                  <th className={`text-start px-4 py-3 font-semibold ${textMuted}`}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th className={`text-center px-4 py-3 font-semibold ${textMuted}`}>{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className={`border-b last:border-0 transition-colors ${
                    isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-[#F0EEE7]/30 hover:bg-[#F9F8F5]/50'
                  }`}>
                    <td className={`px-4 py-3 font-medium ${textPrimary}`}>
                      {payment.invoiceNumber || `INV-${payment.id?.slice(0, 6)}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                          <Building2 size={10} className="text-[#987012]" />
                        </div>
                        <span className={`${textPrimary} truncate max-w-[120px]`}>{payment.sponsorName || '—'}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 hidden sm:table-cell ${textSecondary} truncate max-w-[120px]`}>
                      {payment.eventName || '—'}
                    </td>
                    <td className={`px-4 py-3 font-semibold text-[#987012]`}>
                      {payment.amount ? `${Number(payment.amount).toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : '—'}
                    </td>
                    <td className={`px-4 py-3 hidden md:table-cell ${textSecondary}`}>
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColors[payment.status] || statusColors.pending}`}>
                        {isAr ? statusLabels[payment.status]?.ar : statusLabels[payment.status]?.en}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => confirmMutation.mutate({ invoiceId: payment.id })}
                          disabled={confirmMutation.isPending}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] h-7 px-2 gap-1"
                        >
                          <CheckCircle size={10} />
                          {isAr ? 'تأكيد' : 'Confirm'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
