/**
 * EventCalendar — Sponsor Event Calendar
 * Visual calendar with event milestones, deadlines, and sponsorship activities
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, MapPin,
  Star, CheckCircle, AlertCircle, Users, Bot, Flag,
  Megaphone, Camera, FileText, Monitor, Coffee
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface CalendarEvent {
  id: string;
  title: { ar: string; en: string };
  date: string;
  time?: string;
  type: 'event' | 'deadline' | 'meeting' | 'milestone' | 'delivery';
  description: { ar: string; en: string };
  location?: { ar: string; en: string };
  priority: 'high' | 'medium' | 'low';
}

const events: CalendarEvent[] = [
  { id: 'E1', title: { ar: 'الموعد النهائي — رفع الشعارات', en: 'Deadline — Logo Upload' }, date: '2026-03-01', type: 'deadline', description: { ar: 'آخر موعد لرفع الشعارات بجميع الصيغ المطلوبة', en: 'Last date to upload logos in all required formats' }, priority: 'high' },
  { id: 'E2', title: { ar: 'اجتماع تنسيق مع فريق المعرض', en: 'Coordination Meeting with Expo Team' }, date: '2026-03-05', time: '10:00', type: 'meeting', description: { ar: 'مراجعة خطة التفعيل ومواقع الأصول', en: 'Review activation plan and asset locations' }, location: { ar: 'عبر Zoom', en: 'Via Zoom' }, priority: 'medium' },
  { id: 'E3', title: { ar: 'الموعد النهائي — فيديو المسرح', en: 'Deadline — Stage Video' }, date: '2026-03-10', type: 'deadline', description: { ar: 'آخر موعد لتسليم فيديو المسرح 30 ثانية', en: 'Last date to deliver 30-sec stage video' }, priority: 'high' },
  { id: 'E4', title: { ar: 'الموعد النهائي — تصاميم اللافتات', en: 'Deadline — Banner Designs' }, date: '2026-03-15', type: 'deadline', description: { ar: 'آخر موعد لتسليم تصاميم اللافتات والملصقات', en: 'Last date to deliver banner and sticker designs' }, priority: 'high' },
  { id: 'E5', title: { ar: 'بدء الطباعة والإنتاج', en: 'Print & Production Start' }, date: '2026-03-18', type: 'milestone', description: { ar: 'بدء طباعة جميع المواد المادية', en: 'Start printing all physical materials' }, priority: 'medium' },
  { id: 'E6', title: { ar: 'تجهيز الموقع — يوم 1', en: 'Venue Setup — Day 1' }, date: '2026-03-28', type: 'delivery', description: { ar: 'تركيب الشاشات واللافتات والبوابات', en: 'Install screens, banners, and gates' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'high' },
  { id: 'E7', title: { ar: 'تجهيز الموقع — يوم 2', en: 'Venue Setup — Day 2' }, date: '2026-03-29', type: 'delivery', description: { ar: 'تجهيز صالة VIP والأكشاك ومنطقة القهوة', en: 'Setup VIP lounge, booths, and coffee zone' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'high' },
  { id: 'E8', title: { ar: 'اختبار تقني شامل', en: 'Full Technical Test' }, date: '2026-03-29', time: '16:00', type: 'milestone', description: { ar: 'اختبار جميع الشاشات والمحتوى والإضاءة', en: 'Test all screens, content, and lighting' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'high' },
  { id: 'E9', title: { ar: 'يوم الافتتاح — مؤتمر ليب 2026', en: 'Opening Day — LEAP 2026' }, date: '2026-03-30', time: '09:00', type: 'event', description: { ar: 'الكلمة الافتتاحية في المسرح الرئيسي الساعة 9:30', en: 'Opening speech at main stage at 9:30' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'high' },
  { id: 'E10', title: { ar: 'يوم 2 — مؤتمر ليب 2026', en: 'Day 2 — LEAP 2026' }, date: '2026-03-31', time: '09:00', type: 'event', description: { ar: 'جلسات نقاش + تفعيل الأكشاك', en: 'Panel sessions + booth activation' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'medium' },
  { id: 'E11', title: { ar: 'يوم 3 — مؤتمر ليب 2026', en: 'Day 3 — LEAP 2026' }, date: '2026-04-01', time: '09:00', type: 'event', description: { ar: 'جلسات تواصل VIP + عشاء الرعاة', en: 'VIP networking + sponsors dinner' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'medium' },
  { id: 'E12', title: { ar: 'يوم الختام — مؤتمر ليب 2026', en: 'Closing Day — LEAP 2026' }, date: '2026-04-02', time: '09:00', type: 'event', description: { ar: 'الجلسة الختامية + توزيع الجوائز', en: 'Closing session + awards ceremony' }, location: { ar: 'مركز الرياض للمعارض', en: 'Riyadh Exhibition Center' }, priority: 'high' },
  { id: 'E13', title: { ar: 'تسليم تقرير ما بعد الفعالية', en: 'Post-Event Report Delivery' }, date: '2026-04-10', type: 'milestone', description: { ar: 'تقرير شامل: عائد الاستثمار، الظهور، العملاء المحتملين', en: 'Full report: ROI, exposure, leads' }, priority: 'medium' },
];

const typeConfig = {
  event: { icon: Star, color: 'text-[#987012]', bg: 'bg-[#987012]/10', border: 'border-[#987012]/20', label: { ar: 'فعالية', en: 'Event' } },
  deadline: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: { ar: 'موعد نهائي', en: 'Deadline' } },
  meeting: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: { ar: 'اجتماع', en: 'Meeting' } },
  milestone: { icon: Flag, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: { ar: 'مرحلة', en: 'Milestone' } },
  delivery: { icon: CheckCircle, color: 'text-[#d4b85a]', bg: 'bg-[#fbf8f0]0/10', border: 'border-[#fbf8f0]0/20', label: { ar: 'تسليم', en: 'Delivery' } },
};

export default function EventCalendar() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [currentMonth, setCurrentMonth] = useState(2); // March 2026 (0-indexed)
  const [filterType, setFilterType] = useState<string>('all');

  const months = [
    { ar: 'مارس 2026', en: 'March 2026', month: 2, year: 2026 },
    { ar: 'أبريل 2026', en: 'April 2026', month: 3, year: 2026 },
  ];

  const currentMonthData = months[currentMonth === 2 ? 0 : 1];
  const daysInMonth = currentMonth === 2 ? 31 : 30;
  const firstDay = currentMonth === 2 ? 0 : 3; // Sunday=0 for March 2026, Wednesday=3 for April

  const monthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth;
  }).filter(e => filterType === 'all' || e.type === filterType);

  const getEventsForDay = (day: number) => {
    const dateStr = `2026-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthEvents.filter(e => e.date === dateStr);
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date('2026-03-16')).slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'تقويم الفعاليات', en: 'Event Calendar' })}
        subtitle={l({ ar: 'عرض جميع الفعاليات القادمة', en: 'View all upcoming events' })}
        image={IMAGES.calendar}
      />


      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors ${filterType === 'all' ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 border border-border'}`}>
          {l({ ar: 'الكل', en: 'All' })}
        </button>
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilterType(key)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors flex items-center gap-1 ${filterType === key ? cfg.bg + ' ' + cfg.color + ' border ' + cfg.border : 'bg-muted/50 text-muted-foreground/70 border border-border'}`}>
            <cfg.icon size={10} />
            {l(cfg.label)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-card rounded-xl p-3 sm:p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(2)} className="p-1.5 rounded-lg hover:bg-muted/50"><ChevronRight size={16} className="text-muted-foreground/70" /></button>
            <h3 className="text-sm font-bold text-foreground">{l(currentMonthData)}</h3>
            <button onClick={() => setCurrentMonth(3)} className="p-1.5 rounded-lg hover:bg-muted/50"><ChevronLeft size={16} className="text-muted-foreground/70" /></button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {(language === 'ar' ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(day => (
              <div key={day} className="text-center text-[8px] sm:text-[9px] text-muted-foreground/50 py-1 font-medium">{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              const isToday = currentMonth === 2 && day === 16;

              return (
                <div key={day} className={`aspect-square rounded-lg p-0.5 sm:p-1 text-center relative transition-colors ${isToday ? 'ring-1 ring-[#987012]/50 bg-[#987012]/5' : hasEvents ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-muted/30'}`}>
                  <span className={`text-[9px] sm:text-[10px] ${isToday ? 'text-[#987012] font-bold' : 'text-muted-foreground'}`}>{day}</span>
                  {hasEvents && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, ei) => (
                        <div key={ei} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${typeConfig[e.type].bg}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-3">
          <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
            <h3 className="text-xs font-bold text-muted-foreground mb-3">{l({ ar: 'الأحداث القادمة', en: 'Upcoming Events' })}</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event, i) => {
                const cfg = typeConfig[event.type];
                return (
                  <div key={event.id} className="p-2.5 rounded-lg bg-muted/30 border border-border hover:border-[#987012]/10 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded-lg ${cfg.bg} shrink-0`}>
                        <cfg.icon size={12} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] sm:text-xs font-bold text-foreground/80 truncate">{l(event.title)}</h4>
                        <p className="text-[8px] text-muted-foreground/50 mt-0.5">{event.date} {event.time && `• ${event.time}`}</p>
                        {event.location && (
                          <p className="text-[8px] text-foreground/20 mt-0.5 flex items-center gap-1"><MapPin size={8} />{l(event.location)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Tip */}
          <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
            <div className="flex items-start gap-2">
              <Bot size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-blue-400 mb-1">{l({ ar: 'تنبيه Maham AI', en: 'Maham AI Alert' })}</p>
                <p className="text-[9px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'لديك 3 مواعيد نهائية خلال الأسبوعين القادمين. أنصحك بإعطاء الأولوية لتصميم اللافتات المعلقة لأنها تحتاج وقت طباعة إضافي.', en: 'You have 3 deadlines in the next 2 weeks. I recommend prioritizing hanging banner design as it needs extra print time.' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
        <h3 className="text-xs font-bold text-muted-foreground mb-4">{l({ ar: 'الجدول الزمني الكامل', en: 'Full Timeline' })}</h3>
        <div className="relative">
          <div className="absolute top-0 bottom-0 start-[18px] w-px bg-muted/60" />
          <div className="space-y-3">
            {events.map((event, i) => {
              const cfg = typeConfig[event.type];
              const isPast = new Date(event.date) < new Date('2026-03-16');
              return (
                <div key={event.id} className={`flex items-start gap-3 ps-0 animate-fade-in ${isPast ? 'opacity-40' : ''}`} style={{ animationDelay: `${i * 30}ms` }}>
                  <div className={`relative z-10 p-1.5 rounded-full ${cfg.bg} border ${cfg.border} shrink-0`}>
                    <cfg.icon size={10} className={cfg.color} />
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[10px] sm:text-xs font-bold text-foreground/80">{l(event.title)}</h4>
                      <span className={`px-1.5 py-0.5 rounded-full text-[7px] ${cfg.bg} ${cfg.color}`}>{l(cfg.label)}</span>
                    </div>
                    <p className="text-[8px] text-muted-foreground/50 mt-0.5">{event.date} {event.time && `• ${event.time}`}</p>
                    <p className="text-[9px] text-muted-foreground/70 mt-1">{l(event.description)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
