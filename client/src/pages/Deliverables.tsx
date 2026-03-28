/**
 * Deliverables — Campaign Deliverables Tracker
 * Track all sponsorship deliverables: logo, screens, stage, media, passes
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CheckCircle, Clock, AlertCircle, Circle, ChevronDown,
  Image, Monitor, Megaphone, Ticket, Coffee, Flag,
  Camera, FileText, Users, Star, Bot, ArrowUpRight
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface Deliverable {
  id: string;
  category: { ar: string; en: string };
  icon: any;
  items: {
    name: { ar: string; en: string };
    status: 'completed' | 'in-progress' | 'pending' | 'not-started';
    date?: string;
    note?: { ar: string; en: string };
  }[];
}

const deliverables: Deliverable[] = [
  {
    id: 'branding', category: { ar: 'أصول العلامة التجارية', en: 'Brand Assets' }, icon: Image,
    items: [
      { name: { ar: 'الشعار الرئيسي — تم الاعتماد', en: 'Primary Logo — Approved' }, status: 'completed', date: '2026-02-15' },
      { name: { ar: 'الشعار الأبيض — تم الاعتماد', en: 'White Logo — Approved' }, status: 'completed', date: '2026-02-15' },
      { name: { ar: 'دليل العلامة التجارية — تم الاعتماد', en: 'Brand Guidelines — Approved' }, status: 'completed', date: '2026-02-16' },
      { name: { ar: 'تصميم اللافتات المعلقة — مطلوب', en: 'Hanging Banner Design — Required' }, status: 'not-started', note: { ar: 'الموعد النهائي: 15 مارس 2026', en: 'Deadline: March 15, 2026' } },
      { name: { ar: 'تصميم الملصقات الأرضية — مطلوب', en: 'Floor Sticker Design — Required' }, status: 'not-started', note: { ar: 'الموعد النهائي: 15 مارس 2026', en: 'Deadline: March 15, 2026' } },
    ],
  },
  {
    id: 'screens', category: { ar: 'الشاشات والوسائط الرقمية', en: 'Screens & Digital Media' }, icon: Monitor,
    items: [
      { name: { ar: 'فيديو المسرح (30 ثانية) — قيد المراجعة', en: 'Stage Video (30 sec) — Under Review' }, status: 'in-progress', date: '2026-02-20' },
      { name: { ar: 'إعلان الشاشات LED — قيد المراجعة', en: 'LED Screen Ad — Under Review' }, status: 'in-progress', date: '2026-02-20' },
      { name: { ar: 'تثبيت الشاشات في الموقع', en: 'Screen Installation On-site' }, status: 'pending', note: { ar: 'سيتم قبل الفعالية بيومين', en: 'Will be done 2 days before event' } },
      { name: { ar: 'اختبار المحتوى على الشاشات', en: 'Content Testing on Screens' }, status: 'pending' },
    ],
  },
  {
    id: 'stage', category: { ar: 'المسرح والكلمات', en: 'Stage & Speeches' }, icon: Megaphone,
    items: [
      { name: { ar: 'تأكيد موعد الكلمة الافتتاحية', en: 'Opening Speech Slot Confirmed' }, status: 'completed', date: '2026-02-10' },
      { name: { ar: 'إرسال محتوى الكلمة للمراجعة', en: 'Speech Content Submitted for Review' }, status: 'in-progress' },
      { name: { ar: 'ذكر الراعي في كل جلسة', en: 'Sponsor Mention in Every Session' }, status: 'pending' },
      { name: { ar: 'شعار على شاشات المسرح', en: 'Logo on Stage Screens' }, status: 'pending' },
    ],
  },
  {
    id: 'physical', category: { ar: 'الأصول المادية', en: 'Physical Assets' }, icon: Flag,
    items: [
      { name: { ar: 'طباعة جدار التسجيل', en: 'Registration Wall Print' }, status: 'pending' },
      { name: { ar: 'تركيب اللافتات المعلقة', en: 'Hanging Banners Installation' }, status: 'not-started' },
      { name: { ar: 'لصق الملصقات الأرضية', en: 'Floor Stickers Application' }, status: 'not-started' },
      { name: { ar: 'برانديد البوابات', en: 'Gate Branding' }, status: 'pending' },
      { name: { ar: 'تجهيز صالة VIP', en: 'VIP Lounge Setup' }, status: 'not-started' },
      { name: { ar: 'تجهيز الأكشاك التفاعلية', en: 'Activation Booths Setup' }, status: 'not-started' },
    ],
  },
  {
    id: 'hospitality', category: { ar: 'الضيافة والتذاكر', en: 'Hospitality & Passes' }, icon: Ticket,
    items: [
      { name: { ar: 'إصدار 20 تذكرة VIP', en: 'Issue 20 VIP Passes' }, status: 'completed', date: '2026-02-25' },
      { name: { ar: 'تخصيص مقاعد VIP أمامية', en: 'Assign Front VIP Seating' }, status: 'in-progress' },
      { name: { ar: 'برانديد منطقة القهوة', en: 'Coffee Zone Branding' }, status: 'not-started' },
      { name: { ar: 'شعار على الأكواب', en: 'Logo on Cups' }, status: 'not-started' },
    ],
  },
  {
    id: 'media', category: { ar: 'الإعلام والتغطية', en: 'Media & Coverage' }, icon: Camera,
    items: [
      { name: { ar: 'ذكر في البيان الصحفي', en: 'Press Release Mention' }, status: 'completed', date: '2026-02-12' },
      { name: { ar: 'نشر على حسابات التواصل', en: 'Social Media Post' }, status: 'in-progress' },
      { name: { ar: 'شعار على الموقع الرسمي للفعالية', en: 'Logo on Event Website' }, status: 'completed', date: '2026-02-14' },
      { name: { ar: 'ظهور في بوابة التاجر', en: 'Visibility in Trader Portal' }, status: 'pending' },
      { name: { ar: 'تقرير ما بعد الفعالية', en: 'Post-Event Report' }, status: 'not-started' },
    ],
  },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-[#d4b85a]', bg: 'bg-[#fbf8f0]0/10', label: { ar: 'مكتمل', en: 'Completed' } },
  'in-progress': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: { ar: 'جاري التنفيذ', en: 'In Progress' } },
  pending: { icon: Circle, color: 'text-blue-400', bg: 'bg-blue-500/10', label: { ar: 'قيد الانتظار', en: 'Pending' } },
  'not-started': { icon: Circle, color: 'text-foreground/20', bg: 'bg-muted/50', label: { ar: 'لم يبدأ', en: 'Not Started' } },
};

export default function Deliverables() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [expanded, setExpanded] = useState<string[]>(deliverables.map(d => d.id));

  const totalItems = deliverables.reduce((s, d) => s + d.items.length, 0);
  const completedItems = deliverables.reduce((s, d) => s + d.items.filter(i => i.status === 'completed').length, 0);
  const progress = Math.round((completedItems / totalItems) * 100);

  const toggle = (id: string) => setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'تتبع التسليمات', en: 'Deliverables Tracking' })}
        subtitle={l({ ar: 'تابع حالة تسليمات الرعاية', en: 'Track sponsorship deliverable status' })}
        image={IMAGES.reportSuccess}
      />


      {/* Overall Progress */}
      <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">{l({ ar: 'التقدم الإجمالي', en: 'Overall Progress' })}</h3>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">{completedItems} {l({ ar: 'من', en: 'of' })} {totalItems} {l({ ar: 'تسليم مكتمل', en: 'deliverables completed' })}</p>
          </div>
          <span className="text-2xl font-bold gold-text">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full rounded-full gold-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = deliverables.reduce((s, d) => s + d.items.filter(i => i.status === key).length, 0);
            return (
              <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <cfg.icon size={12} className={cfg.color} />
                <span className="text-[9px] text-muted-foreground/70">{l(cfg.label)}</span>
                <span className={`text-[10px] font-bold ${cfg.color} ms-auto`}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverable Categories */}
      <div className="space-y-2 sm:space-y-3">
        {deliverables.map((del, di) => {
          const catCompleted = del.items.filter(i => i.status === 'completed').length;
          const catProgress = Math.round((catCompleted / del.items.length) * 100);
          const isExpanded = expanded.includes(del.id);

          return (
            <div key={del.id} className="glass-card rounded-xl overflow-hidden tilt-card animate-fade-in" style={{ animationDelay: `${di * 50}ms` }}>
              <button onClick={() => toggle(del.id)} className="w-full p-3 sm:p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                <div className="p-2 rounded-lg bg-[#987012]/10 border border-[#987012]/20">
                  <del.icon size={16} className="text-[#987012]" />
                </div>
                <div className="flex-1 text-start">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">{l(del.category)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-muted/50 max-w-[120px]">
                      <div className="h-full rounded-full gold-gradient" style={{ width: `${catProgress}%` }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground/50">{catCompleted}/{del.items.length}</span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-muted-foreground/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="border-t border-border p-3 sm:p-4 space-y-1.5 animate-fade-in">
                  {del.items.map((item, ii) => {
                    const cfg = statusConfig[item.status];
                    return (
                      <div key={ii} className="flex items-start gap-2.5 py-1.5">
                        <cfg.icon size={14} className={`${cfg.color} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <p className={`text-[10px] sm:text-xs ${item.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}>{l(item.name)}</p>
                          {item.date && <p className="text-[8px] text-foreground/20 mt-0.5">{item.date}</p>}
                          {item.note && <p className="text-[8px] text-[#987012]/60 mt-0.5">{l(item.note)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Summary */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'ملخص Maham AI', en: 'Maham AI Summary' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'تقدمك جيد! لديك 3 ملفات مطلوب رفعها قبل 15 مارس. أنصحك بالبدء بتصميم اللافتات المعلقة أولاً لأنها تحتاج وقت طباعة أطول. تذكر أن تصميم الكشك يحتاج إعادة رفع بدقة أعلى.', en: 'Good progress! You have 3 files required before March 15. I recommend starting with hanging banner design first as it needs longer print time. Remember the booth design needs re-upload at higher resolution.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
