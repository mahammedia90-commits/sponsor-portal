/**
 * Admin Sponsors Management
 * List sponsors, view profiles, manage KYC verification
 * Connected to admin.sponsors.* API
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import {
  Users, Building2, Search, Loader2, CheckCircle, XCircle,
  Clock, Eye, Shield, Mail, Phone, MapPin, FileText,
  AlertTriangle, Award, DollarSign, ArrowLeft, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminSponsors() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [search, setSearch] = useState('');
  const [verFilter, setVerFilter] = useState<string>('');
  const [selectedSponsorId, setSelectedSponsorId] = useState<number | null>(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [kycUserId, setKycUserId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  const utils = trpc.useUtils();

  const { data: sponsors, isLoading } = trpc.admin.sponsors.list.useQuery(
    { search: search || undefined, verificationStatus: verFilter || undefined }
  );

  const { data: sponsorDetail, isLoading: detailLoading } = trpc.admin.sponsors.get.useQuery(
    { id: selectedSponsorId! },
    { enabled: !!selectedSponsorId }
  );

  const updateVerification = trpc.admin.sponsors.updateVerification.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم تحديث حالة التوثيق' : 'Verification status updated');
      utils.admin.sponsors.list.invalidate();
      if (selectedSponsorId) utils.admin.sponsors.get.invalidate({ id: selectedSponsorId });
      setKycDialogOpen(false);
      setRejectionReason('');
    },
    onError: (err) => toast.error(err.message),
  });

  const verificationLabels: Record<string, { ar: string; en: string; color: string; icon: any }> = {
    pending: { ar: 'بانتظار', en: 'Pending', color: 'bg-gray-500/15 text-gray-600', icon: Clock },
    submitted: { ar: 'مقدّم', en: 'Submitted', color: 'bg-blue-500/15 text-blue-600', icon: FileText },
    under_review: { ar: 'قيد المراجعة', en: 'Under Review', color: 'bg-yellow-500/15 text-yellow-600', icon: Eye },
    verified: { ar: 'موثّق', en: 'Verified', color: 'bg-emerald-500/15 text-emerald-600', icon: CheckCircle },
    rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-500/15 text-red-600', icon: XCircle },
  };

  const handleKycAction = (userId: number, action: 'verified' | 'rejected' | 'under_review') => {
    setKycUserId(userId);
    if (action === 'rejected') {
      setKycDialogOpen(true);
    } else {
      updateVerification.mutate({ userId, status: action });
    }
  };

  // ═══════ SPONSOR DETAIL VIEW ═══════
  if (selectedSponsorId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedSponsorId(null)}
          className={`flex items-center gap-2 text-xs ${textSecondary} hover:text-[#987012] transition-colors`}
        >
          <ArrowLeft size={14} />
          {isAr ? 'العودة للقائمة' : 'Back to List'}
        </button>

        {detailLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#987012]" />
          </div>
        ) : !sponsorDetail ? (
          <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
            <Users size={48} className={`mx-auto mb-3 ${textMuted}`} />
            <p className={`text-sm ${textPrimary}`}>{isAr ? 'لم يتم العثور على الراعي' : 'Sponsor not found'}</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className={`rounded-2xl border p-6 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                  <Building2 size={28} className="text-[#987012]" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-lg font-bold ${textPrimary}`}>
                    {sponsorDetail.profile?.companyNameAr || sponsorDetail.profile?.companyNameEn || sponsorDetail.name || '—'}
                  </h2>
                  <p className={`text-xs ${textSecondary}`}>{sponsorDetail.email}</p>
                  {sponsorDetail.profile && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {sponsorDetail.profile.industry && (
                        <span className={`text-[10px] ${textMuted} flex items-center gap-1`}>
                          <Award size={10} /> {sponsorDetail.profile.industry}
                        </span>
                      )}
                      {sponsorDetail.profile.city && (
                        <span className={`text-[10px] ${textMuted} flex items-center gap-1`}>
                          <MapPin size={10} /> {sponsorDetail.profile.city}
                        </span>
                      )}
                      {sponsorDetail.profile.phone && (
                        <span className={`text-[10px] ${textMuted} flex items-center gap-1`}>
                          <Phone size={10} /> {sponsorDetail.profile.phone}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const vs = sponsorDetail.profile?.verificationStatus ?? 'pending';
                    const vl = verificationLabels[vs] ?? verificationLabels.pending;
                    return (
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${vl.color}`}>
                        {isAr ? vl.ar : vl.en}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* KYC Actions */}
              {sponsorDetail.profile && sponsorDetail.profile.verificationStatus !== 'verified' && (
                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]'} flex flex-wrap gap-2`}>
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleKycAction(sponsorDetail.id, 'verified')}
                    disabled={updateVerification.isPending}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    {isAr ? 'توثيق' : 'Verify'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleKycAction(sponsorDetail.id, 'under_review')}
                    disabled={updateVerification.isPending}
                  >
                    <Eye size={12} className="mr-1" />
                    {isAr ? 'قيد المراجعة' : 'Under Review'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleKycAction(sponsorDetail.id, 'rejected')}
                    disabled={updateVerification.isPending}
                  >
                    <XCircle size={12} className="mr-1" />
                    {isAr ? 'رفض' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`rounded-2xl p-4 border text-center ${cardBg}`}>
                <p className="text-xl font-bold text-[#987012]">{sponsorDetail.sponsorships?.length ?? 0}</p>
                <p className={`text-[9px] ${textMuted}`}>{isAr ? 'الرعايات' : 'Sponsorships'}</p>
              </div>
              <div className={`rounded-2xl p-4 border text-center ${cardBg}`}>
                <p className="text-xl font-bold text-blue-500">{sponsorDetail.contracts?.length ?? 0}</p>
                <p className={`text-[9px] ${textMuted}`}>{isAr ? 'العقود' : 'Contracts'}</p>
              </div>
              <div className={`rounded-2xl p-4 border text-center ${cardBg}`}>
                <p className="text-xl font-bold text-emerald-500">{sponsorDetail.invoices?.length ?? 0}</p>
                <p className={`text-[9px] ${textMuted}`}>{isAr ? 'الفواتير' : 'Invoices'}</p>
              </div>
            </div>

            {/* Sponsorships Table */}
            {(sponsorDetail.sponsorships?.length ?? 0) > 0 && (
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="p-4">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'الرعايات' : 'Sponsorships'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}>
                        <th className={`px-4 py-2.5 text-start ${textSecondary}`}>ID</th>
                        <th className={`px-4 py-2.5 text-center ${textSecondary}`}>{isAr ? 'الحالة' : 'Status'}</th>
                        <th className={`px-4 py-2.5 text-end ${textSecondary}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
                        <th className={`px-4 py-2.5 text-end ${textSecondary}`}>{isAr ? 'التاريخ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorDetail.sponsorships!.map((sp: any) => (
                        <tr key={sp.id} className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                          <td className={`px-4 py-2.5 ${textPrimary} font-medium`}>#{sp.id}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                              sp.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                              sp.status === 'lead' ? 'bg-blue-500/15 text-blue-600' :
                              sp.status === 'lost' ? 'bg-red-500/15 text-red-600' :
                              'bg-gray-500/15 text-gray-600'
                            }`}>{sp.status}</span>
                          </td>
                          <td className={`px-4 py-2.5 text-end font-bold text-[#987012]`}>
                            {Number(sp.totalAmount ?? 0).toLocaleString()} <span className="text-[9px] font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                          </td>
                          <td className={`px-4 py-2.5 text-end ${textMuted}`}>
                            {sp.createdAt ? new Date(sp.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contracts Table */}
            {(sponsorDetail.contracts?.length ?? 0) > 0 && (
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="p-4">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'العقود' : 'Contracts'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}>
                        <th className={`px-4 py-2.5 text-start ${textSecondary}`}>{isAr ? 'رقم العقد' : 'Contract #'}</th>
                        <th className={`px-4 py-2.5 text-center ${textSecondary}`}>{isAr ? 'الحالة' : 'Status'}</th>
                        <th className={`px-4 py-2.5 text-end ${textSecondary}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorDetail.contracts!.map((c: any) => (
                        <tr key={c.id} className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                          <td className={`px-4 py-2.5 ${textPrimary} font-medium`}>{c.contractNumber}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                              c.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                              c.status === 'draft' ? 'bg-gray-500/15 text-gray-600' :
                              'bg-blue-500/15 text-blue-600'
                            }`}>{c.status}</span>
                          </td>
                          <td className={`px-4 py-2.5 text-end font-bold text-[#987012]`}>
                            {Number(c.totalAmount ?? 0).toLocaleString()} <span className="text-[9px] font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Invoices Table */}
            {(sponsorDetail.invoices?.length ?? 0) > 0 && (
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="p-4">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'الفواتير' : 'Invoices'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}>
                        <th className={`px-4 py-2.5 text-start ${textSecondary}`}>{isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
                        <th className={`px-4 py-2.5 text-center ${textSecondary}`}>{isAr ? 'الحالة' : 'Status'}</th>
                        <th className={`px-4 py-2.5 text-end ${textSecondary}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorDetail.invoices!.map((inv: any) => (
                        <tr key={inv.id} className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                          <td className={`px-4 py-2.5 ${textPrimary} font-medium`}>{inv.invoiceNumber}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                              inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-600' :
                              inv.status === 'overdue' ? 'bg-red-500/15 text-red-600' :
                              inv.status === 'sent' ? 'bg-blue-500/15 text-blue-600' :
                              'bg-gray-500/15 text-gray-600'
                            }`}>{inv.status}</span>
                          </td>
                          <td className={`px-4 py-2.5 text-end font-bold text-[#987012]`}>
                            {Number(inv.totalAmount ?? 0).toLocaleString()} <span className="text-[9px] font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* KYC Rejection Dialog */}
        <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isAr ? 'سبب الرفض' : 'Rejection Reason'}</DialogTitle>
            </DialogHeader>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={isAr ? 'اكتب سبب رفض التوثيق...' : 'Enter rejection reason...'}
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setKycDialogOpen(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  if (kycUserId) {
                    updateVerification.mutate({
                      userId: kycUserId,
                      status: 'rejected',
                      rejectionReason: rejectionReason,
                    });
                  }
                }}
                disabled={!rejectionReason.trim() || updateVerification.isPending}
              >
                {updateVerification.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <XCircle size={14} className="mr-1" />}
                {isAr ? 'رفض' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ═══════ SPONSORS LIST VIEW ═══════
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
          {isAr ? 'إدارة الرعاة' : 'Sponsor Management'}
        </h1>
        <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
          {isAr ? 'عرض وإدارة الرعاة والتحقق من الهوية' : 'View and manage sponsors and KYC verification'}
        </p>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-4 ${cardBg} flex flex-col sm:flex-row gap-3`}>
        <div className="relative flex-1">
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} ${textMuted}`} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم أو الشركة...' : 'Search by name or company...'}
            className={`text-xs ${isRTL ? 'pr-9' : 'pl-9'}`}
          />
        </div>
        <select
          value={verFilter}
          onChange={(e) => setVerFilter(e.target.value)}
          className={`text-xs px-3 py-2 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/[0.06] text-foreground' : 'bg-white border-[#F0EEE7] text-[#010101]'}`}
        >
          <option value="">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
          {Object.entries(verificationLabels).map(([key, val]) => (
            <option key={key} value={key}>{isAr ? val.ar : val.en}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي الرعاة' : 'Total Sponsors', value: sponsors?.length ?? 0, icon: Users, color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
          { label: isAr ? 'موثّقون' : 'Verified', value: sponsors?.filter((s: any) => s.profile?.verificationStatus === 'verified').length ?? 0, icon: CheckCircle, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
          { label: isAr ? 'بانتظار التوثيق' : 'Pending Verification', value: sponsors?.filter((s: any) => s.profile?.verificationStatus === 'submitted' || s.profile?.verificationStatus === 'under_review').length ?? 0, icon: Clock, color: 'text-yellow-500', bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
          { label: isAr ? 'بدون ملف' : 'No Profile', value: sponsors?.filter((s: any) => !s.profile).length ?? 0, icon: AlertTriangle, color: 'text-gray-500', bg: isDark ? 'bg-gray-500/10' : 'bg-gray-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <Icon size={14} className={stat.color} />
              </div>
              <p className={`text-lg font-bold ${textPrimary}`}>{stat.value}</p>
              <p className={`text-[9px] ${textMuted}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Sponsors List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#987012]" />
        </div>
      ) : !sponsors?.length ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <Users size={48} className={`mx-auto mb-3 ${textMuted}`} />
          <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا يوجد رعاة' : 'No sponsors found'}</p>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'سيظهر الرعاة هنا عند تسجيلهم' : 'Sponsors will appear here when they register'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor: any) => {
            const vs = sponsor.profile?.verificationStatus ?? 'pending';
            const vl = verificationLabels[vs] ?? verificationLabels.pending;
            return (
              <div
                key={sponsor.id}
                onClick={() => setSelectedSponsorId(sponsor.id)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${cardBg} ${isDark ? 'hover:border-[#987012]/20' : 'hover:border-[#987012]/30 hover:shadow-lg'}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-[#987012]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${textPrimary} truncate`}>
                      {sponsor.profile?.companyNameAr || sponsor.profile?.companyNameEn || sponsor.name || '—'}
                    </p>
                    <p className={`text-[10px] ${textMuted} truncate`}>{sponsor.email}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${vl.color}`}>
                    {isAr ? vl.ar : vl.en}
                  </span>
                </div>

                {sponsor.profile && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sponsor.profile.industry && (
                      <span className={`text-[9px] ${textMuted} flex items-center gap-1`}>
                        <Award size={9} /> {sponsor.profile.industry}
                      </span>
                    )}
                    {sponsor.profile.city && (
                      <span className={`text-[9px] ${textMuted} flex items-center gap-1`}>
                        <MapPin size={9} /> {sponsor.profile.city}
                      </span>
                    )}
                  </div>
                )}

                <div className={`h-px w-full ${isDark ? 'bg-white/[0.04]' : 'bg-[#F0EEE7]'} mb-3`} />

                <div className="flex items-center justify-between">
                  <span className={`text-[9px] ${textMuted}`}>
                    {isAr ? 'انضم' : 'Joined'}: {sponsor.createdAt ? new Date(sponsor.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : '—'}
                  </span>
                  <span className={`text-[9px] text-[#987012] font-semibold flex items-center gap-1`}>
                    {isAr ? 'عرض التفاصيل' : 'View Details'} <Eye size={10} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
