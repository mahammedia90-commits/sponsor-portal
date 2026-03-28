/**
 * Home — Landing Page for Sponsor Portal
 * Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism + Gold Accents + Premium Parallax + Scroll Reveal
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { useLanguage, allLanguages } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Award, TrendingUp, Users, Eye, Shield, Bot, BarChart3,
  Megaphone, FileText, CreditCard, Globe, Building2,
  Sparkles, Target, Calculator, ChevronDown, CheckCircle,
  Sun, Moon, Zap, Lock, Handshake, PieChart,
  Briefcase, Crown, Medal, Trophy, ArrowUpRight, Star,
  MapPin, Calendar, Layers, Upload, MessageSquare,
  Phone, Mail, ChevronRight, Play, Rocket, Search,
  Filter, DollarSign, Percent, Clock, ArrowRight,
  HelpCircle, Plus, Minus, Monitor, Smartphone,
  Palette, Image, Video, Mic, Printer, LayoutGrid, X
} from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-hero-jumKf6mngMij2RZTr82mpQ.webp';
const NETWORKING_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-networking-MFXV2JJJJzpYWJPNqCCWBj.webp';
const ANALYTICS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-analytics-iiNEBrqpOPCHOqVJ4RKvMo.webp';
const EXPO_HALL_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-expo-hall-KF8yTvgvVLMQbi4AKXqhKg.webp';
const CONTRACT_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-contract-signing-bZYt7waPaSJTKfV2eGwuUv.webp';
const BRAND_DISPLAY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-brand-display-b5qLQv32gHCTauu66Zc4GR.webp';
const TEAM_MEETING_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-team-meeting-TTLSPyzF255bLyGgeULaUP.webp';
const AI_ASSISTANT_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-ai-assistant-HZZXDJTczNPmxkiDehfyXt.webp';
const REPORT_SUCCESS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-report-success-Vs6t6GUB37fTAPP8ofXTYs.webp';
const LEADS_CRM_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-leads-crm-o2mq2DBuFvwahsH47uYUNU.webp';
const CALENDAR_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-calendar-events-CMjaTAEJi3TUJpEmGRHWDQ.webp';
const DASHBOARD_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-analytics-dashboard-S23sSkprnMAhokvRuYStWi.webp';
const LOGO_DARK = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/mahamexpo-logo-dark_2f2c36c9.jpeg';
const LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/mahamexpo-logo-white_b6f5381f.webp';

/* ===== Intersection Observer Hook ===== */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold, rootMargin: '0px 0px -60px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ===== Animated Counter ===== */
function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    const prefix = target.replace(/[0-9,+]/g, '');
    const hasSuffix = target.includes('+');
    if (isNaN(num)) { setDisplay(target); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(num / 45));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { start = num; clearInterval(timer); }
      setDisplay(`${prefix}${start.toLocaleString()}${hasSuffix ? '+' : ''}`);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ===== Floating Particle ===== */
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: `rgba(22, 163, 74, ${Math.random() * 0.3 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-particle ${Math.random() * 8 + 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ===== FAQ Accordion Item ===== */
function FAQItem({ q, a, open, onClick, isDark }: { q: string; a: string; open: boolean; onClick: () => void; isDark: boolean }) {
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-400 border ${
      isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-[#987012]/20' : 'bg-white border-[#F0EEE7]/60 hover:border-[#987012]/30 shadow-sm'
    }`}>
      <button onClick={onClick} className="w-full flex items-center justify-between p-4 sm:p-5 text-start gap-3">
        <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-foreground' : 'text-[#010101]'}`}>{q}</span>
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-400 ${
          open
            ? 'bg-[#987012]/20 border-[#987012]/30 rotate-180'
            : isDark ? 'border-[#987012]/20' : 'border-[#987012]/25'
        }`}>
          <ChevronDown size={14} className="text-[#987012]" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`px-4 sm:px-5 pb-4 sm:pb-5 text-[10px] sm:text-xs leading-relaxed ${isDark ? 'text-muted-foreground' : 'text-[#919187]'}`}>{a}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { language, setLanguage, isRTL, languageFlag } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeJourney, setActiveJourney] = useState(0);

  const isDark = theme === 'dark';
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  // Theme-aware colors
  const bg1 = 'bg-background';
  const bg2 = isDark ? 'bg-[#0a0c12]' : 'bg-[#f8f7f4]';
  const textPrimary = 'text-foreground';
  const textSecondary = 'text-muted-foreground';
  const textMuted = 'text-[#6B6B6B] dark:text-[#6B6B6B]';
  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const cardHover = isDark ? 'hover:border-[#987012]/20 hover:bg-white/[0.05]' : 'hover:border-[#987012]/25 hover:shadow-lg';

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveJourney(p => (p + 1) % 12), 3000);
    return () => clearInterval(t);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const whySection = useInView();
  const audienceSection = useInView();
  const journeySection = useInView();
  const assetsSection = useInView();
  const packagesSection = useInView();
  const statsSection = useInView();
  const successSection = useInView();
  const economicSection = useInView();
  const aiSection = useInView();
  const complianceSection = useInView();
  const faqSection = useInView();
  const contactSection = useInView();

  /* ===== DATA ===== */
  const whyReasons = [
    { icon: Eye, title: { ar: 'ظهور استراتيجي', en: 'Strategic Visibility' }, desc: { ar: 'ليس مجرد وضع شعار — بل تموضع استراتيجي لعلامتك التجارية أمام جمهور الأعمال المستهدف في أكبر المعارض والفعاليات', en: 'Not just logo placement — strategic brand positioning in front of targeted business audiences at major exhibitions' } },
    { icon: Users, title: { ar: 'توليد عملاء حقيقيين', en: 'Real Lead Generation' }, desc: { ar: 'نظام ذكي لتوليد وتتبع العملاء المحتملين من التجار والزوار مع تصنيف تلقائي وتقارير مفصلة', en: 'Smart system for generating and tracking leads from traders and visitors with auto-classification' } },
    { icon: BarChart3, title: { ar: 'عائد استثمار قابل للقياس', en: 'Measurable ROI' }, desc: { ar: 'تحليلات متقدمة لقياس مشاهدات العلامة، معدلات التحويل، وعائد الاستثمار الفعلي لكل فعالية', en: 'Advanced analytics to measure brand views, conversion rates, and actual ROI per event' } },
    { icon: Handshake, title: { ar: 'وصول مباشر للتجار والمستثمرين', en: 'Direct Access to Traders & Investors' }, desc: { ar: 'شبكة متكاملة تربطك مباشرة بالتجار والمستثمرين المشاركين في الفعاليات', en: 'Integrated network connecting you directly with participating traders and investors' } },
    { icon: Target, title: { ar: 'جمهور مستهدف بدقة', en: 'Precisely Targeted Audience' }, desc: { ar: 'بيانات دقيقة عن ملف الجمهور — القطاع، المنصب، حجم الشركة — لضمان وصول رسالتك للجمهور الصحيح', en: 'Precise audience data — sector, position, company size — ensuring your message reaches the right people' } },
    { icon: FileText, title: { ar: 'عمليات رعاية منظمة', en: 'Organized Sponsorship Operations' }, desc: { ar: 'عقود رقمية، مدفوعات آمنة، تتبع التسليمات، وإدارة كاملة من مكان واحد', en: 'Digital contracts, secure payments, deliverables tracking, and full management from one place' } },
  ];

  const audienceProfile = [
    { label: { ar: 'مدراء تنفيذيون', en: 'C-Level Executives' }, pct: 22, icon: Crown },
    { label: { ar: 'مدراء أقسام', en: 'Department Directors' }, pct: 35, icon: Briefcase },
    { label: { ar: 'رواد أعمال', en: 'Entrepreneurs' }, pct: 18, icon: Rocket },
    { label: { ar: 'مستثمرون', en: 'Investors' }, pct: 15, icon: TrendingUp },
    { label: { ar: 'مهنيون متخصصون', en: 'Industry Professionals' }, pct: 10, icon: Users },
  ];

  const journeySteps = [
    { icon: Search, title: { ar: 'اكتشف الفعاليات', en: 'Discover Events' } },
    { icon: Sparkles, title: { ar: 'استكشف فرص الرعاية', en: 'Explore Opportunities' } },
    { icon: Filter, title: { ar: 'فلتر حسب القطاع والميزانية', en: 'Filter by Sector & Budget' } },
    { icon: MapPin, title: { ar: 'اختر الفعالية', en: 'Select Event' } },
    { icon: LayoutGrid, title: { ar: 'خريطة أصول الرعاية', en: 'Sponsorship Asset Map' } },
    { icon: Layers, title: { ar: 'قارن الحزم', en: 'Compare Packages' } },
    { icon: Clock, title: { ar: 'احجز مؤقتاً (30 دقيقة)', en: 'Temporary Reserve (30 min)' } },
    { icon: Upload, title: { ar: 'ارفع وثائق الشركة', en: 'Upload Company Docs' } },
    { icon: CheckCircle, title: { ar: 'موافقة المشرف', en: 'Admin Approval' } },
    { icon: FileText, title: { ar: 'وقّع العقد رقمياً', en: 'Sign Contract Digitally' } },
    { icon: CreditCard, title: { ar: 'أكمل الدفع', en: 'Complete Payment' } },
    { icon: BarChart3, title: { ar: 'تتبع الأداء والتقارير', en: 'Track Performance' } },
  ];

  const sponsorAssetTypes = [
    { ar: 'حقوق التسمية', en: 'Naming Rights' },
    { ar: 'الراعي الرئيسي', en: 'Main Sponsor' },
    { ar: 'بلاتيني / ذهبي / فضي', en: 'Platinum / Gold / Silver' },
    { ar: 'رعاية المدخل', en: 'Entrance Branding' },
    { ar: 'منطقة التسجيل', en: 'Registration Zone' },
    { ar: 'رعاية المسرح', en: 'Stage Sponsorship' },
    { ar: 'منطقة الابتكار', en: 'Innovation Zone' },
    { ar: 'صالة VIP', en: 'VIP Lounge' },
    { ar: 'شاشات LED', en: 'LED Screens' },
    { ar: 'لافتات معلقة', en: 'Hanging Banners' },
    { ar: 'أكشاك تفاعلية', en: 'Activation Booths' },
    { ar: 'ملصقات أرضية', en: 'Floor Stickers' },
    { ar: 'بوابات مُعلَّمة', en: 'Branded Gates' },
    { ar: 'أنفاق مُعلَّمة', en: 'Branded Tunnels' },
    { ar: 'جدار إعلامي', en: 'Media Wall' },
    { ar: 'ظهور رقمي داخل المنصة', en: 'Digital Platform Visibility' },
  ];

  const tiers = [
    { name: { ar: 'بلاتيني', en: 'Platinum' }, icon: Crown, gradient: 'from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0]', textColor: 'text-[#010101]', price: '300,000', popular: true, features: { ar: ['شعار رئيسي على جميع المواد والشاشات', 'كلمة افتتاحية في الفعالية', 'منصة عرض رئيسية 100م²', 'تغطية إعلامية حصرية كاملة', 'حضور VIP لـ 30 شخص', 'تقرير تحليلي بالذكاء الاصطناعي', 'أولوية في توليد العملاء المحتملين', 'حق حصري للقطاع', 'ذكر في جميع البيانات الصحفية'], en: ['Main logo on all materials & screens', 'Opening speech at event', 'Premium 100m² booth', 'Full exclusive media coverage', '30 VIP passes', 'AI analytics report', 'Priority lead generation', 'Category exclusivity rights', 'Mention in all press releases'] } },
    { name: { ar: 'ذهبي', en: 'Gold' }, icon: Trophy, gradient: 'from-[#987012] via-[#d4a832] to-[#987012]', textColor: 'text-[#010101]', price: '150,000', popular: false, features: { ar: ['شعار على المواد الرئيسية', 'منصة عرض 50م²', 'تغطية إعلامية', 'حضور VIP لـ 15 شخص', 'تقرير أداء مفصل', 'ترويج داخل المنصة الرقمية', 'ذكر في وسائل التواصل'], en: ['Logo on main materials', '50m² booth', 'Media coverage', '15 VIP passes', 'Detailed performance report', 'Digital platform promotion', 'Social media mention'] } },
    { name: { ar: 'فضي', en: 'Silver' }, icon: Medal, gradient: 'from-[#A0A0A0] via-[#D0D0D0] to-[#A0A0A0]', textColor: 'text-[#010101]', price: '70,000', popular: false, features: { ar: ['شعار على موقع الفعالية', 'منصة عرض 25م²', 'حضور VIP لـ 5 أشخاص', 'تقرير أداء أساسي', 'ذكر في البريد الإلكتروني'], en: ['Logo on event website', '25m² booth', '5 VIP passes', 'Basic performance report', 'Email mention'] } },
    { name: { ar: 'شريك رسمي', en: 'Official Partner' }, icon: Award, gradient: 'from-amber-700 via-amber-500 to-amber-700', textColor: 'text-white', price: '35,000', popular: false, features: { ar: ['شعار على صفحة الفعالية', 'حضور VIP لشخصين', 'ذكر في منشورات التواصل', 'تقرير ملخص'], en: ['Logo on event page', '2 VIP passes', 'Social media mention', 'Summary report'] } },
  ];

  const successStoryImages = [EXPO_HALL_IMG, BRAND_DISPLAY_IMG, NETWORKING_IMG];

  const successStories = [
    { company: { ar: 'شركة الاتصالات السعودية STC', en: 'Saudi Telecom Company STC' }, event: { ar: 'مؤتمر ليب 2025', en: 'LEAP 2025' }, result: { ar: 'زيادة 340% في العملاء المحتملين مع 2.5 مليون مشاهدة للعلامة التجارية', en: '340% increase in leads with 2.5M brand impressions' }, tier: { ar: 'بلاتيني', en: 'Platinum' } },
    { company: { ar: 'بنك الرياض', en: 'Riyad Bank' }, event: { ar: 'ديب فيست 2025', en: 'DeepFest 2025' }, result: { ar: '180 عميل محتمل مؤهل و 1.8 مليون مشاهدة رقمية', en: '180 qualified leads and 1.8M digital impressions' }, tier: { ar: 'ذهبي', en: 'Gold' } },
    { company: { ar: 'أرامكو', en: 'Aramco' }, event: { ar: 'مؤتمر البترول العالمي', en: 'World Petroleum Congress' }, result: { ar: 'تغطية إعلامية في 45 دولة مع 5 مليون مشاهدة', en: 'Media coverage in 45 countries with 5M impressions' }, tier: { ar: 'بلاتيني', en: 'Platinum' } },
  ];

  const faqs = [
    { q: { ar: 'ما هي أنواع الرعاية المتاحة؟', en: 'What types of sponsorship are available?' }, a: { ar: 'نوفر حزم رعاية متنوعة تشمل: بلاتيني، ذهبي، فضي، شريك رسمي، راعي قطاع، راعي منطقة، راعي شاشات، راعي مسرح، راعي تسجيل، راعي ضيافة، وراعي VIP. كل حزمة تتضمن مجموعة محددة من أصول الرعاية المادية والرقمية.', en: 'We offer diverse sponsorship packages including: Platinum, Gold, Silver, Official Partner, Category Sponsor, Zone Sponsor, Screen Sponsor, Stage Sponsor, Registration Sponsor, Hospitality Sponsor, and VIP Sponsor.' } },
    { q: { ar: 'كيف يمكنني قياس عائد الاستثمار من الرعاية؟', en: 'How can I measure sponsorship ROI?' }, a: { ar: 'نوفر لوحة تحليلات متقدمة تتضمن: إجمالي المشاهدات، تقدير حركة الزوار حسب الموقع، عدد العملاء المحتملين، معدل تغطية العلامة التجارية، نسبة إتمام الحملة، ملف قطاع الجمهور، وتقرير ما بعد الفعالية بصيغة PDF و Excel.', en: 'We provide an advanced analytics dashboard including: total impressions, footfall estimates by location, leads generated, brand coverage rate, campaign completion rate, audience sector profile, and post-event report in PDF & Excel.' } },
    { q: { ar: 'هل يمكنني حجز أصل رعاية محدد؟', en: 'Can I reserve a specific sponsorship asset?' }, a: { ar: 'نعم! من خلال خريطة أصول الرعاية التفاعلية يمكنك اختيار الأصل المحدد وحجزه مؤقتاً لمدة 30 دقيقة أثناء إكمال إجراءات التسجيل والدفع.', en: 'Yes! Through the interactive sponsorship asset map, you can select a specific asset and temporarily reserve it for 30 minutes while completing registration and payment.' } },
    { q: { ar: 'ما هي طرق الدفع المتاحة؟', en: 'What payment methods are available?' }, a: { ar: 'ندعم: بطاقات الائتمان والخصم، مدى، Apple Pay، والتحويل البنكي. الدفعة المقدمة 50% لتأكيد الرعاية، والمتبقي يُستحق قبل 30 يوماً من الفعالية. جميع المعاملات متوافقة مع ZATCA.', en: 'We support: credit/debit cards, Mada, Apple Pay, and bank transfer. 50% advance payment to confirm, remaining due 30 days before event. All transactions are ZATCA compliant.' } },
    { q: { ar: 'هل يمكنني رفع مواد العلامة التجارية الخاصة بي؟', en: 'Can I upload my brand assets?' }, a: { ar: 'بالتأكيد! من خلال لوحة إدارة أصول العلامة التجارية يمكنك رفع: الشعار، دليل الهوية البصرية، تصاميم الحملات، إعلانات الفيديو، البانرات الرقمية، ملفات الطباعة، وملفات الشاشات.', en: 'Absolutely! Through the brand asset management dashboard you can upload: logo, brand guidelines, campaign artwork, video ads, digital banners, print files, and screen media.' } },
    { q: { ar: 'كيف تعمل عملية الموافقة؟', en: 'How does the approval process work?' }, a: { ar: 'بعد حجز أصل الرعاية، يتم إشعار المشرف فوراً لمراجعة ملف الشركة. ستتابع حالة طلبك: تم الاستلام → قيد المراجعة → معتمد → العقد جاهز → بانتظار الدفع → مؤكد.', en: 'After reserving, the supervisor is notified immediately. Track your status: Received → Under Review → Approved → Contract Ready → Payment Pending → Confirmed.' } },
  ];

  const stats = [
    { value: '50,000+', label: { ar: 'زائر أعمال لكل فعالية', en: 'Business Visitors per Event' } },
    { value: '300+', label: { ar: 'عارض لكل فعالية', en: 'Exhibitors per Event' } },
    { value: '14M+', label: { ar: 'ريال سعودي إيرادات رعاية سنوية', en: 'SAR Annual Sponsor Revenue' } },
    { value: '20+', label: { ar: 'قطاع صناعي', en: 'Industry Sectors' } },
    { value: '10+', label: { ar: 'فعالية سنوياً', en: 'Events Annually' } },
    { value: '340%', label: { ar: 'متوسط عائد الاستثمار', en: 'Average ROI' } },
  ];

  const compliance = [
    { label: 'ZATCA', desc: { ar: 'هيئة الزكاة والضريبة والجمارك', en: 'Tax & Customs Authority' } },
    { label: { ar: 'وزارة التجارة', en: 'MOC' }, desc: { ar: 'سجل تجاري ساري', en: 'Active Commercial Registration' } },
    { label: 'KYC / AML', desc: { ar: 'اعرف عميلك ومكافحة غسل الأموال', en: 'Know Your Customer & AML' } },
    { label: 'ISO 27001', desc: { ar: 'أمن المعلومات', en: 'Information Security' } },
    { label: 'PDPL', desc: { ar: 'نظام حماية البيانات الشخصية', en: 'Personal Data Protection Law' } },
    { label: 'SAMA', desc: { ar: 'البنك المركزي السعودي', en: 'Saudi Central Bank' } },
  ];

  const sponsorTypes = [
    { icon: Building2, title: { ar: 'البنوك والمالية', en: 'Banks & Finance' } },
    { icon: Zap, title: { ar: 'الاتصالات والتقنية', en: 'Telecom & Tech' } },
    { icon: Briefcase, title: { ar: 'العقارات والتطوير', en: 'Real Estate & Development' } },
    { icon: Target, title: { ar: 'الطيران والضيافة', en: 'Aviation & Hospitality' } },
    { icon: TrendingUp, title: { ar: 'الطاقة والصناعة', en: 'Energy & Industry' } },
    { icon: Handshake, title: { ar: 'الجهات الحكومية', en: 'Government Entities' } },
    { icon: Monitor, title: { ar: 'التقنية المالية', en: 'Fintech' } },
    { icon: Megaphone, title: { ar: 'السلع الاستهلاكية', en: 'FMCG' } },
    { icon: Shield, title: { ar: 'الرعاية الصحية', en: 'Healthcare' } },
    { icon: Palette, title: { ar: 'التجزئة', en: 'Retail' } },
    { icon: Rocket, title: { ar: 'السيارات', en: 'Automotive' } },
    { icon: Globe, title: { ar: 'منصات الاستثمار', en: 'Investment Platforms' } },
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden bg-background`} dir={isRTL ? 'rtl' : 'ltr'} onMouseMove={handleMouseMove}>

      {/* Fixed Controls — Language Dropdown + Theme Toggle */}
      <div className={`fixed top-3 sm:top-4 ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} z-50 flex items-center gap-1.5 sm:gap-2`}>
        {/* Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border text-[10px] sm:text-xs transition-all duration-400 ${
              isDark ? 'text-[#e8d9a8]/70 hover:text-[#987012] hover:border-[#987012]/30 border-white/10' : 'text-[#565656] hover:text-[#987012] hover:border-[#987012]/30 border-[#F0EEE7]'
            }`}
            style={{ background: isDark ? 'rgba(12, 14, 20, 0.7)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
            <Globe size={12} className="shrink-0" />
            <span>{languageFlag} {allLanguages.find(l => l.code === language)?.name}</span>
            <ChevronDown size={10} className={`shrink-0 transition-transform duration-300 ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {langDropdownOpen && (
            <div className={`absolute top-full mt-1.5 ${isRTL ? 'right-0' : 'left-0'} rounded-xl overflow-hidden shadow-2xl z-[100]`}
              style={{
                background: isDark ? 'rgba(14, 15, 22, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(24px)',
                border: `1px solid ${isDark ? 'rgba(152,112,18,0.12)' : 'rgba(152,112,18,0.15)'}`,
                minWidth: '10rem',
                animation: 'fadeInUp 0.2s cubic-bezier(0.22,1,0.36,1)',
              }}>
              <div className="py-1">
                {allLanguages.map(lang => (
                  <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all duration-200 ${
                      language === lang.code
                        ? 'text-[#987012] font-semibold'
                        : isDark ? 'text-[#919187] hover:text-white hover:bg-muted/50' : 'text-[#565656] hover:text-[#010101] hover:bg-[#F9F8F5]'
                    }`}
                    style={language === lang.code ? { background: isDark ? 'rgba(152,112,18,0.08)' : 'rgba(152,112,18,0.06)' } : {}}>
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[#987012] shrink-0" style={{ marginInlineStart: 'auto', boxShadow: '0 0 6px rgba(152,112,18,0.4)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {toggleTheme && (
          <button onClick={toggleTheme}
            className={`p-1.5 sm:p-2 rounded-full border transition-all duration-400 group ${
              isDark ? 'text-[#e8d9a8]/70 hover:text-[#987012] hover:border-[#987012]/30 border-white/10' : 'text-[#565656] hover:text-[#987012] hover:border-[#987012]/30 border-[#F0EEE7]'
            }`}
            style={{ background: isDark ? 'rgba(12, 14, 20, 0.7)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
            <div className="transition-transform duration-700 group-hover:rotate-[360deg]">
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </div>
          </button>
        )}
      </div>

      {/* ===== HERO — Parallax + Particles + Spotlight ===== */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ transform: `scale(1.12) translateY(${scrollY * 0.18}px)`, transition: 'transform 0.1s linear' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181715]/75 via-[#181715]/45 to-[#181715]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181715]/40 via-transparent to-[#181715]/40" />
        {/* Interactive spotlight */}
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(152,112,18,0.12), transparent 55%)` }} />
        <GoldParticles />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full border border-[#987012]/20 backdrop-blur-md"
            style={{ background: 'rgba(152,112,18,0.06)' }}>
            <div className="w-2 h-2 rounded-full bg-[#987012] animate-pulse" style={{ boxShadow: '0 0 8px rgba(152,112,18,0.5)' }} />
            <span className="text-[10px] sm:text-xs text-[#987012] font-semibold tracking-wide">{l({ ar: 'منصة الرعاية الأذكى في المملكة', en: 'The Smartest Sponsorship Platform in Saudi Arabia' })}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-['Cairo'] text-white mb-3 sm:mb-5 leading-[1.1]">
            <span className="gold-text inline-block" style={{ textShadow: '0 0 40px rgba(152,112,18,0.15)' }}>{l({ ar: 'بوابة الداعم', en: 'Sponsor Portal' })}</span>
            <br />
            <span className="text-white/85 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium">{l({ ar: 'سوق الرعاية الاحترافي', en: 'Professional Sponsorship Marketplace' })}</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
            {l({ ar: 'اكتشف فرص الرعاية — احجز أصول العلامة التجارية — وقّع العقود رقمياً — تتبع الأداء والعائد — كل شيء من مكان واحد', en: 'Discover sponsorship opportunities — Reserve brand assets — Sign contracts digitally — Track performance & ROI — All from one place' })}
          </p>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/opportunities">
              <span className="btn-cta-glass px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2.5 group animate-gold-pulse">
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-500" />
                {l({ ar: 'اكتشف فرص الرعاية', en: 'Discover Sponsorship Opportunities' })}
                <ArrowUpRight size={14} className="transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
            <Link href="/login">
              <span className="btn-ghost-glass px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2">
                {l({ ar: 'لوحة تحكم الداعم', en: 'Sponsor Dashboard' })}
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-[#987012]/25 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-[#987012]/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== WHY SPONSOR WITH MAHAM EXPO ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative`} ref={whySection.ref}>
        {isDark && <GoldParticles />}
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-800 ${whySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'القيمة المضافة', en: 'Value Proposition' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl md:text-5xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5 transition-all duration-800 delay-100 ${whySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'لماذا ترعى مع مهام إكسبو؟', en: 'Why Sponsor with Maham Expo?' })}
            </h2>
            <p className={`${textSecondary} max-w-2xl mx-auto text-xs sm:text-sm md:text-base transition-all duration-800 delay-200 ${whySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'مهام إكسبو ليست مجرد "وضع شعار" — بل قناة نمو تجاري حقيقية تربطك بالجمهور المستهدف وتقيس عائد استثمارك', en: 'Maham Expo is not just "logo placement" — it\'s a real business growth channel connecting you with targeted audiences and measuring your ROI' })}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyReasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className={`rounded-2xl p-5 sm:p-7 border group transition-all duration-700 hover:scale-[1.02] ${cardBg} ${cardHover} ${whySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#987012]/8 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#987012]/15 transition-all duration-400 group-hover:scale-110">
                    <Icon size={22} className="text-[#987012] sm:w-6 sm:h-6" />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold ${textPrimary} mb-2`}>{l(r.title)}</h3>
                  <p className={`text-[10px] sm:text-xs ${textSecondary} leading-relaxed`}>{l(r.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHO ATTENDS — AUDIENCE PROFILE ===== */}
      <section className={`py-14 sm:py-24 ${bg2} relative overflow-hidden`} ref={audienceSection.ref}>
        {/* Background image with overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={NETWORKING_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
            <div>
              <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${audienceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {l({ ar: 'ملف الجمهور', en: 'Audience Profile' })}
              </span>
              <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5 transition-all duration-700 delay-100 ${audienceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {l({ ar: 'من يحضر فعالياتنا؟', en: 'Who Attends Our Events?' })}
              </h2>
              <p className={`${textSecondary} text-xs sm:text-sm mb-7 sm:mb-10 transition-all duration-700 delay-200 ${audienceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {l({ ar: 'جمهور أعمال نوعي — صناع قرار، مدراء تنفيذيون، مستثمرون، ورواد أعمال من أكثر من 20 قطاعاً صناعياً', en: 'Quality business audience — decision makers, executives, investors, and entrepreneurs from 20+ industry sectors' })}
              </p>
              <div className="space-y-4 sm:space-y-5">
                {audienceProfile.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className={`transition-all duration-700 ${audienceSection.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: `${i * 100 + 300}ms` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className="text-[#987012]" />
                          <span className={`text-[11px] sm:text-xs ${isDark ? 'text-foreground/80' : 'text-[#565656]'} font-medium`}>{l(a.label)}</span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-[#987012] font-bold">{a.pct}%</span>
                      </div>
                      <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-[#F9F8F5]'}`}>
                        <div className="h-full rounded-full gold-gradient transition-all duration-1200 ease-out" style={{ width: audienceSection.inView ? `${a.pct}%` : '0%', transitionDelay: `${i * 100 + 500}ms` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`rounded-2xl p-6 sm:p-8 border transition-all duration-700 delay-300 ${cardBg} ${audienceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className={`text-sm sm:text-lg font-bold ${textPrimary} mb-5 sm:mb-7`}>{l({ ar: 'القطاعات المستهدفة للرعاة', en: 'Target Sponsor Sectors' })}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {sponsorTypes.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl transition-all duration-300 group ${
                      isDark ? 'bg-white/[0.02] hover:bg-[#987012]/8' : 'bg-[#F9F8F5] hover:bg-[#987012]/5'
                    }`}>
                      <Icon size={14} className="text-[#987012]/50 group-hover:text-[#987012] transition-colors shrink-0" />
                      <span className={`text-[9px] sm:text-[11px] ${textSecondary} group-hover:${textPrimary} transition-colors`}>{l(s.title)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW SPONSORSHIP WORKS — JOURNEY ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative`} ref={journeySection.ref}>
        {isDark && <GoldParticles />}
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${journeySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'رحلة الداعم', en: 'Sponsor Journey' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5 transition-all duration-700 delay-100 ${journeySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'كيف تعمل الرعاية؟', en: 'How Sponsorship Works' })}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {journeySteps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === activeJourney;
              return (
                <div key={i} onClick={() => setActiveJourney(i)}
                  className={`rounded-xl p-3.5 sm:p-5 text-center cursor-pointer border transition-all duration-500 ${
                    isActive
                      ? `border-[#987012]/30 ${isDark ? 'bg-[#987012]/8' : 'bg-[#987012]/5'} shadow-[0_0_25px_rgba(152,112,18,0.08)] scale-[1.03]`
                      : `${cardBg} ${cardHover}`
                  } ${journeySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-all duration-400 ${isActive ? 'bg-[#987012]/20 scale-110' : isDark ? 'bg-white/5' : 'bg-[#F9F8F5]'}`}>
                    <Icon size={18} className={`transition-all duration-400 sm:w-5 sm:h-5 ${isActive ? 'text-[#987012]' : isDark ? 'text-muted-foreground/50' : 'text-[#919187]'}`} />
                  </div>
                  <div className={`text-[9px] sm:text-[10px] font-bold mb-1 transition-colors duration-300 ${isActive ? 'text-[#987012]' : textMuted}`}>{String(i + 1).padStart(2, '0')}</div>
                  <p className={`text-[9px] sm:text-[11px] font-medium transition-colors duration-300 leading-tight ${isActive ? (isDark ? 'text-[#e8d9a8]' : 'text-[#010101]') : textSecondary}`}>{l(s.title)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SPONSORSHIP ASSETS TYPES ===== */}
      <section className={`py-14 sm:py-24 ${bg2} relative overflow-hidden`} ref={assetsSection.ref}>
        {/* Subtle background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={BRAND_DISPLAY_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${assetsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'مخزون الرعاية', en: 'Sponsorship Inventory' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5 transition-all duration-700 delay-100 ${assetsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'أصول الرعاية المتاحة', en: 'Available Sponsorship Assets' })}
            </h2>
            <p className={`${textSecondary} max-w-2xl mx-auto text-xs sm:text-sm transition-all duration-700 delay-200 ${assetsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'لا نبيع حزماً مجردة — بل أصول رعاية حقيقية يمكنك اختيارها وحجزها من خريطة تفاعلية', en: 'We don\'t sell abstract packages — we sell real sponsorship assets you can select and reserve from an interactive map' })}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {sponsorAssetTypes.map((a, i) => (
              <div key={i} className={`rounded-xl p-2.5 sm:p-3.5 text-center border transition-all duration-400 cursor-pointer group hover:scale-[1.04] ${cardBg} ${cardHover} ${assetsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 35}ms` }}>
                <p className={`text-[8px] sm:text-[10px] ${textSecondary} group-hover:text-[#987012] transition-colors leading-tight font-medium`}>{l(a)}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-7 sm:mt-10">
            <Link href="/asset-map">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#987012] hover:text-[#d4a832] transition-all duration-300 font-semibold group">
                {l({ ar: 'استكشف خريطة الأصول التفاعلية', en: 'Explore Interactive Asset Map' })}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative`} ref={packagesSection.ref}>
        {isDark && <GoldParticles />}
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${packagesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'حزم الرعاية', en: 'Sponsorship Packages' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5 transition-all duration-700 delay-100 ${packagesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'اختر الحزمة المناسبة لعلامتك', en: 'Choose the Right Package for Your Brand' })}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <div key={i} className={`rounded-2xl overflow-hidden border transition-all duration-700 hover:scale-[1.02] ${
                  tier.popular ? 'ring-1 ring-[#987012]/30 relative' : ''
                } ${cardBg} ${packagesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  {tier.popular && <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />}
                  <div className={`p-5 sm:p-6 bg-gradient-to-br ${tier.gradient} text-center`}>
                    <Icon size={30} className={`mx-auto mb-2 ${tier.textColor} sm:w-9 sm:h-9`} />
                    <h3 className={`text-sm sm:text-lg font-bold ${tier.textColor}`}>{l(tier.name)}</h3>
                    <p className={`text-xl sm:text-3xl font-bold mt-1 ${tier.textColor}`}>{tier.price} <span className="text-xs sm:text-sm font-normal">{l({ ar: 'ر.س', en: 'SAR' })}</span></p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="space-y-2.5 sm:space-y-3">
                      {l(tier.features).map((f: string, fi: number) => (
                        <div key={fi} className="flex items-start gap-2.5">
                          <CheckCircle size={13} className="text-[#987012] mt-0.5 shrink-0" />
                          <span className={`text-[10px] sm:text-xs ${textSecondary} leading-tight`}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/opportunities">
                      <span className={`mt-5 sm:mt-6 w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-400 ${
                        tier.popular
                          ? 'bg-[#fbf8f0]0 text-white hover:shadow-[0_0_25px_rgba(152,112,18,0.2)] hover:scale-[1.02]'
                          : `border ${isDark ? 'border-white/10 text-[#919187]' : 'border-[#F0EEE7] text-[#919187]'} hover:border-[#987012]/30 hover:text-[#987012]`
                      }`}>
                        {l({ ar: 'اختر هذه الحزمة', en: 'Choose This Package' })}
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link href="/package-compare">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#987012] hover:text-[#d4a832] transition-all duration-300 font-semibold group">
                {l({ ar: 'قارن جميع الحزم بالتفصيل', en: 'Compare All Packages in Detail' })}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className={`py-12 sm:py-20 ${bg2} relative`} ref={statsSection.ref}>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
            {stats.map((s, i) => (
              <div key={i} className={`rounded-2xl p-4 sm:p-6 text-center border transition-all duration-700 hover:scale-[1.04] ${cardBg} ${statsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 70}ms` }}>
                <p className="text-xl sm:text-3xl font-bold gold-text mb-1.5"><AnimatedCounter target={s.value} /></p>
                <p className={`text-[9px] sm:text-xs ${textMuted}`}>{l(s.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUCCESS STORIES ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative overflow-hidden`} ref={successSection.ref}>
        {isDark && <GoldParticles />}
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${successSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'قصص النجاح', en: 'Success Stories' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 transition-all duration-700 delay-100 ${successSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'رعاة حققوا نتائج استثنائية', en: 'Sponsors Who Achieved Exceptional Results' })}
            </h2>
          </div>
          {/* Success Stories Hero Image */}
          <div className={`rounded-2xl overflow-hidden mb-8 sm:mb-12 transition-all duration-700 delay-200 ${successSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative h-48 sm:h-64 lg:h-80">
              <img src={REPORT_SUCCESS_IMG} alt="Success celebration" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#181715] via-[#181715]/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`} />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8">
                <p className="text-white text-sm sm:text-lg font-bold drop-shadow-lg">{l({ ar: 'رعاة مهام إكسبو يحققون نتائج استثنائية في كل فعالية', en: 'Maham Expo sponsors achieve exceptional results at every event' })}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {successStories.map((s, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden border transition-all duration-700 hover:scale-[1.02] ${cardBg} ${cardHover} ${successSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 120}ms` }}>
                {/* Story Image */}
                <div className="relative h-36 sm:h-44 overflow-hidden">
                  <img src={successStoryImages[i]} alt={l(s.company)} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#181715]/90 to-transparent' : 'bg-gradient-to-t from-white/90 to-transparent'}`} />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#fbf8f0]0 text-white">{l(s.tier)}</span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`text-sm sm:text-base font-bold ${textPrimary} mb-1`}>{l(s.company)}</h3>
                  <p className="text-[10px] sm:text-xs text-[#987012]/70 mb-3">{l(s.event)}</p>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#987012]/20 to-transparent mb-3" />
                  <p className={`text-[10px] sm:text-xs ${textSecondary} leading-relaxed`}>{l(s.result)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ECONOMIC MODEL ===== */}
      <section className={`py-14 sm:py-24 ${bg2} relative overflow-hidden`} ref={economicSection.ref}>
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={EXPO_HALL_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${economicSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'النموذج الاقتصادي', en: 'Economic Model' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 transition-all duration-700 delay-100 ${economicSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'الرعاية قناة نمو تجاري حقيقية', en: 'Sponsorship is a Real Business Growth Channel' })}
            </h2>
          </div>
          <div className={`rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto border transition-all duration-700 delay-200 ${cardBg} ${economicSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
              {[
                { val: '300', label: { ar: 'جناح لكل فعالية', en: 'Booths per Event' } },
                { val: '30,000', label: { ar: 'زائر لكل فعالية', en: 'Visitors per Event' } },
                { val: '10', label: { ar: 'رعاة لكل فعالية', en: 'Sponsors per Event' } },
                { val: '1.4M', label: { ar: 'ر.س إيرادات رعاية', en: 'SAR Sponsor Revenue' } },
              ].map((e, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl sm:text-3xl font-bold gold-text"><AnimatedCounter target={e.val} /></p>
                  <p className={`text-[9px] sm:text-xs ${textMuted} mt-1`}>{l(e.label)}</p>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#987012]/20 to-transparent mb-6 sm:mb-10" />
            <div className="text-center">
              <p className={`text-sm sm:text-lg ${textSecondary} mb-2`}>
                {l({ ar: '10 فعاليات سنوياً =', en: '10 events annually =' })}
              </p>
              <p className="text-3xl sm:text-5xl font-bold gold-text font-['Cairo']">
                14M+ <span className="text-sm sm:text-lg">{l({ ar: 'ر.س إيرادات رعاية سنوية', en: 'SAR Annual Sponsorship Revenue' })}</span>
              </p>
              <p className={`text-[10px] sm:text-xs ${textMuted} mt-2`}>
                {l({ ar: 'هذه قناة تجارية جادة — ليست مجرد ظهور', en: 'This is a serious commercial channel — not just visibility' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI LAYER ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative overflow-hidden`} ref={aiSection.ref}>
        {isDark && <GoldParticles />}
        {/* AI Background Image */}
        <div className="absolute inset-0 opacity-[0.06]">
          <img src={AI_ASSISTANT_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
            <div className={`transition-all duration-700 ${aiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3">
                {l({ ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' })}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-5">
                {l({ ar: 'Maham AI — مساعدك الذكي', en: 'Maham AI — Your Smart Assistant' })}
              </h2>
              <p className={`${textSecondary} text-xs sm:text-sm mb-6 sm:mb-8`}>
                {l({ ar: 'ذكاء اصطناعي مدمج في كل خطوة من رحلة الرعاية — من اختيار الفعالية إلى قياس العائد', en: 'AI integrated into every step of the sponsorship journey — from event selection to ROI measurement' })}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { ar: 'توصيات بأفضل الفعاليات لقطاعك', en: 'Best event recommendations for your sector' },
                  { ar: 'اقتراح أصول الرعاية الأعلى تأثيراً', en: 'Suggest highest-impact sponsorship assets' },
                  { ar: 'تقدير عائد الاستثمار المتوقع', en: 'Estimate expected ROI' },
                  { ar: 'تحليل توافق الجمهور مع علامتك', en: 'Analyze audience fit with your brand' },
                  { ar: 'اقتراح حزم مركبة (مادية + رقمية)', en: 'Suggest combined packages (physical + digital)' },
                  { ar: 'تحديد المواقع عالية الحركة والقيمة', en: 'Identify high-traffic, high-value placements' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#987012]/10 flex items-center justify-center shrink-0">
                      <Bot size={12} className="text-[#987012]" />
                    </div>
                    <span className={`text-[10px] sm:text-xs ${isDark ? 'text-[#A0A0A0]' : 'text-[#565656]'}`}>{l(item)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-2xl p-5 sm:p-7 border transition-all duration-700 delay-300 ${cardBg} ${aiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#987012]/15 flex items-center justify-center">
                  <Bot size={16} className="text-[#987012]" />
                </div>
                <span className={`text-sm font-bold ${textPrimary}`}>Maham AI</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fbf8f0]0/10 text-[#d4b85a] font-medium">{l({ ar: 'متصل', en: 'Online' })}</span>
              </div>
              {[
                { label: { ar: 'موصى لعلامتك', en: 'Recommended for Your Brand' }, val: { ar: 'مؤتمر ليب 2026 — عائد متوقع 340%', en: 'LEAP 2026 — Expected ROI 340%' }, color: 'text-[#d4b85a]' },
                { label: { ar: 'أصول عالية التأثير', en: 'High Impact Assets' }, val: { ar: 'شاشة المدخل الرئيسي + جدار التسجيل', en: 'Main entrance screen + Registration wall' }, color: 'text-[#987012]' },
                { label: { ar: 'أفضل حزمة لميزانيتك', en: 'Best Package for Budget' }, val: { ar: 'ذهبي + ترقية رقمية = وفر 15%', en: 'Gold + Digital upgrade = Save 15%' }, color: 'text-blue-400' },
                { label: { ar: 'رعاة مشابهون اختاروا', en: 'Similar Sponsors Chose' }, val: { ar: 'بلاتيني في ديب فيست + ذهبي في ليب', en: 'Platinum at DeepFest + Gold at LEAP' }, color: 'text-purple-400' },
              ].map((r, i) => (
                <div key={i} className={`mb-3 p-3.5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-[#F9F8F5] border-[#F0EEE7]'}`}>
                  <p className={`text-[9px] sm:text-[10px] font-semibold ${r.color} mb-0.5`}>{l(r.label)}</p>
                  <p className={`text-[10px] sm:text-xs ${textSecondary}`}>{l(r.val)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPLIANCE ===== */}
      <section className={`py-12 sm:py-20 ${bg2} relative`} ref={complianceSection.ref}>
        <div className="container relative z-10">
          <h2 className={`text-2xl sm:text-3xl font-bold font-['Cairo'] text-center mb-2 sm:mb-3 gold-text transition-all duration-700 ${complianceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {l({ ar: 'الامتثال والتوافق', en: 'Compliance & Regulations' })}
          </h2>
          <p className={`${textSecondary} text-center mb-8 sm:mb-12 max-w-xl mx-auto text-xs sm:text-sm transition-all duration-700 delay-100 ${complianceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {l({ ar: 'متوافقون بالكامل مع جميع الأنظمة والمعايير السعودية والعالمية', en: 'Fully compliant with all Saudi and international regulations' })}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {compliance.map((c, i) => (
              <div key={i} className={`rounded-2xl p-4 sm:p-5 text-center border transition-all duration-700 hover:scale-[1.04] ${cardBg} ${complianceSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-[#987012]/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Shield size={18} className="text-[#987012] sm:w-5 sm:h-5" />
                </div>
                <p className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-foreground/90' : 'text-[#010101]'}`}>{typeof c.label === 'string' ? c.label : l(c.label)}</p>
                <p className={`text-[8px] sm:text-[10px] ${textMuted} mt-0.5 sm:mt-1 leading-tight`}>{l(c.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={`py-14 sm:py-24 ${bg1} relative`} ref={faqSection.ref}>
        {isDark && <GoldParticles />}
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className={`inline-block text-[10px] sm:text-xs text-[#987012] font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 transition-all duration-700 ${faqSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'الأسئلة الشائعة', en: 'FAQ' })}
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold font-['Cairo'] gold-text transition-all duration-700 delay-100 ${faqSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {l({ ar: 'أسئلة متكررة', en: 'Frequently Asked Questions' })}
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className={`transition-all duration-700 ${faqSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 70}ms` }}>
                <FAQItem q={l(f.q)} a={l(f.a)} open={openFAQ === i} onClick={() => setOpenFAQ(openFAQ === i ? null : i)} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / CONSULTATION ===== */}
      <section className={`py-14 sm:py-24 ${bg2} relative overflow-hidden`} ref={contactSection.ref}>
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={TEAM_MEETING_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className={`rounded-2xl p-7 sm:p-12 max-w-3xl mx-auto text-center border transition-all duration-700 ${cardBg} ${contactSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sovereign-glass-gold flex items-center justify-center mx-auto mb-5 sm:mb-7 sovereign-glow">
              <Phone size={28} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Cairo'] gold-text mb-3 sm:mb-4">
              {l({ ar: 'احجز استشارة رعاية مجانية', en: 'Book a Free Sponsorship Consultation' })}
            </h2>
            <p className={`${textSecondary} text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto`}>
              {l({ ar: 'فريقنا المتخصص جاهز لمساعدتك في اختيار أفضل فرص الرعاية المناسبة لعلامتك التجارية وميزانيتك', en: 'Our specialized team is ready to help you choose the best sponsorship opportunities for your brand and budget' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 sm:mb-8">
              <a href="tel:+966535555900" className={`flex items-center gap-2 text-xs sm:text-sm ${textSecondary} hover:text-[#987012] transition-colors`}>
                <Phone size={14} />
                <span dir="ltr">+966 53 555 5900</span>
              </a>
              <a href="mailto:info@mahamexpo.sa" className={`flex items-center gap-2 text-xs sm:text-sm ${textSecondary} hover:text-[#987012] transition-colors`}>
                <Mail size={14} />
                <span>info@mahamexpo.sa</span>
              </a>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/login">
                <span className="btn-cta-glass px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2">
                  {l({ ar: 'ابدأ الآن مجاناً', en: 'Start Now for Free' })}
                </span>
              </Link>
              <Link href="/opportunities">
                <span className="btn-ghost-glass px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2">
                  {l({ ar: 'تصفح بدون تسجيل', en: 'Browse Without Registration' })}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POLICIES ===== */}
      <section className={`py-12 sm:py-20 ${bg1}`}>
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cairo'] text-center mb-8 sm:mb-12 gold-text">
            {l({ ar: 'السياسات والأحكام', en: 'Policies & Terms' })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: { ar: 'سياسة الدفع', en: 'Payment Policy' }, items: { ar: ['دفعة مقدمة 50% لتأكيد الرعاية', 'المتبقي يُستحق قبل 30 يوماً من الفعالية', 'ندعم: بطاقات ائتمان، مدى، Apple Pay، تحويل بنكي', 'فاتورة ضريبية متوافقة مع ZATCA'], en: ['50% advance payment to confirm sponsorship', 'Remaining due 30 days before event', 'We support: Credit cards, Mada, Apple Pay, bank transfer', 'ZATCA-compliant tax invoice'] } },
              { title: { ar: 'سياسة الإلغاء', en: 'Cancellation Policy' }, items: { ar: ['الدفعة المقدمة غير مستردة', 'إلغاء قبل 30+ يوماً: استرداد 50% من المتبقي', 'إلغاء قبل أقل من 30 يوماً: لا يوجد استرداد', 'سياسة استبدال الأصول متاحة'], en: ['Advance payment is non-refundable', 'Cancel 30+ days before: 50% refund of remaining', 'Cancel less than 30 days: no refund', 'Asset replacement policy available'] } },
              { title: { ar: 'الخصوصية والأمان', en: 'Privacy & Security' }, items: { ar: ['بياناتك محمية وفق نظام حماية البيانات الشخصية PDPL', 'تشفير كامل لجميع المعاملات المالية', 'لا نشارك بياناتك مع أطراف ثالثة', 'سجل تدقيق كامل لجميع العمليات'], en: ['Your data is protected per PDPL', 'Full encryption for all financial transactions', 'We do not share your data with third parties', 'Full audit log for all operations'] } },
            ].map((policy, i) => (
              <div key={i} className={`rounded-2xl p-5 sm:p-6 border ${cardBg}`}>
                <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} mb-3 sm:mb-4`}>{l(policy.title)}</h3>
                <div className="space-y-2 sm:space-y-2.5">
                  {l(policy.items).map((item: string, idx: number) => (
                    <p key={idx} className={`text-[10px] sm:text-xs ${textSecondary} flex items-start gap-2`}>
                      <span className="text-[#987012] mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`py-10 sm:py-14 border-t ${isDark ? 'bg-[#08090d] border-white/5' : 'bg-[#F9F8F5] border-[#F0EEE7]'}`}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-7 sm:gap-10 mb-8 sm:mb-10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Cairo'] mb-2 gold-text">MAHAM EXPO</h3>
              <p className={`text-[10px] sm:text-xs ${textMuted} leading-relaxed`}>{l({ ar: 'شركة مهام إكسبو لتنظيم المعارض والمؤتمرات — فرع من شركة مهام للخدمات وتقنية المعلومات', en: 'Maham Expo for Exhibitions & Conferences — A branch of Maham Services & IT Company' })}</p>
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-foreground/90' : 'text-[#565656]'} mb-3 sm:mb-4`}>{l({ ar: 'بوابة الداعم', en: 'Sponsor Portal' })}</h4>
              <div className={`space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs ${textMuted}`}>
                <Link href="/opportunities"><span className="hover:text-[#987012] transition-colors block">{l({ ar: 'فرص الرعاية', en: 'Sponsorship Opportunities' })}</span></Link>
                <Link href="/login"><span className="hover:text-[#987012] transition-colors block">{l({ ar: 'لوحة التحكم', en: 'Dashboard' })}</span></Link>
                <Link href="/contracts"><span className="hover:text-[#987012] transition-colors block">{l({ ar: 'العقود', en: 'Contracts' })}</span></Link>
                <Link href="/analytics"><span className="hover:text-[#987012] transition-colors block">{l({ ar: 'التحليلات', en: 'Analytics' })}</span></Link>
              </div>
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-foreground/90' : 'text-[#565656]'} mb-3 sm:mb-4`}>{l({ ar: 'الخدمات', en: 'Services' })}</h4>
              <div className={`space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs ${textMuted}`}>
                <p>{l({ ar: 'الحملات التسويقية', en: 'Marketing Campaigns' })}</p>
                <p>{l({ ar: 'توليد العملاء', en: 'Lead Generation' })}</p>
                <p>{l({ ar: 'إدارة أصول العلامة', en: 'Brand Asset Management' })}</p>
                <p>{l({ ar: 'المساعد الذكي', en: 'AI Assistant' })}</p>
              </div>
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-foreground/90' : 'text-[#565656]'} mb-3 sm:mb-4`}>{l({ ar: 'تواصل معنا', en: 'Contact Us' })}</h4>
              <div className={`space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs ${textMuted}`}>
                <p>info@mahamexpo.sa</p>
                <p>rent@mahamexpo.sa</p>
                <p dir="ltr" className="text-start">+966 53 555 5900</p>
                <p dir="ltr" className="text-start">+966 53 477 8899</p>
                <p className="mt-2">{l({ ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Kingdom of Saudi Arabia' })}</p>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#987012]/15 to-transparent mb-5" />
          <div className="text-center">
            <p className={`text-[9px] sm:text-xs ${textMuted}`}>&copy; 2026 Maham Expo for Exhibitions & Conferences — {l({ ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
