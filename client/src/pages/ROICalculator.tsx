/**
 * ROI Calculator — Estimate sponsorship return on investment
 * Glassmorphism design with AI insights
 */
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, TrendingUp, Target, DollarSign, Users, Eye, Sparkles, Bot } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

export default function ROICalculator() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;

  const [investment, setInvestment] = useState(150000);
  const [expectedVisitors, setExpectedVisitors] = useState(50000);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [avgDealValue, setAvgDealValue] = useState(10000);
  const [brandMultiplier, setBrandMultiplier] = useState(1.5);

  const results = useMemo(() => {
    const leads = Math.round(expectedVisitors * (conversionRate / 100));
    const revenue = leads * avgDealValue;
    const brandValue = investment * brandMultiplier;
    const totalReturn = revenue + brandValue;
    const roi = ((totalReturn - investment) / investment * 100).toFixed(0);
    const costPerLead = leads > 0 ? (investment / leads).toFixed(0) : '0';
    return { leads, revenue, brandValue, totalReturn, roi, costPerLead };
  }, [investment, expectedVisitors, conversionRate, avgDealValue, brandMultiplier]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'حاسبة العائد على الاستثمار', en: 'ROI Calculator' })}
        subtitle={l({ ar: 'احسب العائد المتوقع من رعاية كل فعالية', en: 'Calculate expected ROI from sponsoring each event' })}
        image={IMAGES.analytics}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Input Parameters */}
        <div className="glass-card animate-border-glow rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-foreground">{l({ ar: 'معطيات الحساب', en: 'Input Parameters' })}</h3>

          {[
            { label: l({ ar: 'مبلغ الاستثمار (ر.س)', en: 'Investment Amount (SAR)' }), value: investment, setter: setInvestment, min: 10000, max: 1000000, step: 10000 },
            { label: l({ ar: 'الزوار المتوقعون', en: 'Expected Visitors' }), value: expectedVisitors, setter: setExpectedVisitors, min: 1000, max: 500000, step: 1000 },
            { label: l({ ar: 'معدل التحويل (%)', en: 'Conversion Rate (%)' }), value: conversionRate, setter: setConversionRate, min: 0.5, max: 10, step: 0.5 },
            { label: l({ ar: 'متوسط قيمة الصفقة (ر.س)', en: 'Avg Deal Value (SAR)' }), value: avgDealValue, setter: setAvgDealValue, min: 1000, max: 100000, step: 1000 },
            { label: l({ ar: 'مضاعف قيمة العلامة التجارية', en: 'Brand Value Multiplier' }), value: brandMultiplier, setter: setBrandMultiplier, min: 0.5, max: 5, step: 0.5 },
          ].map((field, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-medium text-foreground">{field.label}</label>
                <span className="text-[10px] font-bold text-[#987012]">{field.value.toLocaleString()}</span>
              </div>
              <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={e => field.setter(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted/50 accent-[#987012]" />
              <div className="flex justify-between text-[8px] text-foreground/20 mt-0.5">
                <span>{field.min.toLocaleString()}</span>
                <span>{field.max.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="glass-card animate-border-glow rounded-xl p-4">
            <h3 className="text-xs font-bold text-foreground mb-3">{l({ ar: 'النتائج المتوقعة', en: 'Expected Results' })}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: TrendingUp, label: l({ ar: 'العائد على الاستثمار', en: 'ROI' }), value: `${results.roi}%`, color: 'text-[#987012]' },
                { icon: Users, label: l({ ar: 'عملاء محتملون', en: 'Expected Leads' }), value: results.leads.toLocaleString(), color: 'text-[#d4b85a]' },
                { icon: DollarSign, label: l({ ar: 'الإيرادات المتوقعة (ر.س)', en: 'Expected Revenue (SAR)' }), value: results.revenue.toLocaleString(), color: 'text-blue-400' },
                { icon: Eye, label: l({ ar: 'قيمة العلامة التجارية (ر.س)', en: 'Brand Value (SAR)' }), value: results.brandValue.toLocaleString(), color: 'text-purple-400' },
                { icon: Target, label: l({ ar: 'تكلفة العميل (ر.س)', en: 'Cost per Lead (SAR)' }), value: results.costPerLead.toLocaleString(), color: 'text-orange-400' },
                { icon: Sparkles, label: l({ ar: 'العائد الإجمالي (ر.س)', en: 'Total Return (SAR)' }), value: results.totalReturn.toLocaleString(), color: 'text-[#987012]' },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <r.icon size={14} className={`${r.color} mb-1.5`} />
                  <p className={`text-sm sm:text-base font-bold ${r.color}`}>{r.value}</p>
                  <p className="text-[8px] text-foreground/20">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 border-blue-500/10">
            <div className="flex items-start gap-3">
              <Bot size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-400 mb-1">{l({ ar: 'تحليل Maham AI', en: 'Maham AI Analysis' })}</p>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                  {l({ ar: `بناءً على المعطيات المدخلة، يتوقع النظام عائد استثمار بنسبة ${results.roi}%. هذا يعني أن كل ريال تستثمره في الرعاية سيعود عليك بـ ${(Number(results.roi) / 100 + 1).toFixed(1)} ريال. ننصح بزيادة الاستثمار في الحملات الرقمية المصاحبة لتحسين معدل التحويل.`, en: `Based on your inputs, the system predicts an ROI of ${results.roi}%. This means every SAR invested returns ${(Number(results.roi) / 100 + 1).toFixed(1)} SAR. We recommend increasing digital campaign investment to improve conversion rates.` })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
