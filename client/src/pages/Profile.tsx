/**
 * Profile — Sponsor company profile
 * Connected to real tRPC API
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Globe, Mail, Phone, MapPin, Briefcase, Users, Target, Edit, Shield, CheckCircle, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

export default function Profile() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const { sponsor, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-[#987012]" />
      </div>
    );
  }

  const s = sponsor;

  const fields = [
    { icon: Building2, label: l({ ar: 'اسم الشركة', en: 'Company Name' }), value: s?.companyName || user?.name || '—' },
    { icon: Briefcase, label: l({ ar: 'العلامة التجارية', en: 'Brand Name' }), value: s?.brandName || '—' },
    { icon: User, label: l({ ar: 'جهة الاتصال', en: 'Contact Person' }), value: s?.contactPerson || user?.name || '—' },
    { icon: Mail, label: l({ ar: 'البريد الإلكتروني', en: 'Email' }), value: s?.email || user?.email || '—' },
    { icon: Phone, label: l({ ar: 'الهاتف', en: 'Phone' }), value: s?.phone || '—' },
    { icon: MapPin, label: l({ ar: 'الدولة', en: 'Country' }), value: s?.country || '—' },
    { icon: Target, label: l({ ar: 'القطاع', en: 'Industry' }), value: s?.industry || '—' },
    { icon: Users, label: l({ ar: 'حجم الشركة', en: 'Company Size' }), value: s?.companySize || '—' },
    { icon: Globe, label: l({ ar: 'الموقع الإلكتروني', en: 'Website' }), value: s?.website || '—' },
    { icon: Target, label: l({ ar: 'السوق المستهدف', en: 'Target Market' }), value: s?.targetMarket || '—' },
    { icon: Briefcase, label: l({ ar: 'ميزانية التسويق', en: 'Marketing Budget' }), value: s?.marketingBudget || '—' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'الملف الشخصي', en: 'Profile' })}
        subtitle={l({ ar: 'إدارة بيانات حسابك', en: 'Manage your account information' })}
        image={IMAGES.teamMeeting}
      />

      {/* Header Card */}
      <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#987012]/10 flex items-center justify-center animate-glow"><Building2 size={24} className="text-[#987012]" /></div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground font-['Cairo']">{s?.companyName || user?.name || '—'}</h2>
              <p className="text-[10px] text-muted-foreground/70">{s?.brandName || '—'}</p>
              <div className="flex items-center gap-2 mt-1">
                {s?.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full bg-[#fbf8f0]0/10 text-[#d4b85a] border border-[#fbf8f0]0/20"><CheckCircle size={8} />{l({ ar: 'موثّق', en: 'Verified' })}</span>
                )}
                {s && <span className="text-[8px] text-foreground/20">#{s.id}</span>}
              </div>
            </div>
          </div>
          <button onClick={() => toast.info(l({ ar: 'ستتوفر هذه الميزة قريباً', en: 'Feature coming soon' }))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-[10px] text-muted-foreground/70 hover:text-[#987012] hover:border-[#987012]/30 transition-all">
            <Edit size={10} />{l({ ar: 'تعديل', en: 'Edit' })}
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <h3 className="text-xs font-bold text-foreground mb-3">{l({ ar: 'معلومات الشركة', en: 'Company Information' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <field.icon size={14} className="text-[#987012]/50 shrink-0" />
              <div>
                <p className="text-[8px] text-foreground/20">{field.label}</p>
                <p className="text-[10px] font-medium text-foreground">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="glass-card animate-border-glow rounded-xl p-4">
        <h3 className="text-xs font-bold text-foreground mb-3">{l({ ar: 'الامتثال والتوافق', en: 'Compliance' })}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'ZATCA', desc: l({ ar: 'هيئة الزكاة والضريبة', en: 'Tax Authority' }) },
            { label: l({ ar: 'وزارة التجارة', en: 'MOC' }), desc: l({ ar: 'سجل تجاري ساري', en: 'Active CR' }) },
            { label: 'KYC', desc: l({ ar: 'اعرف عميلك', en: 'Know Your Customer' }) },
            { label: 'AML', desc: l({ ar: 'مكافحة غسل الأموال', en: 'Anti Money Laundering' }) },
            { label: 'GDPR', desc: l({ ar: 'حماية البيانات', en: 'Data Protection' }) },
            { label: 'ISO 27001', desc: l({ ar: 'أمن المعلومات', en: 'Info Security' }) },
          ].map((comp, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#fbf8f0]0/[0.03] border border-[#fbf8f0]0/10 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <Shield size={12} className="text-[#d4b85a] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-foreground">{comp.label}</p>
                <p className="text-[8px] text-foreground/20">{comp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
