/**
 * Team Management — Manage sponsor team members
 * Glassmorphism design
 */
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Plus, Shield, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

const teamMembers = [
  { id: '1', name: 'أحمد محمد الراشد', nameEn: 'Ahmed Al-Rashed', email: 'ahmed@techvision.sa', phone: '+966 55 123 4567', role: 'مدير الحساب', roleEn: 'Account Manager', status: 'active', permissions: ['full_access'] },
  { id: '2', name: 'سارة العلي', nameEn: 'Sara Al-Ali', email: 'sara@techvision.sa', phone: '+966 50 987 6543', role: 'مدير التسويق', roleEn: 'Marketing Manager', status: 'active', permissions: ['campaigns', 'analytics', 'brand_exposure'] },
  { id: '3', name: 'خالد الحربي', nameEn: 'Khalid Al-Harbi', email: 'khalid@techvision.sa', phone: '+966 55 111 2233', role: 'مسؤول العقود', roleEn: 'Contracts Officer', status: 'active', permissions: ['contracts', 'payments'] },
  { id: '4', name: 'نورة القحطاني', nameEn: 'Noura Al-Qahtani', email: 'noura@techvision.sa', phone: '+966 50 444 5566', role: 'محلل بيانات', roleEn: 'Data Analyst', status: 'active', permissions: ['analytics', 'leads', 'reports'] },
];

export default function Team() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'إدارة الفريق', en: 'Team Management' })}
        subtitle={l({ ar: 'أدر فريق الرعاية الخاص بك', en: 'Manage your sponsorship team' })}
        image={IMAGES.networking}
      />

      <div className="flex items-center justify-between">
        <button onClick={() => toast.info(l({ ar: 'ستتوفر هذه الميزة قريباً', en: 'Feature coming soon' }))} className="btn-cta-glass px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1">
          <Plus size={12} />{l({ ar: 'إضافة عضو', en: 'Add Member' })}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {teamMembers.map((member, i) => (
          <div key={member.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#987012]/10 flex items-center justify-center text-[10px] font-bold text-[#987012]">{member.name.charAt(0)}</div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">{language === 'ar' ? member.name : member.nameEn}</p>
                  <p className="text-[9px] text-[#987012]">{language === 'ar' ? member.role : member.roleEn}</p>
                </div>
              </div>
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-[#fbf8f0]0/10 text-[#d4b85a] border border-[#fbf8f0]0/20">{l({ ar: 'نشط', en: 'Active' })}</span>
            </div>
            <div className="space-y-1 mb-2.5">
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50"><Mail size={10} />{member.email}</div>
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50"><Phone size={10} /><span dir="ltr">{member.phone}</span></div>
            </div>
            <div className="flex flex-wrap gap-1">
              {member.permissions.map(p => (
                <span key={p} className="text-[8px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground/50 border border-border">
                  <Shield size={7} className="inline mr-0.5" />
                  {p === 'full_access' ? l({ ar: 'وصول كامل', en: 'Full Access' }) : p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
