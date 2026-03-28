/**
 * Brand Exposure — Track brand visibility across events
 * Glassmorphism design with AI insights
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Monitor, MapPin, Globe, Smartphone, Megaphone, ArrowUpRight, Bot } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const BRANDING_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-branding-JPt8vCtGT7BMWHguRf9mzu.webp';

export default function BrandExposure() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const channels = [
    { icon: Monitor, label: l({ ar: 'شاشات العرض في الفعاليات', en: 'Event Display Screens' }), impressions: '1.8M', growth: '+52%', desc: l({ ar: 'شاشات LED كبيرة في مداخل ومخارج الفعاليات', en: 'Large LED screens at event entrances/exits' }) },
    { icon: Globe, label: l({ ar: 'المنصة الرقمية', en: 'Digital Platform' }), impressions: '2.1M', growth: '+67%', desc: l({ ar: 'موقع مهام إكسبو وتطبيق الجوال', en: 'Maham Expo website and mobile app' }) },
    { icon: MapPin, label: l({ ar: 'خرائط الأجنحة التفاعلية', en: 'Interactive Booth Maps' }), impressions: '890K', growth: '+38%', desc: l({ ar: 'شعارك على خرائط الأجنحة التفاعلية', en: 'Your logo on interactive booth maps' }) },
    { icon: Smartphone, label: l({ ar: 'إشعارات الجوال', en: 'Mobile Notifications' }), impressions: '450K', growth: '+45%', desc: l({ ar: 'إشعارات مخصصة للزوار والتجار', en: 'Targeted notifications to visitors and traders' }) },
    { icon: Megaphone, label: l({ ar: 'وسائل التواصل الاجتماعي', en: 'Social Media' }), impressions: '3.2M', growth: '+78%', desc: l({ ar: 'منشورات وقصص على جميع المنصات', en: 'Posts and stories across all platforms' }) },
    { icon: Eye, label: l({ ar: 'المواد المطبوعة', en: 'Print Materials' }), impressions: '320K', growth: '+15%', desc: l({ ar: 'كتيبات وبطاقات ولافتات', en: 'Brochures, cards, and banners' }) },
  ];

  const sponsorBenefits = [
    { tier: l({ ar: 'بلاتيني', en: 'Platinum' }), benefits: language === 'ar' ? ['شعار رئيسي على جميع المواد', 'كلمة افتتاحية', 'منصة عرض 100م²', 'تغطية إعلامية حصرية', 'حضور VIP 30 شخص', 'تقرير تحليلي مفصل'] : ['Main logo on all materials', 'Opening speech', '100m² booth', 'Exclusive media coverage', '30 VIP passes', 'Detailed analytics report'], color: 'border-gray-400/30' },
    { tier: l({ ar: 'ذهبي', en: 'Gold' }), benefits: language === 'ar' ? ['شعار على المواد الرئيسية', 'منصة عرض 50م²', 'تغطية إعلامية', 'حضور VIP 15 شخص', 'تقرير أداء'] : ['Logo on main materials', '50m² booth', 'Media coverage', '15 VIP passes', 'Performance report'], color: 'border-[#987012]/30' },
    { tier: l({ ar: 'فضي', en: 'Silver' }), benefits: language === 'ar' ? ['شعار على موقع الفعالية', 'منصة عرض 25م²', 'حضور VIP 5 أشخاص', 'تقرير أساسي'] : ['Logo on event website', '25m² booth', '5 VIP passes', 'Basic report'], color: 'border-[#F0EEE7]/20' },
    { tier: l({ ar: 'برونزي', en: 'Bronze' }), benefits: language === 'ar' ? ['شعار على صفحة الفعالية', 'حضور VIP 2', 'ذكر في المنشورات'] : ['Logo on event page', '2 VIP passes', 'Social media mention'], color: 'border-amber-700/20' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'ظهور العلامة التجارية', en: 'Brand Exposure' })}
        subtitle={l({ ar: 'تتبع ظهور علامتك التجارية عبر جميع قنوات الفعاليات', en: 'Track your brand visibility across all event channels' })}
        image={IMAGES.analytics}
      />

      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36 sm:h-44">
        <img src={BRANDING_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181715] via-[#181715]/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
          <h2 className="text-base sm:text-xl font-bold text-white font-['Cairo']">{l({ ar: 'ظهور العلامة التجارية', en: 'Brand Exposure' })}</h2>
          <p className="text-[10px] text-[#A0A0A0]">{l({ ar: 'تتبع ظهور علامتك التجارية عبر جميع قنوات الفعاليات', en: 'Track your brand visibility across all event channels' })}</p>
        </div>
      </div>

      {/* Exposure Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {channels.map((ch, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#987012]/10"><ch.icon size={16} className="text-[#987012]" /></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-foreground">{ch.label}</p>
                <p className="text-[8px] text-muted-foreground/50">{ch.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-foreground">{ch.impressions}</p>
              <span className="flex items-center gap-0.5 text-[10px] text-[#d4b85a] font-medium"><ArrowUpRight size={10} />{ch.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsorship Tiers Benefits */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <h3 className="text-xs font-bold text-foreground mb-4">{l({ ar: 'مزايا حزم الرعاية', en: 'Sponsorship Package Benefits' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {sponsorBenefits.map((pkg, i) => (
            <div key={i} className={`rounded-xl border ${pkg.color} bg-muted/30 overflow-hidden animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="p-2.5 text-center border-b border-border">
                <p className="text-xs font-bold gold-text">{pkg.tier}</p>
              </div>
              <div className="p-3 space-y-1.5">
                {pkg.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[9px] text-muted-foreground/70">
                    <span className="text-[#987012] mt-0.5 shrink-0">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'أعلى قنوات الظهور أداءً: وسائل التواصل الاجتماعي (3.2M مشاهدة، +78%). ننصح بزيادة المحتوى المرئي (فيديو + ريلز) على إنستغرام وتيك توك — البيانات تشير لمعدل تفاعل أعلى 4 أضعاف مقارنة بالمحتوى النصي.', en: 'Top performing channel: Social Media (3.2M impressions, +78%). We recommend increasing visual content (video + reels) on Instagram and TikTok — data shows 4x higher engagement rate compared to text content.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
