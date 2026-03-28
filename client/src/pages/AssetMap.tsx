/**
 * AssetMap — Interactive Sponsorship Asset Map
 * Premium venue map with clickable sponsorship assets, color states, and detail panels
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MapPin, Eye, DollarSign, Users, Clock, CheckCircle, X,
  Maximize2, ZoomIn, ZoomOut, Layers, Bot, Star, ArrowUpRight,
  Monitor, Megaphone, Coffee, Crown, Ticket, Camera, Flag
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

type AssetStatus = 'available' | 'on-hold' | 'booked' | 'ai-recommended' | 'premium';

interface SponsorAsset {
  id: string;
  name: { ar: string; en: string };
  type: { ar: string; en: string };
  location: { ar: string; en: string };
  status: AssetStatus;
  price: number;
  dimensions: string;
  exposure: string;
  footfall: string;
  duration: { ar: string; en: string };
  media: { ar: string; en: string };
  deliverables: { ar: string[]; en: string[] };
  x: number; y: number; w: number; h: number;
}

const assets: SponsorAsset[] = [
  { id: 'A1', name: { ar: 'شاشة المدخل الرئيسي', en: 'Main Entrance Screen' }, type: { ar: 'شاشة LED', en: 'LED Screen' }, location: { ar: 'البوابة الرئيسية', en: 'Main Gate' }, status: 'premium', price: 150000, dimensions: '12m x 4m', exposure: '95%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'فيديو + صور ثابتة', en: 'Video + Static Images' }, deliverables: { ar: ['عرض شعار على الشاشة', 'فيديو 30 ثانية كل 5 دقائق', 'إضاءة ذهبية مخصصة'], en: ['Logo display on screen', '30-sec video every 5 min', 'Custom gold lighting'] }, x: 45, y: 5, w: 10, h: 8 },
  { id: 'A2', name: { ar: 'جدار التسجيل', en: 'Registration Wall' }, type: { ar: 'جدار برانديد', en: 'Branded Wall' }, location: { ar: 'منطقة التسجيل', en: 'Registration Zone' }, status: 'available', price: 80000, dimensions: '8m x 3m', exposure: '90%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'طباعة عالية الجودة', en: 'High-quality print' }, deliverables: { ar: ['شعار على جدار التسجيل', 'خلفية صور الزوار', 'ذكر في البث المباشر'], en: ['Logo on registration wall', 'Visitor photo backdrop', 'Live stream mention'] }, x: 30, y: 15, w: 12, h: 6 },
  { id: 'A3', name: { ar: 'رعاية المسرح الرئيسي', en: 'Main Stage Sponsorship' }, type: { ar: 'رعاية مسرح', en: 'Stage Sponsorship' }, location: { ar: 'المسرح الرئيسي', en: 'Main Stage' }, status: 'ai-recommended', price: 250000, dimensions: '20m x 10m', exposure: '85%', footfall: '50,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'شاشات + لافتات + ذكر صوتي', en: 'Screens + Banners + Audio mention' }, deliverables: { ar: ['شعار على شاشات المسرح', 'ذكر في كل جلسة', 'مقعد VIP أمامي', 'فرصة كلمة افتتاحية'], en: ['Logo on stage screens', 'Mention in every session', 'Front VIP seating', 'Opening speech opportunity'] }, x: 35, y: 35, w: 18, h: 12 },
  { id: 'A4', name: { ar: 'صالة VIP', en: 'VIP Lounge' }, type: { ar: 'صالة حصرية', en: 'Exclusive Lounge' }, location: { ar: 'الطابق العلوي', en: 'Upper Floor' }, status: 'available', price: 200000, dimensions: '15m x 10m', exposure: '40%', footfall: '5,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'برانديد كامل + شاشات', en: 'Full branding + Screens' }, deliverables: { ar: ['برانديد كامل للصالة', 'شاشات داخلية', 'قائمة ضيافة مخصصة', 'تواصل مباشر مع VIPs'], en: ['Full lounge branding', 'Internal screens', 'Custom hospitality menu', 'Direct VIP networking'] }, x: 70, y: 20, w: 14, h: 10 },
  { id: 'A5', name: { ar: 'لافتات معلقة', en: 'Hanging Banners' }, type: { ar: 'لافتات', en: 'Banners' }, location: { ar: 'السقف - الممرات الرئيسية', en: 'Ceiling - Main Corridors' }, status: 'available', price: 45000, dimensions: '3m x 6m (x4)', exposure: '80%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'طباعة قماش عالية الجودة', en: 'High-quality fabric print' }, deliverables: { ar: ['4 لافتات معلقة', 'مواقع استراتيجية', 'رؤية 360 درجة'], en: ['4 hanging banners', 'Strategic locations', '360° visibility'] }, x: 15, y: 50, w: 8, h: 6 },
  { id: 'A6', name: { ar: 'أكشاك تفاعلية', en: 'Activation Booths' }, type: { ar: 'أكشاك', en: 'Booths' }, location: { ar: 'منطقة التفعيل', en: 'Activation Zone' }, status: 'booked', price: 120000, dimensions: '6m x 4m (x2)', exposure: '60%', footfall: '30,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'تجربة تفاعلية كاملة', en: 'Full interactive experience' }, deliverables: { ar: ['كشكين تفاعليين', 'فريق دعم', 'جمع بيانات العملاء', 'توزيع عينات'], en: ['2 activation booths', 'Support team', 'Lead capture', 'Sample distribution'] }, x: 55, y: 55, w: 10, h: 8 },
  { id: 'A7', name: { ar: 'شاشات LED داخلية', en: 'Indoor LED Screens' }, type: { ar: 'شاشات رقمية', en: 'Digital Screens' }, location: { ar: 'الممرات والقاعات', en: 'Corridors & Halls' }, status: 'available', price: 60000, dimensions: '55" x 8 شاشات', exposure: '75%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'فيديو + صور + رسوم متحركة', en: 'Video + Images + Animation' }, deliverables: { ar: ['8 شاشات موزعة', 'عرض 15 ثانية كل 3 دقائق', 'محتوى ديناميكي'], en: ['8 distributed screens', '15-sec display every 3 min', 'Dynamic content'] }, x: 25, y: 65, w: 12, h: 6 },
  { id: 'A8', name: { ar: 'رعاية البوابات', en: 'Gate Sponsorship' }, type: { ar: 'بوابات برانديد', en: 'Branded Gates' }, location: { ar: 'جميع البوابات', en: 'All Gates' }, status: 'on-hold', price: 90000, dimensions: '4m x 3m (x3)', exposure: '95%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'طباعة + إضاءة', en: 'Print + Lighting' }, deliverables: { ar: ['3 بوابات مبرندة', 'إضاءة مخصصة', 'شعار على التذاكر'], en: ['3 branded gates', 'Custom lighting', 'Logo on tickets'] }, x: 5, y: 30, w: 8, h: 8 },
  { id: 'A9', name: { ar: 'ملصقات أرضية', en: 'Floor Stickers' }, type: { ar: 'ملصقات', en: 'Stickers' }, location: { ar: 'الممرات الرئيسية', en: 'Main Corridors' }, status: 'available', price: 25000, dimensions: '2m x 2m (x10)', exposure: '70%', footfall: '170,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'طباعة مقاومة للمشي', en: 'Walk-resistant print' }, deliverables: { ar: ['10 ملصقات أرضية', 'مواقع ممرات رئيسية', 'توجيه الزوار لكشكك'], en: ['10 floor stickers', 'Main corridor locations', 'Direct visitors to your booth'] }, x: 40, y: 70, w: 10, h: 5 },
  { id: 'A10', name: { ar: 'رعاية منطقة القهوة', en: 'Coffee Zone Sponsorship' }, type: { ar: 'منطقة ضيافة', en: 'Hospitality Zone' }, location: { ar: 'منطقة الاستراحة', en: 'Break Area' }, status: 'available', price: 75000, dimensions: '8m x 6m', exposure: '50%', footfall: '80,000+', duration: { ar: '4 أيام', en: '4 days' }, media: { ar: 'برانديد + أكواب + قوائم', en: 'Branding + Cups + Menus' }, deliverables: { ar: ['برانديد كامل للمنطقة', 'شعار على الأكواب', 'قائمة مخصصة', 'شاشة عرض'], en: ['Full zone branding', 'Logo on cups', 'Custom menu', 'Display screen'] }, x: 75, y: 50, w: 10, h: 8 },
];

const statusConfig: Record<AssetStatus, { color: string; bg: string; border: string; label: { ar: string; en: string } }> = {
  'available': { color: 'text-[#d4b85a]', bg: 'bg-[#fbf8f0]0/20', border: 'border-[#fbf8f0]0/40', label: { ar: 'متاح', en: 'Available' } },
  'on-hold': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', label: { ar: 'محجوز مؤقتاً', en: 'On Hold' } },
  'booked': { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40', label: { ar: 'محجوز', en: 'Booked' } },
  'ai-recommended': { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', label: { ar: 'موصى به AI', en: 'AI Recommended' } },
  'premium': { color: 'text-[#987012]', bg: 'bg-[#987012]/20', border: 'border-[#987012]/40', label: { ar: 'بريميوم', en: 'Premium' } },
};

export default function AssetMap() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [selectedAsset, setSelectedAsset] = useState<SponsorAsset | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all');

  const filteredAssets = filterStatus === 'all' ? assets : assets.filter(a => a.status === filterStatus);

  const handleReserve = (asset: SponsorAsset) => {
    if (asset.status === 'booked') {
      toast.error(l({ ar: 'هذا الأصل محجوز بالفعل', en: 'This asset is already booked' }));
      return;
    }
    toast.success(l({ ar: `تم حجز "${l(asset.name)}" مؤقتاً لمدة 30 دقيقة`, en: `"${l(asset.name)}" temporarily reserved for 30 minutes` }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'خريطة أصول الرعاية التفاعلية', en: 'Interactive Sponsorship Asset Map' })}
        subtitle={l({ ar: 'استكشف مواقع الرعاية التفاعلية', en: 'Explore interactive sponsorship locations' })}
        image={IMAGES.expoHall}
      />

      {/* Zoom Controls */}
      <div className="flex justify-end items-center gap-2">
        <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="p-2 rounded-lg glass-card hover:border-[#987012]/20 transition-colors btn-ripple"><ZoomIn size={14} className="text-muted-foreground" /></button>
        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.6))} className="p-2 rounded-lg glass-card hover:border-[#987012]/20 transition-colors btn-ripple"><ZoomOut size={14} className="text-muted-foreground" /></button>
        <span className="text-[10px] text-muted-foreground/70">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Legend */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{l({ ar: 'حالة الأصول:', en: 'Asset Status:' })}</span>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterStatus(filterStatus === key ? 'all' : key as AssetStatus)} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] sm:text-[10px] border transition-colors ${filterStatus === key ? cfg.border + ' ' + cfg.bg : 'border-border hover:border-border'}`}>
              <div className={`w-2 h-2 rounded-full ${cfg.bg}`} />
              <span className={filterStatus === key ? cfg.color : 'text-muted-foreground'}>{l(cfg.label)}</span>
            </button>
          ))}
          {filterStatus !== 'all' && (
            <button onClick={() => setFilterStatus('all')} className="text-[9px] text-[#987012] hover:underline">{l({ ar: 'عرض الكل', en: 'Show All' })}</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-2 glass-card rounded-xl p-3 sm:p-4 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '75%', transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            {/* Venue Background */}
            <div className="absolute inset-0 rounded-lg border border-border bg-[#0a0c12]">
              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d4a832" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Venue Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] text-muted-foreground/50 font-medium">{l({ ar: 'البوابة الرئيسية', en: 'MAIN ENTRANCE' })}</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] text-muted-foreground/50 font-medium">{l({ ar: 'البوابة الخلفية', en: 'REAR ENTRANCE' })}</div>
              <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[8px] sm:text-[10px] text-muted-foreground/50 font-medium writing-vertical-lr" style={{ writingMode: 'vertical-lr' }}>{l({ ar: 'البوابة الغربية', en: 'WEST GATE' })}</div>
              <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[8px] sm:text-[10px] text-muted-foreground/50 font-medium writing-vertical-lr" style={{ writingMode: 'vertical-lr' }}>{l({ ar: 'البوابة الشرقية', en: 'EAST GATE' })}</div>

              {/* Asset Blocks */}
              {filteredAssets.map(asset => {
                const cfg = statusConfig[asset.status];
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`absolute rounded-md border-2 ${cfg.border} ${cfg.bg} transition-all duration-300 hover:scale-105 hover:z-10 group cursor-pointer flex items-center justify-center ${selectedAsset?.id === asset.id ? 'ring-2 ring-[#987012] z-20' : ''}`}
                    style={{ left: `${asset.x}%`, top: `${asset.y}%`, width: `${asset.w}%`, height: `${asset.h}%` }}
                    title={l(asset.name)}
                  >
                    <span className={`text-[6px] sm:text-[8px] font-bold ${cfg.color} text-center leading-tight px-0.5`}>{l(asset.name)}</span>
                  </button>
                );
              })}

              {/* Visitor Flow Arrows */}
              <div className="absolute top-[12%] left-[50%] w-0.5 h-[15%] bg-gradient-to-b from-[#987012]/30 to-transparent" />
              <div className="absolute top-[30%] left-[20%] w-[15%] h-0.5 bg-gradient-to-r from-[#987012]/20 to-transparent" />
              <div className="absolute top-[30%] right-[20%] w-[15%] h-0.5 bg-gradient-to-l from-[#987012]/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="space-y-3">
          {selectedAsset ? (
            <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${statusConfig[selectedAsset.status].bg} ${statusConfig[selectedAsset.status].color} border ${statusConfig[selectedAsset.status].border} mb-2`}>
                    {l(statusConfig[selectedAsset.status].label)}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">{l(selectedAsset.name)}</h3>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{l(selectedAsset.type)}</p>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-1 rounded-lg hover:bg-muted/50"><X size={14} className="text-muted-foreground/50" /></button>
              </div>

              <div className="space-y-2 mb-4">
                {[
                  { icon: MapPin, label: { ar: 'الموقع', en: 'Location' }, value: l(selectedAsset.location) },
                  { icon: Maximize2, label: { ar: 'الأبعاد', en: 'Dimensions' }, value: selectedAsset.dimensions },
                  { icon: Eye, label: { ar: 'نسبة الظهور', en: 'Exposure' }, value: selectedAsset.exposure },
                  { icon: Users, label: { ar: 'حركة الزوار', en: 'Footfall' }, value: selectedAsset.footfall },
                  { icon: Clock, label: { ar: 'المدة', en: 'Duration' }, value: l(selectedAsset.duration) },
                  { icon: Camera, label: { ar: 'الوسائط', en: 'Media' }, value: l(selectedAsset.media) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                    <item.icon size={12} className="text-[#987012]/60 shrink-0" />
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground/70 w-16 shrink-0">{l(item.label)}</span>
                    <span className="text-[9px] sm:text-[10px] text-foreground/80">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h4 className="text-[10px] sm:text-xs font-bold text-muted-foreground mb-2">{l({ ar: 'المخرجات المضمنة', en: 'Included Deliverables' })}</h4>
                <div className="space-y-1">
                  {l(selectedAsset.deliverables).map((d: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-[#d4b85a] shrink-0" />
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#987012]/5 border border-[#987012]/10 mb-4">
                <p className="text-[9px] text-muted-foreground/70">{l({ ar: 'السعر', en: 'Price' })}</p>
                <p className="text-lg font-bold gold-text">{selectedAsset.price.toLocaleString()} <span className="text-xs">{l({ ar: 'ر.س', en: 'SAR' })}</span></p>
                <p className="text-[8px] text-muted-foreground/50 mt-0.5">{l({ ar: 'شامل ضريبة القيمة المضافة 15%', en: 'Including 15% VAT' })}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleReserve(selectedAsset)} disabled={selectedAsset.status === 'booked'} className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${selectedAsset.status === 'booked' ? 'bg-muted/50 text-foreground/20 cursor-not-allowed' : 'bg-[#fbf8f0]0 text-white hover:shadow-[0_0_15px_rgba(152,112,18,0.2)]'}`}>
                  <Clock size={12} />
                  {l({ ar: 'احجز مؤقتاً', en: 'Reserve' })}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card animate-border-glow rounded-xl p-6 sm:p-8 text-center">
              <Layers size={32} className="text-foreground/15 mx-auto mb-3" />
              <p className="text-xs text-muted-foreground/70">{l({ ar: 'اختر أصل رعاية من الخريطة لعرض التفاصيل', en: 'Select a sponsorship asset from the map to view details' })}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
            <h4 className="text-xs font-bold text-muted-foreground mb-3">{l({ ar: 'ملخص الأصول', en: 'Assets Summary' })}</h4>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const count = assets.filter(a => a.status === key).length;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                      <span className="text-[10px] text-muted-foreground">{l(cfg.label)}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${cfg.color}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400">{l({ ar: 'توصية Maham AI', en: 'Maham AI Recommendation' })}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'بناءً على ملفك التعريفي وقطاعك، نوصي برعاية المسرح الرئيسي + شاشة المدخل للحصول على أقصى ظهور وعائد استثمار يقدر بـ 340%.', en: 'Based on your profile and sector, we recommend Main Stage + Entrance Screen for maximum exposure and an estimated 340% ROI.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
