/**
 * Admin Event Management
 * CRUD events + manage packages + status management
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Calendar, Plus, Search, Filter, Edit, Trash2, Eye, MapPin,
  Users, Award, ChevronDown, Loader2, MoreHorizontal,
  CheckCircle, Clock, AlertCircle, X, Save, Building2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEvents() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';
  const inputBg = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F9F8F5] border-[#F0EEE7]';

  // Data
  const { data: events, isLoading, refetch } = trpc.admin.events.list.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  const createMutation = trpc.admin.events.create.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إنشاء الفعالية' : 'Event created' );
      setShowCreateModal(false);
      refetch();
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const updateMutation = trpc.admin.events.update.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم التحديث' : 'Updated' );
      setEditingEvent(null);
      refetch();
    },
    onError: (e) => toast.error(isAr ? 'خطأ' : 'Error'),
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/15 text-gray-600 border-gray-500/20',
    published: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
    active: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
    completed: 'bg-purple-500/15 text-purple-600 border-purple-500/20',
    cancelled: 'bg-red-500/15 text-red-600 border-red-500/20',
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    draft: { ar: 'مسودة', en: 'Draft' },
    published: { ar: 'منشور', en: 'Published' },
    active: { ar: 'نشط', en: 'Active' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
            {isAr ? 'إدارة الفعاليات' : 'Event Management'}
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
            {isAr ? 'إنشاء وإدارة الفعاليات وحزم الرعاية' : 'Create and manage events and sponsorship packages'}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#987012] to-[#d4a832] text-white hover:opacity-90 gap-2"
        >
          <Plus size={16} />
          {isAr ? 'إنشاء فعالية' : 'Create Event'}
        </Button>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-4 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={14} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث عن فعالية...' : 'Search events...'}
              className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} placeholder:${textMuted} focus:outline-none focus:border-[#987012]/30`}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'published', 'active', 'completed'].map((status) => (
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
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#987012]" />
        </div>
      ) : !events?.length ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <Calendar size={48} className={`mx-auto mb-3 ${textMuted}`} />
          <p className={`text-sm font-medium ${textPrimary} mb-1`}>{isAr ? 'لا توجد فعاليات' : 'No events found'}</p>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'أنشئ فعالية جديدة للبدء' : 'Create a new event to get started'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event: any) => (
            <div key={event.id} className={`rounded-2xl border transition-all duration-300 ${cardBg} overflow-hidden`}>
              {/* Event Header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#987012]/20 to-[#d4a832]/20 flex items-center justify-center shrink-0">
                      <Calendar size={20} className="text-[#987012]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm sm:text-base font-bold ${textPrimary} truncate`}>
                        {isAr ? event.nameAr : event.nameEn}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColors[event.status] || statusColors.draft}`}>
                          {isAr ? statusLabels[event.status]?.ar : statusLabels[event.status]?.en}
                        </span>
                        {event.location && (
                          <span className={`flex items-center gap-1 text-[10px] ${textMuted}`}>
                            <MapPin size={10} />
                            {event.location}
                          </span>
                        )}
                        <span className={`text-[10px] ${textMuted}`}>
                          {event.startDate ? new Date(event.startDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : '—'}
                          {event.endDate ? ` — ${new Date(event.endDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F9F8F5]'}`}
                      title={isAr ? 'عرض الحزم' : 'View Packages'}
                    >
                      <Award size={14} className={textSecondary} />
                    </button>
                    <button
                      onClick={() => setEditingEvent(event)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#F9F8F5]'}`}
                    >
                      <Edit size={14} className={textSecondary} />
                    </button>
                  </div>
                </div>

                {/* Event Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className={`rounded-xl p-2.5 text-center ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>{event.packageCount ?? 0}</p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'حزم الرعاية' : 'Packages'}</p>
                  </div>
                  <div className={`rounded-xl p-2.5 text-center ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>{event.sponsorshipCount ?? 0}</p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'رعايات' : 'Sponsorships'}</p>
                  </div>
                  <div className={`rounded-xl p-2.5 text-center ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
                    <p className={`text-sm font-bold text-[#987012]`}>
                      {event.totalRevenue ? `${Number(event.totalRevenue).toLocaleString()}` : '0'}
                    </p>
                    <p className={`text-[9px] ${textMuted}`}>{isAr ? 'الإيرادات (ر.س)' : 'Revenue (SAR)'}</p>
                  </div>
                </div>
              </div>

              {/* Expanded: Packages */}
              {expandedEvent === event.id && (
                <EventPackages eventId={event.id} isDark={isDark} isAr={isAr} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEvent) && (
        <EventFormModal
          event={editingEvent}
          isDark={isDark}
          isAr={isAr}
          isRTL={isRTL}
          onClose={() => { setShowCreateModal(false); setEditingEvent(null); }}
          onSubmit={(data: any) => {
            if (editingEvent) {
              updateMutation.mutate({ id: editingEvent.id, ...data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

/* ─── Event Packages Sub-component ─── */
function EventPackages({ eventId, isDark, isAr, textPrimary, textSecondary, textMuted }: any) {
  const { data: packages, isLoading } = trpc.admin.packages.listByEvent.useQuery({ eventId });

  if (isLoading) return (
    <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'} p-4 flex justify-center`}>
      <Loader2 size={20} className="animate-spin text-[#987012]" />
    </div>
  );

  return (
    <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0EEE7]/40'} p-4`}>
      <h4 className={`text-xs font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
        <Award size={14} className="text-[#987012]" />
        {isAr ? 'حزم الرعاية' : 'Sponsorship Packages'} ({packages?.length ?? 0})
      </h4>
      {!packages?.length ? (
        <p className={`text-[10px] ${textMuted} text-center py-4`}>{isAr ? 'لا توجد حزم' : 'No packages'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className={`rounded-xl p-3 border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-[#F9F8F5] border-[#F0EEE7]/40'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold ${textPrimary}`}>{isAr ? pkg.nameAr : pkg.nameEn}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  pkg.tier === 'platinum' ? 'bg-gray-200 text-gray-700' :
                  pkg.tier === 'gold' ? 'bg-amber-100 text-amber-700' :
                  pkg.tier === 'silver' ? 'bg-gray-100 text-gray-600' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {pkg.tier}
                </span>
              </div>
              <p className="text-sm font-bold text-[#987012]">
                {Number(pkg.price).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[9px] ${textMuted}`}>
                  {isAr ? 'المتاح' : 'Available'}: {pkg.availableSlots ?? pkg.maxSponsors}/{pkg.maxSponsors}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Event Form Modal ─── */
function EventFormModal({ event, isDark, isAr, isRTL, onClose, onSubmit, isSubmitting }: any) {
  const [form, setForm] = useState({
    nameAr: event?.nameAr || '',
    nameEn: event?.nameEn || '',
    descriptionAr: event?.descriptionAr || '',
    descriptionEn: event?.descriptionEn || '',
    location: event?.location || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    status: event?.status || 'draft',
    maxSponsors: event?.maxSponsors || 50,
  });

  const inputBg = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F9F8F5] border-[#F0EEE7]';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 max-h-[85vh] overflow-y-auto ${
        isDark ? 'bg-[#0a0c12] border-white/[0.08]' : 'bg-white border-[#F0EEE7]'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-base font-bold ${textPrimary}`}>
            {event ? (isAr ? 'تعديل الفعالية' : 'Edit Event') : (isAr ? 'إنشاء فعالية جديدة' : 'Create New Event')}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5">
            <X size={16} className={textMuted} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
                required dir="rtl" />
            </div>
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
                required dir="ltr" />
            </div>
          </div>

          <div>
            <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الموقع' : 'Location'}</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
              placeholder={isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`} />
            </div>
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الحالة' : 'Status'}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}>
                <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                <option value="published">{isAr ? 'منشور' : 'Published'}</option>
                <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
              </select>
            </div>
            <div>
              <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الحد الأقصى للرعاة' : 'Max Sponsors'}</label>
              <input type="number" value={form.maxSponsors} onChange={(e) => setForm({ ...form, maxSponsors: parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`} />
            </div>
          </div>

          <div>
            <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
            <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              rows={3} dir="rtl"
              className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30 resize-none`} />
          </div>

          <div>
            <label className={`text-[10px] font-semibold ${textMuted} block mb-1`}>{isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
            <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              rows={3} dir="ltr"
              className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30 resize-none`} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#987012] to-[#d4a832] text-white hover:opacity-90 gap-2">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {event ? (isAr ? 'حفظ التغييرات' : 'Save Changes') : (isAr ? 'إنشاء' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
