/**
 * Admin Notifications Management
 * Send notifications to sponsors, view system notifications, broadcast
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Bell, Send, Loader2, Users, Building2, Calendar,
  CheckCircle, X, MessageSquare, AlertTriangle,
  Info, Megaphone, Eye, Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNotifications() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [showSendModal, setShowSendModal] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notifTitleAr, setNotifTitleAr] = useState('');
  const [notifTitleEn, setNotifTitleEn] = useState('');
  const [notifMessageAr, setNotifMessageAr] = useState('');
  const [notifMessageEn, setNotifMessageEn] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';
  const inputBg = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F9F8F5] border-[#F0EEE7]';

  // Fetch notifications list
  const { data: notificationsList, isLoading: notifLoading, refetch: refetchNotifs } = trpc.admin.notifications.list.useQuery({ limit: 50 });

  // Fetch sponsors for targeted notifications
  const { data: sponsors } = trpc.admin.sponsors.list.useQuery({});

  // Broadcast mutation
  const broadcastMutation = trpc.admin.notifications.broadcast.useMutation({
    onSuccess: (data) => {
      toast.success(isAr ? 'تم إرسال الإشعار' : 'Notification sent', {
        description: isAr ? `تم الإرسال لـ ${data?.sent ?? 0} راعي` : `Sent to ${data?.sent ?? 0} sponsors`,
      });
      resetForm();
      refetchNotifs();
    },
    onError: () => toast.error(isAr ? 'خطأ في الإرسال' : 'Failed to send'),
  });

  // Send to single user mutation
  const sendMutation = trpc.admin.notifications.send.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إرسال الإشعار' : 'Notification sent');
      resetForm();
      refetchNotifs();
    },
    onError: () => toast.error(isAr ? 'خطأ في الإرسال' : 'Failed to send'),
  });

  const resetForm = () => {
    setShowSendModal(false);
    setNotifTitleAr('');
    setNotifTitleEn('');
    setNotifMessageAr('');
    setNotifMessageEn('');
    setNotifType('info');
    setSelectedUserId(null);
    setIsBroadcast(true);
  };

  const handleSend = () => {
    if (!notifTitleAr && !notifTitleEn) {
      toast.error(isAr ? 'يرجى إدخال العنوان' : 'Please enter a title');
      return;
    }
    const titleAr = notifTitleAr || notifTitleEn;
    const titleEn = notifTitleEn || notifTitleAr;
    const messageAr = notifMessageAr || notifMessageEn || titleAr;
    const messageEn = notifMessageEn || notifMessageAr || titleEn;

    if (isBroadcast) {
      broadcastMutation.mutate({ titleAr, titleEn, messageAr, messageEn, type: notifType });
    } else if (selectedUserId) {
      sendMutation.mutate({ userId: selectedUserId, titleAr, titleEn, messageAr, messageEn, type: notifType });
    } else {
      toast.error(isAr ? 'يرجى اختيار الراعي' : 'Please select a sponsor');
    }
  };

  const typeIcons: Record<string, any> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
    system: Bell,
  };

  const typeColors: Record<string, string> = {
    info: 'bg-blue-500/15 text-blue-500',
    success: 'bg-emerald-500/15 text-emerald-500',
    warning: 'bg-yellow-500/15 text-yellow-500',
    error: 'bg-red-500/15 text-red-500',
    system: 'bg-purple-500/15 text-purple-500',
  };

  const todayCount = notificationsList?.filter((n: any) => {
    const d = new Date(n.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length ?? 0;

  const readCount = notificationsList?.filter((n: any) => n.isRead).length ?? 0;
  const totalCount = notificationsList?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'مركز الإشعارات' : 'Notification Center'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'إرسال وإدارة الإشعارات للرعاة' : 'Send and manage notifications to sponsors'}
          </p>
        </div>
        <Button
          onClick={() => { setIsBroadcast(true); setShowSendModal(true); }}
          className="bg-gradient-to-r from-[#987012] to-[#d4a832] text-white text-xs gap-2"
        >
          <Megaphone size={14} />
          {isAr ? 'إرسال إشعار جماعي' : 'Broadcast Notification'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي الرعاة' : 'Total Sponsors', value: sponsors?.length ?? 0, icon: Users, color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
          { label: isAr ? 'إجمالي الإشعارات' : 'Total Notifications', value: totalCount, icon: Bell, color: 'text-[#987012]', bg: isDark ? 'bg-[#987012]/10' : 'bg-amber-50' },
          { label: isAr ? 'إشعارات اليوم' : "Today's Notifications", value: todayCount, icon: Calendar, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
          { label: isAr ? 'معدل القراءة' : 'Read Rate', value: totalCount > 0 ? `${Math.round((readCount / totalCount) * 100)}%` : '—', icon: Eye, color: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
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

      {/* Quick Actions */}
      <div className={`rounded-2xl border p-5 ${cardBg}`}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
          {isAr ? 'إشعارات سريعة' : 'Quick Notifications'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: isAr ? 'تذكير بالدفع' : 'Payment Reminder',
              desc: isAr ? 'إرسال تذكير لجميع الرعاة بالمدفوعات المعلقة' : 'Remind all sponsors about pending payments',
              icon: AlertTriangle,
              type: 'warning' as const,
              titleAr: 'تذكير بالدفع',
              titleEn: 'Payment Reminder',
              msgAr: 'يرجى مراجعة المدفوعات المعلقة وإتمام عملية الدفع في أقرب وقت.',
              msgEn: 'Please review your pending payments and complete the payment process at your earliest convenience.',
            },
            {
              title: isAr ? 'تحديث فعالية' : 'Event Update',
              desc: isAr ? 'إشعار الرعاة بتحديثات الفعالية القادمة' : 'Notify sponsors about upcoming event updates',
              icon: Calendar,
              type: 'info' as const,
              titleAr: 'تحديث الفعالية',
              titleEn: 'Event Update',
              msgAr: 'تم تحديث تفاصيل الفعالية القادمة. يرجى مراجعة التفاصيل الجديدة.',
              msgEn: 'The upcoming event details have been updated. Please review the new details.',
            },
            {
              title: isAr ? 'رسالة ترحيبية' : 'Welcome Message',
              desc: isAr ? 'إرسال رسالة ترحيبية للرعاة الجدد' : 'Send welcome message to new sponsors',
              icon: MessageSquare,
              type: 'success' as const,
              titleAr: 'مرحباً بك في مهام إكسبو',
              titleEn: 'Welcome to Maham Expo',
              msgAr: 'مرحباً بك في منصة مهام إكسبو للرعاية. نحن سعداء بانضمامك!',
              msgEn: 'Welcome to Maham Expo Sponsorship Platform. We are glad to have you!',
            },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  setNotifType(action.type);
                  setNotifTitleAr(action.titleAr);
                  setNotifTitleEn(action.titleEn);
                  setNotifMessageAr(action.msgAr);
                  setNotifMessageEn(action.msgEn);
                  setIsBroadcast(true);
                  setShowSendModal(true);
                }}
                className={`rounded-xl p-4 border text-start transition-all hover:scale-[1.02] ${cardBg} hover:border-[#987012]/20`}
              >
                <div className={`w-8 h-8 rounded-lg ${typeColors[action.type]} flex items-center justify-center mb-2`}>
                  <Icon size={14} />
                </div>
                <p className={`text-xs font-bold ${textPrimary} mb-0.5`}>{action.title}</p>
                <p className={`text-[10px] ${textMuted}`}>{action.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications History */}
      <div className={`rounded-2xl border p-5 ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-bold ${textPrimary}`}>
            {isAr ? 'سجل الإشعارات' : 'Notification History'}
          </h3>
          <span className={`text-[10px] ${textMuted}`}>{totalCount} {isAr ? 'إشعار' : 'notifications'}</span>
        </div>
        {notifLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#987012]" />
          </div>
        ) : !notificationsList?.length ? (
          <div className="text-center py-12">
            <Bell size={36} className={`mx-auto mb-3 ${textMuted}`} />
            <p className={`text-xs ${textMuted}`}>{isAr ? 'لا توجد إشعارات بعد' : 'No notifications yet'}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {notificationsList.map((notif: any) => {
              const Icon = typeIcons[notif.type] || Info;
              return (
                <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-[#F9F8F5] hover:bg-[#F0EEE7]/50'
                } ${!notif.isRead ? (isDark ? 'ring-1 ring-[#987012]/15' : 'ring-1 ring-[#987012]/10') : ''}`}>
                  <div className={`w-8 h-8 rounded-lg ${typeColors[notif.type] || typeColors.info} flex items-center justify-center shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${textPrimary}`}>
                      {isAr ? notif.titleAr : notif.titleEn}
                    </p>
                    <p className={`text-[10px] ${textSecondary} mt-0.5 line-clamp-2`}>
                      {isAr ? notif.messageAr : notif.messageEn}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`flex items-center gap-1 text-[9px] ${textMuted}`}>
                        <Clock size={9} />
                        {new Date(notif.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      {notif.category && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-white/5' : 'bg-white'} ${textMuted}`}>
                          {notif.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetForm} />
          <div className={`relative w-full max-w-lg rounded-2xl border p-6 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#0a0c12] border-white/[0.08]' : 'bg-white border-[#F0EEE7]'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-base font-bold ${textPrimary}`}>
                {isBroadcast ? (isAr ? 'إشعار جماعي لجميع الرعاة' : 'Broadcast to All Sponsors') : (isAr ? 'إرسال إشعار مخصص' : 'Send Targeted Notification')}
              </h2>
              <button onClick={resetForm} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F9F8F5]'}`}>
                <X size={16} className={textMuted} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Target Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBroadcast(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    isBroadcast ? 'bg-[#987012]/10 text-[#987012] border-[#987012]/20' : `${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]'} ${textMuted}`
                  }`}
                >
                  <Megaphone size={14} />
                  {isAr ? 'جماعي' : 'Broadcast'}
                </button>
                <button
                  onClick={() => setIsBroadcast(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    !isBroadcast ? 'bg-[#987012]/10 text-[#987012] border-[#987012]/20' : `${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]'} ${textMuted}`
                  }`}
                >
                  <Users size={14} />
                  {isAr ? 'مخصص' : 'Targeted'}
                </button>
              </div>

              {/* Sponsor selector for targeted */}
              {!isBroadcast && (
                <div>
                  <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                    {isAr ? 'اختر الراعي' : 'Select Sponsor'}
                  </label>
                  <select
                    value={selectedUserId ?? ''}
                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
                  >
                    <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
                    {sponsors?.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.profile?.companyNameAr || s.profile?.companyNameEn || s.name || s.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type */}
              <div>
                <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                  {isAr ? 'نوع الإشعار' : 'Notification Type'}
                </label>
                <div className="flex gap-2">
                  {(['info', 'success', 'warning', 'error'] as const).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setNotifType(type)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium border transition-all ${
                          notifType === type ? `${typeColors[type]} border-current` : `${isDark ? 'border-white/[0.06]' : 'border-[#F0EEE7]'} ${textMuted}`
                        }`}
                      >
                        <Icon size={12} />
                        {type === 'info' ? (isAr ? 'معلومة' : 'Info') :
                         type === 'success' ? (isAr ? 'نجاح' : 'Success') :
                         type === 'warning' ? (isAr ? 'تحذير' : 'Warning') : (isAr ? 'خطأ' : 'Error')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title AR */}
              <div>
                <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                  {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={notifTitleAr}
                  onChange={(e) => setNotifTitleAr(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
                  placeholder={isAr ? 'عنوان الإشعار بالعربي...' : 'Arabic title...'}
                  dir="rtl"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                  {isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={notifTitleEn}
                  onChange={(e) => setNotifTitleEn(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
                  placeholder="English title..."
                  dir="ltr"
                />
              </div>

              {/* Message AR */}
              <div>
                <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                  {isAr ? 'الرسالة (عربي)' : 'Message (Arabic)'}
                </label>
                <textarea
                  value={notifMessageAr}
                  onChange={(e) => setNotifMessageAr(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30 resize-none`}
                  placeholder={isAr ? 'رسالة الإشعار بالعربي...' : 'Arabic message...'}
                  dir="rtl"
                />
              </div>

              {/* Message EN */}
              <div>
                <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>
                  {isAr ? 'الرسالة (إنجليزي)' : 'Message (English)'}
                </label>
                <textarea
                  value={notifMessageEn}
                  onChange={(e) => setNotifMessageEn(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30 resize-none`}
                  placeholder="English message..."
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleSend}
                disabled={(!notifTitleAr && !notifTitleEn) || broadcastMutation.isPending || sendMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#987012] to-[#d4a832] text-white gap-2"
              >
                {(broadcastMutation.isPending || sendMutation.isPending) ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {isBroadcast ? (isAr ? 'إرسال للجميع' : 'Send to All') : (isAr ? 'إرسال' : 'Send')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
