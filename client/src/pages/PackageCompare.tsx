/**
 * PackageCompare — Sponsorship Package Comparison Tool
 * Compare packages side-by-side with deliverables, pricing, and AI recommendations
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Crown, Trophy, Medal, Award, Star, CheckCircle, X, Bot,
  Users, Eye, Megaphone, Coffee, Monitor, Ticket, Camera,
  DollarSign, Zap, ArrowUpRight, Sparkles, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface SponsorPackage {
  id: string;
  tier: string;
  name: { ar: string; en: string };
  price: number;
  icon: any;
  color: string;
  bg: string;
  border: string;
  description: { ar: string; en: string };
  visibility: number;
  reach: string;
  eventFit: number;
  features: { name: { ar: string; en: string }; included: boolean; detail?: { ar: string; en: string } }[];
}

const packages: SponsorPackage[] = [
  {
    id: 'platinum', tier: 'Platinum', name: { ar: 'الراعي البلاتيني', en: 'Platinum Sponsor' },
    price: 300000, icon: Crown, color: 'text-gray-200', bg: 'bg-gradient-to-br from-gray-300/20 to-[#F9F8F5]0/10', border: 'border-[#F0EEE7]/30',
    description: { ar: 'أعلى مستوى من الظهور والحصرية — حضور مهيمن في كل نقطة اتصال', en: 'Highest level of visibility and exclusivity — dominant presence at every touchpoint' },
    visibility: 98, reach: '170,000+', eventFit: 95,
    features: [
      { name: { ar: 'شعار على المدخل الرئيسي', en: 'Logo on Main Entrance' }, included: true, detail: { ar: 'شاشة LED 12x4m', en: 'LED Screen 12x4m' } },
      { name: { ar: 'رعاية المسرح الرئيسي', en: 'Main Stage Sponsorship' }, included: true, detail: { ar: 'شعار + ذكر في كل جلسة', en: 'Logo + mention in every session' } },
      { name: { ar: 'صالة VIP حصرية', en: 'Exclusive VIP Lounge' }, included: true, detail: { ar: 'برانديد كامل + ضيافة', en: 'Full branding + hospitality' } },
      { name: { ar: '8 شاشات LED داخلية', en: '8 Indoor LED Screens' }, included: true },
      { name: { ar: '4 لافتات معلقة', en: '4 Hanging Banners' }, included: true },
      { name: { ar: 'كشكين تفاعليين', en: '2 Activation Booths' }, included: true },
      { name: { ar: 'جدار التسجيل', en: 'Registration Wall' }, included: true },
      { name: { ar: 'رعاية البوابات', en: 'Gate Sponsorship' }, included: true },
      { name: { ar: 'ملصقات أرضية (10)', en: 'Floor Stickers (10)' }, included: true },
      { name: { ar: 'رعاية منطقة القهوة', en: 'Coffee Zone Sponsorship' }, included: true },
      { name: { ar: 'كلمة افتتاحية', en: 'Opening Speech' }, included: true },
      { name: { ar: '20 تذكرة VIP', en: '20 VIP Passes' }, included: true },
      { name: { ar: 'تقرير عملاء محتملين', en: 'Lead Generation Report' }, included: true },
      { name: { ar: 'ذكر إعلامي (صحافة + سوشال)', en: 'Media Mention (Press + Social)' }, included: true },
      { name: { ar: 'حصرية القطاع', en: 'Category Exclusivity' }, included: true },
      { name: { ar: 'ظهور في بوابة التاجر', en: 'Visibility in Trader Portal' }, included: true },
    ],
  },
  {
    id: 'gold', tier: 'Gold', name: { ar: 'الراعي الذهبي', en: 'Gold Sponsor' },
    price: 150000, icon: Trophy, color: 'text-[#987012]', bg: 'bg-gradient-to-br from-[#987012]/20 to-[#987012]/5', border: 'border-[#987012]/30',
    description: { ar: 'ظهور قوي ومتعدد القنوات — توازن مثالي بين التكلفة والعائد', en: 'Strong multi-channel visibility — perfect balance between cost and return' },
    visibility: 80, reach: '120,000+', eventFit: 88,
    features: [
      { name: { ar: 'شعار على المدخل الرئيسي', en: 'Logo on Main Entrance' }, included: true, detail: { ar: 'شعار ثانوي', en: 'Secondary logo' } },
      { name: { ar: 'رعاية المسرح الرئيسي', en: 'Main Stage Sponsorship' }, included: false },
      { name: { ar: 'صالة VIP حصرية', en: 'Exclusive VIP Lounge' }, included: false },
      { name: { ar: '4 شاشات LED داخلية', en: '4 Indoor LED Screens' }, included: true },
      { name: { ar: '2 لافتات معلقة', en: '2 Hanging Banners' }, included: true },
      { name: { ar: 'كشك تفاعلي واحد', en: '1 Activation Booth' }, included: true },
      { name: { ar: 'جدار التسجيل', en: 'Registration Wall' }, included: true, detail: { ar: 'شعار ثانوي', en: 'Secondary logo' } },
      { name: { ar: 'رعاية البوابات', en: 'Gate Sponsorship' }, included: false },
      { name: { ar: 'ملصقات أرضية (5)', en: 'Floor Stickers (5)' }, included: true },
      { name: { ar: 'رعاية منطقة القهوة', en: 'Coffee Zone Sponsorship' }, included: false },
      { name: { ar: 'كلمة افتتاحية', en: 'Opening Speech' }, included: false },
      { name: { ar: '10 تذاكر VIP', en: '10 VIP Passes' }, included: true },
      { name: { ar: 'تقرير عملاء محتملين', en: 'Lead Generation Report' }, included: true },
      { name: { ar: 'ذكر إعلامي (سوشال فقط)', en: 'Media Mention (Social Only)' }, included: true },
      { name: { ar: 'حصرية القطاع', en: 'Category Exclusivity' }, included: false },
      { name: { ar: 'ظهور في بوابة التاجر', en: 'Visibility in Trader Portal' }, included: true },
    ],
  },
  {
    id: 'silver', tier: 'Silver', name: { ar: 'الراعي الفضي', en: 'Silver Sponsor' },
    price: 70000, icon: Medal, color: 'text-[#919187]', bg: 'bg-gradient-to-br from-gray-400/15 to-[#F9F8F5]0/5', border: 'border-gray-400/20',
    description: { ar: 'ظهور أساسي مع فرص تفعيل — نقطة دخول ممتازة للرعاية', en: 'Essential visibility with activation opportunities — excellent sponsorship entry point' },
    visibility: 55, reach: '60,000+', eventFit: 72,
    features: [
      { name: { ar: 'شعار على المدخل الرئيسي', en: 'Logo on Main Entrance' }, included: false },
      { name: { ar: 'رعاية المسرح الرئيسي', en: 'Main Stage Sponsorship' }, included: false },
      { name: { ar: 'صالة VIP حصرية', en: 'Exclusive VIP Lounge' }, included: false },
      { name: { ar: '2 شاشات LED داخلية', en: '2 Indoor LED Screens' }, included: true },
      { name: { ar: 'لافتة معلقة واحدة', en: '1 Hanging Banner' }, included: true },
      { name: { ar: 'كشك تفاعلي واحد', en: '1 Activation Booth' }, included: false },
      { name: { ar: 'جدار التسجيل', en: 'Registration Wall' }, included: false },
      { name: { ar: 'رعاية البوابات', en: 'Gate Sponsorship' }, included: false },
      { name: { ar: 'ملصقات أرضية (3)', en: 'Floor Stickers (3)' }, included: true },
      { name: { ar: 'رعاية منطقة القهوة', en: 'Coffee Zone Sponsorship' }, included: false },
      { name: { ar: 'كلمة افتتاحية', en: 'Opening Speech' }, included: false },
      { name: { ar: '5 تذاكر VIP', en: '5 VIP Passes' }, included: true },
      { name: { ar: 'تقرير عملاء محتملين', en: 'Lead Generation Report' }, included: true },
      { name: { ar: 'ذكر إعلامي', en: 'Media Mention' }, included: false },
      { name: { ar: 'حصرية القطاع', en: 'Category Exclusivity' }, included: false },
      { name: { ar: 'ظهور في بوابة التاجر', en: 'Visibility in Trader Portal' }, included: true },
    ],
  },
];

export default function PackageCompare() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [selected, setSelected] = useState<string[]>(['platinum', 'gold', 'silver']);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'مقارنة الحزم', en: 'Package Comparison' })}
        subtitle={l({ ar: 'قارن بين حزم الرعاية المتاحة', en: 'Compare available sponsorship packages' })}
        image={IMAGES.expoHall}
      />


      {/* AI Recommendation Banner */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Bot size={16} className="text-blue-400" /></div>
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'توصية Maham AI لعلامتك', en: 'Maham AI Recommendation for Your Brand' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'بناءً على قطاعك (التقنية) وميزانيتك وأهدافك، نوصي بحزمة الراعي الذهبي مع إضافة رعاية المسرح الرئيسي — هذا المزيج يوفر أفضل عائد استثمار بنسبة 280% مع ظهور قوي متعدد القنوات.', en: 'Based on your sector (Technology), budget, and goals, we recommend the Gold Sponsor package with Main Stage add-on — this combination provides the best ROI at 280% with strong multi-channel visibility.' })}</p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[700px]">
          {/* Package Headers */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3"></div>
            {packages.map(pkg => (
              <div key={pkg.id} className={`glass-card rounded-xl p-4 text-center ${pkg.border} ${pkg.id === 'gold' ? 'ring-1 ring-[#987012]/30 relative' : ''}`}>
                {pkg.id === 'gold' && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#fbf8f0]0 text-white">{l({ ar: 'الأكثر شعبية', en: 'Most Popular' })}</div>
                )}
                <pkg.icon size={24} className={`${pkg.color} mx-auto mb-2`} />
                <h3 className={`text-sm font-bold ${pkg.color}`}>{l(pkg.name)}</h3>
                <p className="text-[9px] text-muted-foreground/50 mt-1 leading-relaxed">{l(pkg.description)}</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xl font-bold gold-text">{pkg.price.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'ر.س / فعالية', en: 'SAR / event' })}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Row */}
          <div className="glass-card animate-border-glow rounded-xl p-3 mb-3">
            <div className="grid grid-cols-4 gap-3 items-center">
              <span className="text-[10px] font-bold text-muted-foreground">{l({ ar: 'المقاييس', en: 'Metrics' })}</span>
              {packages.map(pkg => (
                <div key={pkg.id} className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] text-muted-foreground/50">{l({ ar: 'الظهور', en: 'Visibility' })}</span>
                      <span className="text-[8px] text-[#987012]">{pkg.visibility}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted/50"><div className="h-full rounded-full gold-gradient" style={{ width: `${pkg.visibility}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-muted-foreground/50">{l({ ar: 'الوصول', en: 'Reach' })}</span>
                    <span className="text-[9px] text-muted-foreground">{pkg.reach}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Comparison */}
          {packages[0].features.map((feature, fi) => (
            <div key={fi} className={`grid grid-cols-4 gap-3 py-2.5 px-3 ${fi % 2 === 0 ? 'bg-muted/30 rounded-lg' : ''}`}>
              <span className="text-[10px] text-muted-foreground flex items-center">{l(feature.name)}</span>
              {packages.map(pkg => {
                const f = pkg.features[fi];
                return (
                  <div key={pkg.id} className="flex items-center justify-center">
                    {f.included ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-[#d4b85a]" />
                        {f.detail && <span className="text-[8px] text-muted-foreground/50">{l(f.detail)}</span>}
                      </div>
                    ) : (
                      <X size={12} className="text-foreground/15" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* CTA Row */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div></div>
            {packages.map(pkg => (
              <button key={pkg.id} onClick={() => toast.success(l({ ar: `تم اختيار حزمة ${l(pkg.name)}`, en: `${l(pkg.name)} package selected` }))} className={`py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${pkg.id === 'gold' ? 'bg-[#fbf8f0]0 text-white hover:shadow-[0_0_20px_rgba(152,112,18,0.3)]' : 'border border-border text-muted-foreground hover:border-[#987012]/30 hover:text-[#987012]'}`}>
                {l({ ar: 'اختر هذه الحزمة', en: 'Choose Package' })}
                <ArrowUpRight size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
