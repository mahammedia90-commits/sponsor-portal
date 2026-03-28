/**
 * Opportunities — Sponsorship Marketplace
 * Connected to real tRPC API for events and packages
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import {
  Search, Filter, Star, MapPin, Calendar, Users, Eye,
  Award, TrendingUp, Sparkles, ChevronDown, List,
  Clock, Layers, Crown, Trophy, Medal, ArrowUpRight,
  Building2, Zap, Target, Bot, Heart, LayoutGrid,
  CheckCircle, DollarSign, Tag, Globe, Briefcase, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { IMAGES } from '@/lib/images';

// Fallback images for events without custom images
const EVENT_FALLBACK_IMAGES = [
  IMAGES.analytics, IMAGES.expoHall, IMAGES.networking,
  IMAGES.aiAssistant, IMAGES.brandDisplay, IMAGES.contractSigning,
  IMAGES.reportSuccess, IMAGES.teamMeeting,
];

export default function Opportunities() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Fetch events from API
  const { data: eventsData, isLoading } = trpc.events.list.useQuery(
    { status: 'active', limit: 50 },
    { refetchOnWindowFocus: false }
  );

  // Fetch packages for selected event
  const { data: packagesData } = trpc.events.packages.useQuery(
    { eventId: selectedEvent! },
    { enabled: !!selectedEvent, refetchOnWindowFocus: false }
  );

  const events = eventsData ?? [];
  const packages = packagesData ?? [];

  const sectors = useMemo(() => {
    const allSectors = new Set<string>();
    events.forEach(e => e.sectors?.forEach((s: string) => allSectors.add(s)));
    return [
      { id: 'all', label: { ar: 'جميع القطاعات', en: 'All Sectors' } },
      ...Array.from(allSectors).map(s => ({ id: s, label: { ar: s, en: s } })),
    ];
  }, [events]);

  const cities = useMemo(() => {
    const allCities = new Set<string>();
    events.forEach(e => { if (e.city) allCities.add(e.city); });
    return [
      { id: 'all', label: { ar: 'جميع المدن', en: 'All Cities' } },
      ...Array.from(allCities).map(c => ({ id: c, label: { ar: c, en: c } })),
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        (e.titleAr || '').toLowerCase().includes(q) ||
        (e.titleEn || '').toLowerCase().includes(q) ||
        (e.descriptionAr || '').toLowerCase().includes(q) ||
        (e.descriptionEn || '').toLowerCase().includes(q)
      );
    }
    if (selectedSector !== 'all') {
      result = result.filter(e => e.sectors?.includes(selectedSector));
    }
    if (selectedCity !== 'all') {
      result = result.filter(e => e.city === selectedCity);
    }
    if (sortBy === 'visitors') {
      result.sort((a, b) => (b.expectedVisitors ?? 0) - (a.expectedVisitors ?? 0));
    } else {
      // Sort by date (nearest first)
      result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }
    return result;
  }, [events, searchQuery, selectedSector, selectedCity, sortBy]);

  const toggleFav = (id: string) => setFavorites(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const formatNumber = (n: number | null | undefined) => {
    if (!n) return '0';
    return n.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getEventImage = (event: any, index: number) => {
    if (event.imageUrl) return event.imageUrl;
    return EVENT_FALLBACK_IMAGES[index % EVENT_FALLBACK_IMAGES.length];
  };

  const availableSlots = (e: any) => (e.totalSponsorSlots ?? 0) - (e.filledSponsorSlots ?? 0);
  const fillPercent = (e: any) => {
    const total = e.totalSponsorSlots ?? 1;
    return Math.round(((e.filledSponsorSlots ?? 0) / total) * 100);
  };

  const totalStats = [
    { label: { ar: 'فعاليات متاحة', en: 'Available Events' }, value: events.length },
    { label: { ar: 'فرص رعاية مفتوحة', en: 'Open Sponsorship Slots' }, value: events.reduce((s, e) => s + availableSlots(e), 0) },
    { label: { ar: 'إجمالي الزوار المتوقع', en: 'Expected Total Visitors' }, value: formatNumber(events.reduce((s, e) => s + (e.expectedVisitors ?? 0), 0)) },
    { label: { ar: 'إجمالي العارضين', en: 'Total Exhibitors' }, value: formatNumber(events.reduce((s, e) => s + (e.expectedExhibitors ?? 0), 0)) },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-[#987012] animate-spin" />
          <p className="text-xs text-muted-foreground">{l({ ar: 'جارٍ تحميل فرص الرعاية...', en: 'Loading sponsorship opportunities...' })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56">
        <img src={IMAGES.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-['Cairo'] mb-1">
            {l({ ar: 'سوق فرص الرعاية 2026', en: 'Sponsorship Marketplace 2026' })}
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
            {l({ ar: 'اكتشف أفضل فرص الرعاية في أكبر المعارض والفعاليات في المملكة العربية السعودية', en: 'Discover the best sponsorship opportunities at the largest exhibitions and events in Saudi Arabia' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {totalStats.map((stat, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold gold-text">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">{l(stat.label)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground/50" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={l({ ar: 'ابحث عن فعالية...', en: 'Search events...' })} className="w-full ps-9 pe-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-[#987012]/30 focus:outline-none transition-colors" />
          </div>
          <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-foreground/80 focus:border-[#987012]/30 focus:outline-none">
            {sectors.map(s => <option key={s.id} value={s.id}>{l(s.label)}</option>)}
          </select>
          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-foreground/80 focus:border-[#987012]/30 focus:outline-none">
            {cities.map(c => <option key={c.id} value={c.id}>{l(c.label)}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-foreground/80 focus:border-[#987012]/30 focus:outline-none">
            <option value="date">{l({ ar: 'الأقرب تاريخاً', en: 'Nearest Date' })}</option>
            <option value="visitors">{l({ ar: 'الأكثر زواراً', en: 'Most Visitors' })}</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground/70">{filteredEvents.length} {l({ ar: 'نتيجة', en: 'results' })}</p>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/50 border border-border">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#987012]/20 text-[#987012]' : 'text-muted-foreground/50'}`}><LayoutGrid size={14} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#987012]/20 text-[#987012]' : 'text-muted-foreground/50'}`}><List size={14} /></button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4' : 'space-y-3'}>
        {filteredEvents.map((event, i) => {
          const eventTitle = language === 'ar' ? event.titleAr : event.titleEn;
          const eventDesc = language === 'ar' ? event.descriptionAr : event.descriptionEn;
          const isFeatured = event.sponsorshipEnabled && (event.expectedVisitors ?? 0) > 40000;
          const isTrending = (event.filledSponsorSlots ?? 0) > (event.totalSponsorSlots ?? 1) * 0.4;
          const eventIdStr = String(event.id);

          return (
            <div key={event.id} className={`glass-card rounded-xl overflow-hidden tilt-card group transition-all duration-300 hover:border-[#987012]/20 ${isFeatured ? 'ring-1 ring-[#987012]/20' : ''} animate-fade-in`} style={{ animationDelay: `${i * 60}ms` }}>
              {/* Event Image */}
              <div className="relative h-36 sm:h-44 overflow-hidden">
                <img src={getEventImage(event, i)} alt={eventTitle || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/90 via-[#181715]/30 to-transparent" />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {isFeatured && <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-[#987012] text-white">{l({ ar: 'مميز', en: 'Featured' })}</span>}
                    {isTrending && <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium bg-[#987012]/20 text-[#d4a832] backdrop-blur-sm">{l({ ar: 'رائج', en: 'Trending' })}</span>}
                  </div>
                  <button onClick={() => toggleFav(eventIdStr)} className="p-1.5 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-[#987012]/20 transition-colors">
                    <Heart size={14} className={favorites.includes(eventIdStr) ? 'fill-[#987012] text-[#987012]' : 'text-white/60'} />
                  </button>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[9px] text-white/70 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    {event.sectors?.slice(0, 2).join(' · ') || ''}
                  </span>
                  <span className="text-[9px] text-[#d4a832] bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    {availableSlots(event)} {l({ ar: 'فرصة متاحة', en: 'slots available' })}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-[#987012] transition-colors mb-2">{eventTitle}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 leading-relaxed mb-3 line-clamp-2">{eventDesc}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5"><Calendar size={11} className="text-[#987012]/60 shrink-0" /><span className="text-[9px] sm:text-[10px] text-muted-foreground">{formatDate(String(event.startDate))} - {formatDate(String(event.endDate))}</span></div>
                  <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#987012]/60 shrink-0" /><span className="text-[9px] sm:text-[10px] text-muted-foreground">{event.venue}, {event.city}</span></div>
                  <div className="flex items-center gap-1.5"><Users size={11} className="text-[#987012]/60 shrink-0" /><span className="text-[9px] sm:text-[10px] text-muted-foreground">{formatNumber(event.expectedVisitors)} {l({ ar: 'زائر', en: 'visitors' })}</span></div>
                  <div className="flex items-center gap-1.5"><Building2 size={11} className="text-[#987012]/60 shrink-0" /><span className="text-[9px] sm:text-[10px] text-muted-foreground">{formatNumber(event.expectedExhibitors)} {l({ ar: 'عارض', en: 'exhibitors' })}</span></div>
                </div>

                {/* Assets Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground/70">{l({ ar: 'فرص الرعاية', en: 'Sponsorship Slots' })}</span>
                    <span className="text-[9px] sm:text-[10px] text-[#987012]">{availableSlots(event)} {l({ ar: 'متاح من', en: 'of' })} {event.totalSponsorSlots ?? 0}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div className="h-full rounded-full gold-gradient" style={{ width: `${fillPercent(event)}%` }} />
                  </div>
                </div>

                {/* Sectors */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {event.sectors?.slice(0, 4).map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium border border-border text-muted-foreground">{s}</span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'التسجيل حتى', en: 'Register by' })}</p>
                    <p className="text-xs sm:text-sm font-bold gold-text">{event.registrationDeadline ? formatDate(String(event.registrationDeadline)) : '—'}</p>
                  </div>
                  <button onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)} className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-[#987012] text-white hover:shadow-[0_0_15px_rgba(152,112,18,0.2)] transition-all duration-300 flex items-center gap-1">
                    {l({ ar: 'عرض الحزم', en: 'View Packages' })}
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>

              {/* Expanded Packages */}
              {selectedEvent === event.id && (
                <div className="border-t border-border p-4 sm:p-5 bg-muted/30 animate-fade-in">
                  {packages.length === 0 ? (
                    <div className="text-center py-4">
                      <Loader2 size={20} className="text-[#987012] animate-spin mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">{l({ ar: 'جارٍ تحميل الحزم...', en: 'Loading packages...' })}</p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs font-bold text-foreground/90 mb-3">{l({ ar: 'حزم الرعاية المتاحة', en: 'Available Sponsorship Packages' })}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {packages.map((pkg: any) => {
                          const tierIcons: Record<string, any> = { platinum: Crown, gold: Trophy, silver: Medal, bronze: Award };
                          const TierIcon = tierIcons[pkg.tier] || Award;
                          const tierColors: Record<string, string> = {
                            platinum: 'from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0]',
                            gold: 'from-[#987012] via-[#d4a832] to-[#987012]',
                            silver: 'from-[#A0A0A0] via-[#D0D0D0] to-[#A0A0A0]',
                            bronze: 'from-amber-700 via-amber-500 to-amber-700',
                          };
                          const pkgName = language === 'ar' ? pkg.nameAr : pkg.nameEn;
                          const pkgBenefits = pkg.benefits?.[language] || pkg.benefits?.ar || [];
                          const isAvailable = (pkg.currentSponsors ?? 0) < (pkg.maxSponsors ?? 1);

                          return (
                            <div key={pkg.id} className={`rounded-xl overflow-hidden border border-border ${!isAvailable ? 'opacity-60' : ''}`}>
                              <div className={`p-3 bg-gradient-to-br ${tierColors[pkg.tier] || tierColors.bronze} text-center`}>
                                <TierIcon size={22} className="mx-auto mb-1 text-[#010101]" />
                                <h5 className="text-xs font-bold text-[#010101]">{pkgName}</h5>
                                <p className="text-lg font-bold text-[#010101] mt-0.5">
                                  {Number(pkg.price).toLocaleString()} <span className="text-[10px] font-normal">{l({ ar: 'ر.س', en: 'SAR' })}</span>
                                </p>
                              </div>
                              <div className="p-3">
                                <div className="space-y-1.5 mb-3">
                                  {pkgBenefits.slice(0, 5).map((b: string, bi: number) => (
                                    <div key={bi} className="flex items-start gap-1.5">
                                      <CheckCircle size={10} className="text-[#987012] mt-0.5 shrink-0" />
                                      <span className="text-[9px] text-muted-foreground leading-tight">{b}</span>
                                    </div>
                                  ))}
                                  {pkgBenefits.length > 5 && (
                                    <p className="text-[9px] text-[#987012]">+{pkgBenefits.length - 5} {l({ ar: 'مزايا أخرى', en: 'more benefits' })}</p>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 mb-2">
                                  <span>{l({ ar: 'المقاعد', en: 'Slots' })}: {pkg.currentSponsors ?? 0}/{pkg.maxSponsors ?? 0}</span>
                                  {pkg.boothSizeM2 && <span>{pkg.boothSizeM2}m²</span>}
                                  {pkg.vipTickets && <span>{pkg.vipTickets} VIP</span>}
                                </div>
                                <button
                                  onClick={() => isAvailable ? toast.success(l({ ar: 'تم الحجز المؤقت لمدة 30 دقيقة', en: 'Temporarily reserved for 30 minutes' })) : null}
                                  disabled={!isAvailable}
                                  className={`w-full py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    isAvailable
                                      ? 'bg-[#987012] text-white hover:shadow-[0_0_15px_rgba(152,112,18,0.2)]'
                                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                                  }`}
                                >
                                  {isAvailable ? (
                                    <><Clock size={11} />{l({ ar: 'احجز مؤقتاً', en: 'Reserve Now' })}</>
                                  ) : (
                                    l({ ar: 'محجوز بالكامل', en: 'Fully Booked' })
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && !isLoading && (
        <div className="glass-card animate-border-glow rounded-xl p-8 sm:p-12 text-center">
          <Search size={32} className="text-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground/70">{l({ ar: 'لم يتم العثور على فعاليات مطابقة', en: 'No matching events found' })}</p>
          <button onClick={() => { setSearchQuery(''); setSelectedSector('all'); setSelectedCity('all'); }} className="mt-3 text-xs text-[#987012] hover:underline">{l({ ar: 'إعادة تعيين الفلاتر', en: 'Reset Filters' })}</button>
        </div>
      )}
    </div>
  );
}
