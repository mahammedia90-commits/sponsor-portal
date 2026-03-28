/**
 * Networking — Sponsor Networking Hub
 * Connect with traders, investors, other sponsors, and event organizers
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Users, Search, MessageSquare, Star, MapPin, Building2,
  Globe, Bot, ArrowUpRight, Filter, Crown, Shield,
  Handshake, UserPlus, Eye, Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface Contact {
  id: string;
  name: { ar: string; en: string };
  company: { ar: string; en: string };
  role: { ar: string; en: string };
  type: 'trader' | 'investor' | 'sponsor' | 'organizer';
  sector: { ar: string; en: string };
  location: { ar: string; en: string };
  matchScore: number;
  avatar: string;
  verified: boolean;
}

const contacts: Contact[] = [
  { id: 'C1', name: { ar: 'أحمد الراشد', en: 'Ahmed Al-Rashid' }, company: { ar: 'شركة الراشد للتقنية', en: 'Al-Rashid Tech Co.' }, role: { ar: 'المدير التنفيذي', en: 'CEO' }, type: 'trader', sector: { ar: 'التقنية', en: 'Technology' }, location: { ar: 'الرياض', en: 'Riyadh' }, matchScore: 95, avatar: 'AR', verified: true },
  { id: 'C2', name: { ar: 'فاطمة العلي', en: 'Fatima Al-Ali' }, company: { ar: 'مجموعة العلي للاستثمار', en: 'Al-Ali Investment Group' }, role: { ar: 'مديرة الاستثمار', en: 'Investment Director' }, type: 'investor', sector: { ar: 'الاستثمار', en: 'Investment' }, location: { ar: 'جدة', en: 'Jeddah' }, matchScore: 92, avatar: 'FA', verified: true },
  { id: 'C3', name: { ar: 'خالد المنصور', en: 'Khalid Al-Mansour' }, company: { ar: 'بنك الرياض', en: 'Riyad Bank' }, role: { ar: 'نائب الرئيس', en: 'VP' }, type: 'sponsor', sector: { ar: 'البنوك', en: 'Banking' }, location: { ar: 'الرياض', en: 'Riyadh' }, matchScore: 88, avatar: 'KM', verified: true },
  { id: 'C4', name: { ar: 'سارة الحربي', en: 'Sara Al-Harbi' }, company: { ar: 'شركة نيوم', en: 'NEOM Company' }, role: { ar: 'مديرة الشراكات', en: 'Partnerships Director' }, type: 'investor', sector: { ar: 'التطوير العقاري', en: 'Real Estate Development' }, location: { ar: 'نيوم', en: 'NEOM' }, matchScore: 85, avatar: 'SH', verified: true },
  { id: 'C5', name: { ar: 'محمد القحطاني', en: 'Mohammed Al-Qahtani' }, company: { ar: 'STC', en: 'STC' }, role: { ar: 'مدير التسويق', en: 'Marketing Director' }, type: 'sponsor', sector: { ar: 'الاتصالات', en: 'Telecom' }, location: { ar: 'الرياض', en: 'Riyadh' }, matchScore: 82, avatar: 'MQ', verified: true },
  { id: 'C6', name: { ar: 'نورة السعيد', en: 'Noura Al-Saeed' }, company: { ar: 'مهام إكسبو', en: 'Maham Expo' }, role: { ar: 'مديرة الفعاليات', en: 'Events Director' }, type: 'organizer', sector: { ar: 'المعارض', en: 'Exhibitions' }, location: { ar: 'الرياض', en: 'Riyadh' }, matchScore: 98, avatar: 'NS', verified: true },
  { id: 'C7', name: { ar: 'عبدالله الشمري', en: 'Abdullah Al-Shammari' }, company: { ar: 'شركة أرامكو الرقمية', en: 'Aramco Digital' }, role: { ar: 'مدير الابتكار', en: 'Innovation Director' }, type: 'trader', sector: { ar: 'الطاقة والتقنية', en: 'Energy & Tech' }, location: { ar: 'الظهران', en: 'Dhahran' }, matchScore: 79, avatar: 'AS', verified: true },
  { id: 'C8', name: { ar: 'ليلى الزهراني', en: 'Layla Al-Zahrani' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, role: { ar: 'محللة استثمار', en: 'Investment Analyst' }, type: 'investor', sector: { ar: 'الاستثمار السيادي', en: 'Sovereign Investment' }, location: { ar: 'الرياض', en: 'Riyadh' }, matchScore: 90, avatar: 'LZ', verified: true },
];

const typeConfig = {
  trader: { label: { ar: 'تاجر', en: 'Trader' }, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Briefcase },
  investor: { label: { ar: 'مستثمر', en: 'Investor' }, color: 'text-[#d4b85a]', bg: 'bg-[#fbf8f0]0/10', border: 'border-[#fbf8f0]0/20', icon: Crown },
  sponsor: { label: { ar: 'داعم', en: 'Sponsor' }, color: 'text-[#987012]', bg: 'bg-[#987012]/10', border: 'border-[#987012]/20', icon: Star },
  organizer: { label: { ar: 'مشرف', en: 'Organizer' }, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Shield },
};

export default function Networking() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = contacts
    .filter(c => filterType === 'all' || c.type === filterType)
    .filter(c => searchQuery === '' || l(c.name).includes(searchQuery) || l(c.company).includes(searchQuery))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'شبكة التواصل', en: 'Networking' })}
        subtitle={l({ ar: 'تواصل مع التجار والمستثمرين', en: 'Connect with traders and investors' })}
        image={IMAGES.networking}
      />


      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={l({ ar: 'ابحث بالاسم أو الشركة...', en: 'Search by name or company...' })} className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-foreground/20 focus:border-[#987012]/30 focus:outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilterType('all')} className={`px-3 py-2 rounded-lg text-[10px] font-medium transition-colors ${filterType === 'all' ? 'bg-[#fbf8f0]0 text-white' : 'bg-muted/50 text-muted-foreground/70 border border-border'}`}>
            {l({ ar: 'الكل', en: 'All' })}
          </button>
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterType(key)} className={`px-3 py-2 rounded-lg text-[10px] font-medium transition-colors flex items-center gap-1 ${filterType === key ? cfg.bg + ' ' + cfg.color + ' border ' + cfg.border : 'bg-muted/50 text-muted-foreground/70 border border-border'}`}>
              <cfg.icon size={10} />
              {l(cfg.label)}
            </button>
          ))}
        </div>
      </div>

      {/* AI Match Banner */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'مطابقة Maham AI', en: 'Maham AI Matching' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'تم تحليل ملفك التعريفي وقطاعك ومطابقتك مع أفضل الشركاء المحتملين. نسبة المطابقة تعتمد على: القطاع، الموقع، حجم الشركة، والأهداف المشتركة.', en: 'Your profile and sector have been analyzed to match you with the best potential partners. Match score is based on: sector, location, company size, and shared goals.' })}</p>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {filtered.map((contact, i) => {
          const cfg = typeConfig[contact.type];
          return (
            <div key={contact.id} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#987012]/10 border border-[#987012]/20 flex items-center justify-center text-xs sm:text-sm font-bold text-[#987012] shrink-0">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">{l(contact.name)}</h3>
                    {contact.verified && <Shield size={10} className="text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground/70 truncate">{l(contact.role)} — {l(contact.company)}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      <cfg.icon size={8} />{l(cfg.label)}
                    </span>
                    <span className="text-[8px] text-foreground/20 flex items-center gap-0.5"><MapPin size={8} />{l(contact.location)}</span>
                    <span className="text-[8px] text-foreground/20 flex items-center gap-0.5"><Building2 size={8} />{l(contact.sector)}</span>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${contact.matchScore >= 90 ? 'bg-[#fbf8f0]0/10 text-[#d4b85a] border border-[#fbf8f0]0/20' : contact.matchScore >= 80 ? 'bg-[#987012]/10 text-[#987012] border border-[#987012]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {contact.matchScore}%
                  </div>
                  <p className="text-[7px] text-foreground/20 mt-0.5">{l({ ar: 'مطابقة', en: 'Match' })}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => toast.success(l({ ar: `تم إرسال طلب تواصل إلى ${l(contact.name)}`, en: `Connection request sent to ${l(contact.name)}` }))} className="flex-1 py-2 rounded-lg text-[10px] font-medium bg-[#fbf8f0]0 text-white flex items-center justify-center gap-1">
                  <UserPlus size={10} />{l({ ar: 'تواصل', en: 'Connect' })}
                </button>
                <button onClick={() => toast.info(l({ ar: 'ميزة الرسائل قادمة قريباً', en: 'Messaging coming soon' }))} className="flex-1 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground/70 flex items-center justify-center gap-1 hover:border-[#987012]/20">
                  <MessageSquare size={10} />{l({ ar: 'رسالة', en: 'Message' })}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
