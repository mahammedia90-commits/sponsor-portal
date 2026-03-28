/**
 * Admin Reports & Analytics
 * Comprehensive reports: event performance, sponsor performance, platform overview
 * Connected to admin.reports.* + admin.dashboard.* + admin.payments.collectionStats
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import {
  BarChart3, TrendingUp, DollarSign, Users, Calendar,
  Award, FileText, Download, Loader2, PieChart, ArrowUpRight,
  Building2, Eye, Target, CheckCircle, AlertTriangle,
  Globe, Briefcase, Crown, Medal, Trophy, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ReportTab = 'overview' | 'events' | 'sponsors';

export default function AdminReports() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  // API queries
  const { data: kpis, isLoading: kpisLoading } = trpc.admin.dashboard.kpis.useQuery();
  const { data: revenueChart } = trpc.admin.dashboard.revenueChart.useQuery();
  const { data: collectionStats } = trpc.admin.payments.collectionStats.useQuery();
  const { data: platformOverview } = trpc.admin.reports.platformOverview.useQuery();
  const { data: eventPerformance, isLoading: evPerfLoading } = trpc.admin.reports.eventPerformance.useQuery({});
  const { data: sponsorPerformance, isLoading: spPerfLoading } = trpc.admin.reports.sponsorPerformance.useQuery({});
  const { data: pipelineStats } = trpc.admin.sponsorships.pipelineStats.useQuery();

  const tabs = [
    { id: 'overview' as const, label: isAr ? 'نظرة عامة' : 'Platform Overview', icon: PieChart },
    { id: 'events' as const, label: isAr ? 'أداء الفعاليات' : 'Event Performance', icon: Calendar },
    { id: 'sponsors' as const, label: isAr ? 'أداء الرعاة' : 'Sponsor Performance', icon: Users },
  ];

  const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
    lead: { ar: 'طلب جديد', en: 'New Lead', color: 'bg-blue-500/15 text-blue-600' },
    qualified: { ar: 'مؤهل', en: 'Qualified', color: 'bg-cyan-500/15 text-cyan-600' },
    proposal_sent: { ar: 'عرض مرسل', en: 'Proposal Sent', color: 'bg-indigo-500/15 text-indigo-600' },
    negotiation: { ar: 'تفاوض', en: 'Negotiation', color: 'bg-purple-500/15 text-purple-600' },
    contract_sent: { ar: 'عقد مرسل', en: 'Contract Sent', color: 'bg-amber-500/15 text-amber-600' },
    signed: { ar: 'موقّع', en: 'Signed', color: 'bg-teal-500/15 text-teal-600' },
    paid: { ar: 'مدفوع', en: 'Paid', color: 'bg-green-500/15 text-green-600' },
    active: { ar: 'نشط', en: 'Active', color: 'bg-emerald-500/15 text-emerald-600' },
    completed: { ar: 'مكتمل', en: 'Completed', color: 'bg-gray-500/15 text-gray-600' },
    lost: { ar: 'مفقود', en: 'Lost', color: 'bg-red-500/15 text-red-600' },
  };

  const verificationLabels: Record<string, { ar: string; en: string; color: string }> = {
    pending: { ar: 'بانتظار', en: 'Pending', color: 'bg-gray-500/15 text-gray-600' },
    submitted: { ar: 'مقدّم', en: 'Submitted', color: 'bg-blue-500/15 text-blue-600' },
    under_review: { ar: 'قيد المراجعة', en: 'Under Review', color: 'bg-yellow-500/15 text-yellow-600' },
    verified: { ar: 'موثّق', en: 'Verified', color: 'bg-emerald-500/15 text-emerald-600' },
    rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-500/15 text-red-600' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'التقارير والتحليلات' : 'Reports & Analytics'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'تقارير شاملة عن أداء المنصة والفعاليات والرعاة' : 'Comprehensive platform, event, and sponsor performance reports'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.success(isAr ? 'قريباً' : 'Coming soon', { description: isAr ? 'تصدير التقارير قيد التطوير' : 'Report export is under development' })}
          className="text-xs gap-2"
        >
          <Download size={14} />
          {isAr ? 'تصدير التقارير' : 'Export Reports'}
        </Button>
      </div>

      {/* Tabs */}
      <div className={`rounded-2xl border p-1.5 ${cardBg} flex gap-1`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#987012]/10 text-[#987012] shadow-sm'
                  : `${textSecondary} ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#F9F8F5]'}`
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════ OVERVIEW TAB ═══════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform KPIs */}
          {kpisLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#987012]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue', value: `${Number(platformOverview?.totalRevenue ?? kpis?.totalRevenue ?? 0).toLocaleString()}`, suffix: isAr ? 'ر.س' : 'SAR', icon: DollarSign, color: 'text-[#987012]', bg: isDark ? 'bg-[#987012]/10' : 'bg-amber-50' },
                { label: isAr ? 'إجمالي الفعاليات' : 'Total Events', value: platformOverview?.totalEvents ?? kpis?.activeEvents ?? 0, icon: Calendar, color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
                { label: isAr ? 'إجمالي الرعاة' : 'Total Sponsors', value: platformOverview?.totalSponsors ?? kpis?.totalSponsors ?? 0, icon: Users, color: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
                { label: isAr ? 'إجمالي الرعايات' : 'Total Sponsorships', value: platformOverview?.totalSponsorships ?? 0, icon: Award, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
                { label: isAr ? 'متوسط الصفقة' : 'Avg Deal Size', value: `${Number(platformOverview?.avgDealSize ?? 0).toLocaleString()}`, suffix: isAr ? 'ر.س' : 'SAR', icon: Target, color: 'text-teal-500', bg: isDark ? 'bg-teal-500/10' : 'bg-teal-50' },
                { label: isAr ? 'معدل التحويل' : 'Conversion Rate', value: `${platformOverview?.conversionRate ?? 0}%`, icon: TrendingUp, color: 'text-orange-500', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className={`rounded-2xl p-4 border ${cardBg}`}>
                    <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-2`}>
                      <Icon size={14} className={kpi.color} />
                    </div>
                    <p className={`text-lg font-bold ${textPrimary}`}>
                      {kpi.value} {(kpi as any).suffix && <span className="text-[10px] font-normal">{(kpi as any).suffix}</span>}
                    </p>
                    <p className={`text-[9px] ${textMuted}`}>{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Revenue Chart + Collection Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Revenue by Month */}
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-sm font-bold ${textPrimary}`}>
                  {isAr ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                </h3>
                <BarChart3 size={16} className="text-[#987012]" />
              </div>
              {!revenueChart?.length ? (
                <p className={`text-xs ${textMuted} text-center py-8`}>{isAr ? 'لا توجد بيانات' : 'No data available'}</p>
              ) : (
                <div className="space-y-3">
                  {revenueChart.map((item: any, i: number) => {
                    const maxRev = Math.max(...revenueChart.map((e: any) => Number(e.total || 0)));
                    const pct = maxRev > 0 ? (Number(item.total || 0) / maxRev) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[11px] font-medium ${textPrimary}`}>{item.month}</span>
                          <span className="text-[11px] font-bold text-[#987012]">
                            {Number(item.total || 0).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-[#F9F8F5]'}`}>
                          <div className="h-full rounded-full bg-gradient-to-r from-[#987012] to-[#d4a832] transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collection Stats */}
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-sm font-bold ${textPrimary}`}>
                  {isAr ? 'إحصائيات التحصيل' : 'Collection Stats'}
                </h3>
                <Activity size={16} className="text-[#987012]" />
              </div>
              <div className="space-y-4">
                <div className={`rounded-xl p-4 ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${textSecondary}`}>{isAr ? 'نسبة التحصيل' : 'Collection Rate'}</span>
                    <span className="text-lg font-bold text-[#987012]">{collectionStats?.collectionRate ?? 0}%</span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-[#987012] to-[#d4a832] transition-all duration-700" style={{ width: `${collectionStats?.collectionRate ?? 0}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-500">{Number(collectionStats?.totalCollected ?? 0).toLocaleString()}</p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'المحصّل' : 'Collected'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-500">{Number(collectionStats?.totalDue ?? 0).toLocaleString()}</p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'المستحق' : 'Due'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-red-500">{Number(collectionStats?.totalOverdue ?? 0).toLocaleString()}</p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'المتأخر' : 'Overdue'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Funnel */}
          <div className={`rounded-2xl border p-5 ${cardBg}`}>
            <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
              {isAr ? 'قمع المبيعات (Pipeline)' : 'Sales Pipeline Funnel'}
            </h3>
            {!pipelineStats?.length ? (
              <p className={`text-xs ${textMuted} text-center py-6`}>{isAr ? 'لا توجد بيانات' : 'No data'}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {pipelineStats.filter((s: any) => s.count > 0 || ['lead', 'qualified', 'active', 'completed', 'lost'].includes(s.status)).map((stage: any, i: number) => {
                  const sl = statusLabels[stage.status] ?? { ar: stage.status, en: stage.status, color: 'bg-gray-500/15 text-gray-600' };
                  return (
                    <div key={i} className={`rounded-xl p-3 text-center border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-[#F9F8F5] border-[#F0EEE7]'}`}>
                      <p className={`text-xl font-bold ${textPrimary}`}>{stage.count}</p>
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-semibold mt-1 ${sl.color}`}>
                        {isAr ? sl.ar : sl.en}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ EVENTS TAB ═══════ */}
      {activeTab === 'events' && (
        <div className="space-y-5">
          {evPerfLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#987012]" />
            </div>
          ) : !eventPerformance?.length ? (
            <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
              <Calendar size={48} className={`mx-auto mb-3 ${textMuted}`} />
              <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا توجد فعاليات' : 'No events found'}</p>
              <p className={`text-xs ${textMuted}`}>{isAr ? 'أنشئ فعالية أولاً' : 'Create an event first'}</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center mb-2`}>
                    <Calendar size={14} className="text-blue-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{eventPerformance.length}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي الفعاليات' : 'Total Events'}</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} flex items-center justify-center mb-2`}>
                    <Award size={14} className="text-emerald-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{eventPerformance.reduce((s: number, e: any) => s + (e.sponsorCount ?? 0), 0)}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي الرعايات' : 'Total Sponsorships'}</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-[#987012]/10' : 'bg-amber-50'} flex items-center justify-center mb-2`}>
                    <DollarSign size={14} className="text-[#987012]" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{eventPerformance.reduce((s: number, e: any) => s + (e.revenue ?? 0), 0).toLocaleString()}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي الإيرادات' : 'Total Revenue'} ({isAr ? 'ر.س' : 'SAR'})</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} flex items-center justify-center mb-2`}>
                    <Target size={14} className="text-purple-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{eventPerformance.reduce((s: number, e: any) => s + (e.leadCount ?? 0), 0)}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي العملاء المحتملين' : 'Total Leads'}</p>
                </div>
              </div>

              {/* Event Performance Table */}
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="p-5">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'أداء كل فعالية' : 'Per-Event Performance'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}>
                        <th className={`px-4 py-3 text-start font-semibold ${textSecondary}`}>{isAr ? 'الفعالية' : 'Event'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'الحالة' : 'Status'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'الرعاة' : 'Sponsors'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'الحزم' : 'Packages'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'العملاء' : 'Leads'}</th>
                        <th className={`px-4 py-3 text-end font-semibold ${textSecondary}`}>{isAr ? 'الإيرادات' : 'Revenue'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPerformance.map((ev: any, i: number) => (
                        <tr key={i} className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'} ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-[#F9F8F5]/50'}`}>
                          <td className={`px-4 py-3 ${textPrimary} font-medium`}>
                            <div>{isAr ? ev.titleAr : ev.titleEn}</div>
                            <div className={`text-[9px] ${textMuted}`}>
                              {ev.startDate ? new Date(ev.startDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', year: 'numeric' }) : '—'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                              ev.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                              ev.status === 'upcoming' ? 'bg-blue-500/15 text-blue-600' :
                              ev.status === 'completed' ? 'bg-gray-500/15 text-gray-600' :
                              'bg-yellow-500/15 text-yellow-600'
                            }`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-center font-semibold ${textPrimary}`}>{ev.sponsorCount}</td>
                          <td className={`px-4 py-3 text-center ${textSecondary}`}>{ev.packageCount}</td>
                          <td className={`px-4 py-3 text-center ${textSecondary}`}>{ev.leadCount}</td>
                          <td className="px-4 py-3 text-end font-bold text-[#987012]">
                            {ev.revenue.toLocaleString()} <span className="text-[9px] font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════ SPONSORS TAB ═══════ */}
      {activeTab === 'sponsors' && (
        <div className="space-y-5">
          {spPerfLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#987012]" />
            </div>
          ) : !sponsorPerformance?.length ? (
            <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
              <Users size={48} className={`mx-auto mb-3 ${textMuted}`} />
              <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا يوجد رعاة' : 'No sponsors found'}</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} flex items-center justify-center mb-2`}>
                    <Users size={14} className="text-purple-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{sponsorPerformance.length}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي الرعاة' : 'Total Sponsors'}</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} flex items-center justify-center mb-2`}>
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{sponsorPerformance.filter((s: any) => s.verificationStatus === 'verified').length}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'موثّقون' : 'Verified'}</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-[#987012]/10' : 'bg-amber-50'} flex items-center justify-center mb-2`}>
                    <DollarSign size={14} className="text-[#987012]" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{sponsorPerformance.reduce((s: number, sp: any) => s + (sp.totalSpent ?? 0), 0).toLocaleString()}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'إجمالي الإنفاق' : 'Total Spent'} ({isAr ? 'ر.س' : 'SAR'})</p>
                </div>
                <div className={`rounded-2xl p-4 border ${cardBg}`}>
                  <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center mb-2`}>
                    <FileText size={14} className="text-blue-500" />
                  </div>
                  <p className={`text-lg font-bold ${textPrimary}`}>{sponsorPerformance.reduce((s: number, sp: any) => s + (sp.activeContracts ?? 0), 0)}</p>
                  <p className={`text-[9px] ${textMuted}`}>{isAr ? 'عقود نشطة' : 'Active Contracts'}</p>
                </div>
              </div>

              {/* Sponsor Performance Table */}
              <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="p-5">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'أداء كل راعي' : 'Per-Sponsor Performance'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}>
                        <th className={`px-4 py-3 text-start font-semibold ${textSecondary}`}>{isAr ? 'الراعي' : 'Sponsor'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'التوثيق' : 'Verification'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'الرعايات' : 'Sponsorships'}</th>
                        <th className={`px-4 py-3 text-center font-semibold ${textSecondary}`}>{isAr ? 'العقود النشطة' : 'Active Contracts'}</th>
                        <th className={`px-4 py-3 text-end font-semibold ${textSecondary}`}>{isAr ? 'الإنفاق' : 'Total Spent'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorPerformance.map((sp: any, i: number) => {
                        const vl = verificationLabels[sp.verificationStatus] ?? verificationLabels.pending;
                        return (
                          <tr key={i} className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'} ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-[#F9F8F5]/50'}`}>
                            <td className={`px-4 py-3 ${textPrimary}`}>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                                  <Building2 size={14} className="text-[#987012]" />
                                </div>
                                <div>
                                  <p className="font-medium">{sp.companyNameAr || sp.companyNameEn || sp.name || '—'}</p>
                                  <p className={`text-[9px] ${textMuted}`}>{sp.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${vl.color}`}>
                                {isAr ? vl.ar : vl.en}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-center font-semibold ${textPrimary}`}>{sp.totalSponsorships}</td>
                            <td className={`px-4 py-3 text-center ${textSecondary}`}>{sp.activeContracts}</td>
                            <td className="px-4 py-3 text-end font-bold text-[#987012]">
                              {sp.totalSpent.toLocaleString()} <span className="text-[9px] font-normal">{isAr ? 'ر.س' : 'SAR'}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
