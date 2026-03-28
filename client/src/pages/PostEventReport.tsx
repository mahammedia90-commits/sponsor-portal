/**
 * PostEventReport — Post-Event Performance Report
 * Comprehensive report with ROI, exposure metrics, lead quality, and AI insights
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart3, TrendingUp, Users, Eye, DollarSign, Star,
  Download, Share2, Bot, Award, Target, Zap, Globe,
  Camera, Monitor, Megaphone, CheckCircle, ArrowUpRight
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

export default function PostEventReport() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: { ar: 'نظرة عامة', en: 'Overview' } },
    { id: 'exposure', label: { ar: 'الظهور', en: 'Exposure' } },
    { id: 'leads', label: { ar: 'العملاء', en: 'Leads' } },
    { id: 'roi', label: { ar: 'العائد', en: 'ROI' } },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'تقرير ما بعد الفعالية', en: 'Post-Event Report' })}
        subtitle={l({ ar: 'تقارير أداء مفصلة لكل فعالية', en: 'Detailed performance reports for each event' })}
        image={IMAGES.reportSuccess}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:border-[#987012]/20 flex items-center gap-1.5">
            <Download size={12} />{l({ ar: 'تحميل PDF', en: 'Download PDF' })}
          </button>
          <button className="px-3 py-2 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:border-[#987012]/20 flex items-center gap-1.5">
            <Share2 size={12} />{l({ ar: 'مشاركة', en: 'Share' })}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-[#fbf8f0]0 text-white' : 'text-muted-foreground/70 hover:text-muted-foreground'}`}>
            {l(tab.label)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          {/* Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { icon: Eye, label: { ar: 'إجمالي الانطباعات', en: 'Total Impressions' }, value: '2.4M', change: '+340%', color: 'text-blue-400' },
              { icon: Users, label: { ar: 'العملاء المحتملين', en: 'Leads Generated' }, value: '1,847', change: '+280%', color: 'text-[#d4b85a]' },
              { icon: DollarSign, label: { ar: 'عائد الاستثمار', en: 'ROI' }, value: '340%', change: '+40%', color: 'text-[#987012]' },
              { icon: Star, label: { ar: 'تقييم الرضا', en: 'Satisfaction Score' }, value: '4.8/5', change: '', color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <stat.icon size={16} className={`${stat.color} mb-2`} />
                <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{l(stat.label)}</p>
                {stat.change && <span className="text-[8px] text-[#d4b85a]">{stat.change} {l({ ar: 'مقارنة بالمتوسط', en: 'vs average' })}</span>}
              </div>
            ))}
          </div>

          {/* Event Summary */}
          <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">{l({ ar: 'ملخص الفعالية', en: 'Event Summary' })}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: { ar: 'مدة الفعالية', en: 'Event Duration' }, value: { ar: '4 أيام', en: '4 Days' } },
                { label: { ar: 'إجمالي الزوار', en: 'Total Visitors' }, value: '172,450' },
                { label: { ar: 'زوار الكشك', en: 'Booth Visitors' }, value: '34,890' },
                { label: { ar: 'مشاهدات المسرح', en: 'Stage Views' }, value: '52,300' },
                { label: { ar: 'تفاعلات VIP', en: 'VIP Interactions' }, value: '4,200' },
                { label: { ar: 'ذكر إعلامي', en: 'Media Mentions' }, value: '156' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-muted/30 border border-border">
                  <p className="text-[9px] text-muted-foreground/50">{l(item.label)}</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{typeof item.value === 'string' ? item.value : l(item.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Completion */}
          <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">{l({ ar: 'اكتمال التسليمات', en: 'Deliverables Completion' })}</h3>
            <div className="space-y-2">
              {[
                { name: { ar: 'شاشة المدخل الرئيسي', en: 'Main Entrance Screen' }, status: 'completed', hours: '96h' },
                { name: { ar: 'رعاية المسرح', en: 'Stage Sponsorship' }, status: 'completed', hours: '96h' },
                { name: { ar: 'صالة VIP', en: 'VIP Lounge' }, status: 'completed', hours: '96h' },
                { name: { ar: 'الشاشات الداخلية', en: 'Indoor Screens' }, status: 'completed', hours: '96h' },
                { name: { ar: 'اللافتات المعلقة', en: 'Hanging Banners' }, status: 'completed', hours: '96h' },
                { name: { ar: 'الأكشاك التفاعلية', en: 'Activation Booths' }, status: 'completed', hours: '96h' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <CheckCircle size={12} className="text-[#d4b85a] shrink-0" />
                  <span className="text-[10px] text-muted-foreground flex-1">{l(item.name)}</span>
                  <span className="text-[9px] text-[#d4b85a]">{item.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/70">{l({ ar: 'نسبة الاكتمال', en: 'Completion Rate' })}</span>
              <span className="text-sm font-bold text-[#d4b85a]">100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Exposure Tab */}
      {activeTab === 'exposure' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Monitor, title: { ar: 'الشاشات الرقمية', en: 'Digital Screens' }, impressions: '1.2M', engagement: '78%', details: { ar: '8 شاشات × 96 ساعة × 12 عرض/ساعة', en: '8 screens × 96 hours × 12 plays/hour' } },
              { icon: Megaphone, title: { ar: 'المسرح الرئيسي', en: 'Main Stage' }, impressions: '520K', engagement: '92%', details: { ar: 'ذكر في 24 جلسة + كلمة افتتاحية', en: 'Mentioned in 24 sessions + opening speech' } },
              { icon: Camera, title: { ar: 'التغطية الإعلامية', en: 'Media Coverage' }, impressions: '450K', engagement: '65%', details: { ar: '156 ذكر إعلامي + 45 مقال صحفي', en: '156 media mentions + 45 press articles' } },
              { icon: Globe, title: { ar: 'التواصل الاجتماعي', en: 'Social Media' }, impressions: '230K', engagement: '4.2%', details: { ar: '12 منشور رسمي + 890 ذكر من الزوار', en: '12 official posts + 890 visitor mentions' } },
            ].map((item, i) => (
              <div key={i} className="glass-card animate-border-glow rounded-xl p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-[#987012]/10"><item.icon size={14} className="text-[#987012]" /></div>
                  <h4 className="text-xs font-bold text-foreground">{l(item.title)}</h4>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'الانطباعات', en: 'Impressions' })}</p>
                    <p className="text-lg font-bold gold-text">{item.impressions}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-[9px] text-muted-foreground/50">{l({ ar: 'التفاعل', en: 'Engagement' })}</p>
                    <p className="text-sm font-bold text-[#d4b85a]">{item.engagement}</p>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/50 border-t border-border pt-2">{l(item.details)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: { ar: 'إجمالي العملاء', en: 'Total Leads' }, value: '1,847', color: 'text-blue-400' },
              { label: { ar: 'عملاء ساخنين', en: 'Hot Leads' }, value: '342', color: 'text-red-400' },
              { label: { ar: 'عملاء دافئين', en: 'Warm Leads' }, value: '856', color: 'text-yellow-400' },
              { label: { ar: 'معدل التحويل', en: 'Conversion Rate' }, value: '18.5%', color: 'text-[#d4b85a]' },
            ].map((stat, i) => (
              <div key={i} className="glass-card animate-border-glow rounded-xl p-3 text-center">
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{l(stat.label)}</p>
              </div>
            ))}
          </div>

          <div className="glass-card animate-border-glow rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{l({ ar: 'مصادر العملاء', en: 'Lead Sources' })}</h3>
            <div className="space-y-2">
              {[
                { source: { ar: 'الأكشاك التفاعلية', en: 'Activation Booths' }, count: 680, pct: 37 },
                { source: { ar: 'صالة VIP', en: 'VIP Lounge' }, count: 420, pct: 23 },
                { source: { ar: 'مسح QR الشاشات', en: 'Screen QR Scans' }, count: 350, pct: 19 },
                { source: { ar: 'جلسات المسرح', en: 'Stage Sessions' }, count: 245, pct: 13 },
                { source: { ar: 'التواصل الاجتماعي', en: 'Social Media' }, count: 152, pct: 8 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-32 shrink-0">{l(item.source)}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted/50">
                    <div className="h-full rounded-full gold-gradient" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-12 text-end">{item.count}</span>
                  <span className="text-[9px] text-[#987012] w-8 text-end">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROI Tab */}
      {activeTab === 'roi' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card animate-border-glow rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">{l({ ar: 'تحليل العائد على الاستثمار', en: 'ROI Analysis' })}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] text-muted-foreground/70 mb-2">{l({ ar: 'الاستثمار', en: 'Investment' })}</h4>
                <div className="space-y-1.5">
                  {[
                    { label: { ar: 'حزمة الرعاية البلاتينية', en: 'Platinum Package' }, value: '300,000' },
                    { label: { ar: 'إنتاج المحتوى', en: 'Content Production' }, value: '45,000' },
                    { label: { ar: 'فريق التفعيل', en: 'Activation Team' }, value: '25,000' },
                    { label: { ar: 'مواد مطبوعة', en: 'Print Materials' }, value: '15,000' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-border">
                      <span className="text-[10px] text-muted-foreground/70">{l(item.label)}</span>
                      <span className="text-[10px] text-muted-foreground">{item.value} {l({ ar: 'ر.س', en: 'SAR' })}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-1.5 font-bold">
                    <span className="text-xs text-foreground">{l({ ar: 'إجمالي الاستثمار', en: 'Total Investment' })}</span>
                    <span className="text-xs text-[#987012]">385,000 {l({ ar: 'ر.س', en: 'SAR' })}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] text-muted-foreground/70 mb-2">{l({ ar: 'العائد المقدر', en: 'Estimated Return' })}</h4>
                <div className="space-y-1.5">
                  {[
                    { label: { ar: 'قيمة الظهور الإعلامي', en: 'Media Exposure Value' }, value: '680,000' },
                    { label: { ar: 'قيمة العملاء المحتملين', en: 'Lead Value' }, value: '462,000' },
                    { label: { ar: 'قيمة العلامة التجارية', en: 'Brand Value' }, value: '350,000' },
                    { label: { ar: 'فرص أعمال مباشرة', en: 'Direct Business Opportunities' }, value: '120,000' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-border">
                      <span className="text-[10px] text-muted-foreground/70">{l(item.label)}</span>
                      <span className="text-[10px] text-[#d4b85a]">{item.value} {l({ ar: 'ر.س', en: 'SAR' })}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-1.5 font-bold">
                    <span className="text-xs text-foreground">{l({ ar: 'إجمالي العائد المقدر', en: 'Total Estimated Return' })}</span>
                    <span className="text-xs text-[#d4b85a]">1,612,000 {l({ ar: 'ر.س', en: 'SAR' })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[#987012]/5 border border-[#987012]/10 text-center">
              <p className="text-[10px] text-muted-foreground/70">{l({ ar: 'العائد على الاستثمار', en: 'Return on Investment' })}</p>
              <p className="text-3xl font-bold gold-text mt-1">340%</p>
              <p className="text-[9px] text-[#d4b85a] mt-1">{l({ ar: 'أعلى من المتوسط بـ 40%', en: '40% above average' })}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
        <div className="flex items-start gap-3">
          <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{l({ ar: 'أداؤك في مؤتمر ليب 2026 كان استثنائياً! عائد الاستثمار 340% يتفوق على 92% من الرعاة. أبرز نقاط القوة: رعاية المسرح حققت أعلى تفاعل (92%)، والأكشاك التفاعلية كانت المصدر الأول للعملاء المحتملين. توصيتي: كرر نفس الاستراتيجية في الفعالية القادمة مع زيادة ميزانية التواصل الاجتماعي بنسبة 20%.', en: 'Your performance at LEAP 2026 was exceptional! 340% ROI outperforms 92% of sponsors. Key strengths: Stage sponsorship achieved highest engagement (92%), activation booths were the top lead source. My recommendation: Repeat the same strategy at the next event with a 20% increase in social media budget.' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
