/**
 * Admin Contracts Management
 * View, issue, and manage all sponsorship contracts
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  FileText, Search, Filter, Eye, Download, CheckCircle,
  Clock, AlertTriangle, Loader2, Building2, Calendar,
  DollarSign, Send, X, Plus
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContracts() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  const { data: contracts, isLoading, refetch } = trpc.admin.contracts.list.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const issueMutation = trpc.admin.contracts.generate.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إصدار العقد' : 'Contract issued' );
      refetch();
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
    issued: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
    sent: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
    signed: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
    active: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
    expired: 'bg-orange-500/15 text-orange-600 border-orange-500/20',
    cancelled: 'bg-red-500/15 text-red-600 border-red-500/20',
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    draft: { ar: 'مسودة', en: 'Draft' },
    issued: { ar: 'صادر', en: 'Issued' },
    sent: { ar: 'مُرسل', en: 'Sent' },
    signed: { ar: 'موقّع', en: 'Signed' },
    active: { ar: 'نشط', en: 'Active' },
    expired: { ar: 'منتهي', en: 'Expired' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'إدارة العقود' : 'Contract Management'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'إصدار وإدارة عقود الرعاية' : 'Issue and manage sponsorship contracts'}
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'draft', 'issued', 'sent', 'signed', 'active', 'expired'].map((status) => (
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

      {/* Contracts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#987012]" />
        </div>
      ) : !contracts?.length ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <FileText size={48} className={`mx-auto mb-3 ${textMuted}`} />
          <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا توجد عقود' : 'No contracts found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract: any) => (
            <div key={contract.id} className={`rounded-2xl border transition-all duration-300 ${cardBg}`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[#987012]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-bold ${textPrimary}`}>
                          {contract.contractNumber || `#${contract.id?.slice(0, 8)}`}
                        </h3>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColors[contract.status] || statusColors.draft}`}>
                          {isAr ? statusLabels[contract.status]?.ar : statusLabels[contract.status]?.en}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                          <Building2 size={10} />
                          {contract.sponsorName || '—'}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                          <Calendar size={10} />
                          {contract.eventName || '—'}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold text-[#987012]`}>
                          <DollarSign size={10} />
                          {contract.totalAmount ? `${Number(contract.totalAmount).toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {contract.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => issueMutation.mutate({ sponsorshipId: contract.sponsorshipId })}
                        disabled={issueMutation.isPending}
                        className="bg-gradient-to-r from-[#987012] to-[#d4a832] text-white text-[10px] h-8 px-3 gap-1"
                      >
                        {issueMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        {isAr ? 'إصدار' : 'Issue'}
                      </Button>
                    )}
                    <button
                      onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F9F8F5]'}`}
                    >
                      <Eye size={14} className={textSecondary} />
                    </button>
                  </div>
                </div>

                {expandedContract === contract.id && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: isAr ? 'رقم العقد' : 'Contract #', value: contract.contractNumber || '—' },
                        { label: isAr ? 'الراعي' : 'Sponsor', value: contract.sponsorName || '—' },
                        { label: isAr ? 'الفعالية' : 'Event', value: contract.eventName || '—' },
                        { label: isAr ? 'المبلغ' : 'Amount', value: contract.totalAmount ? `${Number(contract.totalAmount).toLocaleString()} SAR` : '—', highlight: true },
                        { label: isAr ? 'تاريخ الإصدار' : 'Issue Date', value: contract.issuedAt ? new Date(contract.issuedAt).toLocaleDateString() : '—' },
                        { label: isAr ? 'تاريخ التوقيع' : 'Signed Date', value: contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : '—' },
                        { label: isAr ? 'تاريخ الانتهاء' : 'Expiry', value: contract.expiresAt ? new Date(contract.expiresAt).toLocaleDateString() : '—' },
                        { label: isAr ? 'الحالة' : 'Status', value: isAr ? statusLabels[contract.status]?.ar : statusLabels[contract.status]?.en },
                      ].map((item, i) => (
                        <div key={i} className={`rounded-xl p-2.5 ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
                          <p className={`text-[9px] ${textMuted} mb-0.5`}>{item.label}</p>
                          <p className={`text-[11px] font-medium ${(item as any).highlight ? 'text-[#987012]' : textPrimary}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
