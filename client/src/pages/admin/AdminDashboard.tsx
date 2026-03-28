/**
 * Admin Executive Dashboard
 * Nour Theme — KPIs + Revenue + Alerts + Quick Actions + Collection Stats
 */
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import {
  DollarSign, Calendar, Award, Clock, Users, Target,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  ArrowUpRight, FileText, CreditCard, Bell, Sparkles,
  BarChart3, PieChart, Activity, Zap, ChevronRight,
  Building2, Shield, Eye, Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const { language, isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  // ─── Data Fetching ───
  const { data: kpis, isLoading: kpisLoading } = trpc.admin.dashboard.kpis.useQuery();
  const { data: recentSponsorships, isLoading: recentLoading } = trpc.admin.dashboard.recentActivity.useQuery();
  const { data: alerts, isLoading: alertsLoading } = trpc.admin.dashboard.alerts.useQuery();
  const { data: collectionStats, isLoading: collectionLoading } = trpc.admin.payments.collectionStats.useQuery();
  const { data: pipeline, isLoading: pipelineLoading } = trpc.admin.sponsorships.pipelineStats.useQuery();

  // ─── Theme helpers ───
  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const cardHover = isDark ? 'hover:border-[#987012]/20 hover:bg-white/[0.05]' : 'hover:border-[#987012]/25 hover:shadow-lg';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  // ─── KPI Cards ───
  const kpiCards = useMemo(() => [
    {
      label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: kpis ? `${Number(kpis.totalRevenue).toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : '—',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      textColor: 'text-emerald-500',
      change: '+12%',
      positive: true,
    },
    {
      label: isAr ? 'الفعاليات النشطة' : 'Active Events',
      value: kpis?.activeEvents ?? '—',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      textColor: 'text-blue-500',
      change: null,
      positive: true,
    },
    {
      label: isAr ? 'الرعايات النشطة' : 'Active Sponsorships',
      value: kpis?.activeSponsorships ?? '—',
      icon: Award,
      color: 'from-[#987012] to-[#d4a832]',
      bgColor: isDark ? 'bg-[#987012]/10' : 'bg-amber-50',
      textColor: 'text-[#987012]',
      change: '+8%',
      positive: true,
    },
    {
      label: isAr ? 'بانتظار الموافقة' : 'Pending Approvals',
      value: kpis?.pendingApprovals ?? '—',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
      textColor: 'text-orange-500',
      change: null,
      positive: false,
    },
    {
      label: isAr ? 'إجمالي الرعاة' : 'Total Sponsors',
      value: kpis?.totalSponsors ?? '—',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      textColor: 'text-purple-500',
      change: '+5',
      positive: true,
    },
    {
      label: isAr ? 'العملاء المحتملين' : 'Total Leads',
      value: kpis?.totalLeads ?? '—',
      icon: Target,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
      textColor: 'text-cyan-500',
      change: '+15',
      positive: true,
    },
  ], [kpis, isAr, isDark]);

  // ─── Status helpers ───
  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending_approval: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/20',
      approved: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
      active: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
      reserved: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
      completed: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
      cancelled: 'bg-red-500/15 text-red-600 border-red-500/20',
      rejected: 'bg-red-500/15 text-red-600 border-red-500/20',
    };
    return map[status] || 'bg-gray-500/15 text-gray-600 border-gray-500/20';
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      pending_approval: { ar: 'بانتظار الموافقة', en: 'Pending Approval' },
      approved: { ar: 'معتمد', en: 'Approved' },
      active: { ar: 'نشط', en: 'Active' },
      reserved: { ar: 'محجوز', en: 'Reserved' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
    };
    return labels[status] ? (isAr ? labels[status].ar : labels[status].en) : status;
  };

  const alertIcon = (type: string) => {
    if (type === 'warning') return <AlertTriangle size={14} className="text-yellow-500" />;
    if (type === 'danger') return <AlertTriangle size={14} className="text-red-500" />;
    return <Bell size={14} className="text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'لوحة القيادة التنفيذية' : 'Executive Dashboard'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'نظرة شاملة على أداء المنصة' : 'Comprehensive platform performance overview'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${textMuted}`}>
            {new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-2xl p-4 border transition-all duration-300 ${cardBg} ${cardHover}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                  <Icon size={16} className={kpi.textColor} />
                </div>
                {kpi.change && (
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    kpi.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className={`text-lg sm:text-xl font-bold ${textPrimary} mb-0.5`}>
                {kpisLoading ? <Loader2 size={16} className="animate-spin" /> : kpi.value}
              </p>
              <p className={`text-[9px] sm:text-[10px] ${textMuted}`}>{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Requests + Alerts + Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Sponsorship Requests — 2 cols */}
        <div className={`lg:col-span-2 rounded-2xl border ${cardBg} overflow-hidden`}>
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-inherit">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#987012]" />
              <h3 className={`text-sm font-bold ${textPrimary}`}>
                {isAr ? 'آخر طلبات الرعاية' : 'Recent Sponsorship Requests'}
              </h3>
            </div>
            <Link href="/admin/approvals">
              <span className="text-[10px] text-[#987012] hover:text-[#d4a832] font-medium flex items-center gap-1 cursor-pointer">
                {isAr ? 'عرض الكل' : 'View All'}
                <ChevronRight size={12} className={isRTL ? 'rotate-180' : ''} />
              </span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[#987012]" />
              </div>
            ) : !recentSponsorships?.length ? (
              <div className="text-center py-12">
                <Award size={32} className={`mx-auto mb-2 ${textMuted}`} />
                <p className={`text-xs ${textMuted}`}>{isAr ? 'لا توجد طلبات حديثة' : 'No recent requests'}</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'}`}>
                    <th className={`text-start px-4 py-2.5 font-semibold ${textMuted}`}>{isAr ? 'الراعي' : 'Sponsor'}</th>
                    <th className={`text-start px-4 py-2.5 font-semibold ${textMuted} hidden sm:table-cell`}>{isAr ? 'الفعالية' : 'Event'}</th>
                    <th className={`text-start px-4 py-2.5 font-semibold ${textMuted} hidden md:table-cell`}>{isAr ? 'الحزمة' : 'Package'}</th>
                    <th className={`text-start px-4 py-2.5 font-semibold ${textMuted}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
                    <th className={`text-start px-4 py-2.5 font-semibold ${textMuted}`}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th className={`text-center px-4 py-2.5 font-semibold ${textMuted}`}>{isAr ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSponsorships.map((s: any, i: number) => (
                    <tr key={s.id || i} className={`border-b last:border-0 transition-colors ${
                      isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-[#F0EEE7]/30 hover:bg-[#F9F8F5]/50'
                    }`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                            <Building2 size={12} className="text-[#987012]" />
                          </div>
                          <span className={`font-medium ${textPrimary} truncate max-w-[120px]`}>
                            {s.sponsorName || (isAr ? 'راعي' : 'Sponsor')}
                          </span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 hidden sm:table-cell ${textSecondary} truncate max-w-[140px]`}>
                        {s.eventName || '—'}
                      </td>
                      <td className={`px-4 py-3 hidden md:table-cell ${textSecondary} truncate max-w-[120px]`}>
                        {s.packageName || '—'}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${textPrimary}`}>
                        {s.totalAmount ? `${Number(s.totalAmount).toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColor(s.status)}`}>
                          {statusLabel(s.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/admin/approvals`}>
                          <span className="text-[#987012] hover:text-[#d4a832] cursor-pointer">
                            <Eye size={14} />
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Alerts + Collection */}
        <div className="space-y-4 sm:space-y-6">
          {/* Smart Alerts */}
          <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
            <div className="flex items-center gap-2 p-4 border-b border-inherit">
              <Zap size={16} className="text-[#987012]" />
              <h3 className={`text-sm font-bold ${textPrimary}`}>
                {isAr ? 'التنبيهات الذكية' : 'Smart Alerts'}
              </h3>
            </div>
            <div className="p-3 space-y-2">
              {alertsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-[#987012]" />
                </div>
              ) : !alerts?.length ? (
                <div className="text-center py-6">
                  <CheckCircle size={24} className="mx-auto mb-1.5 text-emerald-500" />
                  <p className={`text-[10px] ${textMuted}`}>{isAr ? 'لا توجد تنبيهات' : 'No alerts'}</p>
                </div>
              ) : (
                alerts.map((alert: any, i: number) => (
                  <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                    isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-[#F9F8F5] hover:bg-[#F0EEE7]/50'
                  }`}>
                    <div className="mt-0.5 shrink-0">{alertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] sm:text-[11px] font-medium ${textPrimary} leading-tight`}>
                        {isAr ? alert.messageAr : alert.messageEn}
                      </p>
                      {alert.count > 0 && (
                        <span className={`text-[9px] ${textMuted} mt-0.5 inline-block`}>
                          ({alert.count} {isAr ? 'عنصر' : 'items'})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Collection Stats */}
          <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
            <div className="flex items-center gap-2 p-4 border-b border-inherit">
              <PieChart size={16} className="text-[#987012]" />
              <h3 className={`text-sm font-bold ${textPrimary}`}>
                {isAr ? 'إحصائيات التحصيل' : 'Collection Stats'}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {collectionLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-[#987012]" />
                </div>
              ) : (
                <>
                  {/* Collection Rate Circle */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : '#F0EEE7'} strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="#987012" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(collectionStats?.collectionRate ?? 0) * 2.64} 264`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-lg font-bold ${textPrimary}`}>{collectionStats?.collectionRate ?? 0}%</span>
                        <span className={`text-[8px] ${textMuted}`}>{isAr ? 'نسبة التحصيل' : 'Collection'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: isAr ? 'المستحق' : 'Due', value: collectionStats?.totalDue ?? '0', color: 'text-blue-500' },
                      { label: isAr ? 'المحصل' : 'Collected', value: collectionStats?.totalCollected ?? '0', color: 'text-emerald-500' },
                      { label: isAr ? 'المتأخر' : 'Overdue', value: collectionStats?.totalOverdue ?? '0', color: 'text-red-500' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className={`text-xs sm:text-sm font-bold ${stat.color}`}>
                          {Number(stat.value).toLocaleString()}
                        </p>
                        <p className={`text-[8px] ${textMuted}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className={`rounded-2xl border ${cardBg} overflow-hidden`}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-inherit">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#987012]" />
            <h3 className={`text-sm font-bold ${textPrimary}`}>
              {isAr ? 'خط أنابيب الرعاية' : 'Sponsorship Pipeline'}
            </h3>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {pipelineLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-[#987012]" />
            </div>
          ) : !pipeline?.length ? (
            <div className="text-center py-8">
              <BarChart3 size={32} className={`mx-auto mb-2 ${textMuted}`} />
              <p className={`text-xs ${textMuted}`}>{isAr ? 'لا توجد بيانات' : 'No pipeline data'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {pipeline.map((stage: any, i: number) => (
                <div key={i} className={`rounded-xl p-3 text-center border transition-all duration-300 ${
                  isDark ? 'bg-white/[0.02] border-white/[0.04] hover:border-[#987012]/20' : 'bg-[#F9F8F5] border-[#F0EEE7]/40 hover:border-[#987012]/20'
                }`}>
                  <p className={`text-xl sm:text-2xl font-bold ${textPrimary} mb-1`}>{stage.count}</p>
                  <p className={`text-[9px] ${textMuted} leading-tight`}>{statusLabel(stage.status)}</p>
                  {stage.totalAmount && Number(stage.totalAmount) > 0 && (
                    <p className="text-[8px] text-[#987012] font-medium mt-0.5">
                      {Number(stage.totalAmount).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Calendar, label: isAr ? 'إنشاء فعالية جديدة' : 'Create New Event', path: '/admin/events', color: 'from-blue-500 to-blue-600' },
          { icon: Award, label: isAr ? 'مراجعة طلبات الرعاية' : 'Review Sponsorship Requests', path: '/admin/approvals', color: 'from-[#987012] to-[#d4a832]' },
          { icon: FileText, label: isAr ? 'إصدار عقد جديد' : 'Issue New Contract', path: '/admin/contracts', color: 'from-purple-500 to-purple-600' },
          { icon: CreditCard, label: isAr ? 'إدارة المدفوعات' : 'Manage Payments', path: '/admin/payments', color: 'from-emerald-500 to-emerald-600' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.path}>
              <div className={`rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 group ${cardBg} ${cardHover}`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className={`text-[11px] sm:text-xs font-semibold ${textPrimary} leading-tight`}>{action.label}</p>
                <ArrowUpRight size={14} className={`mt-2 ${textMuted} group-hover:text-[#987012] transition-colors`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
