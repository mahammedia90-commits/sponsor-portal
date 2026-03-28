/**
 * Verification — KYC and compliance verification
 * ZATCA & Ministry of Commerce compliant
 */
import { useLanguage } from '@/contexts/LanguageContext';

import { Shield, CheckCircle, Upload, FileText, Building2, CreditCard, Globe, Bot, Lock, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const verificationSteps = [
  { id: 1, status: 'completed', icon: Building2, titleAr: 'معلومات الشركة الأساسية', titleEn: 'Basic Company Info', descAr: 'اسم الشركة، السجل التجاري، العنوان', descEn: 'Company name, CR, address' },
  { id: 2, status: 'completed', icon: FileText, titleAr: 'الوثائق القانونية', titleEn: 'Legal Documents', descAr: 'السجل التجاري، شهادة الزكاة، رخصة البلدية', descEn: 'CR, ZATCA certificate, municipality license' },
  { id: 3, status: 'completed', icon: CreditCard, titleAr: 'المعلومات المالية', titleEn: 'Financial Information', descAr: 'الحساب البنكي، شهادة الضريبة المضافة', descEn: 'Bank account, VAT certificate' },
  { id: 4, status: 'completed', icon: Shield, titleAr: 'التحقق من الهوية (KYC)', titleEn: 'Identity Verification (KYC)', descAr: 'هوية المفوض بالتوقيع، تفويض رسمي', descEn: 'Authorized signatory ID, official authorization' },
  { id: 5, status: 'completed', icon: Globe, titleAr: 'التحقق من النشاط التجاري', titleEn: 'Business Activity Verification', descAr: 'الموقع الإلكتروني، وسائل التواصل، المراجع', descEn: 'Website, social media, references' },
];

const documents = [
  { name: 'السجل التجاري', nameEn: 'Commercial Registration', status: 'verified', date: '2026-01-10', expiry: '2027-01-10' },
  { name: 'شهادة الزكاة والدخل', nameEn: 'ZATCA Certificate', status: 'verified', date: '2026-01-10', expiry: '2026-12-31' },
  { name: 'شهادة ضريبة القيمة المضافة', nameEn: 'VAT Certificate', status: 'verified', date: '2026-01-10', expiry: '2027-01-10' },
  { name: 'رخصة البلدية', nameEn: 'Municipality License', status: 'verified', date: '2026-01-10', expiry: '2026-06-30' },
  { name: 'تفويض المفوض بالتوقيع', nameEn: 'Signatory Authorization', status: 'verified', date: '2026-01-10', expiry: '2027-01-10' },
];

export default function Verification() {
  const { language } = useLanguage();

  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'التحقق والتوثيق', en: 'Verification' })}
        subtitle={l({ ar: 'وثّق حسابك للوصول الكامل', en: 'Verify your account for full access' })}
        image={IMAGES.teamMeeting}
      />


      {/* Status Banner */}
      <div className="glass-card animate-border-glow rounded-xl p-4 border-[#fbf8f0]0/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#fbf8f0]0/10"><Fingerprint size={20} className="text-[#d4b85a]" /></div>
          <div>
            <h2 className="text-sm font-bold text-[#d4b85a]">{l({ ar: 'حسابك موثّق بالكامل', en: 'Your Account is Fully Verified' })}</h2>
            <p className="text-[10px] text-muted-foreground/50">{l({ ar: 'جميع الوثائق المطلوبة تم التحقق منها بنجاح — يمكنك حجز الرعايات وتوقيع العقود', en: 'All required documents verified — you can book sponsorships and sign contracts' })}</p>
          </div>
          <div className="mr-auto px-3 py-1 rounded-full bg-[#fbf8f0]0/10 border border-[#fbf8f0]0/20">
            <span className="text-[9px] font-bold text-[#d4b85a]">{l({ ar: 'موثّق 100%', en: '100% Verified' })}</span>
          </div>
        </div>
      </div>

      {/* Verification Steps */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <h3 className="text-xs font-bold text-foreground mb-4">{l({ ar: 'خطوات التحقق', en: 'Verification Steps' })}</h3>
        <div className="space-y-2.5">
          {verificationSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="p-1.5 rounded-full bg-[#fbf8f0]0/10"><CheckCircle size={14} className="text-[#d4b85a]" /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-foreground">{language === 'ar' ? step.titleAr : step.titleEn}</p>
                  <p className="text-[9px] text-muted-foreground/50">{language === 'ar' ? step.descAr : step.descEn}</p>
                </div>
                <Icon size={14} className="text-[#987012]/40" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-foreground">{l({ ar: 'الوثائق المرفوعة', en: 'Uploaded Documents' })}</h3>
          <button onClick={() => toast.info(l({ ar: 'ستتوفر هذه الميزة قريباً', en: 'Feature coming soon' }))} className="flex items-center gap-1 text-[10px] text-[#987012] hover:underline">
            <Upload size={10} />{l({ ar: 'رفع وثيقة', en: 'Upload Document' })}
          </button>
        </div>
        <div className="space-y-2">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#987012]/10"><FileText size={12} className="text-[#987012]" /></div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">{language === 'ar' ? doc.name : doc.nameEn}</p>
                  <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'تاريخ الرفع:', en: 'Uploaded:' })} {doc.date}</p>
                </div>
              </div>
              <div className="text-end">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fbf8f0]0/10 border border-[#fbf8f0]0/20 text-[#d4b85a] font-medium">{l({ ar: 'موثّق', en: 'Verified' })}</span>
                <p className="text-[8px] text-foreground/20 mt-0.5">{l({ ar: 'ينتهي:', en: 'Expires:' })} {doc.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Info */}
      <div className="glass-card animate-border-glow rounded-xl p-3 border-blue-500/10">
        <div className="flex items-center gap-3">
          <Lock size={14} className="text-blue-400 shrink-0" />
          <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'جميع بياناتك مشفرة ومحمية وفقاً لمعايير الأمان السعودية (NCA) — لا يتم مشاركة بياناتك مع أي طرف ثالث بدون موافقتك', en: 'All your data is encrypted and protected per Saudi NCA standards — your data is never shared with third parties without consent' })}</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'حسابك موثّق بالكامل وجاهز لحجز الرعايات وتوقيع العقود. تنبيه: رخصة البلدية تنتهي في 2026-06-30 — ننصح بتجديدها قبل 30 يوماً من الانتهاء لتجنب تعليق الحساب.', en: 'Your account is fully verified and ready for sponsorship bookings and contract signing. Alert: Municipality license expires on 2026-06-30 — we recommend renewing 30 days before expiry to avoid account suspension.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
