/**
 * Help Center — Support and FAQ
 * Glassmorphism design
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MessageSquare, Video } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const faqs = [
  { q: { ar: 'كيف أصبح داعماً/راعياً لفعالية؟', en: 'How do I become an event sponsor?' }, a: { ar: 'يمكنك تصفح فرص الرعاية المتاحة من قسم "فرص الرعاية" واختيار الحزمة المناسبة لميزانيتك وأهدافك التسويقية. بعد اختيار الحزمة، قم بتقديم طلب وسيتم مراجعته من فريق مهام إكسبو خلال 48 ساعة.', en: 'Browse available opportunities in the "Sponsorship Opportunities" section and select a package that fits your budget. Submit a request and our team will review it within 48 hours.' } },
  { q: { ar: 'ما هي حزم الرعاية المتاحة؟', en: 'What sponsorship packages are available?' }, a: { ar: 'نوفر 4 حزم رعاية: بلاتيني (الأعلى)، ذهبي، فضي، وبرونزي. كل حزمة تتضمن مزايا مختلفة من حيث ظهور العلامة التجارية، حجم المنصة، عدد الدعوات VIP، والتغطية الإعلامية.', en: 'We offer 4 packages: Platinum (highest), Gold, Silver, and Bronze. Each includes different benefits for brand exposure, booth size, VIP passes, and media coverage.' } },
  { q: { ar: 'كيف أتتبع أداء رعايتي؟', en: 'How do I track my sponsorship performance?' }, a: { ar: 'من خلال قسم "التحليلات" يمكنك متابعة مشاهدات العلامة التجارية، عدد العملاء المحتملين، معدل التحويل، والعائد على الاستثمار. كما يوفر المساعد الذكي توصيات مخصصة لتحسين الأداء.', en: 'Through the "Analytics" section you can track brand impressions, leads, conversion rates, and ROI. The AI Assistant also provides personalized optimization recommendations.' } },
  { q: { ar: 'ما هي طرق الدفع المتاحة؟', en: 'What payment methods are available?' }, a: { ar: 'نقبل بطاقات الائتمان (Visa, Mastercard, Mada)، التحويل البنكي، STC Pay، وخدمات التقسيط (تمارا، تابي). جميع المعاملات متوافقة مع ZATCA.', en: 'We accept credit cards (Visa, Mastercard, Mada), bank transfers, STC Pay, and BNPL services (Tamara, Tabby). All transactions are ZATCA compliant.' } },
  { q: { ar: 'كيف أحصل على عملاء محتملين من الفعاليات؟', en: 'How do I get leads from events?' }, a: { ar: 'يتم توليد العملاء المحتملين تلقائياً من خلال تفاعل الزوار والتجار مع علامتك التجارية في الفعالية. يمكنك متابعتهم من قسم "العملاء المحتملون" والتواصل معهم مباشرة.', en: 'Leads are automatically generated from visitor and trader interactions with your brand at events. Track and contact them directly from the "Leads" section.' } },
  { q: { ar: 'هل يمكنني إلغاء رعايتي؟', en: 'Can I cancel my sponsorship?' }, a: { ar: 'يمكن إلغاء الرعاية وفقاً لشروط العقد. عادةً يمكن الإلغاء مع استرداد كامل قبل 60 يوم من الفعالية، واسترداد 50% قبل 30 يوم. بعد ذلك لا يمكن الاسترداد.', en: 'Cancellation follows contract terms. Usually full refund before 60 days, 50% before 30 days, no refund after that.' } },
];

export default function Help() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'مركز المساعدة', en: 'Help Center' })}
        subtitle={l({ ar: 'نحن هنا لمساعدتك', en: 'We are here to help you' })}
        image={IMAGES.teamMeeting}
      />

      <div className="glass-card animate-border-glow rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#987012]/10 animate-glow"><HelpCircle size={20} className="text-[#987012]" /></div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Phone, label: l({ ar: 'اتصل بنا', en: 'Call Us' }), value: '00966535555900', action: () => toast.info('00966535555900') },
          { icon: Mail, label: l({ ar: 'البريد الإلكتروني', en: 'Email' }), value: 'info@mahamexpo.sa', action: () => toast.info('info@mahamexpo.sa') },
          { icon: MessageSquare, label: l({ ar: 'محادثة مباشرة', en: 'Live Chat' }), value: l({ ar: 'متاح 24/7', en: 'Available 24/7' }), action: () => toast.info(l({ ar: 'ستتوفر قريباً', en: 'Coming soon' })) },
          { icon: Video, label: l({ ar: 'اجتماع فيديو', en: 'Video Meeting' }), value: l({ ar: 'حجز موعد', en: 'Book a Meeting' }), action: () => toast.info(l({ ar: 'ستتوفر قريباً', en: 'Coming soon' })) },
        ].map((contact, i) => (
          <button key={i} onClick={contact.action} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 text-center tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <contact.icon size={16} className="text-[#987012] mx-auto mb-2" />
            <p className="text-[10px] font-bold text-foreground">{contact.label}</p>
            <p className="text-[8px] text-muted-foreground/50">{contact.value}</p>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <h3 className="text-xs font-bold text-foreground mb-3">{l({ ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' })}</h3>
        <div className="space-y-1.5">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3 text-right hover:bg-muted/30 transition-colors">
                <span className="text-[10px] font-medium text-foreground">{faq.q[language as 'ar' | 'en']}</span>
                {openFaq === i ? <ChevronUp size={12} className="text-[#987012] shrink-0" /> : <ChevronDown size={12} className="text-foreground/20 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-3 pb-3 border-t border-border">
                  <p className="text-[9px] text-muted-foreground/50 leading-relaxed pt-2">{faq.a[language as 'ar' | 'en']}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
