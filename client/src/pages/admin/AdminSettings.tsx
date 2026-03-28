/**
 * Admin Settings
 * Platform settings, configuration, and system management
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Settings, Globe, Shield, Bell, CreditCard, Palette,
  Database, Key, Mail, Server, CheckCircle, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState('general');

  const cardBg = isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-[#F0EEE7] shadow-sm';
  const textPrimary = isDark ? 'text-foreground' : 'text-[#010101]';
  const textSecondary = isDark ? 'text-muted-foreground' : 'text-[#919187]';
  const textMuted = isDark ? 'text-[#6B6B6B]' : 'text-[#919187]';
  const inputBg = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-[#F9F8F5] border-[#F0EEE7]';

  const tabs = [
    { id: 'general', label: isAr ? 'عام' : 'General', icon: Settings },
    { id: 'security', label: isAr ? 'الأمان' : 'Security', icon: Shield },
    { id: 'notifications', label: isAr ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'payment', label: isAr ? 'الدفع' : 'Payment', icon: CreditCard },
    { id: 'compliance', label: isAr ? 'الامتثال' : 'Compliance', icon: Key },
  ];

  const handleSave = () => {
    toast.success(isAr ? 'تم الحفظ' : 'Saved', { description: isAr ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold font-['Cairo'] ${textPrimary}`}>
          {isAr ? 'إعدادات النظام' : 'System Settings'}
        </h1>
        <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
          {isAr ? 'إدارة إعدادات المنصة والتكوينات' : 'Manage platform settings and configurations'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <div className={`lg:w-56 shrink-0 rounded-2xl border p-3 ${cardBg}`}>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#987012]/10 text-[#987012]'
                      : `${textSecondary} ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#F9F8F5]'}`
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-5`}>
                {isAr ? 'الإعدادات العامة' : 'General Settings'}
              </h3>
              <div className="space-y-4">
                <SettingField label={isAr ? 'اسم المنصة' : 'Platform Name'} value="MAHAM EXPO - Sponsor Portal" isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'البريد الإلكتروني' : 'Contact Email'} value="info@mahamexpo.sa" isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'رقم الهاتف' : 'Phone Number'} value="+966 53 555 5900" isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'العنوان' : 'Address'} value={isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'} isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'اللغة الافتراضية' : 'Default Language'} value={isAr ? 'العربية' : 'Arabic'} isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
              </div>
              <Button onClick={handleSave} className="mt-5 bg-gradient-to-r from-[#987012] to-[#d4a832] text-white gap-2">
                <Save size={14} />
                {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
              </Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-5`}>
                {isAr ? 'إعدادات الأمان' : 'Security Settings'}
              </h3>
              <div className="space-y-4">
                <ToggleSetting label={isAr ? 'المصادقة الثنائية' : 'Two-Factor Authentication'} desc={isAr ? 'تفعيل المصادقة الثنائية لجميع المشرفين' : 'Enable 2FA for all admin accounts'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} />
                <ToggleSetting label={isAr ? 'تسجيل النشاط' : 'Activity Logging'} desc={isAr ? 'تسجيل جميع عمليات المشرف' : 'Log all admin operations'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
                <ToggleSetting label={isAr ? 'قفل الجلسة التلقائي' : 'Auto Session Lock'} desc={isAr ? 'قفل الجلسة بعد 30 دقيقة من عدم النشاط' : 'Lock session after 30 minutes of inactivity'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
                <ToggleSetting label={isAr ? 'تشفير البيانات' : 'Data Encryption'} desc={isAr ? 'تشفير جميع البيانات الحساسة' : 'Encrypt all sensitive data'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-5`}>
                {isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}
              </h3>
              <div className="space-y-4">
                <ToggleSetting label={isAr ? 'إشعار طلب رعاية جديد' : 'New Sponsorship Request'} desc={isAr ? 'إشعار عند تقديم طلب رعاية جديد' : 'Notify when a new sponsorship request is submitted'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
                <ToggleSetting label={isAr ? 'إشعار الدفع' : 'Payment Notification'} desc={isAr ? 'إشعار عند استلام دفعة جديدة' : 'Notify when a new payment is received'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
                <ToggleSetting label={isAr ? 'إشعار العقد' : 'Contract Notification'} desc={isAr ? 'إشعار عند توقيع عقد جديد' : 'Notify when a contract is signed'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
                <ToggleSetting label={isAr ? 'تذكير المدفوعات المتأخرة' : 'Overdue Payment Reminder'} desc={isAr ? 'إرسال تذكير تلقائي للمدفوعات المتأخرة' : 'Auto-send reminders for overdue payments'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} />
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-5`}>
                {isAr ? 'إعدادات الدفع' : 'Payment Settings'}
              </h3>
              <div className="space-y-4">
                <SettingField label={isAr ? 'نسبة الدفعة المقدمة' : 'Advance Payment %'} value="50%" isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'مهلة الدفع (أيام)' : 'Payment Due (days)'} value="30" isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <SettingField label={isAr ? 'العملة الافتراضية' : 'Default Currency'} value={isAr ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'} isDark={isDark} inputBg={inputBg} textPrimary={textPrimary} textMuted={textMuted} />
                <ToggleSetting label={isAr ? 'فاتورة ZATCA' : 'ZATCA Invoice'} desc={isAr ? 'إصدار فواتير متوافقة مع هيئة الزكاة والضريبة' : 'Issue ZATCA-compliant invoices'} isDark={isDark} textPrimary={textPrimary} textMuted={textMuted} defaultOn />
              </div>
              <Button onClick={handleSave} className="mt-5 bg-gradient-to-r from-[#987012] to-[#d4a832] text-white gap-2">
                <Save size={14} />
                {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
              </Button>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-5`}>
                {isAr ? 'الامتثال والتوافق' : 'Compliance'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'ZATCA', desc: isAr ? 'هيئة الزكاة والضريبة والجمارك' : 'Tax & Customs Authority', active: true },
                  { label: 'KYC / AML', desc: isAr ? 'اعرف عميلك ومكافحة غسل الأموال' : 'Know Your Customer & AML', active: true },
                  { label: 'ISO 27001', desc: isAr ? 'أمن المعلومات' : 'Information Security', active: true },
                  { label: 'PDPL', desc: isAr ? 'نظام حماية البيانات الشخصية' : 'Personal Data Protection Law', active: true },
                  { label: 'SAMA', desc: isAr ? 'البنك المركزي السعودي' : 'Saudi Central Bank', active: false },
                  { label: 'IFRS', desc: isAr ? 'المعايير الدولية للتقارير المالية' : 'International Financial Reporting Standards', active: false },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-[#F9F8F5] border-[#F0EEE7]'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${textPrimary}`}>{item.label}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        item.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-yellow-500/15 text-yellow-600'
                      }`}>
                        {item.active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'قيد التفعيل' : 'Pending')}
                      </span>
                    </div>
                    <p className={`text-[10px] ${textMuted}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingField({ label, value, isDark, inputBg, textPrimary, textMuted }: { label: string; value: string; isDark: boolean; inputBg: string; textPrimary: string; textMuted: string }) {
  const [val, setVal] = useState(value);
  return (
    <div>
      <label className={`text-[10px] font-semibold ${textMuted} block mb-1.5`}>{label}</label>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-xl border text-xs ${inputBg} ${textPrimary} focus:outline-none focus:border-[#987012]/30`}
      />
    </div>
  );
}

function ToggleSetting({ label, desc, isDark, textPrimary, textMuted, defaultOn }: { label: string; desc: string; isDark: boolean; textPrimary: string; textMuted: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-[#F9F8F5]'}`}>
      <div>
        <p className={`text-xs font-medium ${textPrimary}`}>{label}</p>
        <p className={`text-[10px] ${textMuted}`}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-all relative ${on ? 'bg-[#987012]' : isDark ? 'bg-white/10' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
