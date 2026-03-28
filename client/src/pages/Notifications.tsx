/**
 * Notifications — Sponsor notification center
 * Connected to real tRPC API
 */
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Check, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const typeIcons: Record<string, React.ElementType> = { success: CheckCircle, info: Info, warning: AlertTriangle, error: XCircle };
const typeColors: Record<string, string> = {
  success: 'text-[#d4b85a] bg-[#fbf8f0]0/10',
  info: 'text-blue-400 bg-blue-500/10',
  warning: 'text-yellow-400 bg-yellow-500/10',
  error: 'text-red-400 bg-red-500/10',
};

export default function Notifications() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const { data: notificationsData, isLoading } = trpc.notifications.list.useQuery();
  const notifications = useMemo(() => notificationsData ?? [], [notificationsData]);
  const utils = trpc.useUtils();

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
  });

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
        title={l({ ar: 'الإشعارات', en: 'Notifications' })}
        subtitle={l({ ar: 'جميع إشعاراتك في مكان واحد', en: 'All your notifications in one place' })}
        image={IMAGES.analytics}
      />

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={40} className="mx-auto mb-3 text-[#987012]/30" />
            <p className="text-sm text-muted-foreground">{l({ ar: 'لا توجد إشعارات', en: 'No notifications' })}</p>
          </div>
        ) : (
          notifications.map((notif: any, i: number) => {
            const Icon = typeIcons[notif.type] || Info;
            return (
              <div key={notif.id} className={`glass-card rounded-xl p-3 sm:p-4 flex items-start gap-3 tilt-card animate-fade-in ${!notif.isRead ? 'border-[#987012]/20' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[notif.type] || typeColors.info}`}><Icon size={14} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[10px] font-bold text-foreground">{notif.title}</h4>
                    <span className="text-[8px] text-foreground/20">{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : '—'}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground/50">{notif.message || notif.content}</p>
                </div>
                {!notif.isRead && (
                  <button onClick={() => markRead.mutate({ id: notif.id })} className="p-1.5 rounded-lg hover:bg-muted/50 transition-all shrink-0" title={l({ ar: 'تحديد كمقروء', en: 'Mark as read' })}>
                    <Check size={12} className="text-[#987012]" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
