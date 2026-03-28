/**
 * AI Assistant — Intelligent sponsorship advisor
 * Maham AI — Powered by advanced analytics
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot, Send, Sparkles, TrendingUp, Target, Users, Lightbulb, BarChart3, Zap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { IMAGES } from '@/lib/images';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const aiRecommendations = [
  { icon: TrendingUp, title: { ar: 'فرصة رعاية مميزة', en: 'Top Sponsorship Opportunity' }, desc: { ar: 'مؤتمر البترول العالمي 2026 — متوقع عائد 340% بناءً على تحليل جمهورك المستهدف في قطاع الطاقة والتقنية.', en: 'World Petroleum Congress 2026 — Expected 340% ROI based on your target audience in energy and tech sectors.' } },
  { icon: Target, title: { ar: 'تحسين الحملة الحالية', en: 'Current Campaign Optimization' }, desc: { ar: 'حملة ليب 2026 تحقق أداءً ممتازاً. ننصح بزيادة الميزانية الرقمية 20% لتحقيق 45% زيادة في العملاء المحتملين.', en: 'LEAP 2026 campaign performing excellently. Recommend 20% digital budget increase for 45% more leads.' } },
  { icon: Users, title: { ar: 'تحليل الجمهور', en: 'Audience Analysis' }, desc: { ar: '68% من جمهورك المستهدف يتواجد في فعاليات التقنية والابتكار. ننصح بالتركيز على ديب فيست وليب.', en: '68% of your target audience attends tech & innovation events. Focus on DeepFest and LEAP.' } },
  { icon: Lightbulb, title: { ar: 'اقتراح استراتيجي', en: 'Strategic Suggestion' }, desc: { ar: 'الجمع بين رعاية ليب وديب فيست يوفر 15% من التكلفة الإجمالية مع زيادة 60% في ظهور العلامة التجارية.', en: 'Combining LEAP and DeepFest sponsorship saves 15% total cost with 60% more brand exposure.' } },
];

const suggestedQuestions = {
  ar: ['ما أفضل فعالية لرعايتها في قطاع التقنية؟', 'كيف أحسّن عائد الاستثمار من رعاياتي الحالية؟', 'ما الميزانية المثالية لرعاية بلاتينية؟', 'حلل أداء حملاتي التسويقية', 'اقترح استراتيجية رعاية للنصف الثاني من 2026'],
  en: ['What\'s the best tech event to sponsor?', 'How to improve ROI from current sponsorships?', 'What\'s the ideal budget for platinum sponsorship?', 'Analyze my marketing campaign performance', 'Suggest a sponsorship strategy for H2 2026'],
};

export default function AIAssistant() {
  const { language } = useLanguage();
  const l = (obj: Record<string, any>) => obj[language] || obj.ar;
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant',
    content: l({ ar: 'مرحباً! أنا المساعد الذكي لمنصة مهام إكسبو. يمكنني مساعدتك في:\n\n• تحليل فرص الرعاية المناسبة لعلامتك التجارية\n• تحسين عائد الاستثمار من حملاتك\n• اقتراح استراتيجيات تسويقية ذكية\n• تحليل بيانات العملاء المحتملين\n• توقع أداء الحملات المستقبلية\n\nكيف يمكنني مساعدتك اليوم؟', en: 'Hello! I\'m the Maham Expo AI Assistant. I can help you with:\n\n• Analyzing suitable sponsorship opportunities\n• Optimizing your campaign ROI\n• Suggesting smart marketing strategies\n• Analyzing lead data\n• Predicting future campaign performance\n\nHow can I help you today?' }),
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: l({ ar: 'شكراً لسؤالك! بناءً على تحليل بياناتك وأنماط السوق الحالية، أنصحك بالتركيز على الفعاليات التقنية الكبرى مثل ليب وديب فيست. هذه الفعاليات تحقق أعلى معدلات تحويل للعملاء في قطاعك (تقنية المعلومات) بمعدل 3.8% مقارنة بالمتوسط العام 2.1%.\n\nكما أنصح بتخصيص 30% من ميزانية الرعاية للحملات الرقمية المصاحبة لتعظيم العائد.', en: 'Thank you! Based on your data analysis and current market patterns, I recommend focusing on major tech events like LEAP and DeepFest. These events achieve the highest lead conversion rates in your sector (IT) at 3.8% compared to the 2.1% general average.\n\nI also recommend allocating 30% of the sponsorship budget to accompanying digital campaigns to maximize ROI.' }),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title={l({ ar: 'المساعد الذكي — Maham AI', en: 'AI Assistant — Maham AI' })}
        subtitle={l({ ar: 'مساعدك الذكي في كل خطوة من رحلة الرعاية', en: 'Your AI assistant for every step of the sponsorship journey' })}
        image={IMAGES.aiAssistant}
      />
      {/* AI Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {aiRecommendations.map((rec, i) => (
          <div key={i} className="glass-card animate-border-glow rounded-xl p-3 sm:p-4 tilt-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#987012]/10"><rec.icon size={14} className="text-[#987012]" /></div>
              <h4 className="text-[10px] font-bold text-foreground">{l(rec.title)}</h4>
            </div>
            <p className="text-[9px] text-muted-foreground/70 leading-relaxed">{l(rec.desc)}</p>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#987012]/10 animate-glow"><Bot size={14} className="text-[#987012]" /></div>
          <div>
            <h3 className="text-[10px] font-bold text-foreground">{l({ ar: 'المحادثة الذكية', en: 'AI Chat' })}</h3>
            <p className="text-[8px] text-[#d4b85a]">{l({ ar: 'متصل', en: 'Online' })}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-[#987012]/10 border border-[#987012]/20' : 'bg-muted/30 border border-border'}`}>
                {msg.role === 'assistant' && <div className="flex items-center gap-1 mb-1"><Sparkles size={10} className="text-[#987012]" /><span className="text-[8px] text-[#987012]">Maham AI</span></div>}
                <p className="text-[10px] text-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="px-3 pb-2">
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {(suggestedQuestions[language as 'ar' | 'en'] || suggestedQuestions.ar).map((q, i) => (
              <button key={i} onClick={() => setInput(q)} className="px-2.5 py-1 rounded-lg text-[9px] bg-muted/50 text-muted-foreground/70 border border-border hover:border-[#987012]/20 whitespace-nowrap transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={l({ ar: 'اكتب سؤالك هنا...', en: 'Type your question...' })}
            className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-[10px] outline-none text-foreground placeholder:text-foreground/20 focus:border-[#987012]/30 transition-colors" />
          <button onClick={handleSend} className="btn-cta-glass p-2 rounded-lg">
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
