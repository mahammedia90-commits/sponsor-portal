/**
 * Admin Sponsorship Approvals
 * Review, approve, reject sponsorship requests
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Award, CheckCircle, XCircle, Clock, Eye, Filter,
  Search, Loader2, Building2, Calendar, DollarSign,
  ChevronDown, AlertTriangle, MessageSquare, X, Send
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminApprovals() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [statusFilter, setStatusFilter] = useState('pending_approval');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';
  const inputBg = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F9F8F5] border-[#F0EEE7]';

  const { data: sponsorships, isLoading, refetch } = trpc.admin.sponsorships.list.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const approveMutation = trpc.admin.sponsorships.approve.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تمت الموافقة على الرعاية' : 'Sponsorship approved' );
      setSelectedRequest(null);
      refetch();
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const rejectMutation = trpc.admin.sponsorships.reject.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم رفض الرعاية' : 'Sponsorship rejected' );
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      refetch();
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const statusColors: Record<string, string> = {
    pending_approval: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20',
    approved: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
    active: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
    reserved: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
    completed: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
    cancelled: 'bg-red-500/15 text-red-600 border-red-500/20',
    rejected: 'bg-red-500/15 text-red-600 border-red-500/20',
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending_approval: { ar: 'بانتظار الموافقة', en: 'Pending Approval' },
    approved: { ar: 'معتمد', en: 'Approved' },
    active: { ar: 'نشط', en: 'Active' },
    reserved: { ar: 'محجوز', en: 'Reserved' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
  };

  const pendingCount = sponsorships?.filter((s: any) => s.status === 'pending_approval').length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'موافقات الرعاية' : 'Sponsorship Approvals'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'مراجعة طلبات الرعاية والموافقة عليها أو رفضها' : 'Review and approve or reject sponsorship requests'}
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span className="text-xs font-semibold text-yellow-600">
              {pendingCount} {isAr ? 'طلب بانتظار المراجعة' : 'pending requests'}
            </span>
          </div>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['pending_approval', 'approved', 'active', 'rejected', 'all'].map((status) => (
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

      {/* Sponsorship Requests */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#987012]" />
        </div>
      ) : !sponsorships?.length ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <CheckCircle size={48} className="mx-auto mb-3 text-emerald-500" />
          <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا توجد طلبات' : 'No requests found'}</p>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'جميع الطلبات تمت مراجعتها' : 'All requests have been reviewed'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sponsorships.map((sp: any) => (
            <div key={sp.id} className={`rounded-2xl border transition-all duration-300 ${cardBg} overflow-hidden ${
              sp.status === 'pending_approval' ? (isDark ? 'ring-1 ring-yellow-500/20' : 'ring-1 ring-yellow-500/15') : ''
            }`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      sp.status === 'pending_approval' ? 'bg-yellow-500/15' : 'bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20'
                    }`}>
                      {sp.status === 'pending_approval' ? <Clock size={18} className="text-yellow-500" /> : <Award size={18} className="text-[#987012]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-bold ${textPrimary}`}>
                          {sp.sponsorName || (isAr ? 'راعي' : 'Sponsor')}
                        </h3>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColors[sp.status]}`}>
                          {isAr ? statusLabels[sp.status]?.ar : statusLabels[sp.status]?.en}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                          <Calendar size={10} />
                          {sp.eventName || '—'}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] ${textSecondary}`}>
                          <Award size={10} />
                          {sp.packageName || '—'}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold text-[#987012]`}>
                          <DollarSign size={10} />
                          {sp.totalAmount ? `${Number(sp.totalAmount).toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : '—'}
                        </span>
                      </div>
                      {sp.createdAt && (
                        <p className={`text-[9px] ${textMuted} mt-1`}>
                          {isAr ? 'تاريخ الطلب:' : 'Requested:'} {new Date(sp.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {sp.status === 'pending_approval' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate({ id: sp.id })}
                          disabled={approveMutation.isPending}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] h-8 px-3 gap-1"
                        >
                          {approveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                          {isAr ? 'موافقة' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedRequest(sp); setShowRejectModal(true); }}
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10 text-[10px] h-8 px-3 gap-1"
                        >
                          <XCircle size={12} />
                          {isAr ? 'رفض' : 'Reject'}
                        </Button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedRequest(selectedRequest?.id === sp.id ? null : sp)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F9F8F5]'}`}
                    >
                      <Eye size={14} className={textSecondary} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedRequest?.id === sp.id && !showRejectModal && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <DetailCard label={isAr ? 'الراعي' : 'Sponsor'} value={sp.sponsorName || '—'} isDark={isDark} />
                      <DetailCard label={isAr ? 'الفعالية' : 'Event'} value={sp.eventName || '—'} isDark={isDark} />
                      <DetailCard label={isAr ? 'الحزمة' : 'Package'} value={sp.packageName || '—'} isDark={isDark} />
                      <DetailCard label={isAr ? 'المبلغ' : 'Amount'} value={sp.totalAmount ? `${Number(sp.totalAmount).toLocaleString()} SAR` : '—'} isDark={isDark} highlight />
                      <DetailCard label={isAr ? 'الحالة' : 'Status'} value={isAr ? statusLabels[sp.status]?.ar : statusLabels[sp.status]?.en} isDark={isDark} />
                      <DetailCard label={isAr ? 'تاريخ الإنشاء' : 'Created'} value={sp.createdAt ? new Date(sp.createdAt).toLocaleDateString() : '—'} isDark={isDark} />
                      {sp.notes && <DetailCard label={isAr ? 'ملاحظات' : 'Notes'} value={sp.notes} isDark={isDark} span2 />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl border p-6 ${
            isDark ? 'bg-[#0a0c12] border-white/[0.08]' : 'bg-white border-[#F0EEE7]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-base font-bold ${textPrimary}`}>
                {isAr ? 'رفض طلب الرعاية' : 'Reject Sponsorship Request'}
              </h2>
              <button onClick={() => setShowRejectModal(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                <X size={16} className={textMuted} />
              </button>
            </div>
            <div className={`rounded-xl p-3 mb-4 ${isDark ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50 border border-red-100'}`}>
              <p className="text-xs text-red-600">
                {isAr ? `سيتم رفض طلب الرعاية من "${selectedRequest.sponsorName}" للفعالية "${selectedRequest.eventName}"` :
                  `This will reject the sponsorship request from "${selectedRequest.sponsorName}" for "${selectedRequest.eventName}"`}
              </p>
            </div>
            <div className="mb-4">
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>
                {isAr ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)'}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30 resize-none`}
                placeholder={isAr ? 'اكتب سبب الرفض...' : 'Enter rejection reason...'}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)} className="flex-1">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={() => rejectMutation.mutate({ id: selectedRequest.id, reason: rejectReason || 'Rejected by admin' })}
                disabled={rejectMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white gap-2"
              >
                {rejectMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                {isAr ? 'تأكيد الرفض' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ label, value, isDark, highlight, span2 }: { label: string; value: string; isDark: boolean; highlight?: boolean; span2?: boolean }) {
  return (
    <div className={`rounded-xl p-2.5 ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'} ${span2 ? 'col-span-2' : ''}`}>
      <p className={`text-[9px] ${isDark ? 'text-[#6B6B6B]' : 'text-[#919187]'} mb-0.5`}>{label}</p>
      <p className={`text-[11px] font-medium ${highlight ? 'text-[#987012]' : (isDark ? 'text-foreground' : 'text-[#010101]')}`}>{value}</p>
    </div>
  );
}
